import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, paiseToRupees } from '@/lib/razorpay';
import { syncToWixCRM } from '@/lib/wix-crm';
import { isEventProcessed, markEventProcessed } from '@/lib/webhook-store';
import type { RazorpayWebhookPayload } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(body, signature)) {
      console.error('[Security] Invalid Razorpay webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: RazorpayWebhookPayload = JSON.parse(body);
    const eventId = request.headers.get('x-razorpay-event-id');

    // SECURITY: Prevent replay attacks
    if (eventId && isEventProcessed(eventId)) {
      console.log(`[Razorpay] Duplicate webhook ignored: ${eventId}`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    console.log(`[Razorpay] Processing event: ${payload.event} (ID: ${eventId})`);

    // Handle different events
    switch (payload.event) {
      // One-time payment events
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;

      case 'order.paid':
        console.log('Order paid:', payload.payload.order?.entity.id);
        break;

      // Subscription events
      case 'subscription.activated':
        await handleSubscriptionActivated(payload);
        break;

      case 'subscription.charged':
        await handleSubscriptionCharged(payload);
        break;

      case 'subscription.pending':
        console.log('Subscription pending:', payload.payload.subscription?.entity.id);
        break;

      case 'subscription.halted':
        await handleSubscriptionHalted(payload);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload);
        break;

      case 'subscription.completed':
        console.log('Subscription completed:', payload.payload.subscription?.entity.id);
        break;

      default:
        console.log('[Razorpay] Unhandled event:', payload.event);
    }

    // Mark event as processed to prevent replay attacks
    if (eventId) {
      markEventProcessed(eventId, 'razorpay');
    }

    // Always return 200 quickly to prevent retries
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Razorpay] Webhook processing error:', error instanceof Error ? error.message : 'Unknown error');
    // Still return 200 to prevent retries for parsing errors
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

/**
 * Handle successful one-time payment
 */
async function handlePaymentCaptured(payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment?.entity;
  if (!payment) return;

  console.log('[Razorpay] Payment captured:', {
    paymentId: payment.id,
    orderId: payment.order_id,
    amount: paiseToRupees(payment.amount),
    email: payment.email,
  });

  // Extract customer data from payment notes
  const {
    programId,
    programName,
    customerEmail,
    customerName,
    customerPhone,
  } = payment.notes;

  // Parse name
  const nameParts = (customerName || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Sync to Wix CRM
  try {
    const result = await syncToWixCRM({
      email: customerEmail || payment.email,
      firstName,
      lastName,
      phone: customerPhone || payment.contact,
      programId: programId || '',
      programName: programName || '',
      paymentId: payment.id,
      amount: paiseToRupees(payment.amount),
      isSubscription: false,
    });

    console.log('[Razorpay] Wix CRM sync result:', result);
  } catch (error) {
    console.error('[Razorpay] Failed to sync to Wix CRM:', error);
    // Don't throw - we still want to return 200 to Razorpay
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment?.entity;
  if (!payment) return;

  console.log('[Razorpay] Payment failed:', {
    paymentId: payment.id,
    orderId: payment.order_id,
    email: payment.email,
    reason: payment.notes,
  });

  // Optional: Track failed payments, send notification, etc.
}

/**
 * Handle subscription activation (first payment)
 */
async function handleSubscriptionActivated(payload: RazorpayWebhookPayload) {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  console.log('[Razorpay] Subscription activated:', {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
    status: subscription.status,
  });

  // Extract customer data from subscription notes
  const {
    programId,
    programName,
    customerEmail,
    customerName,
    customerPhone,
  } = subscription.notes;

  // Parse name
  const nameParts = (customerName || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Sync to Wix CRM
  try {
    const result = await syncToWixCRM({
      email: customerEmail || '',
      firstName,
      lastName,
      phone: customerPhone,
      programId: programId || '',
      programName: programName || '',
      paymentId: subscription.id,
      amount: 0, // Amount from plan, not available in subscription entity
      isSubscription: true,
      subscriptionId: subscription.id,
    });

    console.log('[Razorpay] Wix CRM sync result (subscription):', result);
  } catch (error) {
    console.error('[Razorpay] Failed to sync subscription to Wix CRM:', error);
  }
}

/**
 * Handle subscription charged (recurring payment)
 */
async function handleSubscriptionCharged(payload: RazorpayWebhookPayload) {
  const subscription = payload.payload.subscription?.entity;
  const payment = payload.payload.payment?.entity;
  if (!subscription) return;

  console.log('[Razorpay] Subscription charged:', {
    subscriptionId: subscription.id,
    paymentId: payment?.id,
    amount: payment ? paiseToRupees(payment.amount) : 0,
  });

  // Optional: Update subscription status in your database
  // Optional: Send payment receipt email
}

/**
 * Handle subscription halted (payment failed)
 */
async function handleSubscriptionHalted(payload: RazorpayWebhookPayload) {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  console.log('[Razorpay] Subscription halted:', {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
  });

  // Optional: Notify customer about failed recurring payment
  // Optional: Update subscription status in your database
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(payload: RazorpayWebhookPayload) {
  const subscription = payload.payload.subscription?.entity;
  if (!subscription) return;

  console.log('[Razorpay] Subscription cancelled:', {
    subscriptionId: subscription.id,
    planId: subscription.plan_id,
    endedAt: subscription.ended_at,
  });

  // Optional: Update subscription status in your database
  // Optional: Notify customer about cancellation
}
