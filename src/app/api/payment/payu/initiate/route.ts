import { NextRequest, NextResponse } from 'next/server';
import {
  generatePaymentHash,
  generateTxnId,
  getPayUUrl,
  getMerchantKey,
  isPayUConfigured,
} from '@/lib/payu';

export async function POST(request: NextRequest) {
  try {
    // Check if PayU is configured
    if (!isPayUConfigured()) {
      return NextResponse.json(
        { error: 'PayU is not configured' },
        { status: 500 }
      );
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

    const txnid = generateTxnId();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Parse name
    const nameParts = customerName.trim().split(' ');
    const firstname = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ') || '';

    // Generate hash
    const hash = generatePaymentHash({
      txnid,
      amount: amount.toFixed(2),
      productinfo: programName || programId,
      firstname,
      email: customerEmail,
      udf1: programId, // Store programId in udf1
      udf2: '', // Reserved for future use
    });

    // Payment parameters for PayU form
    const paymentParams = {
      key: getMerchantKey(),
      txnid,
      amount: amount.toFixed(2),
      productinfo: programName || programId,
      firstname,
      lastname,
      email: customerEmail,
      phone: customerPhone || '',
      surl: `${baseUrl}/api/payment/payu/callback`,
      furl: `${baseUrl}/api/payment/payu/callback`,
      hash,
      udf1: programId,
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
    };

    return NextResponse.json({
      success: true,
      paymentUrl: getPayUUrl(),
      params: paymentParams,
    });
  } catch (error) {
    console.error('PayU initiate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
