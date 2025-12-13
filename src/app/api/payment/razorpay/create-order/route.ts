import { NextRequest, NextResponse } from 'next/server';
import { createOrder, generateReceiptId, getPublicKey } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
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
        { error: 'Missing required fields: amount, programId, customerEmail, customerName' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Generate unique receipt ID
    const receipt = generateReceiptId();

    // Create Razorpay order with notes for webhook processing
    const order = await createOrder(amount, receipt, {
      programId,
      programName: programName || programId,
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
    console.error('Razorpay create order error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}
