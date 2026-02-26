'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/programs';

interface PayUCheckoutProps {
  amount: number;
  programId: string;
  programName: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  onError: (error: string) => void;
  buttonText?: string;
  className?: string;
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
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
}

export function PayUCheckout({
  amount,
  programId,
  programName,
  customerEmail,
  customerName,
  customerPhone = '',
  onError,
  buttonText,
  className,
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
        const error = await response.json();
        throw new Error(error.error || 'Failed to initiate payment');
      }

      const data = await response.json();
      setPaymentData(data);
      // Form will auto-submit via useEffect
    } catch (error) {
      console.error('PayU payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handlePayment}
        disabled={loading}
        className={className}
        size="lg"
        variant="secondary"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Redirecting to PayU...
          </>
        ) : (
          buttonText || `Pay ${formatPrice(amount)} via PayU`
        )}
      </Button>

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
