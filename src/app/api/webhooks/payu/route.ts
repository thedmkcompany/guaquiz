import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookAuth } from '@/lib/payu';
import { syncToWixCRM } from '@/lib/wix-crm';
import {
  isEventProcessed,
  markEventProcessed,
  generatePayUEventId,
} from '@/lib/webhook-store';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization header
    const authHeader = request.headers.get('authorization');
    if (!verifyWebhookAuth(authHeader)) {
      console.error('[Security] PayU webhook invalid authorization');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // SECURITY: Generate event ID and check for replay attacks
    const eventId = generatePayUEventId(
      body.txnid || '',
      body.status || '',
      body.mihpayid || ''
    );

    if (isEventProcessed(eventId)) {
      console.log(`[PayU] Duplicate webhook ignored: ${eventId}`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    console.log('[PayU] Processing webhook:', {
      txnid: body.txnid,
      status: body.status,
      mihpayid: body.mihpayid,
    });

    // Only process successful payments
    if (body.status === 'success') {
      // Parse name from firstname
      const nameParts = (body.firstname || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Sync to Wix CRM (webhook is backup if callback failed)
      try {
        const result = await syncToWixCRM({
          email: body.email,
          firstName,
          lastName,
          phone: body.phone || '',
          programId: body.udf1 || '',
          programName: body.productinfo || '',
          paymentId: body.mihpayid,
          amount: parseFloat(body.amount),
          isSubscription: false,
        });

        console.log('[PayU Webhook] Wix CRM sync result:', result);
      } catch (error) {
        console.error('[PayU Webhook] Failed to sync to Wix:', error);
      }
    } else if (body.status === 'failure') {
      console.log('[PayU] Payment failed:', {
        txnid: body.txnid,
        error: body.error,
      });
    }

    // Mark event as processed to prevent replay attacks
    markEventProcessed(eventId, 'payu');

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[PayU] Webhook error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ received: true });
  }
}
