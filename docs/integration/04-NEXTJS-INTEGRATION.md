# Next.js Integration Guide

## Wix CRM Integration Code

This is the core integration code that syncs payment data to Wix CRM.

---

## Step 1: Install Wix SDK

```bash
npm install @wix/sdk @wix/crm @wix/pricing-plans
```

---

## Step 2: Create Wix Client Utility

Create `src/lib/wix.ts`:

```typescript
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { contacts } from '@wix/crm';
import { orders } from '@wix/pricing-plans';

// Initialize Wix client with API key
const wixClient = createClient({
  modules: { contacts, orders },
  auth: ApiKeyStrategy({
    apiKey: process.env.WIX_API_KEY!,
    siteId: process.env.WIX_SITE_ID!,
  }),
});

export interface CustomerData {
  email: string;
  name: string;
  phone: string;
  programId: string;
  paymentId: string;
  amount: number;
}

/**
 * Sync customer to Wix CRM after successful payment
 * 1. Create/Update Contact
 * 2. Create Member (optional)
 * 3. Assign Pricing Plan
 * 4. Trigger Automation (for emails)
 */
export async function syncToWixCRM(data: CustomerData): Promise<{
  contactId: string;
  orderId?: string;
}> {
  const { email, name, phone, programId, paymentId, amount } = data;

  // Parse name
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Step 1: Create or find contact
  let contactId: string;

  try {
    // Try to create new contact
    const contactResponse = await wixClient.contacts.createContact({
      info: {
        name: {
          first: firstName,
          last: lastName,
        },
        emails: {
          items: [{ email }],
        },
        phones: {
          items: phone ? [{ phone }] : [],
        },
        extendedFields: {
          items: {
            'custom.paymentId': paymentId,
            'custom.paymentAmount': amount.toString(),
            'custom.programId': programId,
          },
        },
      },
    });

    contactId = contactResponse.contact!._id!;
    console.log('Created new contact:', contactId);
  } catch (error: any) {
    // If contact exists, try to find and update
    if (error.message?.includes('duplicate') || error.code === 'ALREADY_EXISTS') {
      const queryResponse = await wixClient.contacts.queryContacts({
        filter: {
          'info.emails.items.email': { $eq: email },
        },
      });

      if (queryResponse.contacts && queryResponse.contacts.length > 0) {
        contactId = queryResponse.contacts[0]._id!;
        console.log('Found existing contact:', contactId);

        // Update contact with payment info
        await wixClient.contacts.updateContact(contactId, {
          info: {
            extendedFields: {
              items: {
                'custom.paymentId': paymentId,
                'custom.paymentAmount': amount.toString(),
                'custom.programId': programId,
              },
            },
          },
        });
      } else {
        throw new Error('Contact exists but could not be found');
      }
    } else {
      throw error;
    }
  }

  // Step 2: Assign pricing plan (create offline order)
  let orderId: string | undefined;

  if (programId) {
    try {
      const planId = getPlanIdFromProgramId(programId);

      if (planId) {
        const orderResponse = await wixClient.orders.createOfflineOrder({
          planId,
          memberId: contactId, // Note: This requires contact to be a member
          startDate: new Date().toISOString(),
        });

        orderId = orderResponse.order?._id;

        // Mark as paid
        if (orderId) {
          await wixClient.orders.markAsPaid(orderId);
          console.log('Created and paid order:', orderId);
        }
      }
    } catch (error) {
      console.error('Failed to create pricing plan order:', error);
      // Don't throw - contact was still created successfully
    }
  }

  // Step 3: Trigger automation webhook (for emails)
  await triggerWixAutomation({
    email,
    firstName,
    lastName,
    phone,
    programId,
    paymentId,
    amount,
  });

  return { contactId, orderId };
}

/**
 * Map your program IDs to Wix Plan IDs
 */
function getPlanIdFromProgramId(programId: string): string | null {
  const planMapping: Record<string, string> = {
    'program-basic': process.env.WIX_PLAN_ID_BASIC || '',
    'program-premium': process.env.WIX_PLAN_ID_PREMIUM || '',
    'program-pro': process.env.WIX_PLAN_ID_PRO || '',
    // Add more mappings as needed
  };

  return planMapping[programId] || process.env.WIX_PLAN_ID_DEFAULT || null;
}

/**
 * Trigger Wix Automation webhook for email sending
 */
async function triggerWixAutomation(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  programId: string;
  paymentId: string;
  amount: number;
}): Promise<void> {
  const webhookUrl = process.env.WIX_AUTOMATION_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('No Wix automation webhook URL configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        programName: getProgramName(data.programId),
        paymentId: data.paymentId,
        amount: data.amount,
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log('Triggered Wix automation webhook');
    } else {
      console.error('Wix automation webhook failed:', response.status);
    }
  } catch (error) {
    console.error('Failed to trigger Wix automation:', error);
  }
}

/**
 * Map program IDs to display names
 */
function getProgramName(programId: string): string {
  const nameMapping: Record<string, string> = {
    'program-basic': 'Basic Program',
    'program-premium': 'Premium Program',
    'program-pro': 'Pro Program',
    // Add more mappings as needed
  };

  return nameMapping[programId] || programId;
}

/**
 * Create a Wix member from contact (for login access)
 */
export async function createWixMember(contactId: string, email: string): Promise<string | null> {
  try {
    // Using REST API directly for member creation
    const response = await fetch('https://www.wixapis.com/members/v1/members', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WIX_API_KEY}`,
        'wix-site-id': process.env.WIX_SITE_ID!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        member: {
          contactId,
          loginEmail: email,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const memberId = data.member?.id;
      console.log('Created member:', memberId);

      // Trigger password setup email
      await sendPasswordSetupEmail(email);

      return memberId;
    } else {
      const error = await response.text();
      console.error('Failed to create member:', error);
      return null;
    }
  } catch (error) {
    console.error('Member creation error:', error);
    return null;
  }
}

/**
 * Send password setup email to new member
 */
async function sendPasswordSetupEmail(email: string): Promise<void> {
  try {
    const response = await fetch(
      'https://www.wixapis.com/members/v1/auth/send-set-password-email',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WIX_API_KEY}`,
          'wix-site-id': process.env.WIX_SITE_ID!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      console.log('Sent password setup email to:', email);
    }
  } catch (error) {
    console.error('Failed to send password email:', error);
  }
}

/**
 * Query contacts by email
 */
export async function findContactByEmail(email: string) {
  const response = await wixClient.contacts.queryContacts({
    filter: {
      'info.emails.items.email': { $eq: email },
    },
  });

  return response.contacts?.[0] || null;
}

/**
 * Get all pricing plans
 */
export async function listPricingPlans() {
  const response = await fetch('https://www.wixapis.com/pricing-plans/v2/plans', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.WIX_API_KEY}`,
      'wix-site-id': process.env.WIX_SITE_ID!,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error('Failed to fetch pricing plans');
}
```

---

## Step 3: Create Extended Fields in Wix (Optional)

If you want to store custom data on contacts, create extended fields in Wix:

1. Go to Wix Dashboard → Contacts → Manage Fields
2. Add custom fields:
   - `paymentId` (Text)
   - `paymentAmount` (Number)
   - `programId` (Text)

Then update the code to use:
```typescript
extendedFields: {
  items: {
    'custom.paymentId': paymentId,
    'custom.paymentAmount': amount.toString(),
    'custom.programId': programId,
  },
},
```

---

## Step 4: Full Integration Example

Here's a complete checkout page example:

Create `src/app/checkout/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RazorpayCheckout from '@/components/RazorpayCheckout';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const programId = searchParams.get('program') || 'program-basic';
  const amount = parseInt(searchParams.get('amount') || '999', 10);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  });

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [paymentId, setPaymentId] = useState<string>('');

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id);
    setStep('success');
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500">
            Payment ID: {paymentId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Checkout</h1>
            <p className="text-indigo-200">Complete your purchase</p>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Program</span>
              <span className="font-medium">{programId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Amount</span>
              <span className="text-xl font-bold">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            {step === 'info' ? (
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold
                           hover:bg-indigo-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Paying as:</p>
                  <p className="font-medium">{customerInfo.name}</p>
                  <p className="text-sm text-gray-500">{customerInfo.email}</p>
                </div>

                <RazorpayCheckout
                  amount={amount}
                  programId={programId}
                  programName={`Program: ${programId}`}
                  customerEmail={customerInfo.email}
                  customerName={customerInfo.name}
                  customerPhone={customerInfo.phone}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />

                <button
                  onClick={() => setStep('info')}
                  className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
                >
                  ← Back to details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 5: Success and Failure Pages

Create `src/app/checkout/success/page.tsx`:

```typescript
import Link from 'next/link';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { txnid?: string; paymentId?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You will receive a confirmation email shortly with
          instructions to access your program.
        </p>
        {searchParams.paymentId && (
          <p className="text-sm text-gray-500 mb-6">
            Payment ID: {searchParams.paymentId}
          </p>
        )}
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold
                     hover:bg-indigo-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
```

Create `src/app/checkout/failed/page.tsx`:

```typescript
import Link from 'next/link';

export default function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessage = searchParams.error
    ? decodeURIComponent(searchParams.error)
    : 'Payment could not be processed';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold
                       hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-500 py-2 hover:text-gray-700"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 6: API Route Structure

Your final API route structure should be:

```
src/app/api/
├── payment/
│   ├── create-order/
│   │   └── route.ts         # Razorpay order creation
│   ├── verify/
│   │   └── route.ts         # Razorpay payment verification
│   └── payu/
│       ├── initiate/
│       │   └── route.ts     # PayU payment initiation
│       └── callback/
│           └── route.ts     # PayU callback handler
├── webhooks/
│   ├── razorpay/
│   │   └── route.ts         # Razorpay webhook handler
│   └── payumoney/
│       └── route.ts         # PayU webhook handler
└── wix/
    └── test/
        └── route.ts         # Test Wix connection (dev only)
```

---

## Step 7: Testing Wix Connection

Create `src/app/api/wix/test/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { listPricingPlans, findContactByEmail } from '@/lib/wix';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    // Test 1: List pricing plans
    const plans = await listPricingPlans();

    // Test 2: Query contacts
    const testContact = await findContactByEmail('test@example.com');

    return NextResponse.json({
      success: true,
      tests: {
        pricingPlans: {
          success: true,
          count: plans.plans?.length || 0,
        },
        contactQuery: {
          success: true,
          found: !!testContact,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
```

Test it: `curl http://localhost:3000/api/wix/test`

---

## Reusable for Multiple Landing Pages

To use this integration across multiple landing pages:

1. **Copy the lib files**: `src/lib/razorpay.ts`, `src/lib/payu.ts`, `src/lib/wix.ts`
2. **Copy the API routes**: `src/app/api/payment/`, `src/app/api/webhooks/`
3. **Copy the components**: `src/components/RazorpayCheckout.tsx`, `src/components/PayUCheckout.tsx`
4. **Copy the types**: `src/types/razorpay.ts`, `src/types/payu.ts`
5. **Set environment variables** for each deployment
6. **Update program/plan mappings** in `src/lib/wix.ts`

Each landing page can have its own:
- Product/program offerings
- Pricing
- Branding/styling

But share the same:
- Payment processing
- Wix CRM sync
- Webhook handling
