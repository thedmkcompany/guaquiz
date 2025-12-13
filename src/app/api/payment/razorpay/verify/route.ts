import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPaymentSignature,
  verifySubscriptionSignature,
  fetchPayment,
} from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
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
      console.error('Invalid payment signature');
      return NextResponse.json(
        { error: 'Invalid payment signature', verified: false },
        { status: 400 }
      );
    }

    // Optionally fetch payment details for confirmation
    let paymentDetails = null;
    try {
      paymentDetails = await fetchPayment(razorpay_payment_id);
    } catch (err) {
      console.warn('Could not fetch payment details:', err);
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id || null,
      subscriptionId: razorpay_subscription_id || null,
      status: paymentDetails?.status || 'captured',
    });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json(
      { error: 'Verification failed', verified: false },
      { status: 500 }
    );
  }
}
