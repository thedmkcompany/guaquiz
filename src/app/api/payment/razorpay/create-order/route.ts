import { NextRequest, NextResponse } from 'next/server';
import { createOrder, generateReceiptId, getPublicKey } from '@/lib/razorpay';
import {
  withPaymentHandler,
  validatePaymentWithProgram,
  processingError,
} from '@/lib/payment-api';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  return withPaymentHandler(request, async ({ clientIP, body }) => {
    // Validate request and get program
    const validation = validatePaymentWithProgram(body, clientIP);
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
      // Generate unique receipt ID
      const receipt = generateReceiptId();

      // Create Razorpay order with customer notes for webhook processing
      const order = await createOrder(data.amount, receipt, {
        programId: data.programId,
        programName: data.programName || program.name,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone || '',
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        keyId: getPublicKey(),
      });
    } catch (error) {
      console.error('[Razorpay] Order creation failed:', error instanceof Error ? error.message : 'Unknown error');
      return processingError('Unable to create payment order. Please try again.');
    }
  });
}
