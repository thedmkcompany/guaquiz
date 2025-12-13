import { NextRequest, NextResponse } from 'next/server';
import { createOrder, generateReceiptId, getPublicKey } from '@/lib/razorpay';
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
      amount,
      programId,
      programName,
      customerEmail,
      customerName,
      customerPhone,
    } = body;

    // Validate required fields
    if (!amount || !programId || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Rate limiting by email (prevent abuse from same email)
    const emailLimit = checkRateLimit(
      `payment_email_${customerEmail.toLowerCase()}`,
      RATE_LIMITS.PAYMENT_PER_EMAIL
    );
    if (!emailLimit.allowed) {
      return rateLimitResponse(emailLimit.resetIn);
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // SECURITY: Validate amount matches program price (prevent price manipulation)
    const program = getProgramById(programId);
    if (!program) {
      return NextResponse.json(
        { error: 'Invalid program' },
        { status: 400 }
      );
    }

    if (amount !== program.price) {
      console.error('[SECURITY] Price manipulation attempt:', {
        programId,
        expectedPrice: program.price,
        receivedAmount: amount,
        ip: clientIP,
        email: customerEmail,
      });
      return NextResponse.json(
        { error: 'Invalid amount for selected program' },
        { status: 400 }
      );
    }

    // Generate unique receipt ID
    const receipt = generateReceiptId();

    // Create Razorpay order with notes for webhook processing
    const order = await createOrder(amount, receipt, {
      programId,
      programName: programName || program.name,
      customerEmail,
      customerName,
      customerPhone: customerPhone || '',
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount, // In paise
      currency: order.currency,
      receipt: order.receipt,
      keyId: getPublicKey(),
    });
  } catch (error) {
    console.error('[Payment] Order creation failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Unable to process payment. Please try again.' },
      { status: 500 }
    );
  }
}
