"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProgramBySlug, getPriceStrikeDisplay } from "@/lib/programs";
import { RazorpayCheckout } from "@/components/checkout";
import { CircleStartDateSelector } from "@/components/checkout/CircleStartDateSelector";
import { ChallengeStartDateSelector } from "@/components/checkout/EssentialsStartDateSelector";
import { Shield, Lock } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import {
  getCheckoutPrefill,
  isCheckoutPrefillComplete,
  migrateLegacyStorage,
} from "@/lib/lead-storage";
import {
  calculateCircleStartDate,
  calculateChallengeStartDate,
  getComingMondayIST,
  getFollowingMondayIST,
  getCurrentISTDate,
} from "@/lib/date-utils";
import type { CircleStartDateOption, CircleStartDateSelection, ChallengeStartDateSelection } from "@/types";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export function CheckoutPageClient() {
  const searchParams = useSearchParams();
  const rawSlug = searchParams.get("program") || "essentials";
  const programSlug = rawSlug === "webinar" ? "essentials" : rawSlug;
  const program = getProgramBySlug(programSlug);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [step, setStep] = useState<"info" | "payment">("info");
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Circle program start date selection
  const isCircleProgram = programSlug === "circle";
  const [circleStartDateOption, setCircleStartDateOption] = useState<CircleStartDateOption>("coming-monday");
  const [circleStartDate, setCircleStartDate] = useState<CircleStartDateSelection | undefined>();

  // Calculate Circle dates for selector
  const comingMonday = getComingMondayIST();
  const followingMonday = getFollowingMondayIST();
  const isTodayMonday = getCurrentISTDate().getDay() === 1;

  // Essentials program start date selection
  const isEssentialsProgram = programSlug === "essentials";
  const [essentialsStartDate, setEssentialsStartDate] = useState<ChallengeStartDateSelection | undefined>();

  // Pre-fill from quiz data on mount
  // Uses unified storage (localStorage + sessionStorage) for persistence
  useEffect(() => {
    try {
      // First, migrate any legacy sessionStorage data to new storage
      migrateLegacyStorage();

      // Get pre-filled data from unified storage
      const prefill = getCheckoutPrefill();

      if (prefill) {
        setCustomerInfo(prefill);

        // If all fields are valid, skip directly to payment
        if (isCheckoutPrefillComplete()) {
          setStep("payment");
        }
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update Circle start date when option changes
  useEffect(() => {
    if (isCircleProgram) {
      const selection = calculateCircleStartDate(circleStartDateOption);
      setCircleStartDate(selection);
    }
  }, [isCircleProgram, circleStartDateOption]);

  // Calculate Essentials start date on mount
  useEffect(() => {
    if (isEssentialsProgram) {
      const selection = calculateChallengeStartDate();
      setEssentialsStartDate(selection);
    }
  }, [isEssentialsProgram]);

  // Show loading while checking for quiz data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <div className="glass-card rounded-full shadow-medium border border-white/60 px-8 py-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <div className="text-forest font-subheader font-medium">Loading...</div>
        </div>
      </div>
    );
  }

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
    const params = new URLSearchParams({
      program: program.slug,
      paymentId: data.paymentId,
    });

    // Add Circle start date if applicable
    if (isCircleProgram && circleStartDate) {
      params.append('start_date', circleStartDate.isoString);
    }

    // Add Essentials start date if applicable
    if (isEssentialsProgram && essentialsStartDate) {
      params.append('start_date', essentialsStartDate.isoString);
    }

    window.location.href = `/checkout/success?${params.toString()}`;
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}. Please try again.`);
  };

  const checkoutPriceDisplay = getPriceStrikeDisplay(program);

  return (
    <div className="min-h-screen bg-gradient-pastel relative overflow-hidden">
      <DecorativeBlobs />

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-lg mx-auto">
          <div className="glass-card rounded-[2.5rem] shadow-float border border-white/60 overflow-hidden flex flex-col p-0">
            {/* Order Summary Header */}
            <div className="bg-forest px-6 sm:px-8 py-5 sm:py-6 text-white relative overflow-hidden w-full">
               <div className="absolute inset-0 bg-gradient-to-r from-forest to-forest-light opacity-50" />
               <div className="relative z-10">
                 <h1 className="text-xl sm:text-2xl font-bold font-headline">Secure Checkout</h1>
                 <p className="text-white/80 text-sm font-body mt-1">Complete your purchase</p>
               </div>
            </div>

            {/* Order Summary */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-white/20 bg-white/40 backdrop-blur-sm w-full">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-headline text-lg sm:text-xl text-forest mb-1">{program.name}</p>
                  <p className="text-sm text-charcoal/70 font-body">{program.tagline}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-0.5 shrink-0">
                  {checkoutPriceDisplay.strikeText ? (
                    <p className="text-base sm:text-lg font-headline text-charcoal/45 line-through">
                      {checkoutPriceDisplay.strikeText}
                    </p>
                  ) : null}
                  <p className="text-2xl sm:text-3xl font-bold font-headline text-forest leading-tight">
                    {checkoutPriceDisplay.saleText}
                    {program.isSubscription ? (
                      <span className="text-sm font-body font-normal text-charcoal/50">/mo</span>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>

            {/* Form / Payment */}
            <div className="px-6 sm:px-8 py-6 sm:py-8 w-full">
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
                      className={`w-full px-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all font-body bg-white/60 backdrop-blur-sm outline-none ${
                        errors.name ? "border-wine" : "border-white/40 hover:border-gold/40"
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
                      className={`w-full px-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all font-body bg-white/60 backdrop-blur-sm outline-none ${
                        errors.email ? "border-wine" : "border-white/40 hover:border-gold/40"
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
                      className={`w-full px-5 py-3.5 border rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all font-body bg-white/60 backdrop-blur-sm outline-none ${
                        errors.phone ? "border-wine" : "border-white/40 hover:border-gold/40"
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="text-wine text-sm mt-2 font-body">{errors.phone}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-luxe text-white py-4 px-6 rounded-full font-subheader font-semibold shadow-medium hover:shadow-strong transition-all hover:-translate-y-1"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  {/* Customer Info Summary */}
                  <div className="bg-white/40 rounded-2xl p-5 border border-white/40 backdrop-blur-sm">
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
                        className="text-sm text-wine hover:text-wine-dark font-subheader font-medium transition-colors underline underline-offset-4"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Circle Start Date Selector */}
                  {isCircleProgram && (
                    <div className="bg-white/40 rounded-2xl p-5 border border-white/40 backdrop-blur-sm">
                      <CircleStartDateSelector
                        value={circleStartDateOption}
                        onChange={setCircleStartDateOption}
                        comingMondayDate={comingMonday}
                        followingMondayDate={followingMonday}
                        isTodayMonday={isTodayMonday}
                      />
                    </div>
                  )}

                  {/* Essentials Start Date Selector */}
                  {isEssentialsProgram && essentialsStartDate && (
                    <div className="bg-white/40 rounded-2xl p-5 border border-white/40 backdrop-blur-sm">
                      <ChallengeStartDateSelector startDate={essentialsStartDate} />
                    </div>
                  )}

                  {/* Razorpay Checkout */}
                  <RazorpayCheckout
                    amount={program.price}
                    programId={program.id}
                    programName={program.name}
                    customerEmail={customerInfo.email}
                    customerName={customerInfo.name}
                    customerPhone={customerInfo.phone}
                    isSubscription={program.isSubscription}
                    razorpayPlanId={program.razorpayPlanId}
                    programStartDate={
                      isCircleProgram
                        ? circleStartDate
                        : isEssentialsProgram
                        ? essentialsStartDate
                        : undefined
                    }
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="px-6 sm:px-8 py-5 bg-forest/5 border-t border-forest/5 backdrop-blur-sm w-full">
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
