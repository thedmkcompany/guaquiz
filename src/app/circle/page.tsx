"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/ui/footer";
import { RazorpayCheckout } from "@/components/checkout/RazorpayCheckout";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { useRouter } from "next/navigation";
import { ChevronDown, Play } from "lucide-react";

// ============================================
// DATA CONSTANTS
// ============================================

const pillars = [
  {
    emoji: "🔥",
    title: "FITNESS",
    headline: "Build the Body That Makes You Feel Powerful",
    description:
      "Live workouts 5x/week designed to make you strong, toned, and energized—not exhausted. Progressive training that meets you where you are and takes you where you want to be.",
    features: [
      "Strength training",
      "HIIT sessions",
      "Dance workouts",
      "Yoga & mobility",
      "Indian-friendly modifications",
    ],
  },
  {
    emoji: "✨",
    title: "BEAUTY",
    headline: "Glow From the Inside, Radiate on the Outside",
    description:
      "Skincare routines that fit your life. Hair care that actually works. Habits that make you feel magnetic every single day—not just for special occasions.",
    features: [
      "Weekly skincare guidance",
      "Product recommendations (budget-friendly)",
      "Hair & nail care routines",
      "Posture & presence coaching",
      "Sustainable beauty habits",
    ],
  },
  {
    emoji: "💰",
    title: "FINANCE",
    headline: "Master Your Money, Build Your Freedom",
    description:
      "Financial clarity sessions, budget systems, and investment basics. Because unstoppable women don't just earn more—they keep more, invest smarter, and build wealth.",
    features: [
      "Monthly financial clarity workshops",
      "Budget templates",
      "Savings & investment guidance",
      "Salary negotiation coaching",
      "Money mindset shifts",
    ],
  },
  {
    emoji: "👑",
    title: "CONFIDENCE",
    headline: "Command Respect, Trust Yourself, Own Every Room",
    description:
      "Confidence isn't affirmations. It's evidence. You'll build it through discipline, through wins, through showing up daily with women who believe in you.",
    features: [
      "Weekly mindset coaching",
      "Boundary-setting workshops",
      "Self-talk transformation",
      "Leadership & presence training",
      "Accountability pods",
    ],
  },
];

interface ScheduleSession {
  time: string;
  title: string;
  evening?: string;
}

interface ScheduleDay {
  day: string;
  sessions: ScheduleSession[];
}

const weeklySchedule: ScheduleDay[] = [
  {
    day: "MONDAY",
    sessions: [
      { time: "7:00 AM IST", title: "Strength Training (Live)", evening: "8:00 PM IST — Evening HIIT Option (Live)" },
    ],
  },
  {
    day: "TUESDAY",
    sessions: [
      { time: "7:00 AM IST", title: "Dance Cardio (Live)", evening: "8:00 PM IST — Beauty & Skincare Workshop" },
    ],
  },
  {
    day: "WEDNESDAY",
    sessions: [
      { time: "7:00 AM IST", title: "Yoga & Mobility (Live)" },
    ],
  },
  {
    day: "THURSDAY",
    sessions: [
      { time: "7:00 AM IST", title: "Full Body Strength (Live)", evening: "8:00 PM IST — Finance Clarity Session" },
    ],
  },
  {
    day: "FRIDAY",
    sessions: [
      { time: "7:00 AM IST", title: "Power HIIT (Live)" },
    ],
  },
  {
    day: "SATURDAY",
    sessions: [
      { time: "9:00 AM IST", title: "Community Workout (Extended)", evening: "10:00 AM IST — Confidence Circle (Group Coaching)" },
    ],
  },
  {
    day: "SUNDAY",
    sessions: [
      { time: "Rest Day", title: "Weekly Challenge Check-In (WhatsApp)" },
    ],
  },
];

const whatElseIncluded = [
  "WhatsApp community (24/7 sister support)",
  "Meal planning guidance (Indian-friendly)",
  "Monthly transformation challenges",
  "Accountability pods (small groups)",
  "Expert coach Q&A sessions",
  "Progress tracking tools",
  "Members-only resources library",
];

const transformations = [
  {
    name: "Priya M.",
    location: "HR Manager, Delhi",
    duration: "6 months in Circle",
    results: "Lost 9 kg • Runs 5K now • Never misses Monday workouts",
    quote:
      "The WhatsApp group keeps me going. When I don't feel like showing up, my sisters remind me why I started. That's the power of Circle.",
  },
  {
    name: "Anjali K.",
    location: "Entrepreneur, Bangalore",
    duration: "4 months in Circle",
    results: "Built business to ₹15L revenue • Lost 7 kg • Found work-life balance",
    quote:
      "Circle taught me that taking care of myself ISN'T selfish. My business grew because I grew. Best investment I've made.",
  },
  {
    name: "Meera S.",
    location: "Teacher, Chennai",
    duration: "8 months in Circle",
    results: "Lost 11 kg • Negotiated ₹3L raise • Became accountability pod leader",
    quote:
      "I joined for fitness. I stayed for the sisterhood. Circle changed how I show up—not just in workouts, but in life.",
  },
  {
    name: "Simran G.",
    location: "Consultant, London",
    duration: "5 months in Circle",
    results: "Lost 6 kg • Found community abroad • Consistent through wedding season",
    quote:
      "Living in London, I felt disconnected from Indian community. Circle gave me my sisters back. The early morning IST classes are worth waking up for.",
  },
];

const faqs = [
  {
    question: "What if I can't make the live sessions?",
    answer:
      "All live sessions are recorded for 48 hours. Watch on your time. But we recommend joining live when possible—the community energy is unmatched.",
  },
  {
    question: "How is Circle different from Essentials?",
    answer:
      "Circle has LIVE workouts and community accountability. Essentials is self-paced. If you thrive with sisters around you, Circle is your home.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Circle is month-to-month. Cancel anytime with 7 days notice. No contracts, no penalties. But most women stay because the sisterhood is everything.",
  },
  {
    question: "I'm an NRI in a different time zone. Will this work?",
    answer:
      "Yes! We have sisters in London, Toronto, Dubai, Singapore. Sessions are at 7 AM and 8 PM IST. Pick what works. Recordings available for 48 hours.",
  },
  {
    question: "I have zero fitness experience. Is Circle too advanced?",
    answer:
      "Circle welcomes all levels. Our coaches modify every move. You'll have beginners, intermediates, and advanced—all in the same class, all supported.",
  },
];

// ============================================
// DECORATIVE COMPONENTS
// ============================================

function DecorativeBlob({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        background: "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.12) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
      <span className="text-gold/60 text-lg">✿</span>
      <div className="h-px w-12 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
    </div>
  );
}

function GoldAccentLine() {
  return (
    <div className="w-16 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold mx-auto my-6 rounded-full" />
  );
}

// ============================================
// COMPONENTS
// ============================================

function StickyCTABar({ visible }: { visible: boolean }) {
  const scrollToPayment = () => {
    const paymentSection = document.getElementById("payment-section");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-gradient-to-r from-forest via-forest to-forest-light h-[76px] shadow-[0_-8px_32px_rgba(1,45,38,0.3)] flex items-center justify-between px-5 border-t border-gold/20">
        <div className="flex-1">
          <p className="text-[11px] uppercase text-gold font-semibold tracking-[0.15em]">
            Circle Membership
          </p>
          <p className="text-[22px] font-headline font-bold text-ivory">₹4,499<span className="text-sm font-body font-normal text-ivory/70">/mo</span></p>
        </div>
        <button
          onClick={scrollToPayment}
          className="flex-shrink-0 h-12 px-7 bg-gradient-to-r from-gold to-gold-light text-forest font-semibold text-base rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-[0.96] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)]"
        >
          Join Now →
        </button>
      </div>
    </div>
  );
}

// FAQAccordion imported from @/components/ui/faq-accordion

// Pillar images mapping
const pillarImages: Record<string, string> = {
  FITNESS: "/images/circle/Fitness Geetika Transformation.jpg.png",
  BEAUTY: "/images/circle/Beautfy transformation_2.jpg.png",
  FINANCE: "/images/circle/Circle Finance Transformation.png",
  CONFIDENCE: "/images/circle/Confidence Aurvi Before & After.jpg",
};

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  return (
    <div className="relative bg-gradient-to-br from-forest via-forest to-forest-dark text-ivory rounded-3xl p-8 mb-6 overflow-hidden shadow-[0_8px_32px_rgba(1,45,38,0.25)]">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-wine/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Icon with elegant container */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(212,175,55,0.2)]">
          <span className="text-4xl">{pillar.emoji}</span>
        </div>

        {/* Pillar label */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80 mb-2">Pillar {index + 1}</p>

        {/* Headline */}
        <h3 className="font-headline text-xl leading-tight mb-4 text-ivory">
          {pillar.headline}
        </h3>

        {/* Description */}
        <p className="text-base text-ivory/85 leading-relaxed mb-5">
          {pillar.description}
        </p>

        {/* Elegant divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-5" />

        {/* Features */}
        <p className="text-xs uppercase tracking-wider text-gold/70 mb-3">What&apos;s included</p>
        <ul className="space-y-2">
          {pillar.features.map((feature, idx) => (
            <li key={idx} className="text-sm text-ivory/80 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Pillar Image with luxury filters */}
        <div className="mt-6 aspect-video rounded-2xl border border-ivory/10 overflow-hidden relative">
          <div
            className="absolute inset-0"
            style={{
              filter: "brightness(1.02) contrast(0.9) saturate(0.6) sepia(0.2)",
            }}
          >
            <Image
              src={pillarImages[pillar.title] || pillarImages.FITNESS}
              alt={`${pillar.title} transformation`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Overlay for blend */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(1,45,38,0.4) 0%, transparent 60%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Transformation images mapping by index (Priya M., Anjali K., Meera S., Simran G.)
const transformationImages = [
  "/images/circle/Apoorva Transformation.jpg.png",
  "/images/circle/Dhvani Transformation.jpg.png",
  "/images/circle/Padmavati Transformation.jpg",
  "/images/circle/Pratyancha Gupta Transformatiop.jpg.png",
];

function TransformationCard({ transformation, index }: { transformation: typeof transformations[0]; index: number }) {
  return (
    <div className="relative bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-6 border border-beige/30 group hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/10 to-transparent" />

      {/* Transformation Image */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            filter: "brightness(1.02) contrast(0.9) saturate(0.65) sepia(0.2)",
          }}
        >
          <Image
            src={transformationImages[index % transformationImages.length]}
            alt={`${transformation.name} transformation`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {/* Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(255,255,255,0.3) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Name and duration */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-headline font-semibold text-forest text-lg">{transformation.name}</p>
            <p className="text-forest/60 text-sm">{transformation.location}</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-wine bg-wine/10 px-3 py-1 rounded-full">
            {transformation.duration}
          </span>
        </div>

        {/* Results with gold accent */}
        <div className="flex items-center gap-2 my-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-gold to-gold-light" />
          <p className="text-gold-dark text-sm font-medium">{transformation.results}</p>
        </div>

        {/* Quote with elegant styling */}
        <blockquote className="relative mt-4">
          <span className="absolute -top-2 -left-1 text-3xl text-beige/80 font-accent">&ldquo;</span>
          <p className="text-base text-forest/80 italic leading-relaxed pl-4 font-accent">
            {transformation.quote}
          </p>
        </blockquote>
      </div>
    </div>
  );
}

function ElegantButton({
  onClick,
  children,
  variant = "primary",
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const baseStyles = "w-full h-14 font-semibold text-lg rounded-2xl transition-all duration-300 active:scale-[0.98]";
  const variants = {
    primary: "bg-gradient-to-r from-gold via-gold to-gold-light text-forest shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-wine to-wine-light text-ivory shadow-[0_4px_20px_rgba(128,0,0,0.25)] hover:shadow-[0_6px_28px_rgba(128,0,0,0.35)] hover:-translate-y-0.5",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function CircleLandingPage() {
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCalendly, setShowCalendly] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle sticky bar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(heroBottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPayment = () => {
    const paymentSection = document.getElementById("payment-section");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePaymentSuccess = (data: { paymentId: string; subscriptionId?: string }) => {
    router.push(`/checkout/success?program=circle&payment_id=${data.paymentId}${data.subscriptionId ? `&subscription_id=${data.subscriptionId}` : ""}`);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    router.push(`/checkout/failed?error=${encodeURIComponent(error)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-beige-light/30 to-ivory font-body text-forest overflow-x-hidden">
      {/* ============================================
          SWIPE 1: HERO SECTION
          ============================================ */}
      <section ref={heroRef} className="relative px-5 pt-8 pb-12">
        {/* Decorative blobs */}
        <DecorativeBlob className="w-64 h-64 -top-20 -right-20" />
        <DecorativeBlob className="w-48 h-48 top-40 -left-24 opacity-60" />

        <div className="relative z-10">
          {/* Personalized Badge */}
          <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-wine/10 to-wine/5 rounded-full mb-5 border border-wine/15 shadow-[0_2px_12px_rgba(128,0,0,0.08)]">
            <span className="text-wine text-xs font-semibold uppercase tracking-[0.15em]">
              ✨ Your Personalized Path
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-headline text-[32px] leading-[1.15] text-forest mb-5 md:text-5xl">
            Your Sisterhood to
            <span className="block text-gold-dark">Unstoppable</span>
          </h1>

          {/* Hero Subheadline */}
          <p className="text-base leading-[1.7] text-forest/75 mb-5 md:text-lg">
            You&apos;re ready for community, accountability, and complete transformation.
            Based on your quiz, <span className="font-semibold text-forest">Circle</span> is where you stop doing this alone and start
            becoming unstoppable with your sisters.
          </p>

          {/* Social Proof Line */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-beige to-beige-dark border-2 border-ivory flex items-center justify-center text-xs">
                  👩🏻
                </div>
              ))}
            </div>
            <p className="text-sm text-forest/70">
              <span className="font-semibold text-wine">2,500+</span> women rising together
            </p>
          </div>

          {/* Hero Video */}
          <div className="relative w-[calc(100%+40px)] -ml-5 aspect-[4/3] mb-8 rounded-none overflow-hidden">
            {/* Video with luxury filters */}
            <div
              className="absolute inset-0"
              style={{
                filter: "brightness(1.02) contrast(0.92) saturate(0.7) sepia(0.15)",
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster="/images/circle/Circle community - women supporting women in transformation.jpg"
              >
                <source src="/images/circle/Circle live workout session with community members 2.mp4" type="video/mp4" />
              </video>
            </div>
            {/* Elegant overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(1,45,38,0.5) 0%, transparent 50%, rgba(212,175,55,0.1) 100%)",
              }}
            />
            {/* Decorative frame corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold/40 z-10" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold/40 z-10" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold/40 z-10" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold/40 z-10" />
          </div>

          {/* Primary CTA */}
          <ElegantButton onClick={scrollToPayment}>
            Join Circle — ₹4,499/Month →
          </ElegantButton>

          {/* Micro trust text */}
          <p className="text-center text-xs text-forest/50 mt-4">
            Cancel anytime • Start this week • Founded by Disha Methi Khandelwal
          </p>
        </div>
      </section>

      {/* ============================================
          SWIPE 2: TRUST + PRICE
          ============================================ */}
      <section className="pb-12">
        {/* Community Photo Collage */}
        <div className="grid grid-cols-2 gap-1 mb-10">
          {[
            { src: "/images/circle/Fitness Geetika Transformation.jpg.png", alt: "Fitness transformation - Geetika" },
            { src: "/images/circle/Beautfy transformation_2.jpg.png", alt: "Beauty transformation" },
            { src: "/images/circle/Confidence Aurvi Before & After.jpg", alt: "Confidence transformation - Aurvi" },
            { src: "/images/circle/Circle community - women supporting women in transformation.jpg", alt: "Circle community" },
          ].map((img, i) => (
            <div
              key={i}
              className="aspect-square relative overflow-hidden group"
            >
              <div
                className="absolute inset-0"
                style={{
                  filter: "brightness(1.02) contrast(0.9) saturate(0.65) sepia(0.2)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="50vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="px-5">
          {/* Price Transparency */}
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase text-wine tracking-[0.2em] mb-2">
              Your Investment
            </p>
            <h2 className="font-headline text-[36px] text-forest mb-2 md:text-5xl">
              ₹4,499<span className="text-lg font-body text-forest/50">/month</span>
            </h2>
            <p className="text-sm text-forest/60">
              That&apos;s just ₹149/day for complete transformation
            </p>
          </div>

          <GoldAccentLine />

          <p className="text-base leading-[1.7] text-forest/75 mb-8 text-center">
            Your complete transformation toolkit. Live workouts, expert coaching,
            community support, and holistic guidance across fitness, beauty, finance,
            and confidence.
          </p>

          {/* What's Included Card */}
          <div className="bg-gradient-to-br from-beige-light/80 to-beige/60 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-beige shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-forest/60 mb-4 text-center">Everything Included</p>
            <ul className="space-y-3">
              {[
                "5 live workouts/week (Zoom)",
                "4-pillar transformation",
                "WhatsApp community access",
                "Monthly challenges & accountability",
                "Expert coach guidance",
                "Recorded sessions (48hr access)",
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-forest/80 flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-forest text-xs shadow-sm">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial Quote Card */}
          <div className="relative bg-white rounded-3xl p-7 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-beige/30 overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-wine via-wine to-wine-light rounded-l-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold/10 to-transparent" />

            <div className="relative pl-4">
              <span className="text-4xl text-beige font-accent absolute -top-1 -left-1">&ldquo;</span>
              <p className="text-base italic text-forest/80 leading-[1.7] mb-4 font-accent pt-4">
                I&apos;ve tried every fitness app and YouTube program. Nothing stuck
                until Circle. The community accountability is everything. I don&apos;t
                work out alone anymore—I work out with my sisters.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-beige to-beige-dark flex items-center justify-center text-lg border border-beige">
                  👩🏻
                </div>
                <div>
                  <p className="font-semibold text-forest text-sm">Sneha R.</p>
                  <p className="text-xs text-forest/60">Marketing Manager, Mumbai</p>
                </div>
              </div>
              <p className="text-gold-dark text-xs mt-3 font-medium">
                Lost 8 kg • Consistent for 6 months • Found her tribe
              </p>
            </div>
          </div>

          {/* Secondary CTA */}
          <ElegantButton onClick={scrollToPayment}>
            Claim My Spot in Circle
          </ElegantButton>
        </div>
      </section>

      <FloralDivider />

      {/* ============================================
          SWIPE 3: VISUAL PROOF
          ============================================ */}
      <section className="pb-12">
        {/* Video Testimonial - Barsa Client Transformation */}
        <div className="relative w-[calc(100%+40px)] -ml-5 aspect-video mb-8 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              filter: "brightness(1.02) contrast(0.92) saturate(0.7) sepia(0.15)",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="/images/circle/Circle community - women supporting women in transformation.jpg"
            >
              <source src="/images/circle/Barsa Client Circle Transformation .mp4" type="video/mp4" />
            </video>
          </div>
          {/* Elegant overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(1,45,38,0.5) 0%, transparent 50%, rgba(212,175,55,0.1) 100%)",
            }}
          />
          {/* Decorative frame corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold/40 z-10" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold/40 z-10" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold/40 z-10" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold/40 z-10" />
        </div>

        <div className="px-5">
          {/* Transformation Story Card */}
          <div className="relative bg-gradient-to-br from-forest via-forest to-forest-dark text-ivory rounded-3xl p-7 mb-8 overflow-hidden shadow-[0_8px_32px_rgba(1,45,38,0.3)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center border border-gold/30">
                  <span className="text-2xl">👩🏻</span>
                </div>
                <div>
                  <p className="font-headline font-semibold text-lg">Ananya P.</p>
                  <p className="text-ivory/60 text-sm">Software Engineer, Bangalore</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {["Lost 10 kg", "Built consistent habits", "Never misses Monday"].map((result, idx) => (
                  <span key={idx} className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full border border-gold/30">
                    {result}
                  </span>
                ))}
              </div>

              <blockquote className="text-base italic text-ivory/90 leading-[1.7] font-accent">
                &ldquo;Circle gave me what I was missing: accountability that doesn&apos;t
                feel like pressure. These women GET IT. We rise together.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Prompt */}
          <div className="text-center mb-6">
            <p className="font-accent text-xl text-wine italic mb-2">
              Your sisters are waiting.
            </p>
            <p className="text-forest/70">Ready to join?</p>
          </div>

          <ElegantButton onClick={scrollToPayment}>
            Yes, I&apos;m Ready for Circle
          </ElegantButton>
        </div>
      </section>

      {/* ============================================
          SWIPE 4: WHAT IS CIRCLE
          ============================================ */}
      <section className="px-5 py-12 relative">
        <DecorativeBlob className="w-48 h-48 top-0 right-0 opacity-50" />

        <div className="relative z-10">
          <h2 className="font-headline text-[26px] text-forest mb-2 md:text-4xl leading-tight">
            Where Transformation Becomes
          </h2>
          <h2 className="font-headline text-[26px] text-gold-dark mb-6 md:text-4xl">
            Your Lifestyle
          </h2>

          <p className="text-base leading-[1.7] text-forest/75 mb-4">
            Circle isn&apos;t a fitness program. It&apos;s your <span className="font-semibold text-forest">transformation
            sisterhood</span>—where you work on ALL of you (body, beauty, finance, confidence)
            with women who refuse to wait.
          </p>

          <p className="text-base leading-[1.7] text-forest/75 mb-8">
            Founded by Disha. Led by expert coaches. Powered by <span className="font-semibold text-wine">2,500+ Indian women</span> who show up for themselves—and for each other—every single day.
          </p>

          {/* Community Photo */}
          <div className="relative w-[calc(100%+40px)] -ml-5 aspect-video mb-8 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                filter: "brightness(1.02) contrast(0.9) saturate(0.65) sepia(0.2)",
              }}
            >
              <Image
                src="/images/circle/Circle community - women supporting women in transformation.jpg"
                alt="Circle community - women supporting women in transformation"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            {/* Elegant overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(1,45,38,0.4) 0%, transparent 60%)",
              }}
            />
            {/* Decorative frame corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold/40 z-10" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold/40 z-10" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold/40 z-10" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold/40 z-10" />
          </div>

          {/* This Is For You If Checklist */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-beige/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <p className="font-headline text-lg text-forest mb-5">This is for you if...</p>
            <div className="space-y-4">
              {[
                "You thrive with community—you want accountability that feels like sisterhood, not surveillance",
                "You're ready for 4-6 hours/week commitment across fitness, beauty, finance, and confidence",
                "You want structure without pressure—discipline that feels luxurious, not punishing",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-forest text-xs">✓</span>
                  </div>
                  <p className="text-base text-forest/80 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <ElegantButton onClick={scrollToPayment}>
              This Is What I Need—Join Circle
            </ElegantButton>
          </div>
        </div>
      </section>

      {/* ============================================
          SWIPE 5-8: THE 4 PILLARS
          ============================================ */}
      <section className="px-5 py-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-beige-light/40 via-ivory to-beige-light/40" />
        <DecorativeBlob className="w-64 h-64 -top-20 -left-20 opacity-40" />
        <DecorativeBlob className="w-48 h-48 bottom-40 -right-20 opacity-30" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-wine mb-3">The 4-Pillar System</p>
            <h2 className="font-headline text-[24px] text-forest mb-3 md:text-4xl leading-tight">
              Why Circle Works When
            </h2>
            <h2 className="font-headline text-[24px] text-gold-dark md:text-4xl">
              Everything Else Doesn&apos;t
            </h2>
          </div>

          <p className="text-base leading-[1.7] text-forest/75 mb-10 text-center max-w-md mx-auto">
            Most programs only transform your body. Then life happens—stress, burnout,
            self-doubt—and the results evaporate. <span className="font-semibold text-forest">Circle transforms ALL of you.</span>
          </p>

          {/* Pillar Cards */}
          {pillars.map((pillar, index) => (
            <div key={pillar.title}>
              <PillarCard pillar={pillar} index={index} />
              {/* CTA after pillar 2 and 4 */}
              {(index === 1 || index === 3) && (
                <div className="mb-8">
                  <ElegantButton onClick={scrollToPayment}>
                    Join the Sisterhood—₹4,499/Month
                  </ElegantButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          SWIPE 9: HOW CIRCLE WORKS
          ============================================ */}
      <section className="px-5 py-12 relative">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-wine mb-3">Your Weekly Rhythm</p>
          <h2 className="font-headline text-[24px] text-forest md:text-4xl">
            Here&apos;s What Happens
          </h2>
        </div>

        {/* Weekly Schedule Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-beige/30 shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden relative">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-wine via-wine to-wine-light rounded-l-3xl" />

          <div className="pl-4">
            {weeklySchedule.map((day, idx) => (
              <div key={day.day} className={idx !== weeklySchedule.length - 1 ? "mb-5 pb-5 border-b border-beige/50" : ""}>
                <p className="text-wine text-xs font-semibold uppercase tracking-wider mb-2">{day.day}</p>
                {day.sessions.map((session, sIdx) => (
                  <div key={sIdx}>
                    <p className="text-forest text-base">
                      <span className="font-semibold">{session.time}</span>
                      <span className="text-forest/50 mx-2">—</span>
                      {session.title}
                    </p>
                    {session.evening && (
                      <p className="text-forest/60 text-sm mt-1 pl-4 border-l-2 border-beige">{session.evening}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-beige/50">
            <p className="text-sm italic text-forest/60 text-center">
              All sessions recorded for 48 hours. Can&apos;t make it live? Watch on your time.
            </p>
          </div>
        </div>

        {/* What Else Is Included Card */}
        <div className="relative bg-gradient-to-br from-forest via-forest to-forest-dark text-ivory rounded-3xl p-7 mb-10 overflow-hidden shadow-[0_8px_32px_rgba(1,45,38,0.25)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.15em] text-gold/80 mb-2">Plus</p>
            <h3 className="font-headline text-xl mb-5">Beyond the Workouts</h3>
            <ul className="space-y-3">
              {whatElseIncluded.map((item, idx) => (
                <li key={idx} className="text-base flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="text-ivory/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <ElegantButton onClick={scrollToPayment}>
          I&apos;m Ready to Start This Week
        </ElegantButton>
      </section>

      <FloralDivider />

      {/* ============================================
          SWIPE 10: SOCIAL PROOF
          ============================================ */}
      <section className="px-5 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-beige-light/30 to-ivory" />
        <DecorativeBlob className="w-48 h-48 top-20 -right-20 opacity-40" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-wine mb-3">Real Transformations</p>
            <h2 className="font-headline text-[24px] text-forest md:text-4xl">
              Real Sisters. Real Results.
            </h2>
            <p className="font-accent text-lg text-gold-dark italic mt-2">Real Community.</p>
          </div>

          {/* Transformation Cards */}
          {transformations.map((transformation, index) => (
            <TransformationCard key={transformation.name} transformation={transformation} index={index} />
          ))}

          {/* Group Workout Photos */}
          <div className="grid grid-cols-2 gap-2 w-[calc(100%+40px)] -ml-5 mb-10">
            {[
              "/images/circle/Fitness Geetika Transformation.jpg.png",
              "/images/circle/Confidence Aurvi Before & After.jpg",
            ].map((src, i) => (
              <div
                key={i}
                className="aspect-square relative overflow-hidden"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    filter: "brightness(1.02) contrast(0.9) saturate(0.65) sepia(0.2)",
                  }}
                >
                  <Image
                    src={src}
                    alt="Circle workout transformation"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <ElegantButton onClick={scrollToPayment}>
            Join Your Sisters in Circle
          </ElegantButton>
        </div>
      </section>

      {/* ============================================
          SWIPE 11: FAQ
          ============================================ */}
      <section className="px-5 py-12">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-wine mb-3">Common Questions</p>
          <h2 className="font-headline text-[24px] text-forest md:text-4xl">
            We&apos;ve Got Answers
          </h2>
        </div>

        {/* FAQ Accordion */}
        {faqs.map((faq, index) => (
          <FAQAccordion
            key={index}
            faq={faq}
            isExpanded={expandedFaq === index}
            onToggle={() => setExpandedFaq(expandedFaq === index ? null : index)}
            variant="card"
          />
        ))}
      </section>

      {/* ============================================
          SWIPE 12: FINAL CTA + PAYMENT
          ============================================ */}
      <section id="payment-section" className="px-5 py-12 relative overflow-hidden">
        <DecorativeBlob className="w-64 h-64 -top-20 -left-20 opacity-40" />

        <div className="relative z-10">
          {/* Disha's Message */}
          <div className="relative bg-gradient-to-br from-wine via-wine to-wine-dark text-ivory rounded-3xl p-8 mb-10 overflow-hidden shadow-[0_8px_32px_rgba(128,0,0,0.3)]">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-ivory/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <span className="text-5xl text-ivory/30 font-accent absolute -top-2 left-0">&ldquo;</span>

              <div className="pt-6 space-y-4">
                <p className="text-lg leading-[1.7] font-accent italic text-ivory/95">
                  Here&apos;s what I know: Transformation isn&apos;t a solo journey.
                  Every woman who&apos;s risen has had her sisters beside her.
                </p>
                <p className="text-lg leading-[1.7] font-accent italic text-ivory/95">
                  Circle is where you stop doing this alone. Where discipline feels like
                  love. Where your sisters show up for you—and you show up for them.
                </p>
                <p className="text-lg leading-[1.7] font-accent italic text-ivory/95">
                  Your tribe is waiting. Let&apos;s rise together.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-ivory/20 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/40 to-gold/20 border-2 border-gold/50 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <span className="text-3xl">👩🏻</span>
                </div>
                <div>
                  <p className="font-headline font-semibold text-lg">Disha Methi Khandelwal</p>
                  <p className="text-sm text-ivory/70">Founder, Glow Up Academy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA Container */}
          <div className="relative bg-gradient-to-br from-forest via-forest to-forest-dark text-ivory rounded-3xl p-10 text-center mb-10 overflow-hidden shadow-[0_8px_40px_rgba(1,45,38,0.35)]">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-wine/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-3">Join Us</p>
              <h2 className="font-headline text-[28px] mb-3">Your Queens Are Waiting</h2>
              <p className="text-base text-ivory/80 mb-6">
                The Circle starts this week. Your transformation starts today.
              </p>

              <div className="mb-8">
                <p className="text-4xl font-headline font-bold text-gold mb-1">₹4,499</p>
                <p className="text-sm text-ivory/60">per month • Cancel anytime</p>
              </div>

              {/* Payment Form */}
              <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-ivory/10 border border-ivory/20 text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-ivory/10 border border-ivory/20 text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-ivory/10 border border-ivory/20 text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                />
              </div>

              {/* Razorpay Checkout */}
              <RazorpayCheckout
                amount={4499}
                programId="circle"
                programName="Circle - Monthly Membership"
                customerEmail={customerEmail}
                customerName={customerName}
                customerPhone={customerPhone}
                isSubscription={true}
                razorpayPlanId={process.env.NEXT_PUBLIC_RAZORPAY_CIRCLE_PLAN_ID}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                buttonText="Join Circle Now — ₹4,499/Month"
                className="w-full h-14 bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:to-gold text-forest font-semibold text-lg rounded-2xl shadow-[0_4px_24px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.5)] transition-all duration-300"
              />

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mt-6 text-ivory/50 text-xs">
                <span>🔒 Secure payment</span>
                <span>•</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Alternative CTA Link */}
          <div className="text-center">
            <button
              onClick={() => setShowCalendly(!showCalendly)}
              className="text-wine hover:text-wine-dark text-sm font-medium underline underline-offset-4 decoration-wine/30 hover:decoration-wine transition-all"
            >
              Want to talk first? Book a free 20-min call
            </button>
          </div>

          {/* Calendly Embed (Hidden by default) */}
          {showCalendly && (
            <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-beige/30 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <p className="text-center text-forest font-headline text-lg mb-4">
                Schedule a free call with our team
              </p>
              {/* Calendly widget would go here */}
              <div className="aspect-video bg-beige-light rounded-2xl flex items-center justify-center mb-4">
                <p className="text-forest/50 text-sm">[Calendly Widget]</p>
              </div>
              <Link
                href="/book-call"
                className="block w-full h-14 bg-gradient-to-r from-wine to-wine-light text-ivory font-semibold text-lg rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(128,0,0,0.25)] hover:shadow-[0_6px_28px_rgba(128,0,0,0.35)] transition-all"
              >
                Book Your Free Call
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <StickyCTABar visible={showStickyBar} />

      {/* Add padding at bottom for sticky bar */}
      <div className="h-20 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />

      <Footer />
    </div>
  );
}
