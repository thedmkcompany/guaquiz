import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createQuizLeadAsync, syncToWixCRM, type QuizLeadData } from '@/lib/wix-crm';
import {
  getPendingLeads,
  getPendingPaymentSyncLeads,
  getEscalationLeads,
  updateLeadSyncStatus,
  updatePaymentSyncStatus,
  storeWixIds,
  isSupabaseConfigured,
  type QuizLeadRecord,
} from '@/lib/supabase';
import { maskEmail } from '@/lib/validation';
import { parseCustomerName } from '@/lib/payment-api';

// Secret key for cron job authentication
const CRON_SECRET = process.env.CRON_SECRET || '';

// Safety margin: stop processing before Vercel timeout (60s Pro, 10s Hobby)
const MAX_EXECUTION_MS = 55_000;

/**
 * Verify cron authorization (timing-safe)
 * Supports both Vercel Cron (Authorization header) and custom CRON_SECRET
 */
function isAuthorized(request: NextRequest): boolean {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization');

  // SECURITY: Require CRON_SECRET to be configured - fail securely if missing
  if (!CRON_SECRET) {
    console.error('[Security] CRON_SECRET not configured - denying access');
    return false;
  }

  if (!authHeader) return false;

  const expected = `Bearer ${CRON_SECRET}`;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(authHeader),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

interface PhaseResults {
  total: number;
  synced: number;
  failed: number;
  errors: string[];
}

function emptyResults(): PhaseResults {
  return { total: 0, synced: 0, failed: 0, errors: [] };
}

/**
 * POST /api/quiz/retry-sync
 *
 * Retry failed Wix CRM syncs for pending leads and payment syncs.
 * Called automatically by Vercel Cron every 4 hours.
 *
 * Phase 1: Quiz lead sync (contact creation)
 * Phase 2: Payment sync (member creation + plan assignment)
 * Phase 3: Escalation check (log stuck leads)
 *
 * Security: Requires CRON_SECRET header for authentication.
 *
 * @returns Summary of sync results
 */
export async function POST(request: NextRequest) {
  // Verify cron secret
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: false,
      error: 'Supabase not configured',
    });
  }

  const startTime = Date.now();

  try {
    // ==========================================
    // Phase 1: Quiz lead sync retry
    // ==========================================
    const quizResults = await processQuizLeadSync(startTime);

    // ==========================================
    // Phase 2: Payment sync retry
    // ==========================================
    const paymentResults = await processPaymentSync(startTime);

    // ==========================================
    // Phase 3: Escalation check
    // ==========================================
    const escalationCount = await checkEscalation();

    const totalProcessed = quizResults.total + paymentResults.total;

    if (totalProcessed === 0 && escalationCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending syncs to process',
      });
    }

    console.log(
      `[Retry Sync] Completed: quiz=${quizResults.synced}/${quizResults.total} synced, ` +
      `payment=${paymentResults.synced}/${paymentResults.total} synced, ` +
      `escalation=${escalationCount}`
    );

    return NextResponse.json({
      success: true,
      message: `Processed ${quizResults.total} quiz leads + ${paymentResults.total} payment syncs`,
      quiz: quizResults,
      payment: paymentResults,
      escalation: { count: escalationCount },
    });
  } catch (error) {
    console.error('[Retry Sync] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Phase 1: Process pending quiz lead syncs (contact creation in Wix)
 */
async function processQuizLeadSync(startTime: number): Promise<PhaseResults> {
  const pendingLeads = await getPendingLeads(30);
  const results = emptyResults();
  results.total = pendingLeads.length;

  if (pendingLeads.length === 0) return results;

  console.log(`[Retry Sync] Phase 1: Processing ${pendingLeads.length} quiz leads`);

  for (const lead of pendingLeads) {
    // Timeout guard
    if (Date.now() - startTime > MAX_EXECUTION_MS) {
      console.warn('[Retry Sync] Approaching timeout, stopping quiz lead sync early');
      break;
    }

    try {
      const result = await syncLeadToWix(lead);

      if (result.success) {
        await updateLeadSyncStatus(lead.id!, 'synced', result.contactId);
        results.synced++;
      } else {
        await updateLeadSyncStatus(lead.id!, 'failed', undefined, result.error);
        results.failed++;
        results.errors.push(`${maskEmail(lead.email)}: ${result.error}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      await updateLeadSyncStatus(lead.id!, 'failed', undefined, errorMsg);
      results.failed++;
      results.errors.push(`${maskEmail(lead.email)}: ${errorMsg}`);
    }
  }

  return results;
}

/**
 * Phase 2: Process pending payment syncs (member creation + plan assignment in Wix)
 */
async function processPaymentSync(startTime: number): Promise<PhaseResults> {
  const pendingLeads = await getPendingPaymentSyncLeads(15);
  const results = emptyResults();
  results.total = pendingLeads.length;

  if (pendingLeads.length === 0) return results;

  console.log(`[Retry Sync] Phase 2: Processing ${pendingLeads.length} payment syncs`);

  for (const lead of pendingLeads) {
    // Timeout guard
    if (Date.now() - startTime > MAX_EXECUTION_MS) {
      console.warn('[Retry Sync] Approaching timeout, stopping payment sync early');
      break;
    }

    try {
      const result = await syncPaymentLeadToWix(lead);

      if (result.success) {
        await updatePaymentSyncStatus(lead.id!, 'synced');
        results.synced++;
      } else {
        await updatePaymentSyncStatus(lead.id!, 'failed', result.error);
        results.failed++;
        results.errors.push(`${maskEmail(lead.email)}: ${result.error}`);
      }

      // Longer delay for payment sync (heavier operations: contact + member + plan)
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      await updatePaymentSyncStatus(lead.id!, 'failed', errorMsg);
      results.failed++;
      results.errors.push(`${maskEmail(lead.email)}: ${errorMsg}`);
    }
  }

  return results;
}

/**
 * Phase 3: Check for leads that have exhausted all retry attempts
 * Logs warnings for manual investigation
 */
async function checkEscalation(): Promise<number> {
  const escalationLeads = await getEscalationLeads(10);

  if (escalationLeads.length > 0) {
    console.error(`[Retry Sync] ESCALATION: ${escalationLeads.length} leads have exhausted all retries`);
    for (const lead of escalationLeads) {
      console.error(`[Retry Sync] STUCK: ${maskEmail(lead.email)} | ` +
        `quiz_attempts=${lead.wix_sync_attempts} | ` +
        `payment_sync_attempts=${lead.wix_payment_sync_attempts} | ` +
        `paid=${lead.payment_status === 'paid'}`
      );
    }
  }

  return escalationLeads.length;
}

/**
 * Sync a single quiz lead to Wix CRM (contact creation)
 */
async function syncLeadToWix(lead: QuizLeadRecord): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  const leadData: QuizLeadData = {
    name: lead.name,
    email: lead.email,
    whatsapp: lead.whatsapp,
    recommendation: lead.recommendation,
    quizAnswers: lead.quiz_answers as Record<string, string[]> | undefined,
    deviceType: lead.device_type ?? undefined,
    referralSource: lead.referral_source ?? undefined,
  };

  return createQuizLeadAsync(leadData);
}

/**
 * Sync a single paid lead to Wix CRM (contact + member + plan assignment)
 */
async function syncPaymentLeadToWix(lead: QuizLeadRecord): Promise<{
  success: boolean;
  error?: string;
}> {
  const { firstName, lastName } = parseCustomerName(lead.name);

  const result = await syncToWixCRM({
    email: lead.email,
    firstName,
    lastName,
    phone: lead.whatsapp || undefined,
    programId: lead.program_purchased || lead.recommendation || '',
    programName: lead.program_purchased || lead.recommendation || '',
    paymentId: lead.payment_id || '',
    amount: lead.payment_amount || 0,
    isSubscription: !!lead.subscription_id,
    subscriptionId: lead.subscription_id || undefined,
    programStartDate: lead.program_start_date || undefined,
  });

  // Store Wix IDs if returned
  if (result.success && (result.orderId || result.memberId)) {
    await storeWixIds(
      lead.email,
      result.orderId || null,
      result.memberId || null
    );
  }

  return {
    success: result.success && !result.planAssignmentFailed,
    error: result.error || (result.planAssignmentFailed ? 'Plan assignment failed' : undefined),
  };
}

/**
 * GET /api/quiz/retry-sync
 *
 * Get status of pending leads and payment syncs (for monitoring)
 */
export async function GET(request: NextRequest) {
  // Verify authorization
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      message: 'Supabase not configured',
    });
  }

  try {
    const [pendingLeads, pendingPaymentLeads] = await Promise.all([
      getPendingLeads(100),
      getPendingPaymentSyncLeads(100),
    ]);

    return NextResponse.json({
      configured: true,
      pendingQuizCount: pendingLeads.length,
      pendingPaymentSyncCount: pendingPaymentLeads.length,
      quizLeads: pendingLeads.map(lead => ({
        id: lead.id,
        email: maskEmail(lead.email),
        recommendation: lead.recommendation,
        attempts: lead.wix_sync_attempts,
        lastError: lead.wix_sync_error,
        createdAt: lead.created_at,
      })),
      paymentLeads: pendingPaymentLeads.map(lead => ({
        id: lead.id,
        email: maskEmail(lead.email),
        program: lead.program_purchased,
        paymentSyncAttempts: lead.wix_payment_sync_attempts,
        lastError: lead.wix_payment_sync_error,
        paidAt: lead.paid_at,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
