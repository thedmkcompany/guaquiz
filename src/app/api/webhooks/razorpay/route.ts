import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, paiseToRupees } from '@/lib/razorpay';
import {
  syncToWixCRM,
  cancelWixOrder,
  pauseWixOrder,
  resumeWixOrder,
  updateContactSubscriptionStatus,
} from '@/lib/wix-crm';
import {
  updateLeadPaymentStatus,
  markPaymentFailed,
  storeWixIds,
  updateSubscriptionStatus,
  getWixOrderIdForSubscription,
  findLeadBySubscriptionId,
} from '@/lib/supabase';
import { tryMarkEventProcessed } from '@/lib/webhook-store';
import { parseCustomerName } from '@/lib/payment-api';
import { maskEmail } from '@/lib/validation';
import { sendPaymentConfirmation } from '@/lib/aisensy';
import { getProgramById } from '@/lib/programs';
import type { RazorpayWebhookPayload, RazorpayPaymentEntity, RazorpaySubscriptionEntity } from '@/types/payment';

type WebhookEventHandler = (payload: RazorpayWebhookPayload) => Promise<void>;

/** Event handlers for different webhook events */
const EVENT_HANDLERS: Record<string, WebhookEventHandler> = {
  'payment.captured': handlePaymentCaptured,
  'payment.failed': handlePaymentFailed,
  'order.paid': handleOrderPaid,
  'subscription.activated': handleSubscriptionActivated,
  'subscription.charged': handleSubscriptionCharged,
  'subscription.pending': handleSubscriptionPending,
  'subscription.halted': handleSubscriptionHalted,
  'subscription.cancelled': handleSubscriptionCancelled,
  'subscription.completed': handleSubscriptionCompleted,
  'subscription.expired': handleSubscriptionExpired,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(body, signature)) {
      console.error('[Security] Invalid Razorpay webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: RazorpayWebhookPayload = JSON.parse(body);
    const eventId = request.headers.get('x-razorpay-event-id');

    // Atomically check and mark event as processed (prevents race conditions)
    if (eventId) {
      const isFirstProcessing = await tryMarkEventProcessed(eventId, 'razorpay');
      if (!isFirstProcessing) {
        console.log(`[Razorpay Webhook] Duplicate event ignored: ${eventId}`);
        return NextResponse.json({ received: true, duplicate: true });
      }
    }

    console.log(`[Razorpay Webhook] Processing: ${payload.event} (ID: ${eventId})`);

    // Handle the event
    const handler = EVENT_HANDLERS[payload.event];
    if (handler) {
      await handler(payload);
    } else {
      console.log('[Razorpay Webhook] Unhandled event:', payload.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Razorpay Webhook] Error:', error instanceof Error ? error.message : 'Unknown error');
    // Return 200 to prevent retries for parsing errors
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

// ============================================
// PAYMENT EVENT HANDLERS
// ============================================

async function handlePaymentCaptured(payload: RazorpayWebhookPayload): Promise<void> {
  const payment = payload.payload.payment?.entity;
  if (!payment) return;

  logPaymentEvent('captured', payment);
  await syncPaymentToCRM(payment);
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload): Promise<void> {
  const payment = payload.payload.payment?.entity;
  if (!payment) return;

  console.log('[Razorpay Webhook] Payment failed:', {
    paymentId: payment.id,
    orderId: payment.order_id,
    email: maskEmail(payment.email || ''),
  });

  // Update Supabase with failed payment status
  const email = payment.notes?.customerEmail || payment.email;
  if (email) {
    await markPaymentFailed(email, payment.id, 'razorpay');
  }
}

async function handleOrderPaid(payload: RazorpayWebhookPayload): Promise<void> {
  console.log('[Razorpay Webhook] Order paid:', payload.payload.order?.entity.id);
}

// ============================================
// SUBSCRIPTION EVENT HANDLERS
// ============================================

async function handleSubscriptionActivated(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  logSubscriptionEvent('activated', subscription);
  await syncSubscriptionToCRM(subscription);
}

async function handleSubscriptionCharged(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.payload.subscription?.entity;
  const payment = payload.payload.payment?.entity;
  if (!subscription) return;

  const amount = payment ? paiseToRupees(payment.amount) : 0;

  console.log('[Razorpay Webhook] Subscription charged (renewal):', {
    subscriptionId: subscription.id,
    paymentId: payment?.id,
    amount,
  });

  // Update Supabase with renewal info
  const result = await updateSubscriptionStatus({
    subscriptionId: subscription.id,
    status: 'active',
    lastRenewalAt: new Date().toISOString(),
    incrementRenewalCount: true,
  });

  if (!result.success) {
    console.error('[Razorpay Webhook] Failed to update subscription renewal:', result.error);
    return;
  }

  // If subscription was previously halted, resume the Wix order
  const lead = result.lead;
  if (lead?.wix_order_id && lead?.subscription_status === 'halted') {
    console.log('[Razorpay Webhook] Resuming previously halted Wix order');
    await resumeWixOrder(lead.wix_order_id);
  }

  // Update contact's subscription status in Wix
  const email = subscription.notes?.customerEmail || lead?.email;
  if (email) {
    await updateContactSubscriptionStatus(email, 'active', {
      'custom.lastrenewalat': new Date().toISOString(),
      'custom.lastrenewalamount': amount.toString(),
    });
  }
}

async function handleSubscriptionPending(payload: RazorpayWebhookPayload): Promise<void> {
  console.log('[Razorpay Webhook] Subscription pending:', payload.payload.subscription?.entity.id);
}

async function handleSubscriptionHalted(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  console.log('[Razorpay Webhook] Subscription halted (payment failed):', {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
  });

  // Update Supabase with halted status
  const result = await updateSubscriptionStatus({
    subscriptionId: subscription.id,
    status: 'halted',
  });

  if (!result.success) {
    console.error('[Razorpay Webhook] Failed to update subscription halted status:', result.error);
    return;
  }

  // Pause/suspend the Wix pricing plan order
  const lead = result.lead;
  if (lead?.wix_order_id) {
    console.log('[Razorpay Webhook] Pausing Wix order due to payment failure');
    await pauseWixOrder(lead.wix_order_id);
  }

  // Update contact's subscription status in Wix
  const email = subscription.notes?.customerEmail || lead?.email;
  if (email) {
    await updateContactSubscriptionStatus(email, 'halted', {
      'custom.subscriptionhaltedat': new Date().toISOString(),
    });
  }
}

async function handleSubscriptionCancelled(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  const endedAt = subscription.ended_at
    ? new Date(subscription.ended_at * 1000).toISOString()
    : new Date().toISOString();

  console.log('[Razorpay Webhook] Subscription cancelled:', {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
    endedAt,
  });

  // Update Supabase with cancelled status
  const result = await updateSubscriptionStatus({
    subscriptionId: subscription.id,
    status: 'cancelled',
    endedAt,
  });

  if (!result.success) {
    console.error('[Razorpay Webhook] Failed to update subscription cancelled status:', result.error);
    return;
  }

  // Cancel the Wix pricing plan order
  const lead = result.lead;
  if (lead?.wix_order_id) {
    console.log('[Razorpay Webhook] Cancelling Wix order:', lead.wix_order_id);
    const cancelled = await cancelWixOrder(lead.wix_order_id);
    if (cancelled) {
      console.log('[Razorpay Webhook] Wix order cancelled successfully');
    }
  } else {
    console.warn('[Razorpay Webhook] No Wix order ID found to cancel');
  }

  // Update contact's subscription status in Wix
  const email = subscription.notes?.customerEmail || lead?.email;
  if (email) {
    await updateContactSubscriptionStatus(email, 'cancelled', {
      'custom.subscriptionendedat': endedAt,
    });
  }
}

async function handleSubscriptionCompleted(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  const endedAt = subscription.ended_at
    ? new Date(subscription.ended_at * 1000).toISOString()
    : new Date().toISOString();

  console.log('[Razorpay Webhook] Subscription completed (natural end):', {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
    endedAt,
  });

  // Update Supabase with completed status
  const result = await updateSubscriptionStatus({
    subscriptionId: subscription.id,
    status: 'completed',
    endedAt,
  });

  if (!result.success) {
    console.error('[Razorpay Webhook] Failed to update subscription completed status:', result.error);
    return;
  }

  // For completed subscriptions, we could either:
  // 1. Cancel the Wix order (removes access)
  // 2. Leave it as-is (if the Wix plan has its own expiry)
  // For now, we cancel to ensure clean state
  const lead = result.lead;
  if (lead?.wix_order_id) {
    console.log('[Razorpay Webhook] Cancelling Wix order for completed subscription');
    await cancelWixOrder(lead.wix_order_id);
  }

  // Update contact's subscription status in Wix
  const email = subscription.notes?.customerEmail || lead?.email;
  if (email) {
    await updateContactSubscriptionStatus(email, 'completed', {
      'custom.subscriptionendedat': endedAt,
      'custom.subscriptioncompletedat': endedAt,
    });
  }
}

async function handleSubscriptionExpired(payload: RazorpayWebhookPayload): Promise<void> {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  const endedAt = subscription.ended_at
    ? new Date(subscription.ended_at * 1000).toISOString()
    : new Date().toISOString();

  console.log('[Razorpay Webhook] Subscription expired (e.g., trial ended without conversion):', {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
    endedAt,
  });

  // Update Supabase - treat expired similar to cancelled
  const result = await updateSubscriptionStatus({
    subscriptionId: subscription.id,
    status: 'cancelled', // Using cancelled status for expired
    endedAt,
  });

  if (!result.success) {
    console.error('[Razorpay Webhook] Failed to update subscription expired status:', result.error);
    return;
  }

  // Cancel the Wix pricing plan order
  const lead = result.lead;
  if (lead?.wix_order_id) {
    console.log('[Razorpay Webhook] Cancelling Wix order for expired subscription');
    await cancelWixOrder(lead.wix_order_id);
  }

  // Update contact's subscription status in Wix
  const email = subscription.notes?.customerEmail || lead?.email;
  if (email) {
    await updateContactSubscriptionStatus(email, 'cancelled', {
      'custom.subscriptionendedat': endedAt,
      'custom.subscriptionexpiredat': endedAt,
    });
  }
}

// ============================================
// CRM SYNC HELPERS
// ============================================

function logPaymentEvent(event: string, payment: RazorpayPaymentEntity): void {
  console.log(`[Razorpay Webhook] Payment ${event}:`, {
    paymentId: payment.id,
    orderId: payment.order_id,
    amount: paiseToRupees(payment.amount),
    email: maskEmail(payment.email || ''),
  });
}

function logSubscriptionEvent(event: string, subscription: RazorpaySubscriptionEntity): void {
  console.log(`[Razorpay Webhook] Subscription ${event}:`, {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
    status: subscription.status,
  });
}

async function syncPaymentToCRM(payment: RazorpayPaymentEntity): Promise<void> {
  // Safely extract notes with fallbacks (notes may be undefined or missing fields)
  const notes = payment.notes || {};
  const programId = notes.programId || '';
  const programName = notes.programName || '';
  const customerEmail = notes.customerEmail || '';
  const customerName = notes.customerName || '';
  const customerPhone = notes.customerPhone || '';

  const { firstName, lastName } = parseCustomerName(customerName);
  const email = customerEmail || payment.email || '';
  const amount = paiseToRupees(payment.amount);

  // Validate we have minimum required data
  if (!email) {
    console.error('[Razorpay Webhook] Cannot sync payment - no email found:', {
      paymentId: payment.id,
      hasNotes: !!payment.notes,
      hasPaymentEmail: !!payment.email,
    });
    return;
  }

  // Warn if programId is missing - pricing plan won't be assigned
  if (!programId) {
    console.warn('[Razorpay Webhook] Payment missing programId in notes:', {
      paymentId: payment.id,
      email: maskEmail(email),
      noteKeys: Object.keys(notes),
    });
    console.warn('[Razorpay Webhook] Pricing plan will NOT be assigned for this payment');
  }

  // Sync to Supabase (primary record)
  try {
    const supabaseResult = await updateLeadPaymentStatus({
      email,
      paymentId: payment.id,
      amount,
      programId: programId || '',
      gateway: 'razorpay',
      status: 'paid',
    });
    console.log('[Razorpay Webhook] Supabase sync result:', supabaseResult);
  } catch (error) {
    console.error('[Razorpay Webhook] Failed to sync to Supabase:', error);
  }

  // Sync to Wix CRM
  try {
    const result = await syncToWixCRM({
      email,
      firstName,
      lastName,
      phone: customerPhone || payment.contact,
      programId: programId || '',
      programName: programName || '',
      paymentId: payment.id,
      amount,
      isSubscription: false,
    });

    console.log('[Razorpay Webhook] Wix CRM sync result:', result);

    // Send AISensy payment confirmation (non-blocking)
    try {
      const program = getProgramById(programId);
      if (program && customerPhone) {
        await sendPaymentConfirmation({
          phone: customerPhone,
          name: customerName,
          email,
          programName: programName || program.name,
          programId: programId, // For campaign selection
          programTier: program.tier,
          amount,
          paymentId: payment.id,
          isSubscription: false,
        });
      }
    } catch (error) {
      console.error('[Razorpay Webhook] AISensy payment confirmation failed:', error);
    }

    // Store Wix IDs for potential future refund/revocation
    if (result.success && (result.orderId || result.memberId)) {
      await storeWixIds(email, result.orderId || null, result.memberId || null);
      console.log('[Razorpay Webhook] Stored Wix IDs for one-time payment:', {
        paymentId: payment.id,
        wixOrderId: result.orderId,
        wixMemberId: result.memberId,
      });
    }
  } catch (error) {
    console.error('[Razorpay Webhook] Failed to sync to Wix CRM:', error);
  }
}

async function syncSubscriptionToCRM(subscription: RazorpaySubscriptionEntity): Promise<void> {
  // Safely extract notes with fallbacks (notes may be undefined or missing fields)
  const notes = subscription.notes || {};
  const programId = notes.programId || '';
  const programName = notes.programName || '';
  const customerEmail = notes.customerEmail || '';
  const customerName = notes.customerName || '';
  const customerPhone = notes.customerPhone || '';
  const programStartDate = notes.programStartDate || '';
  const startDateOption = notes.startDateOption || '';

  const { firstName, lastName } = parseCustomerName(customerName);
  const email = customerEmail;

  // Validate we have minimum required data
  if (!email) {
    console.error('[Razorpay Webhook] Cannot sync subscription - no email found:', {
      subscriptionId: subscription.id,
      hasNotes: !!subscription.notes,
    });
    return;
  }

  // Sync to Supabase (primary record)
  try {
    const supabaseResult = await updateLeadPaymentStatus({
      email,
      paymentId: subscription.id,
      amount: 0, // Subscription amount handled separately
      programId: programId || '',
      gateway: 'razorpay',
      subscriptionId: subscription.id,
      status: 'paid',
      programStartDate: programStartDate || undefined,
      startDateOption: startDateOption || undefined,
    });
    console.log('[Razorpay Webhook] Supabase sync (subscription):', supabaseResult);
  } catch (error) {
    console.error('[Razorpay Webhook] Failed to sync subscription to Supabase:', error);
  }

  // Sync to Wix CRM
  try {
    const result = await syncToWixCRM({
      email,
      firstName,
      lastName,
      phone: customerPhone,
      programId: programId || '',
      programName: programName || '',
      paymentId: subscription.id,
      amount: 0,
      isSubscription: true,
      subscriptionId: subscription.id,
      programStartDate: programStartDate || undefined,
      startDateOption: startDateOption || undefined,
    });

    console.log('[Razorpay Webhook] Wix CRM sync (subscription):', result);

    // Send AISensy payment confirmation for subscription (non-blocking)
    try {
      const program = getProgramById(programId);
      if (program && customerPhone) {
        await sendPaymentConfirmation({
          phone: customerPhone,
          name: customerName,
          email,
          programName: programName || program.name,
          programId: programId, // For campaign selection
          programTier: program.tier,
          amount: 0, // First subscription charge - amount in separate webhook
          paymentId: subscription.id,
          isSubscription: true,
          startDateOption: startDateOption || undefined, // For Essentials date selection
        });
      }
    } catch (error) {
      console.error('[Razorpay Webhook] AISensy subscription confirmation failed:', error);
    }

    // IMPORTANT: Store Wix order ID and member ID for later cancellation/updates
    if (result.success && (result.orderId || result.memberId)) {
      await storeWixIds(email, result.orderId || null, result.memberId || null);

      // Also set initial subscription status to active
      await updateSubscriptionStatus({
        subscriptionId: subscription.id,
        status: 'active',
      });

      console.log('[Razorpay Webhook] Stored Wix IDs for subscription:', {
        subscriptionId: subscription.id,
        wixOrderId: result.orderId,
        wixMemberId: result.memberId,
      });
    }
  } catch (error) {
    console.error('[Razorpay Webhook] Failed to sync subscription to Wix CRM:', error);
  }
}
