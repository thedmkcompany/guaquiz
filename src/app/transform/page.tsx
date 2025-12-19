"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/ui/footer";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import {
  Check,
  Flame,
  Sparkles,
  Wallet,
  Crown,
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCDNUrl } from "@/lib/cdn";

// =============================================================================
// DATA CONSTANTS
// =============================================================================

const comparisonItems = [
  {
    item: "Your last international vacation",
    cost: "₹2.5L",
    result: "beautiful memories, back to normal in 2 weeks",
  },
  {
    item: "Your designer handbag",
    cost: "₹2-3L",
    result: "elevates your outfit, not your life",
  },
  {
    item: "Your haute couture lehenga",
    cost: "₹4L+",
    result: "makes you feel like a million bucks for a day",
  },
  {
    item: "Your cosmetic treatments",
    cost: "₹5L+",
    result: "give you a glow for a few days",
  },
];

const separateServicesBreakdown = [
  {
    service: "Personal Trainer",
    cost: "₹25K/month × 6",
    total: "₹1,50,000",
    what: "Workouts only, no nutrition, no accountability beyond sessions",
  },
  {
    service: "Nutritionist",
    cost: "₹15K/month × 6",
    total: "₹90,000",
    what: "Meal plans, but no training, no mindset work",
  },
  {
    service: "Financial Coach",
    cost: "₹30K/month × 6",
    total: "₹1,80,000",
    what: "Wealth planning, but no fitness, no beauty protocols",
  },
  {
    service: "Mindset Coach",
    cost: "₹30K/month × 6",
    total: "₹1,80,000",
    what: "Confidence work, but no body transformation",
  },
  {
    service: "Beauty/Hormone Specialist",
    cost: "₹50K/month × 6",
    total: "₹3,00,000",
    what: "Skin & wellness, but disconnected from everything else",
  },
];

const testimonials = [
  {
    name: "Priya M.",
    location: "Mumbai",
    profession: "Strategy Consultant",
    quote:
      "My husband asked me if I'd changed my skincare routine. I hadn't. I'd changed my entire system—fitness, sleep, nutrition, confidence. TRANSFORM gave me the structure I'd been missing. Within 8 weeks, people at work started asking what was different. By month 6, I'd been promoted.",
    image: getCDNUrl("/images/transform/Akancha Sharma.jpg"),
  },
  {
    name: "Anjali R.",
    location: "Bangalore",
    profession: "Tech Executive",
    quote:
      "I spent ₹2.5L on a Chanel bag last year without hesitation. When I told my husband I was investing ₹2L in TRANSFORM, I expected pushback. Instead, he said: 'Finally, you're prioritizing yourself the way you prioritize everyone else.' Three months in, he notices how much more present I am with our kids.",
    image: getCDNUrl("/images/transform/Jinal in 3 Months.jpg"),
  },
  {
    name: "Kavya S.",
    location: "London",
    profession: "Finance Manager - NRI",
    quote:
      "I'd see women at events who just had that energy—that presence. I wanted to be her. Circle gave me community, but TRANSFORM gave me the personal blueprint. Now I'm the woman other women ask about. Worth every single pound I invested.",
    image: getCDNUrl("/images/transform/Akancha Sharma.jpg"),
  },
];

const annualSpendingBreakdown = [
  {
    category: "Dining out & weekend brunches",
    monthly: "₹15-20K/month",
    annual: "₹1.8L-₹2.4L/year",
  },
  {
    category: "Skincare, makeup, beauty treatments",
    monthly: "₹12-15K/month",
    annual: "₹1.44L-₹1.8L/year",
  },
  {
    category: "Gym membership you barely use",
    monthly: "₹10-15K/month",
    annual: "₹1.2L-₹1.8L/year",
  },
  {
    category: "Online shopping (clothes, accessories)",
    monthly: "₹20-25K/month",
    annual: "₹2.4L-₹3L/year",
  },
  {
    category: "Subscriptions (Netflix, Spotify, apps)",
    monthly: "₹5-8K/month",
    annual: "₹60K-₹96K/year",
  },
];

const transformClients = [
  "Senior Vice President, Financial Services (Mumbai)",
  "Founder, D2C Beauty Brand (Bangalore)",
  "Investment Banker, NRI (Singapore)",
  "Marketing Director, Tech Unicorn (Gurgaon)",
  "Chartered Accountant, Private Practice (Hyderabad)",
  "Healthcare Executive, NRI (Toronto)",
];

const faqs = [
  {
    question: "What if I can't afford ₹1,99,999 upfront?",
    answer:
      "We offer flexible payment plans through Razorpay. You can split the investment into EMI options that fit your budget. The strategy call (₹9,999) must be paid upfront, but it's credited back if you enroll.",
  },
  {
    question: "How is this different from Circle or Essentials?",
    answer:
      "TRANSFORM is 1:1 personal coaching with only 14 clients per year. Circle is group-based community coaching. Essentials is self-paced. If you want direct access to Disha, custom protocols, and personal accountability, TRANSFORM is your path.",
  },
  {
    question: "What if I'm not based in India?",
    answer:
      "TRANSFORM works globally. All sessions are virtual (Zoom). Meal plans adapt to your location. Workouts are equipment-flexible. Our NRI clients in London, Toronto, Dubai, and Singapore get the same experience.",
  },
  {
    question:
      "I have medical conditions (PCOS, thyroid, injuries). Can TRANSFORM help?",
    answer:
      "Yes. Disha has worked with clients with PCOS, thyroid issues, joint injuries, and chronic conditions. Your strategy call includes a full health assessment, and all protocols are adapted to your specific needs.",
  },
  {
    question: "What happens after the 6 months?",
    answer:
      "Most TRANSFORM clients continue with monthly coaching (₹25,000/month) to maintain and elevate results. But the 6-month program gives you the systems, habits, and identity shift to thrive independently if you choose.",
  },
  {
    question: "Can I get a refund if it doesn't work?",
    answer:
      "TRANSFORM requires full commitment. If you do the work and don't see results, we'll extend your program at no cost. Refunds are only available if you complete less than 2 weeks (medical emergencies only).",
  },
];

// =============================================================================
// DECORATIVE COMPONENTS
// =============================================================================

function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
      <Sparkles className="w-5 h-5 text-gold/60" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

function DecorativeBlob({
  className = "",
  color = "gold",
}: {
  className?: string;
  color?: "gold" | "wine" | "beige";
}) {
  const colorClasses = {
    gold: "bg-gold/10",
    wine: "bg-wine/10",
    beige: "bg-beige/30",
  };

  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${colorClasses[color]} ${className}`}
    />
  );
}

// Styled brand name component for "TRANSFORM"
function TransformBrand({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light" | "dark";
}) {
  const variants = {
    default: "text-wine",
    light: "text-gold",
    dark: "text-wine",
  };

  return (
    <span
      className={`font-headline font-semibold tracking-[0.08em] italic ${variants[variant]} ${className}`}
    >
      TRANSFORM
    </span>
  );
}

function MobileStickyCTA({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-forest via-forest to-forest-light z-[1000] md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        height: "80px",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />

      <div className="flex items-center justify-between h-full px-5">
        <div>
          <p className="text-gold/80 text-xs font-body uppercase tracking-wider">
            TRANSFORM Program
          </p>
          <p className="text-ivory text-lg font-headline">
            Book Strategy Session
          </p>
        </div>
        <Link
          href="/checkout?program=transform-strategy-call"
          className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-forest font-body font-semibold text-base px-6 py-3 rounded-full h-auto shadow-lg inline-flex items-center gap-1"
        >
          Book Now →
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function TransformLandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setShowStickyCTA(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-beige-light/30 to-ivory font-body text-charcoal overflow-x-hidden">
      {/* =========================================================================
          SECTION 1: HERO (ABOVE FOLD)
          ========================================================================= */}
      <section className="relative min-h-screen flex items-center px-4 md:px-8 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ivory via-beige-light/50 to-ivory" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-wine/40 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-gold/60 rounded-full animate-pulse delay-500" />

        {/* Decorative blobs */}
        <DecorativeBlob
          className="w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] -top-[15vw] -right-[15vw] md:-top-64 md:-right-64 animate-pulse"
          color="gold"
        />
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 top-1/2 -left-[12vw] md:-left-48"
          color="wine"
        />
        <DecorativeBlob
          className="w-[40vw] h-[40vw] max-w-80 max-h-80 bottom-20 -right-[5vw] md:right-1/4"
          color="beige"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-forest/5 via-forest/10 to-forest/5 backdrop-blur-sm border border-gold/40 rounded-full text-sm font-body font-semibold text-forest mb-10 shadow-lg">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-gold/60 rounded-full animate-pulse delay-150" />
              <span className="w-2 h-2 bg-gold/30 rounded-full animate-pulse delay-300" />
            </div>
            <span className="font-headline font-bold tracking-[0.15em] text-wine">
              TRANSFORM
            </span>
            <Crown className="w-4 h-4 text-gold" />
          </div>

          {/* Hero Headline */}
          <h1 className="font-headline text-[40px] leading-[1.1] md:text-6xl lg:text-7xl md:leading-[1.05] font-bold mb-8">
            <span className="bg-gradient-to-r from-forest via-forest to-forest-light bg-clip-text text-transparent">
              While Other Women Hesitate,
            </span>
            <br />
            <span className="bg-gradient-to-r from-wine via-wine to-wine-light bg-clip-text text-transparent">
              You TRANSFORM
            </span>
          </h1>

          {/* Subheadline */}
          <p className="font-accent text-lg md:text-2xl text-forest/70 mb-8 leading-relaxed max-w-[850px] mx-auto px-4">
            You&apos;ve invested in your career, your home, your wardrobe.
            You&apos;ve spent ₹3L on a handbag without blinking. Now it&apos;s
            time to invest that same confidence in becoming the woman everyone
            asks about.
          </p>

          {/* Microcopy above CTA */}
          <div className="bg-gradient-to-br from-wine/5 via-beige-light/30 to-gold/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-10 max-w-3xl mx-auto border border-gold/20 shadow-lg">
            <p className="font-body text-base md:text-lg text-forest/80 leading-relaxed">
              Women like you have invested in Chanel bags (₹2.5L), fancy lehngas (₹4L), cosmetic treatments (₹5L+).{" "}
              <span className="font-headline font-bold text-wine">
                <TransformBrand className="text-base md:text-lg" /> is
                ₹1,99,999
              </span>{" "}
              to become the woman who owns all of it - body, confidence, and
              presence.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12 max-w-sm md:max-w-xl mx-auto px-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-wine/20 to-gold/20 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

              <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-gold/20">
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent z-10" />

                <Image
                  src={getCDNUrl("/images/DMK/Disha Wine Blazer 2.png")}
                  alt="Disha Methi Khandelwal - TRANSFORM Program Founder"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 576px"
                />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-lg">
                    <p className="font-headline text-base md:text-lg text-forest font-semibold">
                      Disha Methi Khandelwal
                    </p>
                    <p className="font-body text-xs md:text-sm text-forest/60">
                      Founder, Glow Up Academy •{" "}
                      <TransformBrand className="text-xs md:text-sm" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="space-y-4 px-4">
            <Link
              href="/checkout?program=transform-strategy-call"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold text-forest font-body text-base md:text-lg font-bold px-8 md:px-12 py-5 md:py-7 h-auto rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="whitespace-nowrap">
                Invest ₹9,999 in Your Strategy Session
              </span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>

            <p className="font-body text-sm text-forest/50">
              (Credited toward TRANSFORM when you enroll)
            </p>
          </div>
        </div>
      </section>

      {/* Curved divider */}
      <div className="relative h-16 md:h-24 -mt-1">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"
            fill="#F2EBD9"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 2: YOU'RE NOT BEING SELFISH. YOU'RE BEING STRATEGIC.
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-80 max-h-80 top-0 right-0"
          color="gold"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            You&apos;re Not Being Selfish.
            <br />
            <span className="text-wine">You&apos;re Being Strategic.</span>
          </h2>

          <div className="max-w-[720px] mx-auto space-y-6 mb-10 text-center px-2">
            <p className="font-body text-base md:text-xl text-forest/80 leading-[1.7] md:leading-relaxed">
              The women who look effortlessly put together? They invested in
              transformation years ago.
            </p>
            <p className="font-body text-base md:text-xl text-forest/80 leading-[1.7] md:leading-relaxed">
              The ones who walk into rooms with quiet confidence? They chose
              themselves before choosing anyone else.
            </p>
            <p className="font-accent text-lg md:text-2xl text-wine leading-[1.5] md:leading-relaxed">
              The difference between you and the woman you admire isn&apos;t
              luck, it&apos;s the decision you&apos;re about to make.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-6 md:p-10 max-w-3xl mx-auto shadow-xl border border-gold/10">
            <p className="font-body text-base md:text-lg text-forest/85 leading-[1.6] md:leading-relaxed mb-6">
              You already know this: When you&apos;re at your best, everyone
              around you benefits.
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-wine" />
                </div>
                <span className="font-body text-sm md:text-lg text-forest/80">
                  Your team gets better leadership
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-wine" />
                </div>
                <span className="font-body text-sm md:text-lg text-forest/80">
                  Your family gets your full presence
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-wine" />
                </div>
                <span className="font-body text-sm md:text-lg text-forest/80">
                  Your partner notices the shift
                </span>
              </li>
            </ul>
            <p className="font-headline text-xl md:text-2xl text-wine font-bold text-center">
              <TransformBrand className="text-xl md:text-2xl" /> isn&apos;t
              selfish. It&apos;s strategic.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 3: THE COMPARISON THAT CHANGES EVERYTHING
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 -top-[8vw] -left-[12vw] md:-top-24 md:-left-48"
          color="beige"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            What Your ₹2L Could Buy vs.
            <br />
            <span className="text-wine">What It Could Make You Become</span>
          </h2>

          <p className="font-body text-base md:text-lg text-forest/80 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s be honest. You&apos;ve spent more than ₹2L on things
            that depreciate:
          </p>

          {/* Comparison Cards */}
          <div className="space-y-4 mb-12">
            {comparisonItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-lg border border-forest/5 flex items-start gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-forest/60" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <p className="font-headline text-base md:text-lg text-forest font-semibold">
                      {item.item}
                    </p>
                    <p className="font-headline text-base md:text-lg text-wine font-bold">
                      {item.cost}
                    </p>
                  </div>
                  <p className="font-body text-sm md:text-base text-forest/60 italic">
                    {item.result}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-10">
            <p className="font-body text-base md:text-lg text-forest/80 mb-4 leading-relaxed">
              You didn&apos;t think twice about those investments because they
              felt worth it.
            </p>
            <p className="font-accent text-xl md:text-3xl text-wine font-bold leading-tight">
              Here&apos;s what makes{" "}
              <TransformBrand className="text-xl md:text-3xl" /> different:
            </p>
          </div>

          {/* The Real Comparison */}
          <div className="bg-gradient-to-br from-wine/5 via-beige-light/30 to-gold/5 rounded-3xl md:rounded-[2rem] p-8 md:p-12 max-w-3xl mx-auto shadow-xl border-2 border-gold/30">
            <p className="font-headline text-2xl md:text-4xl text-wine font-bold text-center mb-8">
              ₹1,99,999 doesn&apos;t depreciate.
              <br />
              <span className="text-gold">It compounds.</span>
            </p>

            <p className="font-body text-base md:text-lg text-forest/80 text-center mb-10 leading-relaxed">
              6 months from now, you won&apos;t just remember the
              transformation. You&apos;ll <strong>be</strong> the
              transformation. Every single day.
            </p>

            <div className="bg-white/70 rounded-2xl p-6 md:p-8 mb-6">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="text-center md:text-left">
                  <p className="font-body text-sm text-forest/60 mb-2">
                    That handbag makes you look successful for
                  </p>
                  <p className="font-headline text-2xl md:text-3xl text-forest/40">
                    2-3 years
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-body text-sm text-wine/80 mb-2 font-semibold">
                    <TransformBrand className="text-sm" /> makes you become
                    unstoppable for
                  </p>
                  <p className="font-headline text-3xl md:text-4xl text-wine font-bold">
                    the rest of your life
                  </p>
                </div>
              </div>
            </div>

            <p className="font-accent text-lg md:text-2xl text-forest text-center">
              Which investment would your future self thank you for?
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 4: WOMEN LIKE YOU DON'T DO GROUP PROGRAMS
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 top-1/4 -right-[10vw] md:-right-36"
          color="gold"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            Women Like You Don&apos;t Do
            <br />
            <span className="text-wine">Group Programs</span>
          </h2>

          <p className="font-body text-base md:text-lg text-forest/80 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            You&apos;ve seen the Instagram ads:
          </p>

          {/* Group Program Examples */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="bg-white/60 rounded-full px-5 py-2 border border-forest/10">
              <p className="font-body text-sm text-forest/60">
                &ldquo;Join our 6-week challenge!&rdquo; (₹499)
              </p>
            </div>
            <div className="bg-white/60 rounded-full px-5 py-2 border border-forest/10">
              <p className="font-body text-sm text-forest/60">
                &ldquo;Group coaching starts Monday!&rdquo; (₹2,999)
              </p>
            </div>
            <div className="bg-white/60 rounded-full px-5 py-2 border border-forest/10">
              <p className="font-body text-sm text-forest/60">
                &ldquo;Monthly membership access!&rdquo; (₹1,499)
              </p>
            </div>
          </div>

          <div className="max-w-[720px] mx-auto mb-10 px-2">
            <p className="font-body text-base md:text-lg text-forest/80 mb-6 leading-relaxed">
              You&apos;ve maybe even tried them.
            </p>
            <p className="font-body text-base md:text-lg text-forest/80 mb-6 leading-relaxed">
              And here&apos;s what happened: You showed up for 2 weeks. Life
              got busy. You dropped off. You felt guilty. You promised yourself
              &ldquo;next time.&rdquo;
            </p>
            <p className="font-accent text-lg md:text-2xl text-wine mb-8 leading-tight">
              Here&apos;s why that cycle exists:
            </p>
            <p className="font-headline text-xl md:text-3xl text-forest font-bold text-center">
              Group programs are designed for everyone.
              <br />
              <span className="text-wine">
                <TransformBrand className="text-xl md:text-3xl" /> is designed
                for you.
              </span>
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* You're not looking for */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-forest/10">
              <h3 className="font-headline text-lg md:text-xl text-forest/60 mb-6 text-center">
                You&apos;re not looking for:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-forest/40" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Generic meal plans (you&apos;ve tried those)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-forest/40" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Recorded workouts (you need accountability)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-forest/40" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Community-only support (you need personal guidance)
                  </span>
                </li>
              </ul>
            </div>

            {/* You're looking for */}
            <div className="bg-gradient-to-br from-wine/5 to-gold/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border-2 border-gold/30">
              <h3 className="font-headline text-lg md:text-xl text-wine mb-6 text-center font-bold">
                You&apos;re looking for:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    Custom protocols designed for YOUR body, YOUR schedule, YOUR
                    goals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    TheDMK as your personal transformation architect
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    Integration across all four pillars (because you&apos;re
                    done with piecemeal approaches)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="font-accent text-base md:text-lg text-forest/80 text-center max-w-2xl mx-auto leading-relaxed">
            The women who choose{" "}
            <TransformBrand className="text-base md:text-lg" /> aren&apos;t
            better than group program members. They just know what level of
            investment creates the results they actually want.
          </p>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 5: YOU KNOW THAT WOMAN WHO...
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 bottom-1/4 -left-[8vw] md:-left-32"
          color="wine"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            You Know That Woman Who...
          </h2>

          <div className="max-w-[720px] mx-auto mb-10 space-y-4 text-center">
            <p className="font-body text-lg md:text-xl text-forest/80 leading-relaxed">
              ...Always looks radiant in photos (no filter needed)?
            </p>
            <p className="font-body text-lg md:text-xl text-forest/80 leading-relaxed">
              ...Wears confidence like it&apos;s tailored just for her?
            </p>
            <p className="font-body text-lg md:text-xl text-forest/80 leading-relaxed">
              ...Has that subtle glow that makes people ask &ldquo;what&apos;s
              your secret?&rdquo;
            </p>
            <p className="font-body text-lg md:text-xl text-forest/80 leading-relaxed">
              ...Seems to have it all together—body, career, presence, energy?
            </p>
          </div>

          <p className="font-accent text-xl md:text-2xl text-wine text-center mb-8 leading-tight">
            You follow her on Instagram. You&apos;ve wondered what she&apos;s
            doing differently.
          </p>

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-8 md:p-10 max-w-3xl mx-auto shadow-xl border border-gold/10 mb-10">
            <h3 className="font-headline text-xl md:text-2xl text-forest mb-6 text-center">
              Here&apos;s what she&apos;s <strong>NOT</strong> doing:
            </h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-1" />
                <span className="font-body text-sm md:text-lg text-forest/70">
                  Following free YouTube workouts
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-1" />
                <span className="font-body text-sm md:text-lg text-forest/70">
                  Buying every supplement she sees online
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-1" />
                <span className="font-body text-sm md:text-lg text-forest/70">
                  Waiting for &ldquo;the right time&rdquo; to start
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-1" />
                <span className="font-body text-sm md:text-lg text-forest/70">
                  Choosing generic programs over personalized transformation
                </span>
              </li>
            </ul>

            <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent my-8" />

            <h3 className="font-headline text-xl md:text-2xl text-wine mb-6 text-center font-bold">
              Here&apos;s what she <strong>DID</strong> do:
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-wine" />
                </div>
                <span className="font-body text-sm md:text-lg text-forest/85">
                  Invested in herself the way she invests in everything else
                  that matters
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-wine" />
                </div>
                <span className="font-body text-sm md:text-lg text-forest/85">
                  Chose personal guidance over trial-and-error
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-wine" />
                </div>
                <span className="font-body text-sm md:text-lg text-forest/85">
                  Treated transformation as a strategic priority, not a
                  &ldquo;someday&rdquo; goal
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-wine" />
                </div>
                <span className="font-body text-sm md:text-lg text-forest/85">
                  Stopped comparing what she spends on herself vs. what she
                  spends on others
                </span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="font-accent text-xl md:text-3xl text-wine mb-4 leading-tight">
              The woman you admire made a decision.
            </p>
            <p className="font-headline text-2xl md:text-4xl text-forest font-bold">
              Now it&apos;s your turn.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 6: HOW TRANSFORM WORKS (VALUE BREAKDOWN)
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 top-1/4 right-0"
          color="gold"
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-6 md:mb-8 px-2">
            What ₹1,99,999 Gets You
          </h2>
          <p className="font-accent text-lg md:text-xl text-wine text-center mb-12 max-w-2xl mx-auto">
            (And Why It&apos;s Worth More Than You&apos;re Paying)
          </p>

          <p className="font-body text-base md:text-lg text-forest/80 text-center mb-8 max-w-2xl mx-auto">
            If you hired these experts separately:
          </p>

          {/* Services Breakdown Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-6 md:p-8 shadow-xl border border-gold/10 mb-10 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 pb-4 mb-4 border-b border-forest/10">
                <div className="font-headline text-sm md:text-base text-forest/60">
                  What You Need
                </div>
                <div className="font-headline text-sm md:text-base text-forest/60">
                  What It Costs
                </div>
                <div className="font-headline text-sm md:text-base text-forest/60">
                  Total
                </div>
                <div className="font-headline text-sm md:text-base text-forest/60">
                  What You Get
                </div>
              </div>

              {/* Rows */}
              {separateServicesBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-4 py-4 border-b border-forest/5 last:border-0"
                >
                  <div className="font-body text-sm md:text-base text-forest font-semibold">
                    {item.service}
                  </div>
                  <div className="font-body text-xs md:text-sm text-forest/70">
                    {item.cost}
                  </div>
                  <div className="font-headline text-sm md:text-base text-wine font-bold">
                    {item.total}
                  </div>
                  <div className="font-body text-xs md:text-sm text-forest/60 italic">
                    {item.what}
                  </div>
                </div>
              ))}

              {/* Total Row */}
              <div className="grid grid-cols-4 gap-4 pt-6 mt-4 border-t-2 border-forest/20">
                <div className="col-span-2 font-headline text-base md:text-lg text-forest font-bold">
                  Total if hired separately:
                </div>
                <div className="font-headline text-xl md:text-2xl text-forest/40 line-through">
                  ₹7,38,000/6 months
                </div>
                <div></div>
              </div>
            </div>
          </div>

          {/* The TRANSFORM Offer */}
          <div className="relative mb-12">
            <div className="absolute -inset-1 bg-gradient-to-br from-gold/30 via-transparent to-wine/30 rounded-[2.5rem]" />

            <div className="relative bg-gradient-to-br from-wine/5 via-beige-light/30 to-gold/5 rounded-[2rem] p-8 md:p-12 shadow-xl border-2 border-gold/30">
              <div className="text-center">
                <p className="font-body text-sm md:text-base text-forest/60 mb-2">
                  With <TransformBrand className="text-sm md:text-base" />:
                </p>
                <p className="font-headline text-4xl md:text-6xl text-wine font-bold mb-6">
                You save <strong className="text-wine">₹5,38,001</strong>
                </p>
                <p className="font-accent text-lg md:text-2xl text-forest/85 mb-8 leading-relaxed">
                  AND
                  get something money can&apos;t buy separately:{" "}
                  <strong className="text-wine">INTEGRATION.</strong>
                </p>
                <p className="font-body text-base md:text-lg text-forest/80 leading-relaxed max-w-2xl mx-auto">
                  When TheDMK architects your fitness, beauty, finance, and
                  confidence together, they compound. That&apos;s the
                  transformation that lasts.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/checkout?program=transform-strategy-call"
              className="inline-flex items-center justify-center bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold text-forest font-body text-base md:text-lg font-semibold px-8 md:px-10 py-4 md:py-5 h-auto rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Book Your Strategy Session</span>
            </Link>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 7: YOUR HUSBAND/PARTNER WILL NOTICE (TESTIMONIALS)
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[24px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-12 md:mb-16 px-2">
            Your Husband/Partner Will Notice
            <br />
            <span className="text-wine" style={{fontSize: '1rem'}}>(And So Will Everyone Else)</span>
          </h2>

          <div className="space-y-8 md:space-y-10">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-6 md:p-10 shadow-xl border border-wine/10 relative overflow-hidden"
              >
                {/* Accent border */}
                <div className="absolute left-0 top-6 md:top-8 bottom-6 md:bottom-8 w-1 bg-gradient-to-b from-wine/40 via-wine to-wine/40 rounded-full" />

                <div className="pl-5 md:pl-6">
                  <p className="font-accent text-base md:text-xl text-forest/85 leading-[1.6] md:leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-gold/20 flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-headline text-base md:text-lg text-forest">
                        {testimonial.name}
                      </p>
                      <p className="font-body text-sm text-forest/60">
                        {testimonial.profession}, {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 8: LET'S TALK ABOUT WHAT ₹2L REALLY MEANS TO YOU
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 -top-[8vw] -left-[12vw] md:-top-24 md:-left-48"
          color="beige"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            Let&apos;s Talk About What ₹2L
            <br />
            <span className="text-wine">Really Means to You</span>
          </h2>

          <p className="font-body text-base md:text-lg text-forest/80 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            You&apos;re reading this because you earn ₹25-60L annually (or
            $45-70K if you&apos;re an NRI).
          </p>

          <p className="font-accent text-lg md:text-xl text-wine text-center mb-12">
            Let&apos;s be honest about what ₹1,99,999 represents:
          </p>

          {/* Income Breakdown Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* ₹40L earner */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-gold/10">
              <h3 className="font-headline text-xl md:text-2xl text-wine mb-6 text-center font-bold">
                For someone earning ₹40L/year:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s <strong>5% of your annual income</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s less than your annual shopping budget
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s less than what you spent on your last vacation +
                    gifts + eating out this year
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s what you&apos;d spend on a luxury watch or jewelry
                    piece without stress
                  </span>
                </li>
              </ul>
            </div>

            {/* ₹60L earner */}
            <div className="bg-gradient-to-br from-wine/5 to-gold/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border-2 border-gold/30">
              <h3 className="font-headline text-xl md:text-2xl text-wine mb-6 text-center font-bold">
                For someone earning ₹60L/year:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s <strong>3.3% of your annual income</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s less than your car EMI for the year
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s comparable to what you invest in mutual funds
                    monthly (scaled annually)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-wine mt-2 flex-shrink-0" />
                  <span className="font-body text-sm md:text-base text-forest/80">
                    It&apos;s less than what you&apos;ve spent on things that
                    haven&apos;t changed your life
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <p className="font-accent text-lg md:text-2xl text-forest/85 mb-3 leading-relaxed">
              The question isn&apos;t{" "}
              <span className="text-wine font-semibold">
                &ldquo;Can I afford ₹2L?&rdquo;
              </span>
            </p>
            <p className="font-headline text-xl md:text-3xl text-wine font-bold leading-tight">
              The question is &ldquo;Can I afford another year of feeling like
              I&apos;m capable of more but not living it?&rdquo;
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 9: THE BRUTAL COMPARISON (ANNUAL SPENDING)
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 top-1/4 -right-[10vw] md:-right-36"
          color="gold"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            Here&apos;s What You&apos;ve Already Spent This Year
            <br />
            <span className="text-wine">(That Didn&apos;t TRANSFORM You)</span>
          </h2>

          <p className="font-body text-base md:text-lg text-forest/80 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s do the uncomfortable math:
          </p>

          {/* Spending Breakdown */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-6 md:p-8 shadow-xl border border-gold/10 mb-10">
            <div className="space-y-4">
              {annualSpendingBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-forest/5 last:border-0"
                >
                  <span className="font-body text-sm md:text-base text-forest/80">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-xs md:text-sm text-forest/60">
                      {item.monthly}
                    </span>
                    <span className="font-headline text-sm md:text-base text-wine font-bold">
                      {item.annual}
                    </span>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-6 mt-4 border-t-2 border-forest/20">
                <span className="font-headline text-base md:text-lg text-forest font-bold">
                  Total you&apos;ve already spent:
                </span>
                <span className="font-headline text-xl md:text-2xl text-wine font-bold">
                  ₹7.4L-₹9.6L this year
                </span>
              </div>
            </div>
          </div>

          {/* The Hard Truth */}
          <div className="bg-gradient-to-br from-wine/5 via-beige-light/30 to-gold/5 rounded-3xl md:rounded-[2rem] p-8 md:p-12 max-w-3xl mx-auto shadow-xl border-2 border-wine/20 mb-10">
            <p className="font-accent text-xl md:text-3xl text-wine text-center mb-6 leading-tight">
              And here&apos;s the hard truth:
            </p>
            <p className="font-headline text-2xl md:text-4xl text-forest font-bold text-center mb-8">
              You&apos;re the same woman you were Last Year.
            </p>
            <p className="font-body text-base md:text-lg text-forest/80 text-center leading-relaxed mb-6">
              <TransformBrand className="text-base md:text-lg" /> costs
              ₹1,99,999. You&apos;ve been spending more than that annually on
              things that don&apos;t compound.
            </p>
            <p className="font-accent text-lg md:text-2xl text-forest/85 text-center leading-relaxed">
              Imagine redirecting even half of that scattered spending into ONE
              integrated transformation that actually works.
            </p>
          </div>

          <p className="font-headline text-xl md:text-3xl text-wine font-bold text-center">
            Which version feels like the smarter investment now?
          </p>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 10: WOMEN AT YOUR LEVEL CHOOSE TRANSFORM
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 bottom-1/4 -left-[8vw] md:-left-32"
          color="wine"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            Women at Your Level
            <br />
            <span className="text-wine">Choose TRANSFORM</span>
          </h2>

          <p className="font-accent text-lg md:text-xl text-forest/80 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            <TransformBrand className="text-lg md:text-xl" /> clients
            aren&apos;t just high-earners. They&apos;re high-performers who
            understand ROI.
          </p>

          {/* Client Profiles */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-8 md:p-10 shadow-xl border border-gold/10 mb-12">
            <h3 className="font-headline text-xl md:text-2xl text-wine mb-8 text-center font-bold">
              Our current <TransformBrand className="text-xl md:text-2xl" />{" "}
              clients:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {transformClients.map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-gradient-to-br from-beige-light/30 to-transparent rounded-2xl border border-gold/10"
                >
                  <div className="w-8 h-8 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Crown className="w-4 h-4 text-wine" />
                  </div>
                  <p className="font-body text-sm md:text-base text-forest/85">
                    {client}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-6">
            <p className="font-body text-base md:text-lg text-forest/80 leading-relaxed">
              They&apos;re not &ldquo;fitter&rdquo; than you. They&apos;re not
              &ldquo;more disciplined.&rdquo;
            </p>
            <p className="font-accent text-xl md:text-2xl text-wine leading-tight">
              They just made the decision you&apos;re considering right now.
            </p>
            <p className="font-headline text-xl md:text-3xl text-forest font-bold leading-tight">
              And 6 months later? They&apos;re the women other women ask about.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 11: THE FINAL COMPARISON CLOSE
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-6 md:mb-8 px-2">
            The Most Expensive Decision
            <br />
            <span className="text-wine">You&apos;ll Make This Year...</span>
          </h2>

          <p className="font-accent text-xl md:text-3xl text-wine text-center mb-12 leading-tight">
            ...isn&apos;t paying ₹1,99,999 for{" "}
            <TransformBrand className="text-xl md:text-3xl" />.
            <br />
            It&apos;s staying exactly where you are.
          </p>

          {/* Cost Comparison */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {/* Another year of... */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-forest/10">
              <h3 className="font-headline text-lg md:text-xl text-forest/60 mb-6 text-center">
                Another year of:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Looking at photos and feeling &ldquo;I could look better
                    than this&rdquo;
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Comparing yourself to other women and wondering
                    &ldquo;what&apos;s she doing that I&apos;m not?&rdquo;
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Buying more clothes to feel confident instead of being
                    confident
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Starting programs and stopping them, wondering why you
                    can&apos;t stay consistent
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Watching your peers transform while you stay stuck in
                    analysis paralysis
                  </span>
                </li>
              </ul>
            </div>

            {/* 6 months from now */}
            <div className="bg-gradient-to-br from-wine/5 to-gold/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border-2 border-gold/30">
              <h3 className="font-headline text-lg md:text-xl text-wine mb-6 text-center font-bold">
                Versus 6 months from now, after{" "}
                <TransformBrand className="text-lg md:text-xl" />:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    You don&apos;t just look different. You are different.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    The woman who walks into rooms with quiet confidence?
                    That&apos;s you.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    The woman people ask &ldquo;what&apos;s your secret?&rdquo;
                    That&apos;s you.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    The woman who invested in herself the way she invests in
                    everything else? That&apos;s you.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <p className="font-headline text-2xl md:text-4xl text-forest font-bold mb-4 leading-tight">
              The women who hesitate stay the same.
            </p>
            <p className="font-headline text-2xl md:text-4xl text-wine font-bold leading-tight">
              The women who decide, transform.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 12: PRIMARY CTA (WHAT HAPPENS AFTER BOOKING)
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Link
              href="/checkout?program=transform-strategy-call"
              className="inline-flex items-center justify-center bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold text-forest font-body text-lg md:text-xl font-bold px-10 md:px-14 py-6 md:py-8 h-auto rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-3 flex-shrink-0" />
              <span className="whitespace-nowrap">
                Invest ₹9,999 in Your Strategy Session
              </span>
            </Link>
          </div>

          {/* What happens after you book */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-8 md:p-10 shadow-xl border border-gold/10 mb-10">
            <h3 className="font-headline text-xl md:text-2xl text-forest mb-8 text-center font-bold">
              What happens after you book:
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine to-wine-light flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="font-headline text-base text-ivory font-bold">
                    1
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-body text-sm md:text-base text-forest/85 leading-relaxed">
                    You fill out a transformation readiness questionnaire (we
                    prepare for YOUR specific situation)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine to-wine-light flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="font-headline text-base text-ivory font-bold">
                    2
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-body text-sm md:text-base text-forest/85 leading-relaxed">
                    TheDMK reviews your goals, current challenges, and
                    transformation vision
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine to-wine-light flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="font-headline text-base text-ivory font-bold">
                    3
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-body text-sm md:text-base text-forest/85 leading-relaxed">
                    During your 60-minute strategy session, we map your 6-month
                    transformation blueprint
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="font-headline text-base text-forest font-bold">
                    4
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="space-y-2">
                    <p className="font-body text-sm md:text-base text-forest/85 leading-relaxed">
                      <strong>If you&apos;re accepted into TRANSFORM:</strong>{" "}
                      Your ₹9,999 is credited toward your ₹1,99,999 investment
                    </p>
                    <p className="font-body text-sm md:text-base text-forest/85 leading-relaxed">
                      <strong>
                        If TRANSFORM isn&apos;t the right fit:
                      </strong>{" "}
                      You keep the strategy session insights (₹9,999 value)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-wine/5 via-beige-light/30 to-gold/5 rounded-3xl p-6 md:p-8 text-center max-w-2xl mx-auto border border-gold/20">
            <p className="font-headline text-xl md:text-2xl text-wine font-bold mb-3">
              Either way, you win.
            </p>
            <p className="font-accent text-base md:text-lg text-forest/85">
              You don&apos;t lose money. You invest in clarity.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 13: TheDMKWORKS WITH 14 TRANSFORM CLIENTS PER YEAR
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24">
        <DecorativeBlob
          className="w-[50vw] h-[50vw] max-w-96 max-h-96 top-1/4 right-0"
          color="gold"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-[28px] leading-[1.2] md:text-4xl lg:text-5xl md:leading-tight font-bold text-forest text-center mb-10 md:mb-12 px-2">
            TheDMK Works with 14{" "}
            <TransformBrand className="text-[28px] md:text-4xl lg:text-5xl" />{" "}
            Clients Per Year
          </h2>

          <p className="font-accent text-lg md:text-xl text-wine text-center mb-12">
            Here&apos;s why that matters to you:
          </p>

          <div className="max-w-3xl mx-auto mb-10">
            <p className="font-body text-base md:text-lg text-forest/80 text-center mb-8 leading-relaxed">
              You&apos;ve been in group programs where the coach:
            </p>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-forest/10 mb-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Disappears for weeks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Gives generic advice
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Doesn&apos;t remember your specific situation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-forest/40 flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-forest/70">
                    Treats you like a number, not a person
                  </span>
                </li>
              </ul>
            </div>

            <p className="font-headline text-2xl md:text-3xl text-wine font-bold text-center mb-8">
              <TransformBrand className="text-2xl md:text-3xl" /> is the
              opposite.
            </p>

            <div className="bg-gradient-to-br from-wine/5 to-gold/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border-2 border-gold/30">
              <p className="font-body text-base md:text-lg text-forest/80 text-center mb-6 leading-relaxed">
                With only 14 clients annually, DMK:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    Knows your cycle, your schedule, your triggers, your goals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    Adapts your protocols in real-time based on what&apos;s
                    working
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    Responds to your messages within hours, not days
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-wine/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-wine" />
                  </div>
                  <span className="font-body text-sm md:text-base text-forest/85">
                    Architects every dimension to work together, not in isolation
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-6">
            <p className="font-accent text-lg md:text-xl text-forest/85 leading-relaxed">
              This isn&apos;t just &ldquo;more expensive coaching.&rdquo;
            </p>
            <p className="font-headline text-xl md:text-3xl text-wine font-bold leading-tight">
              This is why women at your level choose{" "}
              <TransformBrand className="text-xl md:text-3xl" /> over
              everything else.
            </p>
            <p className="font-body text-base md:text-lg text-forest/80 leading-relaxed">
              The ₹9,999 strategy session determines if you&apos;re one of this
              year&apos;s 14.
            </p>
            <p className="font-accent text-lg md:text-xl text-wine leading-relaxed">
              This isn&apos;t a sales call. It&apos;s a mutual evaluation.
            </p>
            <p className="font-body text-base md:text-lg text-forest/80 leading-relaxed">
              Because <TransformBrand className="text-base md:text-lg" />{" "}
              isn&apos;t for everyone.
              <br />
              It&apos;s for women like you who are done waiting.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 14: THE WOMAN YOU'LL BE 6 months FROM NOW + FINAL CTA
          ========================================================================= */}
      <section className="relative px-5 md:px-8 py-12 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Final Message */}
          <div className="relative max-w-[720px] mx-auto mb-12">
            <div className="absolute -inset-2 bg-gradient-to-br from-wine/20 via-transparent to-gold/20 rounded-[2.5rem]" />

            <div className="relative bg-gradient-to-br from-wine via-wine to-wine-light rounded-[2rem] p-10 md:p-12 text-ivory shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-ivory/5 rounded-full blur-2xl" />

              <div className="absolute top-6 left-6 text-6xl text-ivory/10 font-accent">
                &ldquo;
              </div>

              <div className="relative z-10">
                <h2 className="font-headline text-2xl md:text-4xl mb-6 leading-tight">
                  The Woman You&apos;ll Be 6 months From Now Is Watching You
                  Decide Right Now
                </h2>
                <div className="space-y-4 mb-6">
                  <p className="font-body text-base md:text-lg leading-relaxed">
                    She&apos;s hoping you choose her.
                  </p>
                  <p className="font-body text-base md:text-lg leading-relaxed">
                    She&apos;s hoping you stop comparing what you spend on
                    yourself vs. others.
                  </p>
                  <p className="font-body text-base md:text-lg leading-relaxed">
                    She&apos;s hoping you finally invest in transformation the
                    way you invest in everything else.
                  </p>
                </div>
                <p className="font-accent text-xl md:text-2xl mb-8 leading-relaxed">
                  She&apos;s already decided.
                  <br />
                  <span className="text-gold">
                    Now you just have to catch up.
                  </span>
                </p>

                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-gold/30">
                    <Image
                      src={getCDNUrl("/images/DMK/Disha Close Up Face.png")}
                      alt="Disha Methi Khandelwal"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-headline text-lg md:text-xl text-ivory">
                      Disha Methi Khandelwal
                    </p>
                    <p className="font-body text-sm text-ivory/70">
                      Founder, Glow Up Academy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mb-12">
            <Link
              href="/checkout?program=transform-strategy-call"
              className="inline-flex items-center justify-center bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold text-forest font-body text-lg md:text-xl font-bold px-10 md:px-14 py-6 md:py-8 h-auto rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-3 flex-shrink-0" />
              <span className="whitespace-nowrap">
                Invest ₹9,999 in Your Strategy Session
              </span>
            </Link>
            <p className="font-accent text-base md:text-lg text-wine mt-6">
              The DMK Woman doesn&apos;t wait. She acts.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-forest text-center mb-3">
              Questions? We&apos;ve Got Answers.
            </h3>
            <div className="flex justify-center mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-lg border border-gold/10">
              {faqs.map((faq, idx) => (
                <FAQAccordion
                  key={idx}
                  faq={faq}
                  isExpanded={expandedFaq === idx}
                  onToggle={() =>
                    setExpandedFaq(expandedFaq === idx ? null : idx)
                  }
                  variant="minimal"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA visible={showStickyCTA} />

      {/* Add bottom padding on mobile to account for sticky CTA */}
      <div className="h-[100px] md:h-0" />

      <Footer />
    </div>
  );
}
