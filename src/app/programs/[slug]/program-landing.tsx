'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Program } from '@/types';
import { Button } from '@/components/ui/button';
import { RazorpayCheckout, PayUCheckout } from '@/components/checkout';
import { ArrowLeft, Check, Shield, Clock, Award, CreditCard } from 'lucide-react';

interface ProgramLandingProps {
  program: Program;
}

type PaymentStep = 'details' | 'payment';
type PaymentGateway = 'razorpay' | 'payu';

export function ProgramLanding({ program }: ProgramLandingProps) {
  const router = useRouter();
  const [step, setStep] = useState<PaymentStep>('details');
  const [error, setError] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('razorpay');

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!customerInfo.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!customerInfo.email.trim() || !customerInfo.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setStep('payment');
  };

  const handlePaymentSuccess = (data: {
    paymentId: string;
    orderId?: string;
    subscriptionId?: string;
  }) => {
    // Redirect to success page
    const params = new URLSearchParams({
      paymentId: data.paymentId,
      program: program.id,
      ...(data.orderId && { orderId: data.orderId }),
      ...(data.subscriptionId && { subscriptionId: data.subscriptionId }),
    });

    router.push(`/checkout/success?${params.toString()}`);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Recommended for you
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {program.name}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {program.description}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What&apos;s Included:
                </h3>
                <ul className="space-y-3">
                  {program.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-sm font-medium text-gray-900">100% Secure</div>
                  <div className="text-xs text-gray-500">Payments</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-sm font-medium text-gray-900">Instant</div>
                  <div className="text-xs text-gray-500">Access</div>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-sm font-medium text-gray-900">Lifetime</div>
                  <div className="text-xs text-gray-500">Support</div>
                </div>
              </div>
            </div>

            {/* Checkout Card */}
            <div className="lg:pl-12 lg:sticky lg:top-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {program.isSubscription ? 'Monthly subscription' : 'One-time payment'}
                  </div>
                  <div className="text-5xl font-bold text-gray-900">
                    {formatPrice(program.price, program.currency)}
                    {program.isSubscription && (
                      <span className="text-lg font-normal text-gray-500">/month</span>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                    <button
                      onClick={() => setError(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Step 1: Customer Details */}
                {step === 'details' && (
                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter your full name"
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
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                )}

                {/* Step 2: Payment */}
                {step === 'payment' && (
                  <div className="space-y-4">
                    {/* Customer Info Summary */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{customerInfo.name}</p>
                          <p className="text-sm text-gray-500">{customerInfo.email}</p>
                          {customerInfo.phone && (
                            <p className="text-sm text-gray-500">{customerInfo.phone}</p>
                          )}
                        </div>
                        <button
                          onClick={() => setStep('details')}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Payment Gateway Selection */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Select Payment Method:</p>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setSelectedGateway('razorpay')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedGateway === 'razorpay'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <CreditCard className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-medium">Razorpay</span>
                          <span className="block text-xs text-gray-500">UPI, Cards, NetBanking</span>
                        </button>

                        <button
                          onClick={() => setSelectedGateway('payu')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedGateway === 'payu'
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <CreditCard className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-medium">PayU</span>
                          <span className="block text-xs text-gray-500">Cards, NetBanking</span>
                        </button>
                      </div>
                    </div>

                    {/* Payment Buttons */}
                    <div className="space-y-3">
                      {selectedGateway === 'razorpay' ? (
                        <RazorpayCheckout
                          amount={program.price}
                          programId={program.id}
                          programName={program.name}
                          customerEmail={customerInfo.email}
                          customerName={customerInfo.name}
                          customerPhone={customerInfo.phone}
                          isSubscription={program.isSubscription}
                          razorpayPlanId={program.razorpayPlanId}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          className="w-full"
                        />
                      ) : (
                        <PayUCheckout
                          amount={program.price}
                          programId={program.id}
                          programName={program.name}
                          customerEmail={customerInfo.email}
                          customerName={customerInfo.name}
                          customerPhone={customerInfo.phone}
                          onError={handlePaymentError}
                          className="w-full"
                        />
                      )}
                    </div>

                    <button
                      onClick={() => setStep('details')}
                      className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
                    >
                      ← Back to details
                    </button>
                  </div>
                )}

                {/* Security Note */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Shield className="w-4 h-4 mr-2" />
                    Secured by Razorpay & PayU
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not sure if this is right for you?
          </h2>
          <p className="text-gray-400 mb-8">
            Take our quick quiz to find the perfect program for your needs.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-lg hover:bg-gray-100 transition-colors"
          >
            Take the Quiz
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Glow Up Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
