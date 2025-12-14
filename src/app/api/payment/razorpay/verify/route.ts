import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPaymentSignature,
  verifySubscriptionSignature,
  fetchPayment,
} from '@/lib/razorpay';
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
  RATE_LIMITS,
} from '@/lib/rate-limit';
import { maskIP } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const clientIP = getClientIP(request);
    const ipLimit = checkRateLimit(`payment_verify_${clientIP}`, RATE_LIMITS.PAYMENT_VERIFY);
    if (!ipLimit.allowed) {
      return rateLimitResponse(ipLimit.resetIn);
    }

    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      );
    }

    let isValid = false;

    // Verify based on payment type
    if (razorpay_subscription_id) {
      // Subscription payment verification
      isValid = verifySubscriptionSignature(
        razorpay_subscription_id,
        razorpay_payment_id,
        razorpay_signature
      );
    } else if (razorpay_order_id) {
      // One-time payment verification
      isValid = verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
    } else {
      return NextResponse.json(
        { error: 'Missing order_id or subscription_id' },
        { status: 400 }
      );
    }

    if (!isValid) {
      console.error('[Security] Invalid payment signature attempt:', {
        paymentId: razorpay_payment_id,
        ip: maskIP(clientIP),
      });
      return NextResponse.json(
        { error: 'Payment verification failed', verified: false },
        { status: 400 }
      );
    }

    // Optionally fetch payment details for confirmation
    let paymentDetails = null;
    try {
      paymentDetails = await fetchPayment(razorpay_payment_id);
    } catch {
      // Non-critical - continue without details
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id || null,
      subscriptionId: razorpay_subscription_id || null,
      status: paymentDetails?.status || 'captured',
    });
  } catch (error) {
    console.error('[Payment] Verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Verification failed', verified: false },
      { status: 500 }
    );
  }
}
