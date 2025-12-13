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
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">
            Program not found
          </h1>
          <Link href="/" className="text-wine hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // Don't allow checkout for high-ticket items
  if (program.requiresCall) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-charcoal mb-4">
            Book a Call First
          </h1>
          <p className="text-slate mb-6">
            The {program.name} program requires a discovery call before
            enrollment.
          </p>
          <Link
            href={`/book-call?program=${program.slug}`}
            className="inline-block bg-gold text-charcoal py-3 px-6 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
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
    <div className="min-h-screen bg-gradient-pastel-vertical">
      {/* Header - Glass effect */}
      <header className="glass-overlay border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/results/${program.slug}`}
            className="inline-flex items-center text-forest hover:text-forest-light transition-colors font-subheader font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to results
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="glass-card-strong rounded-[2rem] shadow-float overflow-hidden">
            {/* Order Summary Header */}
            <div className="bg-gradient-to-br from-forest to-forest-light px-6 sm:px-8 py-5 sm:py-6 text-white">
              <h1 className="text-xl sm:text-2xl font-bold font-headline">Secure Checkout</h1>
              <p className="text-white/80 text-sm font-body mt-1">Complete your purchase</p>
            </div>

            {/* Order Summary */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-white/20 bg-gradient-to-br from-beige-light/40 to-white/40 backdrop-blur-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-headline text-lg sm:text-xl text-forest mb-1">{program.name}</p>
                  <p className="text-sm text-charcoal/70 font-body">{program.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold font-headline text-forest">
                    {formatPrice(program.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form / Payment */}
            <div className="px-6 sm:px-8 py-6 sm:py-8">
              {step === "info" ? (
                <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-subheader font-medium text-forest mb-2"
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
                      className={`w-full px-4 py-3.5 border-2 rounded-[1rem] focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all font-body bg-white/60 backdrop-blur-sm ${
                        errors.name ? "border-wine" : "border-white/40 hover:border-beige-dark/40"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-wine text-sm mt-2 font-body">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-subheader font-medium text-forest mb-2"
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
                      className={`w-full px-4 py-3.5 border-2 rounded-[1rem] focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all font-body bg-white/60 backdrop-blur-sm ${
                        errors.email ? "border-wine" : "border-white/40 hover:border-beige-dark/40"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-wine text-sm mt-2 font-body">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-subheader font-medium text-forest mb-2"
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
                      className={`w-full px-4 py-3.5 border-2 rounded-[1rem] focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all font-body bg-white/60 backdrop-blur-sm ${
                        errors.phone ? "border-wine" : "border-white/40 hover:border-beige-dark/40"
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="text-wine text-sm mt-2 font-body">{errors.phone}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-luxe text-white py-4 px-6 rounded-full font-subheader font-semibold shadow-medium hover:shadow-strong transition-all"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  {/* Customer Info Summary */}
                  <div className="frosted-glass rounded-[1.25rem] p-5 border border-white/40">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-subheader uppercase tracking-wide text-forest/60 mb-2">Paying as:</p>
                        <p className="font-headline text-lg text-forest mb-1">
                          {customerInfo.name}
                        </p>
                        <p className="text-sm text-charcoal/70 font-body">
                          {customerInfo.email}
                        </p>
                        <p className="text-sm text-charcoal/70 font-body">
                          {customerInfo.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep("info")}
                        className="text-sm text-wine hover:text-wine-dark font-subheader font-medium transition-colors"
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
            <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-beige-light/30 to-white/30 border-t border-white/20 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-forest/70 font-subheader">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-forest" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-forest" />
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
