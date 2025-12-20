"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Program } from "@/types";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Section } from "@/components/results";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { Footer } from "@/components/ui/footer";
import {
  Check,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  ShieldCheck,
  Heart,
  Star,
} from "lucide-react";
import { calculateWebinarSessionDate } from "@/lib/date-utils";
import type { WebinarSessionDateSelection } from "@/types";
import { getCDNUrl } from "@/lib/cdn";

// Lazy load MobileLogoLoop - below fold
const MobileLogoLoop = dynamic(
  () => import("@/components/MobileLogoLoop").then((m) => m.MobileLogoLoop),
  { ssr: true }
);

// Elegant decorative flourish component
const ElegantFlourish = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 20"
    className={`w-32 h-5 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 10C20 10 30 5 50 5C70 5 80 15 100 15C120 15 130 5 150 5C170 5 180 10 200 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
    <circle cx="100" cy="10" r="3" fill="currentColor" opacity="0.6" />
  </svg>
);

// Decorative leaf/petal accent
const FloralAccent = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    className={`w-8 h-8 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 5C20 5 25 15 25 20C25 25 22.5 30 20 35C17.5 30 15 25 15 20C15 15 20 5 20 5Z"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M5 20C5 20 15 15 20 15C25 15 35 20 35 20C30 22.5 25 25 20 25C15 25 5 20 5 20Z"
      fill="currentColor"
      opacity="0.15"
    />
  </svg>
);

interface WebinarResultClientProps {
  program: Program;
}

// Timeline experience data
const timelineExperience = [
  {
    timeRange: "0-15 MINUTES",
    headline: "THE 4-PILLAR FRAMEWORK",
    subheadline: "Discover Why Complete Transformation Requires More Than Fitness",
    description:
      "You'll learn why body transformation alone never lasts. And how the 4-pillar system (fitness, beauty, finance, confidence) creates unstoppable momentum. This is the \"aha moment\" that changes how you see transformation forever.",
    unlocks: [
      "Finally understand why willpower fails",
      "See the complete picture",
      "Know what's been missing from every program you've tried before",
    ],
  },
  {
    timeRange: "15-60 MINUTES",
    headline: "TheDMK's Signature Workout",
    subheadline: "Feel the Energy That Creates Consistency",
    description:
      "Experience Disha's signature high-energy workout-the same one that keeps women showing up day after day, not from guilt, but from joy. This isn't punishment. It's power. And you'll feel the difference immediately.",
    unlocks: [
      "Move your body in ways that feel good, not forced",
      "Experience the \"workout high\" that makes you crave movement",
      "Understand why 15,000+ women never miss a session",
    ],
  },
  {
    timeRange: "60-75 MINUTES",
    headline: "WHY THIS WORKS WHEN OTHERS DON'T",
    subheadline: "Learn the System Behind Lasting Transformation",
    description:
      "Discover the exact framework that makes transformation sustainable-not through extreme discipline, but through structure that feels luxurious. This is where science meets sisterhood, and where consistency becomes your new normal.",
    unlocks: [
      "See the path forward clearly",
      "Understand what you actually need (not what fitness influencers sell)",
      "Know exactly how to become the woman who doesn't quit",
    ],
  },
  {
    timeRange: "75-90 MINUTES",
    headline: "YOUR NEXT STEP + Q&A",
    subheadline: "Decide If You're Ready to Continue",
    description:
      "We'll share how to join our ongoing transformation community at special webinar pricing. No pressure. No tricks. Just an invitation to keep going if this experience showed you something you've been missing.",
    unlocks: [
      "Complete clarity on your next step",
      "Answers to every question",
      "The choice to commit... or not",
    ],
  },
];

// Why webinar works benefits
const whyWebinarWorksBenefits = [
  {
    headline: "EXPERIENCE BEFORE COMMITTING",
    description:
      "Stop wondering if \"this will work for me.\" Experience the complete transformation system - the workout, the energy, the framework before deciding anything. No blind faith required.",
  },
  {
    headline: "FEEL THE ENERGY THAT CREATES CONSISTENCY",
    description:
      "You've tried motivation. It didn't last. What you need is structure + energy + community. This experience shows you what that actually feels like and why 15,000+ women stay consistent.",
  },
  {
    headline: "SEE IF THIS IS YOUR MISSING PIECE",
    description:
      "Maybe you don't need another program. Maybe you need THIS program. By the end of 90 minutes, you'll know. And that clarity is worth far more than ₹499.",
  },
];

// Testimonials
const webinarTestimonials = [
  {
    id: "webinar-1",
    name: "Komal S.",
    location: "India",
    role: "Home Maker",
    age: 26,
    journey: "Webinar → Full Member, 6 Months",
    quote:
      "I took the webinar expecting another generic workout. Within 30 minutes, I understood why this is different. The energy, the structure, the complete approach-I joined the full program that day and haven't looked back. Six months later, I'm the most consistent I've ever been.",
    image: getCDNUrl("/images/Webinar/Komal S. .jpg"),
  },
  {
    id: "webinar-2",
    name: "Akancha S.",
    location: "Bangalore",
    role: "Youtuber",
    age: 29,
    journey: "Webinar → Transform Member, 4 Months",
    quote:
      "I've done every fitness program that exists. The webinar showed me what I'd been missing: energy, and a framework that addresses all of me, not just my body. This is the first program I haven't quit.",
    image: getCDNUrl("/images/Webinar/Akancha Sharma.jpg"),
  },
];

// FAQs
const webinarFaqs = [
  {
    question: "What if I can't make the scheduled time?",
    answer:
      "There is no rescheduling, so choose another session date that works for you. We have multiple sessions each week to fit different schedules and time zones.",
  },
  {
    question: "Is there a replay if I miss part of it?",
    answer:
      "Nope babe. We strongly recommend attending the scheduled time-the energy is different when you show up on the time you have decided!",
  },
  {
    question: "Will I be pressured to buy something?",
    answer:
      "No. We'll invite you to join our ongoing program with special webinar pricing. We explain the option. You decide. That's it.",
  },
  {
    question: "What if I'm a complete beginner?",
    answer:
      "Perfect. This experience is designed for all levels. You'll modify movements to match your current fitness level. No judgment. Just progress.",
  },
  {
    question: "What happens if I love it and want to continue?",
    answer:
      "Amazing! You'll get special webinar member pricing (₹500/month discount) if you join within 48 hours of your session. We'll email you all the details.",
  },
  {
    question: "Is this really worth ₹499?",
    answer:
      "You're not paying for 90 minutes. You're paying for clarity. By the end, you'll know exactly what you need to become unstoppable-and whether Glow Up Academy is it. That's priceless.",
  },
];

// Preparation items
const preparationItems = [
  "Workout clothes (comfortable, not restrictive)",
  "Water bottle",
  "Yoga mat (optional, but helpful)",
  "90 minutes of uninterrupted time",
  "An open mind",
];

export function WebinarResultClient({ program }: WebinarResultClientProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [webinarSessionDate, setWebinarSessionDate] = useState<WebinarSessionDateSelection | undefined>();

  // Calculate webinar session date on mount
  useEffect(() => {
    const selection = calculateWebinarSessionDate();
    console.log('[Webinar Result] Calculated session date:', selection);
    setWebinarSessionDate(selection);
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <main className="bg-gradient-pastel relative overflow-hidden">
        {/* Decorative background blobs */}
        <DecorativeBlobs />

        {/* PERSONALIZED HERO SECTION - Feminine Elegance */}
        <section className="relative">
          {/* Soft decorative curves */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-beige/20 to-transparent pointer-events-none" />
          <div className="absolute top-20 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 left-0 w-48 h-48 bg-wine/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-24 lg:py-28">
            <div className="max-w-4xl mx-auto">
              {/* Elegant Badge */}
              <div className="text-center mb-6 md:mb-8">
                <span className="inline-flex items-center gap-2.5 bg-gradient-to-r from-beige-light to-ivory px-5 py-2.5 md:px-6 md:py-3 rounded-full font-subheader text-xs md:text-sm border border-gold/20 shadow-[0_4px_24px_-4px_rgba(212,175,55,0.15)]">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold" />
                  <span className="text-forest">WEBINAR</span>
                  <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold/60" />
                </span>
              </div>

              {/* Flourish decoration */}
              <div className="flex justify-center mb-4">
                <ElegantFlourish className="text-gold" />
              </div>

              {/* Headline - Elegant Typography */}
              <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-forest leading-tight text-center mb-6 md:mb-8">
                <span className="block">Experience</span>
                <span className="block mt-1 md:mt-2">
                  <span className="text-wine">TheDMK Glow Up Framework</span>
                </span>
                <span className="block mt-1 md:mt-2 font-accent italic text-gold-dark text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                  90 Minutes That Changes Everything
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-charcoal/75 text-center max-w-3xl mx-auto mb-10 md:mb-14 font-body leading-relaxed px-2">
                You&apos;ve started and stopped before. This time is different. In this 90-minute transformation experience, you&apos;ll discover why <span className="font-semibold text-forest">15,000+ women</span> choose Glow Up Academy-and feel what <span className="font-accent italic text-wine">&quot;hot and unstoppable&quot;</span> really means.
              </p>

              {/* Hero Image - Elegant Frame */}
              <figure className="relative w-full aspect-[4/3] md:aspect-[16/9]">
                {/* Decorative frame border */}
                <div className="absolute -inset-3 md:-inset-4 rounded-[2.5rem] md:rounded-[3rem] border border-gold/10 bg-gradient-to-br from-beige/30 to-transparent" />
                <div className="absolute -inset-1.5 md:-inset-2 rounded-[2.25rem] md:rounded-[2.5rem] border border-beige/40" />

                <div className="relative w-full h-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.08)]">
                  <Image
                    src={getCDNUrl("/images/DMK/Disha City Background.png")}
                    alt="Disha against city backdrop"
                    fill
                    className="object-cover"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-beige/40 via-transparent to-forest/10" />
                </div>

                {/* Decorative corner accents */}
                <FloralAccent className="absolute -top-4 -left-4 text-gold rotate-45 opacity-60" />
                <FloralAccent className="absolute -bottom-4 -right-4 text-gold -rotate-45 opacity-60" />
              </figure>
            </div>
          </div>
        </section>

        {/* Mobile Logo Loop - Below Hero */}
        <MobileLogoLoop className="my-4" />

        {/* THE 90-MINUTE EXPERIENCE SECTION - Feminine Elegance */}
        <Section background="white" maxWidth="3xl">
          {/* Elegant section intro */}
          <div className="text-center mb-10 md:mb-14">
            <div className="flex justify-center mb-4">
              <ElegantFlourish className="text-wine/50" />
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-4 md:mb-5">
              This Isn&apos;t a Sales Pitch.
              <span className="block font-accent italic text-wine mt-1">It&apos;s a Complete Transformation Experience.</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-charcoal/70 max-w-2xl mx-auto font-body leading-relaxed">
              For 90 minutes, you&apos;ll experience the exact framework that&apos;s transformed <span className="font-semibold text-forest">15,000+ women</span> across the globe. The same workouts, the same energy, the same system that keeps women consistent when everything else has failed.
            </p>
            <div className="flex justify-center mt-5">
              <ElegantFlourish className="text-wine/50 rotate-180" />
            </div>
          </div>

          {/* Elegant Timeline */}
          <div className="relative">
            {/* Decorative vertical line with dots */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-beige to-gold/40" />

            <div className="space-y-6 md:space-y-8">
              {timelineExperience.map((item, index) => (
                <div key={index} className="relative pl-12 md:pl-16">
                  {/* Elegant dot marker */}
                  <div className="absolute left-2.5 md:left-4 top-4 w-3 h-3 md:w-4 md:h-4">
                    <div className="absolute inset-0 bg-gold/20 rounded-full animate-pulse" />
                    <div className="absolute inset-0.5 bg-white rounded-full border-2 border-gold" />
                  </div>

                  {/* Card with elegant borders */}
                  <article className="relative bg-gradient-to-br from-white to-ivory rounded-[1.75rem] p-5 md:p-7 border border-beige/40 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.06)] transition-shadow">
                    {/* Time badge */}
                    <span className="inline-block text-[10px] md:text-xs font-subheader text-gold-dark tracking-wider mb-2 md:mb-3 bg-gold/10 px-3 py-1 rounded-full">
                      {item.timeRange}
                    </span>

                    <h3 className="font-headline text-base md:text-lg text-forest mb-1">
                      {item.headline}
                    </h3>
                    <p className="font-accent italic text-wine/80 text-sm md:text-base mb-3 md:mb-4">
                      {item.subheadline}
                    </p>
                    <p className="text-sm text-charcoal/70 font-body leading-relaxed mb-4 md:mb-5">
                      {item.description}
                    </p>

                    {/* Unlocks list with elegant styling */}
                    <div className="border-t border-beige/50 pt-4">
                      <p className="text-xs font-subheader text-forest/60 uppercase tracking-wider mb-3">
                        You&apos;ll unlock
                      </p>
                      <ul className="space-y-2">
                        {item.unlocks.map((unlock, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-charcoal/70 font-body">
                            <Heart className="w-3.5 h-3.5 text-wine/60 flex-shrink-0 mt-0.5" />
                            {unlock}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* CREATED BY DISHA SECTION - Elegant Feminine Design */}
        <Section background="beige" maxWidth="5xl">
          <div className="relative">
            {/* Decorative elements */}
            <FloralAccent className="absolute -top-8 right-0 text-gold opacity-30 w-16 h-16 hidden lg:block" />
            <FloralAccent className="absolute -bottom-8 left-0 text-wine opacity-20 w-12 h-12 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center">
              {/* Disha Photo - Elegant Frame */}
              <figure className="lg:col-span-5">
                <div className="relative max-w-[300px] md:max-w-[340px] lg:max-w-none mx-auto">
                  {/* Decorative outer frame */}
                  <div className="absolute -inset-3 md:-inset-4 rounded-[2.5rem] border border-gold/15 bg-gradient-to-br from-gold/5 to-transparent" />

                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.08)] border-2 border-white/60">
                    <Image
                      src={getCDNUrl("/images/DMK/Disha Wine Blazer.png")}
                      alt="Disha in elegant wine blazer, corporate wellness expert"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 300px, (max-width: 1024px) 340px, 40vw"
                      loading="lazy"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/20 via-transparent to-beige/10" />
                  </div>

                  {/* Elegant corner accent */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </figure>

              {/* Content */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-5">
                  <ElegantFlourish className="text-gold w-24" />
                </div>

                <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-2">
                  The Framework Behind
                </h2>
                <p className="font-accent italic text-wine text-lg md:text-xl mb-6 md:mb-8">
                  15,000+ Transformations
                </p>

                <div className="space-y-4 md:space-y-5 text-sm md:text-base text-charcoal/75 font-body leading-relaxed">
                  <p>
                    In this 90-minute experience, you&apos;ll get the complete Glow Up Academy
                    framework-the same one I&apos;ve perfected over <span className="font-semibold text-forest">5,000+ fitness sessions</span> with
                    everyone from busy corporate professionals to NRIs across the globe.
                  </p>
                  <p className="bg-white/60 rounded-xl p-4 border-l-4 border-gold font-medium text-forest">
                    This isn&apos;t theory. It&apos;s not motivational fluff.
                  </p>
                  <p>
                    It&apos;s the proven system that&apos;s helped women go from <span className="font-accent italic">&quot;I&apos;ll start Monday&quot;</span> to
                    <span className="font-accent italic text-wine"> &quot;I haven&apos;t missed a day in 6 months.&quot;</span>
                  </p>
                  <p>
                    You&apos;ll feel the energy that makes consistency addictive. You&apos;ll understand
                    the structure that makes transformation inevitable. And you&apos;ll know-by the
                    end-if this is the missing piece you&apos;ve been looking for.
                  </p>
                </div>

                {/* Elegant Signature */}
                <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gold/20">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold/30 shadow-lg">
                      <Image
                        src={getCDNUrl("/images/DMK/Disha Wine Blazer.png")}
                        alt="Disha"
                        fill
                        className="object-cover object-top"
                        sizes="56px"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="font-accent text-xl md:text-2xl text-forest">- Disha</p>
                      <p className="text-xs md:text-sm text-charcoal/60 font-body">
                        Glow Up Expert
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs text-charcoal/50 font-body bg-white/50 px-3 py-1.5 rounded-full">
                      <Star className="w-3 h-3 text-gold" />
                      5,000+ Sessions
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-charcoal/50 font-body bg-white/50 px-3 py-1.5 rounded-full">
                      <Heart className="w-3 h-3 text-wine/60" />
                      15,000+ Transformations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* INVESTMENT SECTION - Elegant Feminine Design */}
        <Section background="white" maxWidth="lg">
          <div className="relative">
            {/* Decorative accents */}
            <FloralAccent className="absolute -top-6 -left-6 text-gold opacity-20 w-20 h-20 hidden md:block" />
            <FloralAccent className="absolute -bottom-6 -right-6 text-wine opacity-15 w-16 h-16 hidden md:block" />

            {/* Elegant outer frame */}
            <div className="absolute -inset-2 md:-inset-3 rounded-[3rem] border border-gold/10 bg-gradient-to-br from-gold/5 to-transparent" />

            <div className="relative bg-gradient-to-b from-ivory via-beige-light to-ivory rounded-[2.5rem] p-8 md:p-10 lg:p-12 border border-beige/40 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.06)]">
              <div className="text-center">
                {/* Flourish */}
                <div className="flex justify-center mb-5">
                  <ElegantFlourish className="text-gold" />
                </div>

                <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-2">
                  90 Minutes. Complete Experience.
                </h2>
                <p className="font-accent italic text-wine text-base md:text-lg mb-8 md:mb-10">
                  One Decision That Changes Everything.
                </p>

                {/* Elegant Pricing */}
                <div className="my-8 md:my-10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gold/10 rounded-full blur-xl" />
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-xl md:text-2xl text-charcoal/35 line-through font-body">
                        ₹999
                      </span>
                      <span className="font-headline text-5xl sm:text-6xl md:text-7xl text-forest">
                        ₹499
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-gold/15 px-4 py-1.5 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span className="text-xs md:text-sm text-gold-dark font-subheader">
                        Limited Time Offer
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-charcoal/60 font-body mt-4">
                    One-time investment. No recurring charges. Complete access.
                  </p>
                </div>

                {/* What you're getting - Elegant quote style */}
                <div className="bg-white/70 rounded-2xl p-5 mb-8 border border-beige/30">
                  <p className="text-sm md:text-base text-charcoal/75 font-body leading-relaxed">
                    <span className="font-semibold text-forest">Not a sample. Not a teaser.</span>{" "}
                    The full transformation experience-the same workout, the same framework, the
                    same energy that keeps <span className="font-accent italic text-wine">15,000+ women unstoppable</span>.
                  </p>
                </div>

                {/* Automatic Session Display */}
                {webinarSessionDate && (
                  <div className="mb-8 md:mb-10">
                    <label className="flex items-center justify-center gap-2 text-xs md:text-sm font-subheader text-forest mb-4">
                      <Calendar className="w-4 h-4 text-gold" />
                      Your Live Session
                    </label>
                    <div className="w-full bg-white border-2 border-wine/30 rounded-2xl px-5 py-4 md:py-5 font-body text-sm md:text-base text-forest flex items-center justify-center gap-2 shadow-sm">
                      <Clock className="w-4 h-4 text-wine/60" />
                      <span className="font-semibold">{webinarSessionDate.displayString}</span>
                    </div>
                    <p className="text-xs text-charcoal/60 font-body mt-3 text-center">
                      Join link will be sent to your email 24 hours before the session
                    </p>
                  </div>
                )}

                {/* Elegant CTA Button */}
                <Link
                  href={`/checkout?program=${program.slug}`}
                  className="group relative w-full py-5 md:py-6 px-8 md:px-10 rounded-full font-subheader font-semibold text-base md:text-lg flex items-center justify-center gap-3 mb-8 md:mb-10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-wine via-wine-light to-wine transition-all group-hover:from-wine-dark group-hover:via-wine group-hover:to-wine-dark" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <span className="relative text-white flex items-center gap-2">
                    Reserve Your Spot
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                {/* Elegant Trust Signals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <div className="flex items-center gap-2.5 bg-white/60 rounded-xl p-3 border border-beige/30">
                    <ShieldCheck className="w-5 h-5 text-forest flex-shrink-0" />
                    <span className="text-xs text-charcoal/70 font-body">Secure Razorpay</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/60 rounded-xl p-3 border border-beige/30">
                    <Check className="w-5 h-5 text-forest flex-shrink-0" />
                    <span className="text-xs text-charcoal/70 font-body">Instant Access</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/60 rounded-xl p-3 border border-beige/30">
                    <Clock className="w-5 h-5 text-forest flex-shrink-0" />
                    <span className="text-xs text-charcoal/70 font-body">48hr Replay</span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-charcoal/50 font-body">
                  Questions? Contact us via Instagram{" "}
                  <a
                    href="https://instagram.com/_thedmk_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wine hover:text-wine-dark inline font-medium underline"
                  >
                    @_thedmk_
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* WHY TRIAL WORKS FOR YOU SECTION - Elegant Feminine */}
        <Section background="beige" maxWidth="3xl">
          <div className="text-center mb-10 md:mb-14">
            <div className="flex justify-center mb-4">
              <ElegantFlourish className="text-gold" />
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-3">
              Why This Is Perfect
            </h2>
            <p className="font-accent italic text-wine text-lg md:text-xl mb-4">
              For You Right Now
            </p>
            <p className="text-sm sm:text-base text-charcoal/70 max-w-2xl mx-auto font-body leading-relaxed">
              Based on your quiz, you&apos;ve struggled with consistency and need to see what works before committing. <span className="font-semibold text-forest">That&apos;s exactly what Webinar is designed for.</span>
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {whyWebinarWorksBenefits.map((benefit, index) => (
              <article
                key={index}
                className="relative bg-gradient-to-br from-white to-ivory rounded-[1.75rem] p-6 md:p-8 border border-beige/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.06)] transition-all group"
              >
                {/* Elegant number badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-lg">
                  <span className="font-headline text-white text-sm md:text-base">{index + 1}</span>
                </div>

                <div className="pl-6 md:pl-8">
                  <h3 className="font-headline text-base md:text-lg text-forest mb-2 group-hover:text-wine transition-colors">
                    {benefit.headline}
                  </h3>
                  <p className="text-sm md:text-base text-charcoal/70 font-body leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative heart on hover */}
                <Heart className="absolute bottom-4 right-4 w-4 h-4 text-wine/0 group-hover:text-wine/30 transition-colors" />
              </article>
            ))}
          </div>
        </Section>

        {/* WHAT HAPPENS AFTER SECTION - Elegant Feminine */}
        <Section background="white" maxWidth="3xl">
          <div className="text-center mb-8 md:mb-10">
            <div className="flex justify-center mb-4">
              <ElegantFlourish className="text-wine/40" />
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest">
              Radical Transparency
            </h2>
            <p className="font-accent italic text-wine text-base md:text-lg mt-2">
              Here&apos;s What Happens Next
            </p>
          </div>

          <div className="relative">
            {/* Decorative frame */}
            <div className="absolute -inset-2 rounded-[2.5rem] border border-gold/10 bg-gradient-to-br from-beige/20 to-transparent" />

            <div className="relative bg-gradient-to-br from-beige-light/80 to-ivory rounded-[2rem] p-6 md:p-8 lg:p-10 border border-beige/40">
              <div className="flex items-center gap-3 mb-5">
                <Heart className="w-5 h-5 text-wine/60" />
                <p className="font-subheader font-semibold text-forest text-base md:text-lg">
                  We believe in honesty, not tricks.
                </p>
              </div>

              <div className="space-y-4 text-sm md:text-base text-charcoal/75 font-body leading-relaxed">
                <p>
                  At the end of the 90-minute experience, we&apos;ll invite you to join our ongoing
                  transformation community <span className="font-semibold text-forest">(₹4,499/month)</span> with a special webinar member discount.
                </p>

                <div className="flex flex-wrap gap-3 md:gap-4 my-6">
                  <span className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full text-forest font-semibold text-sm shadow-sm border border-gold/15">
                    <Check className="w-4 h-4 text-gold" />
                    No auto-charge
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full text-forest font-semibold text-sm shadow-sm border border-gold/15">
                    <Check className="w-4 h-4 text-gold" />
                    No hidden fees
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full text-forest font-semibold text-sm shadow-sm border border-gold/15">
                    <Check className="w-4 h-4 text-gold" />
                    Your choice
                  </span>
                </div>

                <p>
                  Many webinar participants join immediately because they finally found what&apos;s
                  been missing. Some think about it for a few days. Some decide the webinar was
                  exactly what they needed right now.
                </p>

                <p className="bg-white/70 rounded-xl p-4 border-l-4 border-wine font-medium text-forest">
                  All three are perfect. We just want you to experience what makes Glow Up Academy
                  different-then you decide.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gold/15">
                <p className="text-sm text-charcoal/60 font-body font-accent italic">
                  You&apos;ll have 48 hours after your session to decide, with special webinar pricing
                  only available during that window. But there&apos;s zero pressure. <span className="text-wine">This is your
                  transformation, your timeline, your choice.</span>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* TRANSFORMATION PROOF SECTION - Elegant Feminine */}
        <Section background="beige" maxWidth="4xl">
          <div className="text-center mb-10 md:mb-14">
            <div className="flex justify-center mb-4">
              <ElegantFlourish className="text-gold" />
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-2">
              &quot;I Came Skeptical.
            </h2>
            <p className="font-accent italic text-wine text-lg md:text-xl">
              Left Committed.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {webinarTestimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="relative group"
              >
                {/* Elegant outer frame */}
                <div className="absolute -inset-2 rounded-[2.5rem] border border-gold/10 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative bg-gradient-to-br from-white to-ivory rounded-[2rem] p-6 md:p-8 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.05)] border border-beige/40 group-hover:shadow-[0_16px_50px_-8px_rgba(0,0,0,0.08)] transition-shadow">
                  {/* Decorative quote mark */}
                  <div className="absolute top-4 right-4 text-6xl font-accent text-gold/10 leading-none">
                    &ldquo;
                  </div>

                  {/* Avatar with elegant styling */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-gold to-gold-dark rounded-full opacity-20" />
                      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 56px, 64px"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-subheader font-semibold text-forest text-base md:text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-xs md:text-sm text-charcoal/60 font-body">
                        {testimonial.location} • {testimonial.role}, {testimonial.age}
                      </p>
                    </div>
                  </div>

                  {/* Quote with elegant styling */}
                  <blockquote className="text-sm md:text-base text-charcoal/75 font-body leading-relaxed mb-5 relative z-10">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>

                  {/* Elegant journey badge */}
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-wine/60" />
                    <span className="text-xs md:text-sm font-accent italic text-wine">
                      {testimonial.journey}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* WHAT TO EXPECT / PREPARATION SECTION - Elegant Feminine */}
        <Section background="white" maxWidth="3xl">
          <div className="text-center mb-10 md:mb-14">
            <div className="flex justify-center mb-4">
              <ElegantFlourish className="text-gold" />
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest">
              How to Prepare
            </h2>
            <p className="font-accent italic text-wine text-base md:text-lg mt-2">
              For Your Transformation Session
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
            {/* Before */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-beige-light/80 to-ivory rounded-[1.75rem] p-6 md:p-7 border border-beige/40 h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mb-5 shadow-lg">
                  <span className="font-headline text-white text-lg">1</span>
                </div>
                <h3 className="font-subheader font-semibold text-forest text-base md:text-lg mb-3">
                  Before the Session
                </h3>
                <p className="text-sm text-charcoal/70 font-body leading-relaxed">
                  You&apos;ll receive a confirmation email immediately after payment with your access
                  link and everything you need. All you need is <span className="font-accent italic text-wine">workout clothes, water,
                  and an open mind.</span>
                </p>
              </div>
            </div>

            {/* During */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-wine/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-beige-light/80 to-ivory rounded-[1.75rem] p-6 md:p-7 border border-beige/40 h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wine to-wine-light flex items-center justify-center mb-5 shadow-lg">
                  <span className="font-headline text-white text-lg">2</span>
                </div>
                <h3 className="font-subheader font-semibold text-forest text-base md:text-lg mb-3">
                  During the Session
                </h3>
                <p className="text-sm text-charcoal/70 font-body leading-relaxed">
                  Show up ready to move. You&apos;ll join women from across India for this 90-minute
                  transformation experience. <span className="font-accent italic text-wine">Bring energy. Bring curiosity. Bring your whole self.</span>
                </p>
              </div>
            </div>

            {/* After */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-beige-light/80 to-ivory rounded-[1.75rem] p-6 md:p-7 border border-beige/40 h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mb-5 shadow-lg">
                  <span className="font-headline text-white text-lg">3</span>
                </div>
                <h3 className="font-subheader font-semibold text-forest text-base md:text-lg mb-3">
                  After the Session
                </h3>
                <p className="text-sm text-charcoal/70 font-body leading-relaxed">
                  You&apos;ll have 48 hours to decide if you want to continue with special webinar
                  member pricing. <span className="font-accent italic text-wine">Check your email for next steps-we&apos;ll guide you through
                  everything.</span>
                </p>
              </div>
            </div>
          </div>

          {/* What you need - Elegant Card */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-br from-gold/10 to-transparent" />
            <div className="relative bg-gradient-to-br from-forest to-forest-dark rounded-[2rem] p-7 md:p-9 text-white overflow-hidden">
              {/* Decorative elements */}
              <FloralAccent className="absolute top-4 right-4 text-gold/20 w-20 h-20" />
              <FloralAccent className="absolute bottom-4 left-4 text-gold/10 w-16 h-16 rotate-180" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-5 h-5 text-gold" />
                  <h3 className="font-headline text-lg md:text-xl">What You Need:</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {preparationItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm md:text-base">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <span className="text-white/90 font-body">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 pt-5 border-t border-white/10">
                  <p className="text-sm text-white/80 font-accent italic flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-gold font-subheader not-italic">NO GYM. NO EQUIPMENT.</span>
                    <span>Just you.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ SECTION - Elegant Feminine */}
        <Section background="beige" maxWidth="2xl">
          <div className="text-center mb-10 md:mb-12">
            <div className="flex justify-center mb-4">
              <ElegantFlourish className="text-gold" />
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest">
              Everything You Need
            </h2>
            <p className="font-accent italic text-wine text-base md:text-lg mt-2">
              To Know
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {webinarFaqs.map((faq, index) => (
              <FAQAccordion
                key={index}
                faq={faq}
                isExpanded={expandedFaq === index}
                onToggle={() => toggleFaq(index)}
                variant="feminine"
              />
            ))}
          </div>
        </Section>

        {/* FINAL CTA SECTION - Elegant Feminine */}
        <section className="relative bg-gradient-to-b from-forest via-forest-dark to-forest-dark overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-beige/5 to-transparent" />
          <FloralAccent className="absolute top-20 right-10 text-gold/10 w-32 h-32 hidden lg:block" />
          <FloralAccent className="absolute bottom-20 left-10 text-gold/10 w-24 h-24 hidden lg:block rotate-180" />

          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-16 md:py-24 lg:py-28 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              {/* Elegant flourish */}
              <div className="flex justify-center mb-6">
                <ElegantFlourish className="text-gold/60" />
              </div>

              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 md:mb-4">
                90 Minutes to Discover
              </h2>
              <p className="font-accent italic text-gold text-xl sm:text-2xl md:text-3xl mb-6 md:mb-8">
                What Hot &amp; Unstoppable Feels Like
              </p>
              <p className="text-sm md:text-base lg:text-lg text-white/70 font-body mb-10 md:mb-12">
                Stop wondering. <span className="font-accent italic text-gold/90">Start experiencing.</span>
              </p>

              {/* Elegant session reminder */}
              {webinarSessionDate && (
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 md:mb-10 border border-gold/20">
                  <Heart className="w-4 h-4 text-gold" />
                  <p className="text-white/90 font-body text-sm md:text-base">
                    <span className="font-semibold text-gold">Your Session:</span> {webinarSessionDate.displayString}
                  </p>
                </div>
              )}

              {/* Elegant CTA Button */}
              <div className="mb-8 md:mb-10">
                <Link
                  href={`/checkout?program=${program.slug}`}
                  className="group relative inline-flex items-center justify-center gap-3 py-5 md:py-6 px-12 md:px-16 rounded-full text-base md:text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold transition-all group-hover:from-gold-light group-hover:via-gold group-hover:to-gold-light" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <span className="relative font-subheader font-semibold text-charcoal flex items-center gap-2">
                    Reserve My Spot
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Questions */}
              <p className="text-white/50 text-xs md:text-sm mb-4 font-accent italic">
                Questions? Reach out via Instagram{" "}
                <a
                  href="https://instagram.com/_thedmk_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 hover:text-gold font-medium underline"
                >
                  @_thedmk_
                </a>
              </p>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
                <span className="inline-flex items-center gap-2 text-white/40 text-xs md:text-sm">
                  <Heart className="w-3.5 h-3.5 text-wine/60" />
                  15,000+ transformed
                </span>
                <span className="inline-flex items-center gap-2 text-white/40 text-xs md:text-sm">
                  <Star className="w-3.5 h-3.5 text-gold/60" />
                  5,000+ sessions
                </span>
                <span className="inline-flex items-center gap-2 text-white/40 text-xs md:text-sm">
                  <Sparkles className="w-3.5 h-3.5 text-gold/60" />
                  Featured in Telangana Today
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
