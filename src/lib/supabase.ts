import { createClient } from '@supabase/supabase-js';
import type { Database, Tables } from './database.types';
import { maskEmail } from './validation';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate URL format
if (SUPABASE_URL && !SUPABASE_URL.match(/^https?:\/\/[a-z0-9-]+\.supabase\.co\/?$/i)) {
  console.error('[Supabase] Invalid URL format:', SUPABASE_URL);
  console.error('[Supabase] Expected format: https://xxxxx.supabase.co');
}

// Server-side Supabase client (has write access)
export const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

// ============================================
// QUIZ LEAD QUEUE
// ============================================

// Use generated types
export type QuizLeadRecord = Tables<'quiz_leads'>;
export type QuizLeadInsert = Database['public']['Tables']['quiz_leads']['Insert'];
export type LeadSyncStatus = QuizLeadRecord['wix_sync_status'];

/**
 * Store a quiz lead in Supabase (primary storage)
 * Returns the lead ID for tracking
 */
export async function storeQuizLead(data: Omit<QuizLeadInsert, 'id' | 'wix_sync_status' | 'wix_sync_attempts' | 'created_at' | 'updated_at'>): Promise<{
  success: boolean;
  leadId?: string;
  error?: string;
}> {
  if (!supabase) {
    console.warn('Supabase not configured, cannot store lead');
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data: lead, error } = await supabase
      .from('quiz_leads')
      .insert({
        ...data,
        wix_sync_status: 'pending',
        wix_sync_attempts: 0,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to store quiz lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('Error storing quiz lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update lead sync status after Wix CRM sync attempt
 */
export async function updateLeadSyncStatus(
  leadId: string,
  status: LeadSyncStatus,
  contactId?: string,
  error?: string
): Promise<void> {
  if (!supabase) return;

  try {
    const updateData: Partial<QuizLeadRecord> = {
      wix_sync_status: status,
      updated_at: new Date().toISOString(),
    };

    if (contactId) {
      updateData.wix_contact_id = contactId;
    }

    if (error) {
      updateData.wix_sync_error = error;
    }

    // Increment sync attempts
    const { data: current } = await supabase
      .from('quiz_leads')
      .select('wix_sync_attempts')
      .eq('id', leadId)
      .single();

    updateData.wix_sync_attempts = (current?.wix_sync_attempts || 0) + 1;

    await supabase
      .from('quiz_leads')
      .update(updateData)
      .eq('id', leadId);
  } catch (err) {
    console.error('Failed to update lead sync status:', err);
  }
}

/**
 * Get pending leads that need to be synced to Wix
 * Used by retry mechanism
 */
export async function getPendingLeads(limit: number = 50): Promise<QuizLeadRecord[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('quiz_leads')
      .select('*')
      .in('wix_sync_status', ['pending', 'failed'])
      .lt('wix_sync_attempts', 5) // Max 5 retry attempts
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Failed to get pending leads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting pending leads:', error);
    return [];
  }
}

/**
 * Check if a lead with this email already exists (deduplication)
 */
export async function findLeadByEmail(email: string): Promise<QuizLeadRecord | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('quiz_leads')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error finding lead by email:', error);
    }

    return data || null;
  } catch (error) {
    console.error('Error finding lead by email:', error);
    return null;
  }
}

/**
 * Update existing lead with new quiz data
 */
export async function updateExistingLead(
  leadId: string,
  data: Partial<QuizLeadRecord>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('quiz_leads')
      .update({
        ...data,
        wix_sync_status: 'pending', // Re-sync to Wix
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// PAYMENT STATUS TRACKING
// ============================================

export interface PaymentUpdateData {
  email: string;
  paymentId: string;
  amount: number;
  programId: string;
  gateway: 'razorpay' | 'payu';
  subscriptionId?: string;
  status: 'paid' | 'failed' | 'refunded';
  programStartDate?: string;
  startDateOption?: string;
}

/**
 * Update lead payment status in Supabase after successful payment
 * Finds the lead by email and updates payment fields
 */
export async function updateLeadPaymentStatus(data: PaymentUpdateData): Promise<{
  success: boolean;
  leadId?: string;
  error?: string;
}> {
  if (!supabase) {
    console.warn('Supabase not configured, cannot update payment status');
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Find lead by email
    const { data: lead, error: findError } = await supabase
      .from('quiz_leads')
      .select('id')
      .eq('email', data.email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding lead for payment update:', findError);
      return { success: false, error: findError.message };
    }

    if (!lead) {
      // Lead doesn't exist - create a minimal record for tracking
      // This can happen if someone pays directly without taking the quiz
      console.log(`[Supabase] No lead found for ${maskEmail(data.email)}, creating payment record`);

      const { data: newLead, error: insertError } = await supabase
        .from('quiz_leads')
        .insert({
          name: 'Direct Payment',
          email: data.email.toLowerCase(),
          whatsapp: '',
          recommendation: data.programId,
          payment_status: data.status,
          payment_id: data.paymentId,
          payment_amount: data.amount,
          program_purchased: data.programId,
          subscription_id: data.subscriptionId || null,
          payment_gateway: data.gateway,
          paid_at: data.status === 'paid' ? new Date().toISOString() : null,
          program_start_date: data.programStartDate || null,
          start_date_option: data.startDateOption || null,
          wix_sync_status: 'pending',
          wix_sync_attempts: 0,
          ...(data.status === 'paid' && { wix_payment_sync_status: 'pending' as const }),
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating payment record:', insertError);
        return { success: false, error: insertError.message };
      }

      console.log(`[Supabase] Created payment record for direct payment: ${newLead.id}`);
      return { success: true, leadId: newLead.id };
    }

    // Update existing lead with payment info
    const { error: updateError } = await supabase
      .from('quiz_leads')
      .update({
        payment_status: data.status,
        payment_id: data.paymentId,
        payment_amount: data.amount,
        program_purchased: data.programId,
        subscription_id: data.subscriptionId || null,
        payment_gateway: data.gateway,
        paid_at: data.status === 'paid' ? new Date().toISOString() : null,
        program_start_date: data.programStartDate || null,
        start_date_option: data.startDateOption || null,
        updated_at: new Date().toISOString(),
        // Queue Wix payment sync retry for paid leads
        ...(data.status === 'paid' && { wix_payment_sync_status: 'pending' as const }),
      })
      .eq('id', lead.id);

    if (updateError) {
      console.error('Error updating lead payment status:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log(`[Supabase] Updated payment status for lead ${lead.id}: ${data.status}`);
    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('Error in updateLeadPaymentStatus:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Mark a lead's payment as failed
 */
export async function markPaymentFailed(
  email: string,
  paymentId: string,
  gateway: 'razorpay' | 'payu'
): Promise<void> {
  await updateLeadPaymentStatus({
    email,
    paymentId,
    amount: 0,
    programId: '',
    gateway,
    status: 'failed',
  });
}

// ============================================
// SUBSCRIPTION LIFECYCLE TRACKING
// ============================================

export type SubscriptionStatusType = 'active' | 'halted' | 'cancelled' | 'completed' | 'pending';

export interface SubscriptionUpdateData {
  subscriptionId: string;
  status: SubscriptionStatusType;
  endedAt?: string | null;
  lastRenewalAt?: string | null;
  incrementRenewalCount?: boolean;
}

/**
 * Find lead by Razorpay subscription ID
 */
export async function findLeadBySubscriptionId(subscriptionId: string): Promise<QuizLeadRecord | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('quiz_leads')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Supabase] Error finding lead by subscription ID:', error);
    }

    return data || null;
  } catch (error) {
    console.error('[Supabase] Error finding lead by subscription ID:', error);
    return null;
  }
}

/**
 * Update subscription status in Supabase
 * Called when Razorpay sends subscription lifecycle webhooks
 */
export async function updateSubscriptionStatus(data: SubscriptionUpdateData): Promise<{
  success: boolean;
  lead?: QuizLeadRecord;
  error?: string;
}> {
  if (!supabase) {
    console.warn('[Supabase] Not configured, cannot update subscription status');
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Find lead by subscription ID
    const lead = await findLeadBySubscriptionId(data.subscriptionId);

    if (!lead) {
      console.warn(`[Supabase] No lead found for subscription: ${data.subscriptionId}`);
      return { success: false, error: 'Lead not found' };
    }

    // Build update payload
    const updatePayload: Partial<QuizLeadRecord> = {
      subscription_status: data.status,
      updated_at: new Date().toISOString(),
    };

    if (data.endedAt) {
      updatePayload.subscription_end_at = data.endedAt;
    }

    if (data.lastRenewalAt) {
      updatePayload.last_renewal_at = data.lastRenewalAt;
    }

    if (data.incrementRenewalCount) {
      updatePayload.renewal_count = (lead.renewal_count || 0) + 1;
    }

    // Update the lead
    const { error: updateError } = await supabase
      .from('quiz_leads')
      .update(updatePayload)
      .eq('id', lead.id);

    if (updateError) {
      console.error('[Supabase] Error updating subscription status:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log(`[Supabase] Updated subscription status for ${lead.id}: ${data.status}`);
    return { success: true, lead };
  } catch (error) {
    console.error('[Supabase] Error in updateSubscriptionStatus:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Store Wix order and member IDs after successful payment sync
 */
export async function storeWixIds(
  email: string,
  wixOrderId: string | null,
  wixMemberId: string | null
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const updatePayload: Partial<QuizLeadRecord> = {
      updated_at: new Date().toISOString(),
    };

    if (wixOrderId) {
      updatePayload.wix_order_id = wixOrderId;
    }
    if (wixMemberId) {
      updatePayload.wix_member_id = wixMemberId;
    }

    const { error } = await supabase
      .from('quiz_leads')
      .update(updatePayload)
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('[Supabase] Error storing Wix IDs:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Supabase] Stored Wix IDs for ${maskEmail(email)}: order=${wixOrderId}, member=${wixMemberId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get Wix order ID for a subscription (needed for cancellation)
 */
export async function getWixOrderIdForSubscription(subscriptionId: string): Promise<string | null> {
  if (!supabase) return null;

  const lead = await findLeadBySubscriptionId(subscriptionId);
  return lead?.wix_order_id || null;
}

// ============================================
// PAYMENT WIX SYNC TRACKING
// ============================================

export type PaymentSyncStatus = 'pending' | 'synced' | 'failed';

/**
 * Update lead's post-payment Wix sync status
 * Called after syncToWixCRM succeeds or fails for a paid lead
 */
export async function updatePaymentSyncStatus(
  leadId: string,
  status: PaymentSyncStatus,
  error?: string
): Promise<void> {
  if (!supabase) return;

  try {
    const { data: current } = await supabase
      .from('quiz_leads')
      .select('wix_payment_sync_attempts')
      .eq('id', leadId)
      .single();

    const updateData: Partial<QuizLeadRecord> = {
      wix_payment_sync_status: status,
      wix_payment_sync_attempts: (current?.wix_payment_sync_attempts || 0) + 1,
      updated_at: new Date().toISOString(),
    };

    if (error) {
      updateData.wix_payment_sync_error = error;
    }

    // Clear error on success
    if (status === 'synced') {
      updateData.wix_payment_sync_error = null;
    }

    await supabase
      .from('quiz_leads')
      .update(updateData)
      .eq('id', leadId);
  } catch (err) {
    console.error('[Supabase] Failed to update payment sync status:', err);
  }
}

/**
 * Get paid leads that need Wix payment sync retry
 * (member creation + pricing plan assignment failed)
 */
export async function getPendingPaymentSyncLeads(
  limit: number = 20
): Promise<QuizLeadRecord[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('quiz_leads')
      .select('*')
      .eq('payment_status', 'paid')
      .in('wix_payment_sync_status', ['pending', 'failed'])
      .lt('wix_payment_sync_attempts', 10)
      .order('paid_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('[Supabase] Failed to get pending payment sync leads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Supabase] Error getting pending payment sync leads:', error);
    return [];
  }
}

/**
 * Get leads that have exhausted all retry attempts (need manual intervention)
 * Quiz leads: >= 5 attempts. Payment sync: >= 10 attempts.
 */
export async function getEscalationLeads(limit: number = 50): Promise<QuizLeadRecord[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('quiz_leads')
      .select('*')
      .or(
        'and(wix_sync_status.eq.failed,wix_sync_attempts.gte.5),' +
        'and(wix_payment_sync_status.eq.failed,wix_payment_sync_attempts.gte.10)'
      )
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Supabase] Failed to get escalation leads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Supabase] Error getting escalation leads:', error);
    return [];
  }
}
