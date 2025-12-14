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
} from "lucide-react";
import { Button } from "@/components/ui/button";

// =============================================================================
// DATA CONSTANTS - EXACT COPY FROM SPECIFICATIONS
// =============================================================================

const pillars = [
  {
    icon: Flame,
    emoji: "🔥",
    title: "Build the Body That Commands Rooms",
    description:
      "Not just weight loss. Body recomposition. Strength that shows. Energy that radiates. You'll train with Disha's custom protocols—designed for YOUR body, YOUR goals, YOUR lifestyle. No generic plans. No plateau. Just results that reflect the power you feel inside.",
    label: "FITNESS",
  },
  {
    icon: Sparkles,
    emoji: "✨",
    title: "Glow From the Inside, Radiate on the Outside",
    description:
      "Skincare that works. Routines that fit your life. Hair, nails, posture, presence. We address the beauty habits that make you feel magnetic every single day—not just for special occasions. Because confidence isn't makeup. It's how you treat yourself when no one's watching.",
    label: "BEAUTY",
  },
  {
    icon: Wallet,
    emoji: "💰",
    title: "Master Your Money, Master Your Freedom",
    description:
      "Disha has a Master's in Applied Finance. She's coached women to raise their salaries by ₹12L+. You'll build financial clarity, confidence, and systems. Because unstoppable women don't just earn more—they keep more, invest smarter, and build wealth that compounds.",
    label: "FINANCE",
  },
  {
    icon: Crown,
    emoji: "👑",
    title: "Command Respect, Trust Yourself, Own Every Room",
    description:
      "Confidence isn't affirmations. It's evidence. You'll build it through discipline, through wins, through showing up for yourself daily. Disha will coach you on self-talk, boundaries, presence, and leadership. Because hot isn't a look. It's how you carry yourself.",
    label: "CONFIDENCE",
  },
];

const timelinePhases = [
  {
    phase: 1,
    title: "Strategy Session with Disha",
    duration: "60 minutes (Week 0)",
    description:
      "You and Disha meet 1:1 for a deep-dive assessment. She'll evaluate your current state across fitness, beauty, finance, and confidence. You'll walk out with a complete transformation roadmap—personalized to your body, your goals, your life.",
    investment: "₹9,999 (credited back if you enroll in full program)",
  },
  {
    phase: 2,
    title: "Custom Program Build",
    duration: "1 week (Week 1)",
    description:
      "Disha and her team build your custom Transform protocol. Your workout plan. Your meal strategy. Your beauty and skincare routine. Your financial clarity roadmap. Your confidence-building practices. Everything tailored to YOU.",
    deliverable: "Complete Transform playbook (digital + PDF)",
  },
  {
    phase: 3,
    title: "Personal Coaching (THE TRANSFORMATION)",
    duration: "6 months of dedicated transformation",
    description: "",
    bullets: [
      "Weekly 1:1 coaching sessions with Disha (30 minutes each)",
      "Daily accountability via WhatsApp (Disha or senior coach)",
      "Custom adjustments as you progress (workouts, nutrition, beauty, mindset)",
      "Access to Transform portal (meal plans, workout videos, resources)",
      "Monthly progress assessments (photos, measurements, energy, confidence)",
    ],
    result:
      "You don't just finish a program. You become a different woman.",
  },
];

const transformationShowcase = [
  {
    name: "Priya S.",
    profession: "Corporate Lawyer",
    city: "Bangalore",
    quote:
      "I didn't just lose 14 kg. I negotiated a ₹22L raise, started saying no to toxic people, and became the woman I always knew I could be. Transform didn't change my life. It gave me the tools to redesign it myself.",
    results: [
      "Lost 14 kg",
      "Gained muscle definition",
      "Raised salary ₹22L",
      "Built ₹18L investment portfolio",
    ],
  },
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
      "Transform is 1:1 personal coaching with Disha. Circle is group-based community coaching. Essentials is self-paced. If you want direct access to Disha, custom protocols, and personal accountability, Transform is your path.",
  },
  {
    question: "What if I'm not based in India?",
    answer:
      "Transform works globally. All sessions are virtual (Zoom). Meal plans adapt to your location. Workouts are equipment-flexible. Our NRI clients in London, Toronto, Dubai, and Singapore get the same experience.",
  },
  {
    question:
      "I have medical conditions (PCOS, thyroid, injuries). Can Transform help?",
    answer:
      "Yes. Disha has worked with clients with PCOS, thyroid issues, joint injuries, and chronic conditions. Your strategy call includes a full health assessment, and all protocols are adapted to your specific needs.",
  },
  {
    question: "What happens after the 6 months?",
    answer:
      "Most Transform clients continue with monthly coaching (₹25,000/month) to maintain and elevate results. But the 6-month intensive gives you the systems, habits, and identity shift to thrive independently if you choose.",
  },
  {
    question: "Can I get a refund if it doesn't work?",
    answer:
      "Transform requires full commitment—7+ hours/week, adherence to protocols, showing up for sessions. If you do the work and don't see results, we'll extend your program at no cost. But refunds are only available if you complete less than 2 weeks (medical emergencies only).",
  },
];

const thisIsForYouChecklist = [
  "You're ready to invest ₹1,99,999 in yourself (and view it as ROI, not expense)",
  "You have 7+ hours per week for workouts, planning, and transformation work",
  "You've tried programs before and hit a ceiling—you need custom, not cookie-cutter",
  "You want personal guidance from Disha, not just access to her program",
  "You're building a life, career, or identity shift that requires your most powerful self",
  "You're willing to be coached—this isn't a \"tell me what to do\" relationship, it's a partnership",
];

const transformationImages = [
  {
    src: "/images/circle/Fitness Geetika Transformation.jpg.png",
    alt: "Geetika's Fitness Transformation",
    category: "FITNESS",
    name: "Geetika",
  },
  {
    src: "/images/circle/Beautfy transformation_2.jpg.png",
    alt: "Beauty Transformation Journey",
    category: "BEAUTY",
    name: "Beauty Journey",
  },
  {
    src: "/images/circle/Confidence Aurvi Before & After.jpg",
    alt: "Aurvi's Confidence Transformation",
    category: "CONFIDENCE",
    name: "Aurvi",
  },
  {
    src: "/images/circle/Circle community - women supporting women in transformation.jpg",
    alt: "Circle Community - Women Supporting Women",
    category: "COMMUNITY",
    name: "Our Sisterhood",
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
  color = "gold"
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

// =============================================================================
// TRANSFORMATION GALLERY COMPONENT
// =============================================================================

function TransformationGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < transformationImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : transformationImages.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < transformationImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[2px] text-wine font-body mb-3">
          Real Results
        </p>
        <h3 className="font-headline text-2xl md:text-3xl font-bold text-forest mb-2">
          Transformations That Speak for Themselves
        </h3>
        <p className="font-body text-forest/60 text-sm">
          Swipe to see more journeys
        </p>
      </div>

      {/* Gallery Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[2rem]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {transformationImages.map((image, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              <div className="relative aspect-[4/3] md:aspect-[16/9] bg-gradient-to-br from-beige to-beige-dark overflow-hidden rounded-[2rem]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={idx === 0}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block bg-gold/90 text-forest text-xs font-body font-semibold px-3 py-1 rounded-full mb-2">
                    {image.category}
                  </span>
                  <h4 className="font-headline text-xl md:text-2xl text-ivory">
                    {image.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors hidden md:flex z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-forest" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors hidden md:flex z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-forest" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {transformationImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-gold w-8"
                : "bg-forest/20 hover:bg-forest/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail Grid - Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-3 mt-6">
        {transformationImages.map((image, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 ${
              idx === currentIndex
                ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="20vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

// FAQAccordion imported from @/components/ui/faq-accordion

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  return (
    <div className="group relative">
      {/* Decorative frame */}
      <div className="absolute -inset-1 bg-gradient-to-br from-gold/20 via-transparent to-wine/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-gradient-to-br from-forest via-forest to-forest-light rounded-[1.75rem] p-8 text-ivory overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1">
        {/* Subtle inner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-wine/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Icon with elegant circle */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-5 ring-1 ring-gold/20">
            <span className="text-3xl">{pillar.emoji}</span>
          </div>

          <h3 className="font-headline text-xl md:text-2xl mb-4 leading-tight">{pillar.title}</h3>
          <p className="font-body text-base text-ivory/75 leading-relaxed">
            {pillar.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelinePhase({
  phase,
  isLast,
}: {
  phase: (typeof timelinePhases)[0];
  isLast: boolean;
}) {
  return (
    <div className="flex gap-5 md:gap-8">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-forest font-headline font-bold text-lg md:text-xl flex-shrink-0 shadow-lg ring-4 ring-gold/20">
          {phase.phase}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-gold/40 to-gold/10 my-3" />
        )}
      </div>

      {/* Content */}
      <div className="pb-12 pt-1">
        <h3 className="font-headline text-xl md:text-2xl text-forest mb-1">
          {phase.title}
        </h3>
        <p className="text-sm text-wine font-accent mb-4">
          {phase.duration}
        </p>

        {phase.description && (
          <p className="font-body text-base text-forest/80 leading-relaxed mb-4">
            {phase.description}
          </p>
        )}

        {phase.bullets && (
          <ul className="space-y-3 mb-4">
            {phase.bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 font-body text-sm md:text-base text-forest/80"
              >
                <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                </div>
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {phase.investment && (
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-4 border border-gold/20">
            <p className="text-sm font-body text-forest">
              <span className="font-semibold">Investment:</span> {phase.investment}
            </p>
          </div>
        )}

        {phase.deliverable && (
          <div className="bg-beige/30 rounded-2xl p-4 border border-beige">
            <p className="text-sm font-body text-forest">
              <span className="font-semibold">Deliverable:</span> {phase.deliverable}
            </p>
          </div>
        )}

        {phase.result && (
          <p className="font-accent text-lg text-wine mt-5">
            {phase.result}
          </p>
        )}
      </div>
    </div>
  );
}

function MobileStickyCTA({ visible }: { visible: boolean }) {
  const scrollToCalendar = () => {
    const element = document.getElementById("final-cta");
    element?.scrollIntoView({ behavior: "smooth" });
  };

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
          <p className="text-gold/80 text-xs font-body uppercase tracking-wider">Strategy Call</p>
          <p className="text-ivory text-xl font-headline">₹9,999</p>
        </div>
        <Button
          onClick={scrollToCalendar}
          className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-forest font-body font-semibold text-base px-6 py-3 rounded-full h-auto shadow-lg"
        >
          Book Now →
        </Button>
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

  const scrollToCalendar = () => {
    const element = document.getElementById("final-cta");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-beige-light/30 to-ivory font-body text-charcoal overflow-x-hidden">
      {/* =========================================================================
          SECTION 1: HERO (SCREEN 1)
          ========================================================================= */}
      <section className="relative px-4 md:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Decorative blobs */}
        <DecorativeBlob className="w-96 h-96 -top-48 -right-48" color="gold" />
        <DecorativeBlob className="w-72 h-72 top-1/2 -left-36" color="wine" />
        <DecorativeBlob className="w-64 h-64 bottom-0 right-1/4" color="beige" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Personalized Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold/15 via-gold/20 to-gold/15 border border-gold/30 rounded-full text-sm font-body font-medium text-forest mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>✨ Your Personalized Path</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-headline text-[32px] leading-[1.15] md:text-5xl lg:text-6xl md:leading-[1.1] font-bold text-forest mb-8">
            Your Personal Transformation Architect—
            <span className="text-wine">Where Unstoppable Becomes Your Identity</span>
          </h1>

          {/* Hero Subheadline */}
          <p className="font-body text-base md:text-lg text-forest/75 max-w-[680px] mx-auto leading-relaxed mb-8">
            You&apos;re done doing this alone. Based on your quiz answers,
            Transform is your invitation to work 1:1 with Disha Methi
            Khandelwal—the woman who&apos;s guided 2,500+ transformations and
            built India&apos;s most premium holistic program. This isn&apos;t
            coaching. This is complete life redesign. Welcome to your next
            chapter.
          </p>

          {/* Credibility Line */}
          <p className="font-accent text-sm md:text-base text-wine/80 mb-10 max-w-2xl mx-auto">
            Founded by Disha Methi Khandelwal • Master&apos;s in Finance • 10+
            Years Transforming India&apos;s Most Ambitious Women • Featured in
            Telangana Today, WebVeda Founder (400,000+ Students)
          </p>

          {/* Hero Image */}
          <div className="mb-10 max-w-md md:max-w-2xl mx-auto">
            <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-light shadow-2xl ring-1 ring-gold/20">
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-gold/10" />
              {/* Decorative corner accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold/40 rounded-tl-xl" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-gold/40 rounded-br-xl" />
              <Image
                src="/images/DMK/Disha Wine Blazer 2.png"
                alt="Disha Methi Khandelwal in sophisticated setting"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
            <p className="font-accent text-sm text-forest/60 mt-4">
              Disha Methi Khandelwal - Founder of Glow Up Academy Transform Program
            </p>
          </div>

          {/* Primary CTA Button */}
          <Button
            onClick={scrollToCalendar}
            className="bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold text-forest font-body text-lg font-semibold px-10 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <Heart className="w-5 h-5 mr-2 fill-current" />
            Book My Strategy Call with Disha
          </Button>
        </div>
      </section>

      {/* Curved divider */}
      <div className="relative h-16 md:h-24 -mt-1">
        <svg viewBox="0 0 1440 100" fill="none" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill="#F2EBD9" fillOpacity="0.5" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 2: INVESTMENT TRANSPARENCY (SCREEN 2)
          ========================================================================= */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <DecorativeBlob className="w-80 h-80 top-0 right-0" color="gold" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Section Label */}
          <p className="text-xs uppercase tracking-[2px] text-wine font-body text-center mb-3">
            Your Investment
          </p>

          {/* Decorative line */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          {/* Pricing Headline */}
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-forest text-center mb-8">
            The Strategy Call: <span className="text-gold">₹9,999</span>
          </h2>

          {/* Pricing Explanation */}
          <div className="max-w-[680px] mx-auto mb-10 text-center">
            <p className="font-body text-base md:text-lg text-forest/75 leading-relaxed mb-4">
              Your transformation begins with a 60-minute private strategy
              session with Disha. This is where we assess your current state,
              design your complete transformation roadmap across fitness,
              beauty, finance, and confidence—and determine if Transform is the
              right fit.
            </p>
            <p className="font-body text-base md:text-lg text-forest/75 leading-relaxed mb-8">
              If you enroll in the full Transform program after your call, this
              ₹9,999 is credited back to your total investment.
            </p>
            <p className="font-headline text-2xl md:text-3xl font-bold text-forest mb-2">
              Full Transform Program: <span className="text-wine">₹1,99,999</span>
            </p>
            <p className="font-accent text-base text-wine/80">
              6-Month Commitment • Complete Life Transformation
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 max-w-lg mx-auto mb-12 shadow-lg border border-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <p className="font-headline text-lg text-forest">Flexible Payment Options</p>
            </div>
            <ul className="space-y-3 font-body text-sm text-forest/75">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                6-month program: ₹1,99,999 (one-time)
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                EMI available through Razorpay
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                Strategy call: ₹9,999 (pay first, then book)
              </li>
            </ul>
          </div>

          {/* Testimonial - VIP Client */}
          <div className="relative max-w-2xl mx-auto mb-10">
            {/* Decorative quotes */}
            <div className="absolute -top-4 -left-2 text-6xl text-gold/20 font-accent">&ldquo;</div>

            <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 shadow-xl border border-wine/10 relative overflow-hidden">
              {/* Accent border */}
              <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-wine/40 via-wine to-wine/40 rounded-full" />

              <p className="font-accent text-xl md:text-2xl text-forest/85 leading-relaxed mb-6 pl-6">
                I&apos;ve worked with celebrity trainers, nutritionists,
                and therapists. Nothing came close to Transform. Disha
                doesn&apos;t just change your body—she redesigns how you show up
                in the world. I&apos;m unrecognizable in the best way.
              </p>
              <div className="flex items-center gap-4 pl-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-beige to-beige-dark flex items-center justify-center ring-2 ring-gold/20">
                  <span className="text-2xl">👩🏻</span>
                </div>
                <div>
                  <p className="font-headline text-lg text-forest">
                    Ananya K.
                  </p>
                  <p className="font-body text-sm text-forest/60">
                    Investment Banker, Mumbai
                  </p>
                  <p className="font-body text-xs text-wine/70 mt-1">
                    Lost 12 kg • Raised ₹18L in promotions • Reclaimed confidence
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="text-center">
            <Button
              onClick={scrollToCalendar}
              className="bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold text-forest font-body text-lg font-semibold px-10 py-5 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Yes, I&apos;m Ready for My Strategy Call
            </Button>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 3: WHAT IS TRANSFORM (SCREEN 3)
          ========================================================================= */}
      <section className="relative px-4 md:px-8 py-16 md:py-24">
        <DecorativeBlob className="w-96 h-96 -top-24 -left-48" color="beige" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Section Headline */}
          <h2 className="font-headline text-2xl md:text-4xl lg:text-5xl font-bold text-forest text-center mb-10 max-w-[800px] mx-auto leading-tight">
            This Is Where Discipline Becomes <span className="text-wine">Luxury</span>—And Transformation Becomes <span className="text-gold">Lifestyle</span>
          </h2>

          {/* Opening Copy */}
          <div className="max-w-[720px] mx-auto text-center mb-12">
            <p className="font-body text-base md:text-lg text-forest/75 leading-relaxed mb-6">
              Transform isn&apos;t a 12-week program. It&apos;s not a meal plan
              and workout tracker. It&apos;s not something you
              &ldquo;complete.&rdquo;
            </p>
            <p className="font-body text-base md:text-lg text-forest/75 leading-relaxed mb-6">
              Transform is the decision that you&apos;re done optimizing around
              the edges. Done with programs that change your body but leave your
              life the same. Done being your own transformation architect when
              you could have the woman who&apos;s built this for 2,500+ Indian
              women.
            </p>
            <p className="font-body text-base md:text-lg text-forest/75 leading-relaxed mb-6">
              This is 1:1 work with Disha. Personal strategy sessions. Custom
              protocols across fitness, beauty, finance, and confidence. Weekly
              accountability. Direct access. The kind of guidance that
              doesn&apos;t scale—because it&apos;s not meant to.
            </p>
            <p className="font-accent text-lg md:text-xl text-wine leading-relaxed">
              This is the program for women who know exactly what they want: to
              become hot and unstoppable. Not next year. Now.
            </p>
          </div>

          {/* "This Is For You If..." Checklist */}
          <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 max-w-2xl mx-auto mb-12 shadow-lg border border-gold/10">
            <h3 className="font-headline text-xl md:text-2xl font-bold text-forest mb-8 text-center">
              This Is For You If...
            </h3>
            <ul className="space-y-5">
              {thisIsForYouChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-gold/30">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="font-body text-base md:text-lg text-forest/80 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disha Professional Photo */}
          <div className="max-w-sm mx-auto">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-3 bg-gradient-to-br from-gold/20 via-transparent to-wine/20 rounded-[2.5rem]" />

              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-light shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-gold/10" />
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-gold/50 rounded-tl-lg" />
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-gold/50 rounded-br-lg" />
                <Image
                  src="/images/DMK/Professional portrait of Disha - sophisticated,.jpg"
                  alt="Professional portrait of Disha Methi Khandelwal"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 384px"
                />
              </div>
            </div>
            <p className="font-accent text-base text-forest/70 text-center mt-5">
              Disha Methi Khandelwal - Your Transformation Architect
            </p>
          </div>
        </div>
      </section>

      {/* Curved divider */}
      <div className="relative h-16 md:h-24">
        <svg viewBox="0 0 1440 100" fill="none" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
          <path d="M0,100 C480,0 960,0 1440,100 L1440,0 L0,0 Z" fill="#F2EBD9" fillOpacity="0.5" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 4: THE COMPLETE TRANSFORMATION - 4 PILLARS (SCREEN 4)
          ========================================================================= */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 bg-gradient-to-b from-beige-light/50 via-beige-light/30 to-ivory">
        <DecorativeBlob className="w-72 h-72 top-1/4 -right-36" color="gold" />
        <DecorativeBlob className="w-64 h-64 bottom-1/4 -left-32" color="wine" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Section Headline */}
          <h2 className="font-headline text-2xl md:text-4xl lg:text-5xl font-bold text-forest text-center mb-4 leading-tight">
            Why Transform Works When Everything Else Stops at Your Body
          </h2>

          {/* Section Intro */}
          <p className="font-body text-base md:text-lg text-forest/75 text-center max-w-[680px] mx-auto mb-12 leading-relaxed">
            Most programs transform your body. Then life happens—stress,
            burnout, self-doubt—and the results evaporate. Transform rebuilds
            ALL of you, so the transformation lasts. Here&apos;s how:
          </p>

          {/* 4 Pillar Cards - 2x2 grid desktop, 1 column mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {pillars.map((pillar, idx) => (
              <PillarCard key={idx} pillar={pillar} index={idx} />
            ))}
          </div>

          {/* Transformation Gallery */}
          <div className="mt-16 md:mt-20">
            <TransformationGallery />
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* =========================================================================
          SECTION 5: HOW TRANSFORM WORKS - TIMELINE (SCREEN 5)
          ========================================================================= */}
      <section className="relative px-4 md:px-8 py-16 md:py-24">
        <DecorativeBlob className="w-80 h-80 top-0 left-1/4" color="beige" />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Section Headline */}
          <h2 className="font-headline text-2xl md:text-4xl lg:text-5xl font-bold text-forest text-center mb-4 leading-tight">
            Your Transformation Journey
          </h2>
          <p className="font-accent text-lg md:text-xl text-wine text-center mb-12">
            3 Phases to Unstoppable
          </p>

          {/* Timeline */}
          <div className="pl-0">
            {timelinePhases.map((phase, idx) => (
              <TimelinePhase
                key={idx}
                phase={phase}
                isLast={idx === timelinePhases.length - 1}
              />
            ))}
          </div>

          {/* Tertiary CTA */}
          <div className="text-center mt-12">
            <button
              onClick={scrollToCalendar}
              className="group border-2 border-gold text-gold hover:bg-gold hover:text-forest font-body text-lg font-semibold px-10 py-5 h-auto rounded-full transition-all duration-300 bg-transparent inline-flex items-center justify-center gap-2"
            >
              <span>I&apos;m Ready—Book My Strategy Call</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Curved divider */}
      <div className="relative h-16 md:h-24">
        <svg viewBox="0 0 1440 100" fill="none" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
          <path d="M0,100 C480,0 960,0 1440,100 L1440,0 L0,0 Z" fill="#F2EBD9" fillOpacity="0.5" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 6: FINAL PROOF + CTA (SCREEN 6)
          ========================================================================= */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 bg-gradient-to-b from-beige-light/50 to-ivory">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Transformation Showcase */}
          {transformationShowcase.map((client, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 shadow-xl border border-gold/10 mb-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Before/After placeholder */}
                <div className="w-full md:w-1/3">
                  <div className="aspect-square rounded-[1.5rem] bg-gradient-to-br from-beige to-beige-dark flex items-center justify-center shadow-inner">
                    <p className="text-forest/40 text-sm text-center px-4">
                      [Before/After Photos]
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-headline text-2xl md:text-3xl font-bold text-forest mb-3">
                    {client.name}
                  </h3>
                  <p className="font-body text-sm text-wine mb-4">
                    {client.profession}, {client.city}
                  </p>
                  <p className="font-accent text-lg md:text-xl text-forest/80 leading-relaxed mb-6">
                    &ldquo;{client.quote}&rdquo;
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {client.results.map((result, ridx) => (
                      <span
                        key={ridx}
                        className="bg-gradient-to-r from-gold/15 to-gold/10 text-forest text-sm font-body px-4 py-2 rounded-full border border-gold/20"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Disha's Final Message */}
          <div className="relative max-w-[720px] mx-auto mb-12">
            {/* Decorative frame */}
            <div className="absolute -inset-2 bg-gradient-to-br from-wine/20 via-transparent to-gold/20 rounded-[2.5rem]" />

            <div className="relative bg-gradient-to-br from-wine via-wine to-wine-light rounded-[2rem] p-10 md:p-12 text-ivory shadow-2xl overflow-hidden">
              {/* Inner decorations */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-ivory/5 rounded-full blur-2xl" />

              {/* Quote marks */}
              <div className="absolute top-6 left-6 text-6xl text-ivory/10 font-accent">&ldquo;</div>

              <div className="relative z-10">
                <p className="font-accent text-xl md:text-2xl leading-relaxed mb-6">
                  Here&apos;s what I know: You didn&apos;t find this page by
                  accident. You&apos;re here because something inside you is ready
                  to rise. Transform isn&apos;t for everyone. It&apos;s for women
                  who are done waiting, done settling, done being their own
                  obstacle.
                </p>
                <p className="font-accent text-xl md:text-2xl leading-relaxed mb-8">
                  If that&apos;s you—if you&apos;re ready to become hot and
                  unstoppable, not someday, but NOW—then let&apos;s begin. I&apos;ll
                  see you on our strategy call.
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-ivory/20 flex items-center justify-center ring-2 ring-gold/30">
                    <span className="text-3xl">👩🏻‍💼</span>
                  </div>
                  <div>
                    <p className="font-headline text-xl text-ivory">
                      Disha Methi Khandelwal
                    </p>
                    <p className="font-body text-sm text-ivory/70">
                      Founder, Glow Up Academy • Your Transformation Architect
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible FAQ Section */}
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

          {/* Final CTA */}
          <div
            id="final-cta"
            className="relative overflow-hidden"
          >
            {/* Decorative frame */}
            <div className="absolute -inset-1 bg-gradient-to-br from-gold/30 via-transparent to-wine/30 rounded-[2.5rem]" />

            <div className="relative bg-gradient-to-br from-forest via-forest to-forest-light rounded-[2rem] p-10 md:p-16 text-center shadow-2xl">
              {/* Inner decorations */}
              <div className="absolute top-0 left-1/4 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-wine/10 rounded-full blur-3xl" />

              {/* Corner accents */}
              <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-gold/30 rounded-br-2xl" />

              <div className="relative z-10">
                <h2 className="font-headline text-2xl md:text-4xl text-ivory mb-4 leading-tight">
                  Your Queens Are Waiting.
                  <br />
                  <span className="text-gold">Book Your Strategy Call Today.</span>
                </h2>
                <p className="font-body text-base md:text-lg text-ivory/70 mb-10 max-w-md mx-auto">
                  Limited to 5 Transform clients at a time. Disha&apos;s
                  calendar fills fast.
                </p>

                <Link
                  href="/book-call?program=transform"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-gold via-gold to-gold-light hover:from-gold-light hover:via-gold hover:to-gold text-forest font-body text-lg md:text-xl font-bold px-12 md:px-14 py-6 md:py-7 h-auto rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Book My 60-Min Strategy Call — ₹9,999
                </Link>

                {/* Payment + Booking Flow */}
                <div className="mt-12 bg-ivory/10 rounded-2xl p-8 border border-ivory/20">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">1</div>
                      <span className="text-ivory/80 font-body">Pay ₹9,999 via Razorpay</span>
                    </div>
                    <div className="hidden md:block text-gold">→</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">2</div>
                      <span className="text-ivory/80 font-body">Calendar unlocks to book your call</span>
                    </div>
                  </div>
                  <p className="text-ivory/50 text-sm font-body text-center">
                    [Razorpay Payment Button → On success, Calendly scheduling opens]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA visible={showStickyCTA} />

      {/* Add bottom padding on mobile to account for sticky CTA */}
      <div className="h-[80px] md:hidden" />

      <Footer />
    </div>
  );
}
