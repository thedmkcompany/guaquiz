import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentHash } from '@/lib/payu';
import { syncToWixCRM } from '@/lib/wix-crm';

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const formData = await request.formData();

    // Extract all callback parameters
    const params = {
      mihpayid: formData.get('mihpayid') as string,
      status: formData.get('status') as string,
      txnid: formData.get('txnid') as string,
      amount: formData.get('amount') as string,
      productinfo: formData.get('productinfo') as string,
      firstname: formData.get('firstname') as string,
      lastname: formData.get('lastname') as string || '',
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || '',
      hash: formData.get('hash') as string,
      udf1: formData.get('udf1') as string || '', // programId
      udf2: formData.get('udf2') as string || '',
      udf3: formData.get('udf3') as string || '',
      udf4: formData.get('udf4') as string || '',
      udf5: formData.get('udf5') as string || '',
      additionalCharges: formData.get('additionalCharges') as string || '',
      error: formData.get('error') as string || '',
      error_Message: formData.get('error_Message') as string || '',
      bank_ref_num: formData.get('bank_ref_num') as string || '',
    };

    console.log('[PayU Callback] Received:', {
      txnid: params.txnid,
      status: params.status,
      mihpayid: params.mihpayid,
      amount: params.amount,
    });

    // Verify hash
    const isValid = verifyPaymentHash({
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

    if (!isValid) {
      console.error('[PayU Callback] Invalid hash');
      return NextResponse.redirect(
        new URL(`/checkout/failed?error=invalid_signature&txnid=${params.txnid}`, baseUrl)
      );
    }

    if (params.status === 'success') {
      // Sync to Wix CRM
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
        console.error('[PayU Callback] Failed to sync to Wix:', error);
        // Don't fail the redirect - webhook will retry if needed
      }

      // Redirect to success page
      return NextResponse.redirect(
        new URL(
          `/checkout/success?gateway=payu&txnid=${params.txnid}&paymentId=${params.mihpayid}&amount=${params.amount}`,
          baseUrl
        )
      );
    } else {
      // Redirect to failure page
      const errorMsg = encodeURIComponent(
        params.error_Message || params.error || 'Payment failed'
      );
      return NextResponse.redirect(
        new URL(
          `/checkout/failed?gateway=payu&error=${errorMsg}&txnid=${params.txnid}`,
          baseUrl
        )
      );
    }
  } catch (error) {
    console.error('[PayU Callback] Error:', error);
    return NextResponse.redirect(
      new URL('/checkout/failed?error=processing_error', baseUrl)
    );
  }
}
