import { NextRequest, NextResponse } from 'next/server';
import {
  generatePaymentHash,
  generateTxnId,
  getPayUUrl,
  getMerchantKey,
  isPayUConfigured,
} from '@/lib/payu';
import {
  withPaymentHandler,
  validatePaymentWithProgram,
  parseCustomerName,
  getBaseUrl,
  errorResponse,
  ErrorCode,
} from '@/lib/payment-api';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  return withPaymentHandler(request, async ({ clientIP, body }) => {
    // Check if PayU is configured
    if (!isPayUConfigured()) {
      return errorResponse('PayU is not configured', 500, ErrorCode.NOT_CONFIGURED);
    }

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

    // Generate transaction ID and parse name
    const txnid = generateTxnId();
    const { firstName, lastName } = parseCustomerName(data.customerName);
    const baseUrl = getBaseUrl();
    const productInfo = data.programName || program.name;

    // Generate payment hash
    const hash = generatePaymentHash({
      txnid,
      amount: data.amount.toFixed(2),
      productinfo: productInfo,
      firstname: firstName,
      email: data.customerEmail,
      udf1: data.programId,
      udf2: '',
    });

    // Build payment parameters for PayU form
    const paymentParams = {
      key: getMerchantKey(),
      txnid,
      amount: data.amount.toFixed(2),
      productinfo: productInfo,
      firstname: firstName,
      lastname: lastName,
      email: data.customerEmail,
      phone: data.customerPhone || '',
      surl: `${baseUrl}/api/payment/payu/callback`,
      furl: `${baseUrl}/api/payment/payu/callback`,
      hash,
      udf1: data.programId,
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
  });
}
