'use client';

import { useState } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CircleStartDateSelection, EssentialsStartDateSelection, WebinarSessionDateSelection } from '@/types';

interface RazorpayCheckoutProps {
  amount: number;
  programId: string;
  programName: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  isSubscription?: boolean;
  razorpayPlanId?: string; // Required for subscriptions
  programStartDate?: CircleStartDateSelection | EssentialsStartDateSelection | WebinarSessionDateSelection; // Optional program start date (Circle, Essentials, or Webinar)
  onSuccess: (data: {
    paymentId: string;
    orderId?: string;
    subscriptionId?: string;
  }) => void;
  onError: (error: string) => void;
  buttonText?: string;
  className?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  order_id?: string;
  subscription_id?: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

export function RazorpayCheckout({
  amount,
  programId,
  programName,
  customerEmail,
  customerName,
  customerPhone = '',
  isSubscription = false,
  razorpayPlanId,
  programStartDate,
  onSuccess,
  onError,
  buttonText,
  className,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    if (!scriptLoaded) {
      onError('Payment system is loading. Please try again.');
      return;
    }

    setLoading(true);

    try {
      let orderData;

      if (isSubscription && razorpayPlanId) {
        // Create subscription registration link (for UPI AutoPay mandate)
        // Build callback URL for redirect after mandate approval
        const baseUrl = window.location.origin;
        const successParams = new URLSearchParams({
          program: programId,
          email: customerEmail,
          ...(programStartDate?.isoString && { start_date: programStartDate.isoString }),
        });
        const callbackUrl = `${baseUrl}/checkout/success?${successParams.toString()}`;

        const response = await fetch('/api/payment/razorpay/create-subscription-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: razorpayPlanId,
            programId,
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            callbackUrl,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create subscription');
        }

        const registrationData = await response.json();

        // Redirect to Razorpay registration page for mandate approval
        // User will complete UPI mandate setup and be redirected back to success page
        window.location.href = registrationData.shortUrl;
        return; // Exit early - user will be redirected
      } else {
        // Create one-time order
        const response = await fetch('/api/payment/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            programId,
            programName,
            customerEmail,
            customerName,
            customerPhone,
            programStartDate: programStartDate?.isoString,
            startDateOption: programStartDate?.option,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create order');
        }

        orderData = await response.json();
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.keyId,
        name: 'Glow Up Academy',
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
          color: '#800000', // Brand wine color
        },
        handler: async function (response: RazorpayResponse) {
          // Verify payment on server
          try {
            const verifyResponse = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.verified) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                subscriptionId: response.razorpay_subscription_id,
              });
            } else {
              onError('Payment verification failed');
            }
          } catch {
            onError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
          escape: true,
          animation: true,
        },
      };

      // Add order/subscription specific options
      if (isSubscription && orderData.subscriptionId) {
        options.subscription_id = orderData.subscriptionId;
      } else {
        options.amount = orderData.amount;
        options.currency = orderData.currency;
        options.order_id = orderData.orderId;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment failed');
      setLoading(false);
    }
  };

  const defaultButtonText = isSubscription
    ? `Subscribe ${formatPrice(amount)}/month`
    : `Pay ${formatPrice(amount)}`;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <Button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className={className}
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : !scriptLoaded ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          buttonText || defaultButtonText
        )}
      </Button>
    </>
  );
}
