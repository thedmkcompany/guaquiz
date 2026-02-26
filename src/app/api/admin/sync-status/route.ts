import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Admin API: Sync Status Dashboard Data
 *
 * Protected by basic auth (ADMIN_USER / ADMIN_PASSWORD env vars)
 * Returns sync statistics from the quiz_leads table
 */

// Basic auth credentials from environment
const ADMIN_USER = process.env.ADMIN_USER || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeCompare(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/**
 * Verify basic auth header (timing-safe)
 */
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Require both ADMIN_USER and ADMIN_PASSWORD to be set
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    console.error('[Admin API] ADMIN_USER or ADMIN_PASSWORD not configured');
    return false;
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [user, pass] = credentials.split(':');

  return timingSafeCompare(user, ADMIN_USER) && timingSafeCompare(pass, ADMIN_PASSWORD);
}

export async function GET(request: NextRequest) {
  // Verify basic auth
  if (!verifyAuth(request)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  // Check Supabase configuration
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  try {
    // Get sync status counts using parallel queries instead of fetching all rows
    const [
      totalResult, pendingResult, syncedResult, failedResult,
      paidResult, paymentFailedResult,
      paymentSyncPendingResult, paymentSyncFailedResult, paymentSyncSyncedResult,
    ] = await Promise.all([
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('wix_sync_status', 'pending'),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('wix_sync_status', 'synced'),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('wix_sync_status', 'failed'),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('payment_status', 'paid'),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('payment_status', 'failed'),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('wix_payment_sync_status', 'pending'),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('wix_payment_sync_status', 'failed'),
      supabase.from('quiz_leads').select('id', { count: 'exact', head: true }).eq('wix_payment_sync_status', 'synced'),
    ]);

    const statusCounts = {
      total: totalResult.count ?? 0,
      pending: pendingResult.count ?? 0,
      synced: syncedResult.count ?? 0,
      failed: failedResult.count ?? 0,
      paid: paidResult.count ?? 0,
      paymentFailed: paymentFailedResult.count ?? 0,
      unpaid: (totalResult.count ?? 0) - (paidResult.count ?? 0) - (paymentFailedResult.count ?? 0),
      paymentSync: {
        pending: paymentSyncPendingResult.count ?? 0,
        failed: paymentSyncFailedResult.count ?? 0,
        synced: paymentSyncSyncedResult.count ?? 0,
      },
    };

    // Get recent leads (last 50)
    const { data: recentLeads, error: leadsError } = await supabase
      .from('quiz_leads')
      .select('id, name, email, recommendation, wix_sync_status, wix_sync_attempts, wix_sync_error, wix_payment_sync_status, wix_payment_sync_attempts, wix_payment_sync_error, payment_status, payment_id, payment_amount, program_purchased, payment_gateway, paid_at, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (leadsError) throw leadsError;

    // Get failed leads that need attention (exhausted quiz or payment sync retries)
    const { data: failedLeads, error: failedError } = await supabase
      .from('quiz_leads')
      .select('id, name, email, wix_sync_status, wix_sync_attempts, wix_sync_error, wix_payment_sync_status, wix_payment_sync_attempts, wix_payment_sync_error, payment_status, created_at')
      .or(
        'and(wix_sync_status.eq.failed,wix_sync_attempts.gte.5),' +
        'and(wix_payment_sync_status.eq.failed,wix_payment_sync_attempts.gte.10)'
      )
      .order('created_at', { ascending: false })
      .limit(20);

    if (failedError) throw failedError;

    // Get leads by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: dailyLeads, error: dailyError } = await supabase
      .from('quiz_leads')
      .select('created_at, wix_sync_status')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (dailyError) throw dailyError;

    // Group by day
    const leadsPerDay: Record<string, { total: number; synced: number; failed: number }> = {};
    dailyLeads?.forEach((lead) => {
      const day = lead.created_at.split('T')[0];
      if (!leadsPerDay[day]) {
        leadsPerDay[day] = { total: 0, synced: 0, failed: 0 };
      }
      leadsPerDay[day].total++;
      if (lead.wix_sync_status === 'synced') leadsPerDay[day].synced++;
      if (lead.wix_sync_status === 'failed') leadsPerDay[day].failed++;
    });

    return NextResponse.json({
      success: true,
      stats: statusCounts,
      recentLeads: recentLeads?.map((lead) => ({
        ...lead,
        email: maskEmail(lead.email), // Mask email for privacy
      })),
      failedLeads: failedLeads?.map((lead) => ({
        ...lead,
        email: maskEmail(lead.email),
      })),
      leadsPerDay,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Admin API] Error fetching sync status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync status' },
      { status: 500 }
    );
  }
}

/**
 * Mask email for privacy (show first 2 chars + domain)
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local.slice(0, 2) + '***';
  return `${maskedLocal}@${domain}`;
}
