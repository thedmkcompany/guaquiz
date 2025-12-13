# Razorpay Integration Guide

## Why Razorpay?

- **Best documentation** among Indian payment gateways
- **100+ payment methods**: UPI, Cards, Net Banking, Wallets, EMI
- **Lower fees**: 2% + GST (negotiable for volume)
- **Excellent test mode** for development
- **Reliable webhooks** with retry logic

---

## Step 1: Create Razorpay Account

### 1.1 Sign Up

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Sign up with email or Google
3. Verify your email

### 1.2 Complete KYC (For Production)

For test mode, you can skip this. For live payments:

1. Go to **Account & Settings** → **Profile**
2. Complete business verification:
   - Business type (Individual/Company)
   - PAN Card
   - Bank account details
   - Business documents

**Timeline**: KYC approval takes 2-3 business days

---

## Step 2: Get API Keys

### 2.1 Test Mode Keys (Development)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Ensure you're in **Test Mode** (toggle at top)
3. Navigate to: **Account & Settings** → **API Keys**
4. Click **"Generate Test Key"**

You'll receive:
```
Key ID: rzp_test_xxxxxxxxxxxx
Key Secret: xxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.2 Live Mode Keys (Production)

1. Toggle to **Live Mode**
2. Complete KYC if not done
3. Generate Live Key

```
Key ID: rzp_live_xxxxxxxxxxxx
Key Secret: xxxxxxxxxxxxxxxxxxxxxxxx
```

**IMPORTANT**:
- Test keys only work with test cards
- Live keys only work with real payments
- Never expose Key Secret in client-side code

---

## Step 3: Configure Webhooks

### 3.1 Create Webhook Endpoint

1. Go to: **Account & Settings** → **Webhooks**
2. Click **"+ Add New Webhook"**

### 3.2 Configure Webhook

```
Webhook URL: https://your-domain.com/api/webhooks/razorpay
Secret: [Generate a strong secret - save this!]
Alert Email: your@email.com
Active Events: Select the following
```

### 3.3 Required Events

Select these events:

| Event | When It Fires |
|-------|---------------|
| `payment.captured` | Payment successful |
| `payment.failed` | Payment failed |
| `order.paid` | Order fully paid |
| `refund.created` | Refund initiated |

### 3.4 Save Webhook Secret

After creating webhook, save the secret:
```
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## Step 4: Test Card Numbers

Use these in test mode:

### Successful Payment
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name
```

### Failed Payment
```
Card Number: 4111 1111 1111 1234
```

### UPI Test
```
UPI ID: success@razorpay (auto-succeeds)
UPI ID: failure@razorpay (auto-fails)
```

### Net Banking Test
- Select any bank
- Use "success" or "failure" to simulate

---

## Step 5: Payment Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Client requests order                                   │
│     └─► POST /api/payment/create-order                     │
│                                                             │
│  2. Server creates Razorpay order                          │
│     └─► razorpay.orders.create()                           │
│     └─► Returns order_id to client                         │
│                                                             │
│  3. Client opens Razorpay checkout                         │
│     └─► Razorpay.open({ order_id, ... })                   │
│                                                             │
│  4. User completes payment                                 │
│     └─► Razorpay sends payment response to client          │
│                                                             │
│  5. Client sends payment data for verification             │
│     └─► POST /api/payment/verify                           │
│                                                             │
│  6. Server verifies signature                              │
│     └─► crypto.createHmac().verify()                       │
│     └─► Returns success/failure to client                  │
│                                                             │
│  7. Razorpay sends webhook (async, reliable)               │
│     └─► POST /api/webhooks/razorpay                        │
│     └─► Server syncs to Wix CRM                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 6: Code Implementation

### 6.1 Install Dependencies

```bash
npm install razorpay
```

### 6.2 Types Definition

Create `src/types/razorpay.ts`:

```typescript
export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: RazorpayPaymentEntity;
    };
    order?: {
      entity: RazorpayOrder;
    };
  };
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description: string;
  email: string;
  contact: string;
  notes: Record<string, string>;
  created_at: number;
  captured: boolean;
}

export interface CreateOrderRequest {
  amount: number; // In rupees (will be converted to paise)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}
```

### 6.3 Razorpay Utility

Create `src/lib/razorpay.ts`:

```typescript
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Create a Razorpay order
 */
export async function createOrder(
  amount: number, // Amount in rupees
  receipt: string,
  notes?: Record<string, string>
) {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt,
    notes: notes || {},
  });

  return order;
}

/**
 * Verify payment signature (for client-side verification)
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

/**
 * Fetch payment details
 */
export async function fetchPayment(paymentId: string) {
  return razorpay.payments.fetch(paymentId);
}

/**
 * Fetch order details
 */
export async function fetchOrder(orderId: string) {
  return razorpay.orders.fetch(orderId);
}
```

### 6.4 Create Order API Route

Create `src/app/api/payment/create-order/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { amount, programId, customerEmail, customerName, customerPhone } = body;

    // Validate required fields
    if (!amount || !programId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique receipt ID
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Razorpay order with notes for webhook processing
    const order = await createOrder(amount, receipt, {
      programId,
      customerEmail,
      customerName: customerName || '',
      customerPhone: customerPhone || '',
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

### 6.5 Verify Payment API Route

Create `src/app/api/payment/verify/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature', verified: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Verification failed', verified: false },
      { status: 500 }
    );
  }
}
```

### 6.6 Webhook Handler

Create `src/app/api/webhooks/razorpay/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { syncToWixCRM } from '@/lib/wix';
import type { RazorpayWebhookPayload } from '@/types/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: RazorpayWebhookPayload = JSON.parse(body);
    const eventId = request.headers.get('x-razorpay-event-id');

    console.log(`Processing webhook: ${payload.event} (${eventId})`);

    // Handle different events
    switch (payload.event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;

      case 'order.paid':
        // Order is fully paid - can use this as primary trigger
        console.log('Order paid:', payload.payload.order?.entity.id);
        break;

      default:
        console.log('Unhandled event:', payload.event);
    }

    // Always return 200 quickly
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to prevent retries for parsing errors
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity;

  console.log('Payment captured:', {
    paymentId: payment.id,
    orderId: payment.order_id,
    amount: payment.amount / 100,
    email: payment.email,
  });

  // Extract customer data from payment notes
  const { programId, customerEmail, customerName, customerPhone } = payment.notes;

  // Sync to Wix CRM
  try {
    await syncToWixCRM({
      email: customerEmail || payment.email,
      name: customerName || '',
      phone: customerPhone || payment.contact,
      programId,
      paymentId: payment.id,
      amount: payment.amount / 100,
    });

    console.log('Successfully synced to Wix CRM');
  } catch (error) {
    console.error('Failed to sync to Wix CRM:', error);
    // Don't throw - we still want to return 200 to Razorpay
    // Implement retry logic or alert system here
  }
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity;

  console.log('Payment failed:', {
    paymentId: payment.id,
    orderId: payment.order_id,
    email: payment.email,
  });

  // Optional: Track failed payments, send notification, etc.
}
```

### 6.7 Client-Side Checkout Component

Create `src/components/RazorpayCheckout.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Script from 'next/script';

interface RazorpayCheckoutProps {
  amount: number;
  programId: string;
  programName: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayCheckout({
  amount,
  programId,
  programName,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create order on server
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          programId,
          customerEmail,
          customerName,
          customerPhone,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Your Company Name',
        description: programName,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          programId,
        },
        theme: {
          color: '#6366f1', // Customize to match your brand
        },
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.verified) {
            onSuccess(response.razorpay_payment_id);
          } else {
            onError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold
                   hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>
    </>
  );
}
```

---

## Step 7: Testing Checklist

### Test Mode Verification

- [ ] Create order API returns order ID
- [ ] Razorpay checkout opens successfully
- [ ] Test card payment completes
- [ ] Payment verification returns verified: true
- [ ] Webhook received and processed
- [ ] Wix CRM sync completes

### Error Handling

- [ ] Invalid amount rejected
- [ ] Failed payment handled gracefully
- [ ] Invalid signature detected
- [ ] Network errors show user-friendly message

### Production Checklist

- [ ] KYC completed and approved
- [ ] Live API keys configured
- [ ] Webhook URL updated to production domain
- [ ] HTTPS enabled
- [ ] Error monitoring configured
- [ ] Test with real ₹1 payment

---

## Troubleshooting

### "Order creation failed"
- Check API keys are correct
- Ensure amount is positive
- Check Razorpay dashboard for errors

### "Invalid signature"
- Ensure you're using correct Key Secret
- Check webhook secret matches dashboard
- Verify signature calculation logic

### Webhook not received
- Check webhook URL is accessible
- Verify HTTPS is working
- Check Razorpay dashboard webhook logs

### Payment stuck on "Processing"
- Check browser console for errors
- Verify order ID is correct
- Test with different payment method

---

## Environment Variables Summary

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Public (safe for client-side)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```
