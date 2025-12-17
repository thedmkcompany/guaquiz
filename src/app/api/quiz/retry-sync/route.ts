import { NextRequest, NextResponse } from 'next/server';
import { createQuizLeadAsync, type QuizLeadData } from '@/lib/wix-crm';
import {
  getPendingLeads,
  updateLeadSyncStatus,
  isSupabaseConfigured,
  type QuizLeadRecord,
} from '@/lib/supabase';

// Secret key for cron job authentication
const CRON_SECRET = process.env.CRON_SECRET || '';

/**
 * Verify cron authorization
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

  return authHeader === `Bearer ${CRON_SECRET}`;
}

/**
 * POST /api/quiz/retry-sync
 *
 * Retry failed Wix CRM syncs for pending leads.
 * Called automatically by Vercel Cron every 5 minutes.
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

  try {
    // Get pending leads (max 50 per run to avoid timeouts)
    const pendingLeads = await getPendingLeads(50);

    if (pendingLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending leads to sync',
        processed: 0,
      });
    }

    console.log(`[Retry Sync] Processing ${pendingLeads.length} pending leads`);

    const results = {
      total: pendingLeads.length,
      synced: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process leads sequentially to avoid rate limiting
    for (const lead of pendingLeads) {
      try {
        const result = await syncLeadToWix(lead);

        if (result.success) {
          await updateLeadSyncStatus(lead.id!, 'synced', result.contactId);
          results.synced++;
        } else {
          await updateLeadSyncStatus(lead.id!, 'failed', undefined, result.error);
          results.failed++;
          results.errors.push(`${lead.email}: ${result.error}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        await updateLeadSyncStatus(lead.id!, 'failed', undefined, errorMsg);
        results.failed++;
        results.errors.push(`${lead.email}: ${errorMsg}`);
      }
    }

    console.log(`[Retry Sync] Completed: ${results.synced} synced, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: `Processed ${results.total} leads`,
      ...results,
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
 * Sync a single lead to Wix CRM
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
 * GET /api/quiz/retry-sync
 *
 * Get status of pending leads (for monitoring dashboard)
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
    const pendingLeads = await getPendingLeads(100);

    return NextResponse.json({
      configured: true,
      pendingCount: pendingLeads.length,
      leads: pendingLeads.map(lead => ({
        id: lead.id,
        email: lead.email,
        recommendation: lead.recommendation,
        attempts: lead.wix_sync_attempts,
        lastError: lead.wix_sync_error,
        createdAt: lead.created_at,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
