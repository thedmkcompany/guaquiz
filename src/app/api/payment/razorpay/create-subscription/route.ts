import { NextRequest, NextResponse } from 'next/server';
import { createSubscription, getPublicKey } from '@/lib/razorpay';
import { getProgramById } from '@/lib/programs';
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
  RATE_LIMITS,
} from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const clientIP = getClientIP(request);
    const ipLimit = checkRateLimit(`payment_create_${clientIP}`, RATE_LIMITS.PAYMENT_CREATE);
    if (!ipLimit.allowed) {
      return rateLimitResponse(ipLimit.resetIn);
    }

    const body = await request.json();

    const {
      planId, // Razorpay Plan ID (must be created in Razorpay dashboard or via API)
      programId,
      programName,
      customerEmail,
      customerName,
      customerPhone,
      totalCount, // Total billing cycles
    } = body;

    // Validate required fields
    if (!planId || !programId || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Rate limiting by email
    const emailLimit = checkRateLimit(
      `payment_email_${customerEmail.toLowerCase()}`,
      RATE_LIMITS.PAYMENT_PER_EMAIL
    );
    if (!emailLimit.allowed) {
      return rateLimitResponse(emailLimit.resetIn);
    }

    // SECURITY: Validate program exists and planId matches
    const program = getProgramById(programId);
    if (!program) {
      return NextResponse.json(
        { error: 'Invalid program' },
        { status: 400 }
      );
    }

    // Verify the planId matches what's configured for this program
    if (program.razorpayPlanId && planId !== program.razorpayPlanId) {
      console.error('[SECURITY] Plan ID mismatch:', {
        programId,
        expectedPlanId: program.razorpayPlanId,
        receivedPlanId: planId,
        ip: clientIP,
        email: customerEmail,
      });
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    // Create subscription
    const subscription = await createSubscription({
      planId,
      totalCount: totalCount || 12, // Default 12 billing cycles
      customerNotify: true,
      notes: {
        programId,
        programName: programName || program.name,
        customerEmail,
        customerName,
        customerPhone: customerPhone || '',
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      planId: subscription.plan_id,
      status: subscription.status,
      shortUrl: subscription.short_url, // Razorpay hosted checkout URL
      keyId: getPublicKey(),
    });
  } catch (error) {
    console.error('[Payment] Subscription creation failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Unable to create subscription. Please try again.' },
      { status: 500 }
    );
  }
}
