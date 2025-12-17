import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentHash } from '@/lib/payu';
import { syncToWixCRM } from '@/lib/wix-crm';
import { getBaseUrl } from '@/lib/payment-api';

interface PayUCallbackParams {
  mihpayid: string;
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  hash: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  additionalCharges: string;
  error: string;
  errorMessage: string;
  bankRefNum: string;
}

/**
 * Extract PayU callback parameters from form data
 */
function extractCallbackParams(formData: FormData): PayUCallbackParams {
  const getString = (key: string): string => (formData.get(key) as string) || '';

  return {
    mihpayid: getString('mihpayid'),
    status: getString('status'),
    txnid: getString('txnid'),
    amount: getString('amount'),
    productinfo: getString('productinfo'),
    firstname: getString('firstname'),
    lastname: getString('lastname'),
    email: getString('email'),
    phone: getString('phone'),
    hash: getString('hash'),
    udf1: getString('udf1'),
    udf2: getString('udf2'),
    udf3: getString('udf3'),
    udf4: getString('udf4'),
    udf5: getString('udf5'),
    additionalCharges: getString('additionalCharges'),
    error: getString('error'),
    errorMessage: getString('error_Message'),
    bankRefNum: getString('bank_ref_num'),
  };
}

/**
 * Build redirect URL with query parameters
 */
function buildRedirectUrl(path: string, params: Record<string, string>): URL {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl);

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  return url;
}

export async function POST(request: NextRequest) {
  const baseUrl = getBaseUrl();

  try {
    const formData = await request.formData();
    const params = extractCallbackParams(formData);

    console.log('[PayU Callback] Received:', {
      txnid: params.txnid,
      status: params.status,
      mihpayid: params.mihpayid,
      amount: params.amount,
    });

    // Verify payment hash for security
    const isValidHash = verifyPaymentHash({
      txnid: params.txnid,
      amount: params.amount,
      productinfo: params.productinfo,
      firstname: params.firstname,
      email: params.email,
      status: params.status,
      hash: params.hash,
      udf1: params.udf1,
      udf2: params.udf2,
      udf3: params.udf3,
      udf4: params.udf4,
      udf5: params.udf5,
      additionalCharges: params.additionalCharges,
    });

    if (!isValidHash) {
      console.error('[PayU Callback] Invalid hash for txnid:', params.txnid);
      return NextResponse.redirect(
        buildRedirectUrl('/checkout/failed', {
          error: 'invalid_signature',
          txnid: params.txnid,
        })
      );
    }

    // Handle successful payment
    if (params.status === 'success') {
      await handleSuccessfulPayment(params);

      return NextResponse.redirect(
        buildRedirectUrl('/checkout/success', {
          gateway: 'payu',
          txnid: params.txnid,
          paymentId: params.mihpayid,
          amount: params.amount,
        })
      );
    }

    // Handle failed payment
    const errorMessage = params.errorMessage || params.error || 'Payment failed';
    return NextResponse.redirect(
      buildRedirectUrl('/checkout/failed', {
        gateway: 'payu',
        error: errorMessage,
        txnid: params.txnid,
      })
    );
  } catch (error) {
    console.error('[PayU Callback] Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.redirect(new URL('/checkout/failed?error=processing_error', baseUrl));
  }
}

/**
 * Handle successful payment: sync to CRM
 */
async function handleSuccessfulPayment(params: PayUCallbackParams): Promise<void> {
  try {
    const result = await syncToWixCRM({
      email: params.email,
      firstName: params.firstname,
      lastName: params.lastname,
      phone: params.phone,
      programId: params.udf1,
      programName: params.productinfo,
      paymentId: params.mihpayid,
      amount: parseFloat(params.amount),
      isSubscription: false,
    });

    console.log('[PayU Callback] Wix CRM sync result:', result);
  } catch (error) {
    // Log but don't fail - webhook will retry if needed
    console.error('[PayU Callback] Failed to sync to Wix:', error);
  }
}
