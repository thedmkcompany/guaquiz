"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProgramBySlug, formatPrice } from "@/lib/programs";
import { RazorpayCheckout } from "@/components/checkout";
import { ArrowLeft, Shield, Lock } from "lucide-react";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export function CheckoutPageClient() {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program") || "essentials";
  const program = getProgramBySlug(programSlug);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [step, setStep] = useState<"info" | "payment">("info");
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Program not found
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // Don't allow checkout for high-ticket items
  if (program.requiresCall) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book a Call First
          </h1>
          <p className="text-gray-600 mb-6">
            The {program.name} program requires a discovery call before
            enrollment.
          </p>
          <Link
            href={`/book-call?program=${program.slug}`}
            className="inline-block bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Book Your Free Call
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(customerInfo.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep("payment");
    }
  };

  const handlePaymentSuccess = (data: {
    paymentId: string;
    orderId?: string;
    subscriptionId?: string;
  }) => {
    // Redirect to success page with payment info
    window.location.href = `/checkout/success?program=${program.slug}&paymentId=${data.paymentId}`;
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}. Please try again.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/results/${program.slug}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to results
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Order Summary Header */}
            <div className="bg-gray-900 px-6 py-4 text-white">
              <h1 className="text-xl font-bold">Checkout</h1>
              <p className="text-gray-300 text-sm">Complete your purchase</p>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{program.name}</p>
                  <p className="text-sm text-gray-500">{program.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(program.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form / Payment */}
            <div className="px-6 py-6">
              {step === "info" ? (
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Customer Info Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Paying as:</p>
                        <p className="font-medium text-gray-900">
                          {customerInfo.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {customerInfo.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {customerInfo.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep("info")}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Razorpay Checkout */}
                  <RazorpayCheckout
                    amount={program.price}
                    programId={program.id}
                    programName={program.name}
                    customerEmail={customerInfo.email}
                    customerName={customerInfo.name}
                    customerPhone={customerInfo.phone}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
