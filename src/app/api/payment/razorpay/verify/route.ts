import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPaymentSignature,
  verifySubscriptionSignature,
  fetchPayment,
} from '@/lib/razorpay';
import {
  withPaymentHandler,
  parseRequest,
  RazorpayVerifySchema,
  errorResponse,
  ErrorCode,
} from '@/lib/payment-api';
import { RATE_LIMITS } from '@/lib/rate-limit';
import { maskIP } from '@/lib/validation';

export async function POST(request: NextRequest) {
  return withPaymentHandler(
    request,
    async ({ clientIP, body }) => {
      // Parse and validate request
      const parsed = parseRequest(body, RazorpayVerifySchema);
      if (!parsed.success) {
        return parsed.response;
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id,
      } = parsed.data;

      // Verify signature based on payment type
      const isValidSignature = razorpay_subscription_id
        ? verifySubscriptionSignature(razorpay_subscription_id, razorpay_payment_id, razorpay_signature)
        : verifyPaymentSignature(razorpay_order_id!, razorpay_payment_id, razorpay_signature);

      if (!isValidSignature) {
        console.error('[Security] Invalid payment signature:', {
          paymentId: razorpay_payment_id,
          ip: maskIP(clientIP),
        });

        return errorResponse(
          'Payment verification failed',
          400,
          ErrorCode.INVALID_SIGNATURE
        );
      }

      // Optionally fetch payment details for confirmation
      const paymentDetails = await fetchPaymentSafe(razorpay_payment_id);

      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id ?? null,
        subscriptionId: razorpay_subscription_id ?? null,
        status: paymentDetails?.status || 'captured',
      });
    },
    {
      rateLimitKey: `payment_verify_${request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'}`,
      rateLimitConfig: RATE_LIMITS.PAYMENT_VERIFY,
    }
  );
}

/**
 * Fetch payment details without throwing
 */
async function fetchPaymentSafe(paymentId: string): Promise<{ status: string } | null> {
  try {
    return await fetchPayment(paymentId);
  } catch {
    // Non-critical - continue without details
    return null;
  }
}
