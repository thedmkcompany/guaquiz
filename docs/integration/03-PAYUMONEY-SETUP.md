# PayUMoney Integration Guide

## When to Use PayUMoney

- Alternative to Razorpay
- If you already have a PayU merchant account
- For specific payment methods PayU supports better

**Note**: Razorpay generally has better documentation and developer experience. Consider using Razorpay unless you have specific reasons for PayU.

---

## Step 1: Create PayUMoney Account

### 1.1 Sign Up

1. Go to [PayU Business](https://payu.in/business)
2. Click "Sign Up" or "Get Started"
3. Complete registration with business details

### 1.2 Complete KYC

Required documents:
- PAN Card
- Business registration (GST, if applicable)
- Bank account details
- Address proof

**Timeline**: 2-3 business days for verification

---

## Step 2: Get API Credentials

### 2.1 Access Dashboard

1. Log in to [PayU Dashboard](https://dashboard.payu.in)
2. Navigate to: **Settings** → **API Configuration**

### 2.2 Get Credentials

You'll need:
```
Merchant Key: xxxxxx
Merchant Salt (Salt v1): xxxxxxxxxxxxxxxx
```

### 2.3 Test vs Production

| Environment | Dashboard URL |
|-------------|---------------|
| Test/Sandbox | `test.payu.in` |
| Production | `info.payu.in` |

Test credentials are provided separately for sandbox testing.

---

## Step 3: Configure Webhooks

### 3.1 Access Webhook Settings

1. Go to: **Settings** → **Webhook Settings**
2. Click "Add Webhook URL"

### 3.2 Configure Webhook

```
Webhook URL: https://your-domain.com/api/webhooks/payumoney
Events: All transaction events
SSL Verification: Enabled
```

### 3.3 Set Authorization Header

PayU uses a static authorization header for webhook validation:
```
Authorization Header: Your-Custom-Secret-Here
```

Save this as `PAYU_WEBHOOK_SECRET`.

---

## Step 4: Test Credentials

### Test Mode Values

```
Merchant Key: gtKFFx (PayU test key)
Salt: eCwWELxi (PayU test salt)
Test URL: https://test.payu.in/_payment
```

### Test Cards

```
Card Number: 5123456789012346
CVV: 123
Expiry: Any future date
Name: Any name
OTP: 123456
```

### Test UPI

```
VPA: anything@payu
```

---

## Step 5: Payment Flow Overview

PayU uses a **redirect-based flow** (different from Razorpay):

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYU PAYMENT FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Client initiates payment                               │
│     └─► POST /api/payment/payu/initiate                    │
│                                                             │
│  2. Server generates hash & payment params                 │
│     └─► Returns HTML form with hidden fields               │
│                                                             │
│  3. Client auto-submits form to PayU                       │
│     └─► Redirect to https://secure.payu.in/_payment        │
│                                                             │
│  4. User completes payment on PayU page                    │
│                                                             │
│  5. PayU redirects to success/failure URL                  │
│     └─► POST /api/payment/payu/callback                    │
│                                                             │
│  6. Server verifies hash & processes result                │
│     └─► Sync to Wix CRM if successful                      │
│                                                             │
│  7. PayU sends webhook (async, for reliability)            │
│     └─► POST /api/webhooks/payumoney                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 6: Code Implementation

### 6.1 Install Dependencies

```bash
npm install crypto
# crypto is built-in to Node.js, no install needed
```

### 6.2 Types Definition

Create `src/types/payu.ts`:

```typescript
export interface PayUPaymentParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  // Optional fields
  lastname?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  udf1?: string; // User defined field 1 (programId)
  udf2?: string; // User defined field 2
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PayUCallbackParams {
  mihpayid: string;
  status: 'success' | 'failure' | 'pending';
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  hash: string;
  error?: string;
  error_Message?: string;
  bank_ref_num?: string;
  bankcode?: string;
  cardnum?: string;
  // Additional fields
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}

export interface PayUWebhookPayload {
  mihpayid: string;
  status: string;
  txnid: string;
  amount: string;
  email: string;
  phone: string;
  productinfo: string;
  firstname: string;
  udf1?: string;
}
```

### 6.3 PayU Utility

Create `src/lib/payu.ts`:

```typescript
import crypto from 'crypto';

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY!;
const PAYU_SALT = process.env.PAYU_SALT!;

/**
 * Generate hash for PayU payment request
 * Hash formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePaymentHash(params: {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
  } = params;

  const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`;

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Verify hash from PayU callback/webhook
 * Reverse hash formula: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPaymentHash(params: {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  status: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}): boolean {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    hash,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    additionalCharges = '',
  } = params;

  // Handle additional charges if present
  let hashString: string;
  if (additionalCharges) {
    hashString = `${PAYU_SALT}|${status}|${additionalCharges}|||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
  } else {
    hashString = `${PAYU_SALT}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
  }

  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash),
      Buffer.from(hash)
    );
  } catch {
    return false;
  }
}

/**
 * Generate unique transaction ID
 */
export function generateTxnId(): string {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Get PayU payment URL
 */
export function getPayUUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment';
}

/**
 * Verify webhook authorization header
 */
export function verifyWebhookAuth(authHeader: string | null): boolean {
  if (!authHeader) return false;
  return authHeader === process.env.PAYU_WEBHOOK_SECRET;
}
```

### 6.4 Initiate Payment API Route

Create `src/app/api/payment/payu/initiate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generatePaymentHash, generateTxnId, getPayUUrl } from '@/lib/payu';

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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const txnid = generateTxnId();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Generate hash
    const hash = generatePaymentHash({
      txnid,
      amount: amount.toString(),
      productinfo: programName,
      firstname: customerName.split(' ')[0],
      email: customerEmail,
      udf1: programId, // Store programId in udf1
    });

    // Payment parameters
    const paymentParams = {
      key: process.env.PAYU_MERCHANT_KEY!,
      txnid,
      amount: amount.toString(),
      productinfo: programName,
      firstname: customerName.split(' ')[0],
      lastname: customerName.split(' ').slice(1).join(' ') || '',
      email: customerEmail,
      phone: customerPhone || '',
      surl: `${baseUrl}/api/payment/payu/callback`,
      furl: `${baseUrl}/api/payment/payu/callback`,
      hash,
      udf1: programId,
    };

    return NextResponse.json({
      paymentUrl: getPayUUrl(),
      params: paymentParams,
    });
  } catch (error) {
    console.error('PayU initiate error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
```

### 6.5 Callback Handler

Create `src/app/api/payment/payu/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentHash } from '@/lib/payu';
import { syncToWixCRM } from '@/lib/wix';

export async function POST(request: NextRequest) {
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
    };

    console.log('PayU callback received:', {
      txnid: params.txnid,
      status: params.status,
      mihpayid: params.mihpayid,
    });

    // Verify hash
    const isValid = verifyPaymentHash(params);

    if (!isValid) {
      console.error('Invalid hash in PayU callback');
      return NextResponse.redirect(
        new URL('/checkout/failed?error=invalid_signature', process.env.NEXT_PUBLIC_APP_URL!)
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

    if (params.status === 'success') {
      // Sync to Wix CRM
      try {
        await syncToWixCRM({
          email: params.email,
          name: params.firstname,
          phone: params.phone,
          programId: params.udf1,
          paymentId: params.mihpayid,
          amount: parseFloat(params.amount),
        });
      } catch (error) {
        console.error('Failed to sync to Wix:', error);
        // Don't fail the redirect - webhook will retry
      }

      // Redirect to success page
      return NextResponse.redirect(
        new URL(`/checkout/success?txnid=${params.txnid}&paymentId=${params.mihpayid}`, baseUrl)
      );
    } else {
      // Redirect to failure page
      const errorMsg = encodeURIComponent(params.error_Message || 'Payment failed');
      return NextResponse.redirect(
        new URL(`/checkout/failed?error=${errorMsg}`, baseUrl)
      );
    }
  } catch (error) {
    console.error('PayU callback error:', error);
    return NextResponse.redirect(
      new URL('/checkout/failed?error=processing_error', process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
```

### 6.6 Webhook Handler

Create `src/app/api/webhooks/payumoney/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookAuth, verifyPaymentHash } from '@/lib/payu';
import { syncToWixCRM } from '@/lib/wix';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization header
    const authHeader = request.headers.get('authorization');
    if (!verifyWebhookAuth(authHeader)) {
      console.error('Invalid webhook authorization');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    console.log('PayU webhook received:', {
      txnid: body.txnid,
      status: body.status,
      mihpayid: body.mihpayid,
    });

    // Only process successful payments
    if (body.status === 'success') {
      // Sync to Wix CRM (webhook is backup if callback failed)
      try {
        await syncToWixCRM({
          email: body.email,
          name: body.firstname,
          phone: body.phone || '',
          programId: body.udf1 || '',
          paymentId: body.mihpayid,
          amount: parseFloat(body.amount),
        });

        console.log('Webhook: Successfully synced to Wix CRM');
      } catch (error) {
        console.error('Webhook: Failed to sync to Wix:', error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayU webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
```

### 6.7 Client-Side Checkout Component

Create `src/components/PayUCheckout.tsx`:

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';

interface PayUCheckoutProps {
  amount: number;
  programId: string;
  programName: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
}

interface PaymentParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  udf1: string;
}

export default function PayUCheckout({
  amount,
  programId,
  programName,
  customerEmail,
  customerName,
  customerPhone,
}: PayUCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    paymentUrl: string;
    params: PaymentParams;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-submit form when payment data is ready
  useEffect(() => {
    if (paymentData && formRef.current) {
      formRef.current.submit();
    }
  }, [paymentData]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/payment/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          programId,
          programName,
          customerEmail,
          customerName,
          customerPhone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const data = await response.json();
      setPaymentData(data);
      // Form will auto-submit via useEffect
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold
                   hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
      >
        {loading ? 'Redirecting to PayU...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>

      {/* Hidden form for PayU redirect */}
      {paymentData && (
        <form
          ref={formRef}
          method="POST"
          action={paymentData.paymentUrl}
          style={{ display: 'none' }}
        >
          {Object.entries(paymentData.params).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </>
  );
}
```

---

## Step 7: Testing Checklist

### Test Mode Verification

- [ ] Initiate payment returns payment params
- [ ] Form redirects to PayU test page
- [ ] Test card payment completes
- [ ] Callback URL receives POST data
- [ ] Hash verification passes
- [ ] Success page loads correctly
- [ ] Wix CRM sync completes

### Error Handling

- [ ] Invalid amount rejected
- [ ] Failed payment redirects to failure page
- [ ] Invalid hash detected
- [ ] Network errors handled

### Production Checklist

- [ ] KYC completed and approved
- [ ] Live credentials configured
- [ ] Webhook URL configured
- [ ] Success/Failure URLs updated
- [ ] HTTPS enabled
- [ ] Test with real ₹1 payment

---

## Troubleshooting

### "Invalid hash"
- Check Salt is correct (use Salt v1)
- Verify hash string order matches exactly
- Check for extra spaces in values

### "Payment page not loading"
- Verify Merchant Key is correct
- Check if account is active
- Try test credentials first

### Callback not received
- Check surl/furl are accessible
- Verify POST method is allowed
- Check server logs for errors

### Webhook not received
- Verify webhook URL in dashboard
- Check authorization header matches
- Look at PayU webhook logs

---

## Environment Variables Summary

```env
# PayU Configuration
PAYU_MERCHANT_KEY=gtKFFx
PAYU_SALT=eCwWELxi
PAYU_WEBHOOK_SECRET=your_custom_webhook_secret

# App URL (for callbacks)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## PayU vs Razorpay Comparison

| Feature | Razorpay | PayU |
|---------|----------|------|
| Checkout Type | Modal (stays on page) | Redirect |
| Documentation | Excellent | Good |
| Webhooks | Reliable, signed | Basic |
| Test Mode | Easy | Requires separate URL |
| UPI Support | Excellent | Good |
| Fees | 2% + GST | 2% + GST |

**Recommendation**: Use Razorpay unless you have specific requirements for PayU.
