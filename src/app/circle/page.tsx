"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Footer } from "@/components/ui/footer";
import { RazorpayCheckout } from "@/components/checkout/RazorpayCheckout";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { useRouter } from "next/navigation";
import { getCheckoutPrefill, migrateLegacyStorage } from "@/lib/lead-storage";
import { CircleStartDateSelector } from "@/components/checkout/CircleStartDateSelector";
import { getComingMondayIST, getFollowingMondayIST, calculateCircleStartDate, getCurrentISTDate } from "@/lib/date-utils";
import type { CircleStartDateOption } from "@/types";
import { getCDNUrl } from "@/lib/cdn";
import { getProgramById } from "@/lib/programs";

// ============================================
// DATA CONSTANTS
// ============================================

const pillars = [
  {
    emoji: "◆",
    title: "FITNESS",
    headline: "Build the Body That Makes You Feel Powerful",
    description:
      "Structured LIVE & App workouts designed to make you strong, toned, and energized-not exhausted. Progressive training that meets you where you are and takes you where you want to be.",
    features: [
      "Strength training",
      "HIIT sessions",
      "Dance workouts",
      "Yoga & mobility",
      "Indian-friendly modifications",
    ],
  },
  {
    emoji: "✧",
    title: "BEAUTY",
    headline: "Glow From the Inside, Radiate on the Outside",
    description:
      "Skincare routines that fit your life. Hair care that actually works. Habits that make you feel magnetic every single day-not just for special occasions.",
    features: [
      "Weekly skincare guidance",
      "Product recommendations (budget-friendly)",
      "Hair & nail care routines",
      "Posture & presence coaching",
      "Sustainable beauty habits",
    ],
  },
  {
    emoji: "◈",
    title: "FINANCE",
    headline: "Master Your Money, Build Your Freedom",
    description:
      "Financial clarity sessions, budget systems, and investment basics. Because unstoppable women don't just earn more-they keep more, invest smarter, and build wealth.",
    features: [
      "Monthly financial clarity workshops",
      "Budget templates",
      "Savings & investment guidance",
      "Money mindset shifts",
    ],
  },
  {
    emoji: "◇",
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
    name: "Apoorva",
    location: "Dentist, Hyderabad",
    duration: "9 months in Circle",
    results: "Lost 9 kg • Runs 5K now • Never misses workouts",
    quote:
      "The WhatsApp group keeps me going. When I don't feel like showing up, my girlies remind me why I started. That's the power of Circle.",
  },
  {
    name: "Dhvani",
    location: "Sound Engineer, Mumbai",
    duration: "6 months in Circle",
    results: "Found a new passion • Lost 19 kg • Found work-life balance",
    quote:
      "Circle taught me that taking care of myself ISN'T selfish. My passion in dance grew because I grew. Best investment I've made.",
  },
  {
    name: "Padmavati",
    location: "CA, Hyderabad",
    duration: "3 months in Circle",
    results: "Lost 11 kg • Negotiated ₹6L raise • Became accountability pod leader",
    quote:
      "I joined for fitness. I stayed for the sisterhood. Circle changed how I show up-not just in workouts, but in life.",
  },
  {
    name: "Pratyancha G.",
    location: "Doctor Student, Delhi",
    duration: "5 months in Circle",
    results: "Lost 6 kg • Found community • Consistent through wedding season",
    quote:
      "Living in a new city, I felt alone. Circle gave me the best community. The early morning classes are worth waking up for.",
  },
];

const faqs = [
  {
    question: "What if I can't make the live sessions?",
    answer:
      "All live sessions are recorded for 48 hours. Watch on your time. But we recommend joining live when possible-the community energy is unmatched.",
  },
  {
    question: "How is CIRCLE different from ESSENTIALS?",
    answer:
      "CIRCLE has LIVE workouts and community accountability. ESSENTIALS is self-paced. If you thrive with girlies around you, CIRCLE is your home.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. CIRCLE is month-to-month. Cancel anytime with 7 days notice. No contracts, no penalties. But most women stay because the sisterhood is everything.",
  },
  {
    question: "I'm an NRI in a different time zone. Will this work?",
    answer:
      "Yes! We have girlies in London, Toronto, Dubai, Singapore. Sessions are at 7 AM and 8 PM IST. Pick what works. Recordings available for 48 hours.",
  },
  {
    question: "I have zero fitness experience. Is CIRCLE too advanced?",
    answer:
      "CIRCLE welcomes all levels. Our coaches modify every move. You'll have beginners, intermediates, and advanced-all in the same class, all supported.",
  },
];

// ============================================
// DECORATIVE COMPONENTS
// ============================================

function DecorativeBlob({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      aria-hidden="true"
      role="presentation"
      style={{
        background: "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.12) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8" aria-hidden="true" role="presentation">
      <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
      <span className="text-gold/60 text-lg">✿</span>
      <div className="h-px w-12 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
    </div>
  );
}


// ============================================
// COMPONENTS
// ============================================

function StickyCTABar({ visible, onScrollToPayment }: { visible: boolean; onScrollToPayment: () => void }) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-gradient-to-r from-forest via-forest to-forest-light h-[76px] shadow-[0_-8px_32px_rgba(1,45,38,0.3)] flex items-center justify-between px-5 border-t border-gold/20">
        <div className="flex-1">
          <p className="text-[11px] uppercase text-gold font-semibold tracking-[0.15em]">
            CIRCLE Membership
          </p>
          <p className="text-[22px] font-headline font-bold text-ivory">₹117<span className="text-sm font-body font-normal text-ivory/70">/day</span></p>
        </div>
        <button
          onClick={onScrollToPayment}
          className="flex-shrink-0 h-12 px-7 bg-gradient-to-r from-gold to-gold-light text-forest font-semibold text-base rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-[0.96] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)]"
        >
          Join Now →
        </button>
      </div>
    </div>
  );
}

// FAQAccordion imported from @/components/ui/faq-accordion

// Pillar images mapping - CDN optimized
const pillarImages: Record<string, string> = {
  FITNESS: getCDNUrl("/images/circle/Build the Body That Makes You Feel Powerful.jpg"),
  BEAUTY: getCDNUrl("/images/circle/Glow From the Inside, Radiate on the Outside.jpg"),
  FINANCE: getCDNUrl("/images/circle/Master Your Money, Build Your Freedom.jpg"),
  CONFIDENCE: getCDNUrl("/images/circle/Command Respect, Trust Yourself, Own Every Room.jpg"),
};

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  return (
    <div className="relative bg-gradient-to-br from-forest via-forest to-forest-dark text-ivory rounded-3xl p-8 mb-6 overflow-hidden shadow-[0_8px_32px_rgba(1,45,38,0.25)]">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-wine/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Icon with elegant container */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(212,175,55,0.2)]" aria-hidden="true">
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
              loading="lazy"
              quality={75}
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

// Transformation images mapping - CDN optimized
const transformationImages = [
  getCDNUrl("/images/circle/Apoorva Transformation.jpg.png"),
  getCDNUrl("/images/circle/Dhvani Transformation.jpg.png"),
  getCDNUrl("/images/circle/Padmavati Transformation.jpg"),
  getCDNUrl("/images/circle/Pratyancha Gupta Transformatiop.jpg.png"),
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
            loading="lazy"
            quality={75}
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
  const circleProgram = getProgramById('circle')!;
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [startDateOption, setStartDateOption] = useState<CircleStartDateOption>('coming-monday');
  const [comingMonday, setComingMonday] = useState<Date>(new Date());
  const [followingMonday, setFollowingMonday] = useState<Date>(new Date());
  const [isTodayMonday, setIsTodayMonday] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Preload LCP resources (video poster) for faster initial paint
  useEffect(() => {
    // Preload the video poster through Next.js Image optimization
    const posterUrl = getCDNUrl("/images/circle/Circle community - women supporting women in transformation.jpg");
    const optimizedPosterUrl = `/_next/image?url=${encodeURIComponent(posterUrl)}&w=828&q=75`;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedPosterUrl;
    link.type = 'image/webp';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Pre-fill form from quiz data (unified storage)
  useEffect(() => {
    try {
      // Migrate any legacy sessionStorage data
      migrateLegacyStorage();

      // Get pre-filled data from unified storage
      const prefill = getCheckoutPrefill();
      if (prefill) {
        // Only set values if they're not already filled (user might have started typing)
        if (!customerName && prefill.name) {
          setCustomerName(prefill.name);
        }
        if (!customerEmail && prefill.email) {
          setCustomerEmail(prefill.email);
        }
        if (!customerPhone && prefill.phone) {
          setCustomerPhone(prefill.phone);
        }
      }
    } catch (error) {
      // Silent fail - user can still fill form manually
      if (process.env.NODE_ENV === "development") {
        console.error("Error loading quiz data for pre-fill:", error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Handle sticky bar visibility using IntersectionObserver (no forced reflows)
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when hero is not visible (scrolled past)
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate Circle start date options (coming Monday and following Monday)
  useEffect(() => {
    const coming = getComingMondayIST();
    const following = getFollowingMondayIST();
    const today = getCurrentISTDate();
    setComingMonday(coming);
    setFollowingMonday(following);
    setIsTodayMonday(today.getDay() === 1 && today.getHours() < 6);
  }, []);

  const scrollToPayment = () => {
    if (paymentRef.current) {
      // Respect reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      paymentRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  };

  const handlePaymentSuccess = (data: { paymentId: string; subscriptionId?: string }) => {
    const startDateSelection = calculateCircleStartDate(startDateOption);
    router.push(`/checkout/success?program=circle&payment_id=${data.paymentId}${data.subscriptionId ? `&subscription_id=${data.subscriptionId}` : ""}&start_date=${encodeURIComponent(startDateSelection.isoString)}`);
  };

  const handlePaymentError = (error: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.error("Payment error:", error);
    }
    router.push(`/checkout/failed?error=${encodeURIComponent(error)}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-ivory via-beige-light/30 to-ivory font-body text-forest overflow-x-hidden">
      {/* ============================================
          SWIPE 1: HERO SECTION
          ============================================ */}
      <section ref={heroRef} className="relative px-5 pt-8 pb-12">
        {/* Decorative blobs */}
        <DecorativeBlob className="w-64 h-64 -top-20 -right-20" />
        <DecorativeBlob className="w-48 h-48 top-40 -left-24 opacity-60" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-wine/15 via-wine/10 to-gold/10 rounded-full border border-wine/20 shadow-[0_4px_20px_rgba(128,0,0,0.12)] backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-wine to-gold animate-pulse" aria-hidden="true"></span>
              <span className="text-wine text-sm font-bold uppercase tracking-[0.2em]">
                CIRCLE
              </span>
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gold to-wine animate-pulse" aria-hidden="true"></span>
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="font-headline text-[32px] leading-[1.15] text-forest mb-5 md:text-5xl text-center">
            Your Sisterhood to
            <span className="block text-gold-dark">Unstoppable</span>
          </h1>

          {/* Hero Subheadline */}
          <p className="text-base leading-[1.7] text-forest/75 mb-5 md:text-lg">
            You&apos;re ready for community, accountability, and complete transformation.
            Based on your quiz, <span className="font-semibold text-forest">CIRCLE</span> is where you stop doing this alone and start
            becoming unstoppable with your girlies.
          </p>

          {/* Social Proof Line */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2" aria-label="Community members" role="img">
              {[
                getCDNUrl("/images/circle/1 mini image.jpg"),
                getCDNUrl("/images/circle/2 mini image.jpg"),
                getCDNUrl("/images/circle/3 mini image.jpg"),
                getCDNUrl("/images/circle/4 mini image.jpg"),
              ].map((src, i) => (
                <div key={`avatar-${i}`} className="w-8 h-8 rounded-full border-2 border-ivory overflow-hidden relative">
                  <Image
                    src={src}
                    alt={`Circle member ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-forest/70">
              <span className="font-semibold text-wine">1000+</span> women rising together
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
              {/* Optimized poster image for LCP */}
              <Image
                src={getCDNUrl("/images/circle/Circle community - women supporting women in transformation.jpg")}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority
                quality={75}
              />
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={getCDNUrl("/images/circle/Circle live workout session with community members.mp4")} type="video/mp4" />
                Your browser does not support the video tag.
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
            Join CIRCLE →
          </ElegantButton>

          {/* Micro trust text */}
          <p className="text-center text-xs text-forest/50 mt-4">
            Start this week • Founded by Disha Methi Khandelwal
          </p>
        </div>
      </section>

      {/* ============================================
          SWIPE 2: TRUST + INCLUDED
          ============================================ */}
      <section className="pb-12">
        <div className="px-5">
          <p className="text-base leading-[1.7] text-forest/75 mb-6 text-center">
            Your complete transformation toolkit. Live workouts, expert coaching,
            community support, and holistic guidance across fitness, beauty, finance,
            and confidence.
          </p>
        </div>

        <div className="px-5">

          {/* What You'll Experience - Feminine, Benefit-Focused */}
          <div className="relative rounded-3xl overflow-hidden mb-8">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-beige-light via-ivory to-white" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gold/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-wine/10 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

            <div className="relative z-10 p-6 border border-beige/50 rounded-3xl backdrop-blur-sm">
              {/* Header with floral accent */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-gold/70 text-xs">✿</span>
                  <div className="h-px w-6 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
                <h2 className="font-headline text-xl text-forest">
                  What You&apos;ll <span className="text-gold-dark italic font-accent">Experience</span>
                </h2>
              </div>

              {/* Benefit Cards - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Benefit 1 */}
                <div className="group bg-white/70 rounded-2xl p-4 border border-beige/30 hover:border-wine/20 transition-all duration-500 hover:shadow-[0_4px_20px_rgba(128,0,0,0.08)]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine/10 to-wine/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl text-wine">◆</span>
                  </div>
                  <p className="font-semibold text-forest text-sm mb-1">Wake up excited</p>
                  <p className="text-xs text-forest/60 leading-relaxed">4 LIVE workouts weekly make mornings worth it</p>
                </div>

                {/* Benefit 2 */}
                <div className="group bg-white/70 rounded-2xl p-4 border border-beige/30 hover:border-gold/30 transition-all duration-500 hover:shadow-[0_4px_20px_rgba(212,175,55,0.1)]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl text-gold-dark">✧</span>
                  </div>
                  <p className="font-semibold text-forest text-sm mb-1">Never feel alone</p>
                  <p className="text-xs text-forest/60 leading-relaxed">WhatsApp girlies cheering you on daily</p>
                </div>

                {/* Benefit 3 */}
                <div className="group bg-white/70 rounded-2xl p-4 border border-beige/30 hover:border-gold/30 transition-all duration-500 hover:shadow-[0_4px_20px_rgba(212,175,55,0.1)]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl text-gold-dark">◈</span>
                  </div>
                  <p className="font-semibold text-forest text-sm mb-1">Get real answers</p>
                  <p className="text-xs text-forest/60 leading-relaxed">Expert sessions on nutrition, finance & mindset</p>
                </div>

                {/* Benefit 4 */}
                <div className="group bg-white/70 rounded-2xl p-4 border border-beige/30 hover:border-wine/20 transition-all duration-500 hover:shadow-[0_4px_20px_rgba(128,0,0,0.08)]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine/10 to-wine/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl text-wine">◇</span>
                  </div>
                  <p className="font-semibold text-forest text-sm mb-1">Fits YOUR life</p>
                  <p className="text-xs text-forest/60 leading-relaxed">App workouts + 48hr replays for busy days</p>
                </div>
              </div>

              {/* 4 Pillars Row */}
              <div className="py-4 border-t border-beige/30">
                <p className="text-[10px] uppercase tracking-wider text-forest/50 text-center mb-3">Transform in</p>
                <div className="flex justify-center items-center gap-3">
                  {[
                    { emoji: "◆", label: "Body", color: "wine" },
                    { emoji: "✧", label: "Beauty", color: "gold-dark" },
                    { emoji: "◈", label: "Wealth", color: "wine" },
                    { emoji: "◇", label: "Mind", color: "gold-dark" },
                  ].map((pillar) => (
                    <div key={pillar.label} className="flex items-center gap-1">
                      <span className={`text-base text-${pillar.color}`} aria-hidden="true">{pillar.emoji}</span>
                      <span className="text-xs text-forest/70">{pillar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                until CIRCLE. The community accountability is everything. I don&apos;t
                work out alone anymore-I work out with my besties.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-beige relative">
                  <Image
                    src={getCDNUrl("/images/circle/Dhreeti.jpg")}
                    alt="Dhreeti V."
                    fill
                    className="object-cover"
                    sizes="40px"
                    loading="lazy"
                    quality={80}
                  />
                </div>
                <div>
                  <p className="font-semibold text-forest text-sm">Dhreeti V.</p>
                  <p className="text-xs text-forest/60">London</p>
                </div>
              </div>
              <p className="text-gold-dark text-xs mt-3 font-medium">
                Lost 8 kg • Consistent for 6 months • Found her tribe
              </p>
            </div>
          </div>
        </div>

        {/* Community Photo Collage */}
        <div className="grid grid-cols-2 gap-1 mb-8">
          {[
            { src: getCDNUrl("/images/circle/Fitness Geetika Transformation.jpg.png"), alt: "Fitness transformation - Geetika", priority: true },
            { src: getCDNUrl("/images/circle/Beautfy transformation_2.jpg.png"), alt: "Beauty transformation", priority: true },
            { src: getCDNUrl("/images/circle/Confidence Aurvi Before & After.jpg"), alt: "Confidence transformation - Aurvi", priority: false },
            { src: getCDNUrl("/images/circle/Circle community - women supporting women in transformation.jpg"), alt: "Circle community", priority: false },
          ].map((img, i) => (
            <div
              key={`collage-${i}`}
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
                  priority={img.priority}
                  loading={img.priority ? undefined : "lazy"}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="px-5">
          {/* Secondary CTA */}
          <ElegantButton onClick={scrollToPayment}>
            Claim My Spot in CIRCLE
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
            {/* Poster image as placeholder until video is played */}
            <Image
              src={getCDNUrl("/images/circle/Circle community - women supporting women in transformation.jpg")}
              alt="Barsa transformation story"
              fill
              className="object-cover"
              sizes="100vw"
              loading="lazy"
              quality={75}
            />
            <video
              playsInline
              controls
              preload="none"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={getCDNUrl("/images/circle/Barsa Client Circle Transformation .mp4")} type="video/mp4" />
              Your browser does not support the video tag.
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
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30 relative">
                  <Image
                    src={getCDNUrl("/images/circle/Niharika .jpg")}
                    alt="Niharika"
                    fill
                    className="object-cover object-top"
                    sizes="48px"
                    loading="lazy"
                    quality={80}
                  />
                </div>
                <div>
                  <p className="font-headline font-semibold text-lg">Niharika</p>
                  <p className="text-ivory/60 text-sm">Fashion Designer, Chicago</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {["Lost 8 kgs", "Best All Round Performance", "Never misses Monday"].map((result, idx) => (
                  <span key={idx} className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full border border-gold/30">
                    {result}
                  </span>
                ))}
              </div>

              <blockquote className="text-base italic text-ivory/90 leading-[1.7] font-accent">
                &ldquo;CIRCLE gave me what I was missing: accountability that doesn&apos;t
                feel like pressure. These women GET IT. We rise together.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Prompt */}
          <div className="text-center mb-6">
            <p className="font-accent text-xl text-wine italic mb-2">
              Your girlies are waiting.
            </p>
            <p className="text-forest/70">Ready to join?</p>
          </div>

          <ElegantButton onClick={scrollToPayment}>
            Yes, I&apos;m Ready for CIRCLE
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
            CIRCLE isn&apos;t a fitness program. It&apos;s your <span className="font-semibold text-forest">transformation
            sisterhood</span>-where you work on ALL of you (body, beauty, finance, confidence)
            with women who refuse to wait.
          </p>

          <p className="text-base leading-[1.7] text-forest/75 mb-8">
            Founded by Disha. Led by expert coaches. Powered by <span className="font-semibold text-wine">1,000+ Indian women</span> who show up for themselves-and for each other-every single day.
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
                src={getCDNUrl("/images/circle/Circle community - women supporting women in transformation.jpg")}
                alt="Circle community - women supporting women in transformation"
                fill
                className="object-cover"
                sizes="100vw"
                loading="lazy"
                quality={75}
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
                "You thrive with community-you want accountability that feels like sisterhood, not surveillance",
                "You're ready for 4-6 hours/week commitment across fitness, beauty, finance, and confidence",
                "You want structure without pressure-discipline that feels luxurious, not punishing",
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
              This Is What I Need-Join CIRCLE
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
              Why CIRCLE Works When
            </h2>
            <h2 className="font-headline text-[24px] text-gold-dark md:text-4xl">
              Everything Else Doesn&apos;t
            </h2>
          </div>

          <p className="text-base leading-[1.7] text-forest/75 mb-10 text-center max-w-md mx-auto">
            Most programs only transform your body. Then life happens-stress, burnout,
            self-doubt-and the results evaporate. <span className="font-semibold text-forest">CIRCLE transforms ALL of you.</span>
          </p>

          {/* Pillar Cards */}
          {pillars.map((pillar, index) => (
            <div key={pillar.title}>
              <PillarCard pillar={pillar} index={index} />
              {/* CTA after pillar 2 and 4 */}
              {(index === 1 || index === 3) && (
                <div className="mb-8">
                  <ElegantButton onClick={scrollToPayment}>
                    Join the Sisterhood
                  </ElegantButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          SWIPE 9: YOUR WEEKLY RHYTHM - Feminine & Benefit-Focused
          ============================================ */}
      <section className="px-5 py-16 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-0 w-64 h-64 bg-gradient-to-br from-gold/10 to-wine/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-beige/30 to-gold/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/50" />
              <span className="text-gold text-sm">✿</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/50" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine mb-3 font-medium">Your Weekly Rhythm</p>
            <h2 className="font-headline text-[26px] text-forest md:text-4xl leading-tight">
              Every Day, A Reason to<br />
              <span className="text-gold-dark italic font-accent">Show Up For Yourself</span>
            </h2>
          </div>

          {/* Benefit-focused weekly cards */}
          <div className="space-y-4 mb-8">
            {/* Monday */}
            <div className="group bg-gradient-to-r from-white via-white to-beige-light/50 rounded-2xl p-5 border border-beige/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] transition-all duration-500 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-wine animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-wine">Monday • LIVE</span>
                  </div>
                  <p className="font-headline text-lg text-forest mb-1">Start Your Week Feeling Powerful</p>
                  <p className="text-sm text-forest/60">Cardio & Core that wakes up your body and sets the tone</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-wine/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-wine">◆</span>
                </div>
              </div>
            </div>

            {/* Tuesday */}
            <div className="group bg-gradient-to-r from-white via-white to-gold/10 rounded-2xl p-5 border border-beige/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">Tuesday • APP + Expert Session</span>
                  </div>
                  <p className="font-headline text-lg text-forest mb-1">Move Your Body, Nourish Your Soul</p>
                  <p className="text-sm text-forest/60">Dance cardio on your time + Nutrition QnA at 6pm IST</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-gold-dark">✧</span>
                </div>
              </div>
            </div>

            {/* Wednesday */}
            <div className="group bg-gradient-to-r from-white via-white to-beige-light/50 rounded-2xl p-5 border border-beige/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] transition-all duration-500 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-wine animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-wine">Wednesday • LIVE</span>
                  </div>
                  <p className="font-headline text-lg text-forest mb-1">Build Strength That Lasts</p>
                  <p className="text-sm text-forest/60">Mobility & Strength to feel capable in your own skin</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-wine/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-wine">◈</span>
                </div>
              </div>
            </div>

            {/* Thursday */}
            <div className="group bg-gradient-to-r from-white via-white to-gold/10 rounded-2xl p-5 border border-beige/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">Thursday • APP + Expert Session</span>
                  </div>
                  <p className="font-headline text-lg text-forest mb-1">Sculpt Your Body, Master Your Money</p>
                  <p className="text-sm text-forest/60">Full Body Strength + Finance Clarity at 8pm IST</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-gold-dark">◈</span>
                </div>
              </div>
            </div>

            {/* Friday */}
            <div className="group bg-gradient-to-r from-white via-white to-beige-light/50 rounded-2xl p-5 border border-beige/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] transition-all duration-500 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-wine animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-wine">Friday • LIVE</span>
                  </div>
                  <p className="font-headline text-lg text-forest mb-1">Push Your Limits, See Results</p>
                  <p className="text-sm text-forest/60">Power HIIT to end the week feeling unstoppable</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-wine/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-wine">◆</span>
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div className="group bg-gradient-to-br from-forest via-forest to-forest-dark rounded-2xl p-5 shadow-[0_8px_30px_rgba(1,45,38,0.2)] hover:shadow-[0_12px_40px_rgba(1,45,38,0.25)] transition-all duration-500 hover:-translate-y-0.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Saturday • Community Day</span>
                  </div>
                  <p className="font-headline text-lg text-ivory mb-1">Sweat With Your Sisters</p>
                  <p className="text-sm text-ivory/70">Extended workout + Confidence Circle (Beauty, Skincare & Mindset)</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-gold">◇</span>
                </div>
              </div>
            </div>

            {/* Sunday */}
            <div className="group bg-gradient-to-r from-beige-light/80 via-ivory to-white rounded-2xl p-5 border border-beige/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-beige-dark" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest/50">Sunday • Rest & Reflect</span>
                  </div>
                  <p className="font-headline text-lg text-forest mb-1">Rest Is Part of the Journey</p>
                  <p className="text-sm text-forest/60">Weekly challenge check-in on WhatsApp • Celebrate your wins</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-beige/50 flex items-center justify-center">
                  <span className="text-gold">✿</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reassurance note */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full border border-beige/40 shadow-soft">
              <span className="text-gold">✧</span>
              <p className="text-sm text-forest/70 italic">
                Missed a session? Recordimgs are available for 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Else Is Included Section */}
      <section className="px-5 py-8">
        <div className="relative bg-gradient-to-br from-forest via-forest to-forest-dark text-ivory rounded-3xl p-7 mb-8 overflow-hidden shadow-[0_8px_32px_rgba(1,45,38,0.25)]">
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
              Real girlies. Real Results.
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
              getCDNUrl("/images/circle/Fitness Geetika Transformation.jpg.png"),
              getCDNUrl("/images/circle/Confidence Aurvi Before & After.jpg"),
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
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <ElegantButton onClick={scrollToPayment}>
            Join Your girlies in CIRCLE
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
                  Every woman who&apos;s risen has had her girlies beside her.
                </p>
                <p className="text-lg leading-[1.7] font-accent italic text-ivory/95">
                  CIRCLE is where you stop doing this alone. Where discipline feels like
                  love. Where your girlies show up for you-and you show up for them.
                </p>
                <p className="text-lg leading-[1.7] font-accent italic text-ivory/95">
                  Your tribe is waiting. Let&apos;s rise together.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-ivory/20 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.3)] relative">
                  <Image
                    src={getCDNUrl("/images/DMK/Disha Close Up Face.png")}
                    alt="Disha Methi Khandelwal"
                    fill
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                    quality={80}
                  />
                </div>
                <div>
                  <p className="font-headline font-semibold text-lg">Disha Methi Khandelwal</p>
                  <p className="text-sm text-ivory/70">Founder, Glow Up Academy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA Container */}
          <div ref={paymentRef} className="relative bg-gradient-to-br from-forest via-forest to-forest-dark text-ivory rounded-3xl p-6 md:p-10 text-center mb-10 overflow-hidden shadow-[0_8px_40px_rgba(1,45,38,0.35)]">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-wine/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-2 md:mb-3">Join Us</p>
              <h2 className="font-headline text-[22px] md:text-[28px] mb-2 md:mb-3">Your Queens Are Waiting</h2>
              <p className="text-sm md:text-base text-ivory/80 mb-4 md:mb-6">
                CIRCLE starts this Monday. Your transformation starts today.
              </p>

              <div className="mb-5 md:mb-8">
                <p className="text-3xl md:text-4xl font-headline font-bold text-gold mb-1">₹3,999</p>
                <p className="text-xs md:text-sm text-ivory/60">per month • Cancel anytime</p>
              </div>

              {/* Payment Form */}
              <div className="space-y-2.5 md:space-y-3 mb-5 md:mb-8 text-left max-w-sm mx-auto">
                <div>
                  <label htmlFor="circle-name" className="sr-only">Your Name</label>
                  <input
                    id="circle-name"
                    type="text"
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    aria-required="true"
                    className="w-full h-11 md:h-14 px-4 md:px-5 rounded-xl md:rounded-2xl bg-ivory/10 border border-ivory/20 text-ivory text-sm md:text-base placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="circle-email" className="sr-only">Your Email</label>
                  <input
                    id="circle-email"
                    type="email"
                    placeholder="Your Email *"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    aria-required="true"
                    className="w-full h-11 md:h-14 px-4 md:px-5 rounded-xl md:rounded-2xl bg-ivory/10 border border-ivory/20 text-ivory text-sm md:text-base placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="circle-phone" className="sr-only">Phone Number with Country Code</label>
                  <input
                    id="circle-phone"
                    type="tel"
                    placeholder="WA Number (+919876543210) *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    aria-required="true"
                    className="w-full h-11 md:h-14 px-4 md:px-5 rounded-xl md:rounded-2xl bg-ivory/10 border border-ivory/20 text-ivory text-sm md:text-base placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </div>
                {/* Validation message */}
                {(!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) && (
                  <p className="text-ivory/60 text-xs text-center">* All fields are required</p>
                )}
              </div>

              {/* Circle Start Date Selector */}
              <CircleStartDateSelector
                value={startDateOption}
                onChange={setStartDateOption}
                comingMondayDate={comingMonday}
                followingMondayDate={followingMonday}
                isTodayMonday={isTodayMonday}
                className="mb-5 md:mb-6"
              />

              {/* Razorpay Checkout */}
              {customerName.trim() && customerEmail.trim() && customerEmail.includes('@') && customerPhone.trim() ? (
                <RazorpayCheckout
                  amount={circleProgram.price}
                  programId={circleProgram.id}
                  programName={circleProgram.name}
                  customerEmail={customerEmail.trim()}
                  customerName={customerName.trim()}
                  customerPhone={customerPhone.trim()}
                  isSubscription={circleProgram.isSubscription}
                  razorpayPlanId={circleProgram.razorpayPlanId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  buttonText="Join CIRCLE Now"
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:to-gold text-forest font-semibold text-base md:text-lg rounded-xl md:rounded-2xl shadow-[0_4px_24px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.5)] transition-all duration-300"
                  programStartDate={calculateCircleStartDate(startDateOption)}
                />
              ) : (
                <button
                  disabled
                  className="w-full h-12 md:h-14 bg-ivory/20 text-ivory/50 font-semibold text-base md:text-lg rounded-xl md:rounded-2xl cursor-not-allowed transition-all duration-300"
                  aria-disabled="true"
                >
                  Enter your details to continue
                </button>
              )}

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mt-6 text-ivory/50 text-xs">
                <span>◈ Secure payment</span>
                <span>•</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Sticky CTA Bar */}
      <StickyCTABar visible={showStickyBar} onScrollToPayment={scrollToPayment} />

      {/* Add padding at bottom for sticky bar */}
      <div className="h-20 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />

      <Footer />
    </main>
  );
}
