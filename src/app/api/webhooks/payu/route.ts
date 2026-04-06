import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookAuth, verifyPaymentHash } from '@/lib/payu';
import { syncToWixCRM } from '@/lib/wix-crm';
import { updateLeadPaymentStatus, markPaymentFailed } from '@/lib/supabase';
import {
  tryMarkEventProcessed,
  generatePayUEventId,
} from '@/lib/webhook-store';
import { parseCustomerName } from '@/lib/payment-api';
import { sendPaymentConfirmation } from '@/lib/aisensy';
import { getProgramById } from '@/lib/programs';
interface PayUWebhookPayload {
  txnid: string;
  status: string;
  mihpayid: string;
  amount: string;
  email: string;
  phone?: string;
  productinfo: string;
  firstname: string;
  hash?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization header
    const authHeader = request.headers.get('authorization');
    if (!verifyWebhookAuth(authHeader)) {
      console.error('[Security] PayU webhook: invalid authorization');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: PayUWebhookPayload = await request.json();

    // Verify PayU cryptographic hash signature
    if (body.hash) {
      const isValidHash = verifyPaymentHash({
        txnid: body.txnid || '',
        amount: body.amount || '',
        productinfo: body.productinfo || '',
        firstname: body.firstname || '',
        email: body.email || '',
        status: body.status || '',
        hash: body.hash,
        udf1: body.udf1,
        udf2: body.udf2,
        udf3: body.udf3,
        udf4: body.udf4,
        udf5: body.udf5,
        additionalCharges: body.additionalCharges,
      });

      if (!isValidHash) {
        console.error('[Security] PayU webhook: invalid hash signature', {
          txnid: body.txnid,
          status: body.status,
        });
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      // Reject webhooks without hash for security
      console.error('[Security] PayU webhook: missing hash', {
        txnid: body.txnid,
        status: body.status,
      });
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Atomically check and mark event as processed (prevents race conditions)
    const eventId = generatePayUEventId(body.txnid || '', body.status || '', body.mihpayid || '');
    const isFirstProcessing = await tryMarkEventProcessed(eventId, 'payu');

    if (!isFirstProcessing) {
      console.log(`[PayU Webhook] Duplicate event ignored: ${eventId}`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    console.log('[PayU Webhook] Processing:', {
      txnid: body.txnid,
      status: body.status,
      mihpayid: body.mihpayid,
    });

    // Handle based on payment status
    await handlePaymentStatus(body);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[PayU Webhook] Error:', error instanceof Error ? error.message : 'Unknown error');
    // Return 500 so the gateway retries delivery
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }
}

/**
 * Handle payment based on status
 */
async function handlePaymentStatus(payload: PayUWebhookPayload): Promise<void> {
  switch (payload.status) {
    case 'success':
      await handleSuccessfulPayment(payload);
      break;
    case 'failure':
      console.log('[PayU Webhook] Payment failed:', {
        txnid: payload.txnid,
      });
      // Update Supabase with failed payment status
      if (payload.email) {
        await markPaymentFailed(payload.email, payload.mihpayid || payload.txnid, 'payu');
      }
      break;
    default:
      console.log('[PayU Webhook] Unhandled status:', payload.status);
  }
}

/**
 * Handle successful payment: sync to Supabase and CRM
 */
async function handleSuccessfulPayment(payload: PayUWebhookPayload): Promise<void> {
  const { firstName, lastName } = parseCustomerName(payload.firstname || '');
  const amount = parseFloat(payload.amount);

  // Sync to Supabase (primary record)
  try {
    const supabaseResult = await updateLeadPaymentStatus({
      email: payload.email,
      paymentId: payload.mihpayid,
      amount,
      programId: payload.udf1 || '',
      gateway: 'payu',
      status: 'paid',
    });
    console.log('[PayU Webhook] Supabase sync result:', supabaseResult);
  } catch (error) {
    console.error('[PayU Webhook] Failed to sync to Supabase:', error);
  }

  // Sync to Wix CRM
  try {
    const result = await syncToWixCRM({
      email: payload.email,
      firstName,
      lastName,
      phone: payload.phone || '',
      programId: payload.udf1 || '',
      programName: payload.productinfo || '',
      paymentId: payload.mihpayid,
      amount,
      isSubscription: false,
    });

    console.log('[PayU Webhook] Wix CRM sync result:', result);

    // Send AISensy payment confirmation (non-blocking)
    try {
      const program = getProgramById(payload.udf1 || '');
      if (program && payload.phone) {
        await sendPaymentConfirmation({
          phone: payload.phone,
          name: payload.firstname,
          email: payload.email,
          programName: payload.productinfo || program.name,
          programId: payload.udf1 || '', // For campaign selection
          programTier: program.tier,
          amount,
          paymentId: payload.mihpayid,
          isSubscription: false,
        });
      }
    } catch (error) {
      console.error('[PayU Webhook] AISensy payment confirmation failed:', error);
    }
  } catch (error) {
    console.error('[PayU Webhook] Failed to sync to Wix:', error);
    // Don't throw - we still want to return 200 to PayU
  }
}
