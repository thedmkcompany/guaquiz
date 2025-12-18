import { NextRequest, NextResponse } from 'next/server';
import { createSubscription, getPublicKey } from '@/lib/razorpay';
import {
  withPaymentHandler,
  validateSubscriptionWithProgram,
  processingError,
} from '@/lib/payment-api';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';

const DEFAULT_BILLING_CYCLES = 12;

export async function POST(request: NextRequest) {
  return withPaymentHandler(request, async ({ clientIP, body }) => {
    // Validate request and get program
    const validation = validateSubscriptionWithProgram(body, clientIP);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { data, program } = validation;

    // Additional rate limit by email
    const emailLimit = await checkRateLimit(
      `payment_email_${data.customerEmail}`,
      RATE_LIMITS.PAYMENT_PER_EMAIL
    );
    if (!emailLimit.allowed) {
      return rateLimitResponse(emailLimit.resetIn);
    }

    try {
      // Create Razorpay subscription
      const subscription = await createSubscription({
        planId: data.planId,
        totalCount: data.totalCount || DEFAULT_BILLING_CYCLES,
        customerNotify: true,
        notes: {
          programId: data.programId,
          programName: data.programName || program.name,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          customerPhone: data.customerPhone || '',
          programStartDate: data.programStartDate || new Date().toISOString(),
          startDateOption: data.startDateOption || 'coming-monday',
        },
      });

      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        status: subscription.status,
        shortUrl: subscription.short_url,
        keyId: getPublicKey(),
      });
    } catch (error) {
      console.error('[Razorpay] Subscription creation failed:', error instanceof Error ? error.message : 'Unknown error');
      return processingError('Unable to create subscription. Please try again.');
    }
  });
}
