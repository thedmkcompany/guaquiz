"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Program } from "@/types";
import { getQuizPersonalization } from "@/lib/results-data";
import { WhatsAppButton } from "@/components/support/whatsapp-button";
import {
  Section,
  SectionHeader,
  FAQItem,
  BenefitCard,
  TimelineItem,
} from "@/components/results";
import {
  Check,
  Lock,
  Sparkles,
  ArrowRight,
  Instagram,
  Clock,
  Calendar,
  Play,
  Users,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

interface TrialResultClientProps {
  program: Program;
}

// Session times data
const sessionTimes = [
  { id: "sat-10", label: "Saturday, Dec 14 - 10:00 AM IST", date: "2024-12-14", time: "10:00" },
  { id: "sat-16", label: "Saturday, Dec 14 - 4:00 PM IST", date: "2024-12-14", time: "16:00" },
  { id: "sun-10", label: "Sunday, Dec 15 - 10:00 AM IST", date: "2024-12-15", time: "10:00" },
  { id: "sun-18", label: "Sunday, Dec 15 - 6:00 PM IST", date: "2024-12-15", time: "18:00" },
];

// Timeline experience data
const timelineExperience = [
  {
    timeRange: "0-15 MINUTES",
    headline: "THE 4-PILLAR FRAMEWORK",
    subheadline: "Discover Why Complete Transformation Requires More Than Fitness",
    description:
      "You'll learn why body transformation alone never lasts—and how the 4-pillar system (fitness, beauty, finance, confidence) creates unstoppable momentum. This is the \"aha moment\" that changes how you see transformation forever.",
    unlocks: [
      "Finally understand why willpower fails",
      "See the complete picture",
      "Know what's been missing from every program you've tried before",
    ],
  },
  {
    timeRange: "15-60 MINUTES",
    headline: "THE SIGNATURE DMK WORKOUT",
    subheadline: "Feel the Energy That Creates Consistency",
    description:
      "Experience Disha's signature high-energy workout—the same one that keeps women showing up day after day, not from guilt, but from joy. This isn't punishment. It's power. And you'll feel the difference immediately.",
    unlocks: [
      "Move your body in ways that feel good, not forced",
      "Experience the \"workout high\" that makes you crave movement",
      "Understand why 2,500+ women never miss a session",
    ],
  },
  {
    timeRange: "60-75 MINUTES",
    headline: "WHY THIS WORKS WHEN OTHERS DON'T",
    subheadline: "Learn the System Behind Lasting Transformation",
    description:
      "Discover the exact framework that makes transformation sustainable—not through extreme discipline, but through structure that feels luxurious. This is where science meets sisterhood, and where consistency becomes your new normal.",
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
      "We'll share how to join our ongoing transformation community at special trial pricing. No pressure. No tricks. Just an invitation to keep going if this experience showed you something you've been missing.",
    unlocks: [
      "Complete clarity on your next step",
      "Answers to every question",
      "The choice to commit—or not",
    ],
  },
];

// Why trial works benefits
const whyTrialWorksBenefits = [
  {
    headline: "EXPERIENCE BEFORE COMMITTING",
    description:
      "Stop wondering if \"this will work for me.\" Experience the complete transformation system—the workout, the energy, the framework—before deciding anything. No blind faith required.",
  },
  {
    headline: "FEEL THE ENERGY THAT CREATES CONSISTENCY",
    description:
      "You've tried motivation. It didn't last. What you need is structure + energy + community. This experience shows you what that actually feels like—and why 2,500+ women stay consistent.",
  },
  {
    headline: "SEE IF THIS IS YOUR MISSING PIECE",
    description:
      "Maybe you don't need another program. Maybe you need THIS program. By the end of 90 minutes, you'll know. And that clarity is worth far more than ₹499.",
  },
];

// Testimonials
const trialTestimonials = [
  {
    id: "trial-1",
    name: "Neha P.",
    location: "Hyderabad",
    role: "Software Engineer",
    age: 26,
    journey: "Trial → Full Member, 6 Months",
    quote:
      "I took the trial expecting another generic workout. Within 30 minutes, I understood why this is different. The energy, the structure, the complete approach—I joined the full program that day and haven't looked back. Six months later, I'm the most consistent I've ever been.",
  },
  {
    id: "trial-2",
    name: "Anjali K.",
    location: "Dubai",
    role: "Finance Professional",
    age: 29,
    journey: "Trial → Full Member, 4 Months",
    quote:
      "I've done every fitness program that exists. The trial showed me what I'd been missing: community, energy, and a framework that addresses all of me—not just my body. This is the first program I haven't quit.",
  },
];

// FAQs
const trialFaqs = [
  {
    question: "What if I can't make the scheduled time?",
    answer:
      "Choose another session date that works for you. We have multiple sessions each week to fit different schedules and time zones.",
  },
  {
    question: "Is there a replay if I miss part of it?",
    answer:
      "Yes. You'll have 48-hour replay access after your scheduled session. But we strongly recommend attending the scheduled time—the energy is different when you show up live.",
  },
  {
    question: "Will I be pressured to buy something?",
    answer:
      "No. We'll invite you to join our ongoing program with special trial pricing. We explain the option. You decide. That's it.",
  },
  {
    question: "What if I'm a complete beginner?",
    answer:
      "Perfect. This experience is designed for all levels. You'll modify movements to match your current fitness level. No judgment. Just progress.",
  },
  {
    question: "What happens if I love it and want to continue?",
    answer:
      "Amazing! You'll get special trial member pricing (₹500/month discount) if you join within 48 hours of your session. We'll email you all the details.",
  },
  {
    question: "Is this really worth ₹499?",
    answer:
      "You're not paying for 90 minutes. You're paying for clarity. By the end, you'll know exactly what you need to become unstoppable—and whether Glow Up Academy is it. That's priceless.",
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

export function TrialResultClient({ program }: TrialResultClientProps) {
  const [personalization, setPersonalization] = useState({
    heroSubheadline: "",
    whyThisWorksReason: "",
  });
  const [selectedSession, setSelectedSession] = useState(sessionTimes[0].id);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);

  // Get personalization from sessionStorage (set during quiz)
  useEffect(() => {
    const storedQ1Answer = sessionStorage.getItem("dmk_q1_answer");
    const p = getQuizPersonalization(storedQ1Answer || "q1-b");
    setPersonalization({
      heroSubheadline: p.heroSubheadline,
      whyThisWorksReason: p.whyThisWorksReason,
    });
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const selectedSessionData = sessionTimes.find((s) => s.id === selectedSession);

  return (
    <>
      {/* HEADER - Glass texture for sticky overlay */}
      <header className="bg-ivory/70 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-center">
            <Link href="/" className="font-headline text-lg md:text-xl text-forest">
              Glow Up Academy{" "}
              <span className="text-gold font-normal">by THEDMK</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-ivory">
        {/* PERSONALIZED HERO SECTION */}
        <section className="bg-gradient-to-b from-beige-light to-ivory">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="text-center mb-5 md:mb-7">
                <span className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark px-4 py-2 md:px-5 md:py-2.5 rounded-full font-subheader text-xs md:text-sm shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  Your Personalized Path
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-forest leading-tight text-center mb-5 md:mb-7">
                Experience the DMK Transformation—90 Minutes That Change Everything
              </h1>

              {/* Subheadline - Quiz Personalized */}
              <p className="text-base sm:text-lg md:text-xl text-charcoal/80 text-center max-w-3xl mx-auto mb-10 md:mb-12 font-body leading-relaxed px-2">
                You&apos;ve started and stopped before. This time is different. In this 90-minute transformation experience, you&apos;ll discover why 2,500+ women choose Glow Up Academy—and feel what &quot;hot and unstoppable&quot; really means.
              </p>

              {/* Hero Image */}
              <figure className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <Image
                  src="/images/programs/trial-hero.jpg"
                  alt="Dynamic workout scene with empowered women in movement"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-beige via-beige-light to-forest/20" />
                {/* Play indicator overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform cursor-pointer">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-forest ml-1" />
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </section>

        {/* THE 90-MINUTE EXPERIENCE SECTION */}
        <Section background="white" maxWidth="3xl">
          <SectionHeader
            title="This Isn't a Sales Pitch. It's a Complete Transformation Experience."
            subtitle="For 90 minutes, you'll experience the exact framework that's transformed 2,500+ Indian women—the same workouts, the same energy, the same system that keeps women consistent when everything else has failed."
          />

          {/* Timeline */}
          <div className="space-y-4 md:space-y-6">
            {timelineExperience.map((item, index) => (
              <TimelineItem
                key={index}
                timeRange={item.timeRange}
                headline={item.headline}
                subheadline={item.subheadline}
                description={item.description}
                unlocks={item.unlocks}
                isFirst={index === 0}
                isLast={index === timelineExperience.length - 1}
              />
            ))}
          </div>
        </Section>

        {/* CREATED BY DISHA SECTION */}
        <Section background="beige" maxWidth="5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
            {/* Disha Photo */}
            <figure className="lg:col-span-4">
              <div className="relative aspect-[3/4] max-w-[280px] md:max-w-[320px] lg:max-w-none mx-auto rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <Image
                  src="/images/disha-action.jpg"
                  alt="Disha mid-movement, leading with high energy and confidence"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 33vw"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-beige via-beige-light to-forest/20" />
              </div>
            </figure>

            {/* Content */}
            <div className="lg:col-span-8">
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-5 md:mb-7">
                The Framework Behind 2,500+ Transformations
              </h2>

              <div className="space-y-4 md:space-y-5 text-sm md:text-base text-charcoal/80 font-body leading-relaxed">
                <p>
                  In this 90-minute experience, you&apos;ll get the complete Glow Up Academy
                  framework—the same one I&apos;ve perfected over 5,000+ fitness sessions with
                  everyone from busy corporate professionals to NRIs across the globe.
                </p>
                <p className="font-semibold text-forest">
                  This isn&apos;t theory. It&apos;s not motivational fluff.
                </p>
                <p>
                  It&apos;s the proven system that&apos;s helped women go from &quot;I&apos;ll start Monday&quot; to
                  &quot;I haven&apos;t missed a day in 6 months.&quot;
                </p>
                <p>
                  You&apos;ll feel the energy that makes consistency addictive. You&apos;ll understand
                  the structure that makes transformation inevitable. And you&apos;ll know—by the
                  end—if this is the missing piece you&apos;ve been looking for.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-8 md:mt-10 pt-5 md:pt-7 border-t border-beige-dark/20">
                <p className="font-accent text-xl md:text-2xl text-forest mb-1">— Disha</p>
                <p className="text-xs md:text-sm text-charcoal/60 font-body">
                  Corporate Wellness Expert
                </p>
                <p className="text-[10px] md:text-xs text-charcoal/50 font-body mt-1">
                  5,000+ Sessions • 2,500+ Transformations
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* INVESTMENT SECTION */}
        <Section background="white" maxWidth="lg">
          <div className="bg-beige-dark/10 rounded-[2.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <div className="bg-gradient-to-b from-ivory to-beige-light rounded-[2rem] p-8 md:p-10 lg:p-12">
              <div className="text-center">
                <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-3">
                  90 Minutes. Complete Experience. One Decision.
                </h2>

                {/* Pricing */}
                <div className="my-8 md:my-10">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl md:text-3xl text-charcoal/40 line-through font-body">
                      ₹999
                    </span>
                    <span className="font-headline text-4xl sm:text-5xl md:text-6xl text-forest">
                      ₹499
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-charcoal/60 font-body">
                    One-time investment. No recurring charges. Complete access.
                  </p>
                </div>

                {/* What you're getting */}
                <p className="text-sm md:text-base text-charcoal/70 font-body mb-6 leading-relaxed max-w-md mx-auto">
                  <span className="font-semibold text-forest">Not a sample. Not a teaser.</span>{" "}
                  The full transformation experience—the same workout, the same framework, the
                  same energy that keeps 2,500+ women unstoppable.
                </p>

                {/* Session Selection */}
                <div className="mb-6 md:mb-8">
                  <label className="block text-xs md:text-sm font-subheader text-forest mb-3">
                    Choose Your Session Time:
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
                      className="w-full bg-white border-2 border-beige-dark/30 rounded-xl px-4 py-3 md:py-4 text-left font-body text-sm md:text-base text-forest flex items-center justify-between hover:border-gold transition-colors"
                    >
                      <span>{selectedSessionData?.label}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-forest/50 transition-transform ${
                          isSessionDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isSessionDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-beige-dark/20 overflow-hidden z-10">
                        {sessionTimes.map((session) => (
                          <button
                            key={session.id}
                            onClick={() => {
                              setSelectedSession(session.id);
                              setIsSessionDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left font-body text-sm md:text-base hover:bg-beige-light/50 transition-colors ${
                              selectedSession === session.id
                                ? "bg-gold/10 text-forest font-semibold"
                                : "text-charcoal/80"
                            }`}
                          >
                            {session.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/checkout?program=${program.slug}&session=${selectedSession}`}
                  className="btn-luxe w-full py-4 md:py-5 px-8 md:px-10 rounded-full font-subheader font-semibold text-base md:text-lg flex items-center justify-center gap-2 mb-6 md:mb-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.15)]"
                >
                  Reserve Your Spot
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>

                {/* Urgency */}
                <div className="bg-wine/5 rounded-xl p-4 mb-6 md:mb-8">
                  <div className="flex items-center justify-center gap-2 text-wine font-subheader text-sm md:text-base">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">Next Session: Saturday, December 14 at 10:00 AM IST</span>
                  </div>
                  <p className="text-xs md:text-sm text-charcoal/60 font-body mt-1">
                    Limited to 50 participants per session
                  </p>
                </div>

                {/* Trust Signals */}
                <ul className="space-y-2 md:space-y-3 text-left mb-6 md:mb-8">
                  <li className="flex items-center gap-3 text-xs md:text-sm text-charcoal/70 font-body">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-forest flex-shrink-0" />
                    Secure checkout via Razorpay
                  </li>
                  <li className="flex items-center gap-3 text-xs md:text-sm text-charcoal/70 font-body">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-forest flex-shrink-0" />
                    Instant access link after payment
                  </li>
                  <li className="flex items-center gap-3 text-xs md:text-sm text-charcoal/70 font-body">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-forest flex-shrink-0" />
                    48-hour replay access
                  </li>
                </ul>

                <p className="text-xs md:text-sm text-charcoal/50 font-body">
                  Questions?{" "}
                  <WhatsAppButton
                    variant="link"
                    message="Hi! I have a question about the Trial experience."
                    className="text-forest hover:text-forest-dark inline"
                  />
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* WHY TRIAL WORKS FOR YOU SECTION */}
        <Section background="beige" maxWidth="3xl">
          <SectionHeader
            title="Why This Is Perfect for You Right Now"
            subtitle="Based on your quiz, you've struggled with consistency and need to see what works before committing. That's exactly what Trial is designed for."
          />
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {whyTrialWorksBenefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                index={index}
                headline={benefit.headline}
                description={benefit.description}
              />
            ))}
          </div>
        </Section>

        {/* WHAT HAPPENS AFTER SECTION */}
        <Section background="white" maxWidth="3xl">
          <SectionHeader title="Radical Transparency: Here's What Happens Next" />

          <div className="bg-beige-light/50 rounded-[2rem] p-6 md:p-8 lg:p-10">
            <p className="font-subheader font-semibold text-forest text-base md:text-lg mb-4">
              We believe in honesty, not tricks.
            </p>

            <div className="space-y-4 text-sm md:text-base text-charcoal/80 font-body leading-relaxed">
              <p>
                At the end of the 90-minute experience, we&apos;ll invite you to join our ongoing
                transformation community (₹4,499/month) with a special trial member discount.
              </p>

              <div className="flex flex-wrap gap-3 md:gap-4 my-5">
                <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-forest font-semibold text-sm shadow-sm">
                  <Check className="w-4 h-4 text-gold" />
                  No auto-charge
                </span>
                <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-forest font-semibold text-sm shadow-sm">
                  <Check className="w-4 h-4 text-gold" />
                  No hidden fees
                </span>
                <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-forest font-semibold text-sm shadow-sm">
                  <Check className="w-4 h-4 text-gold" />
                  Your choice
                </span>
              </div>

              <p>
                Many trial participants join immediately because they finally found what&apos;s
                been missing. Some think about it for a few days. Some decide the trial was
                exactly what they needed right now.
              </p>

              <p className="font-semibold text-forest">
                All three are perfect. We just want you to experience what makes Glow Up Academy
                different—then you decide.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-beige-dark/20">
              <p className="text-sm text-charcoal/60 font-body">
                You&apos;ll have 48 hours after your session to decide, with special trial pricing
                only available during that window. But there&apos;s zero pressure. This is your
                transformation, your timeline, your choice.
              </p>
            </div>
          </div>
        </Section>

        {/* TRANSFORMATION PROOF SECTION */}
        <Section background="beige" maxWidth="4xl">
          <SectionHeader title="&quot;I Came Skeptical. Left Committed.&quot;" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {trialTestimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-beige-dark/10"
              >
                {/* Avatar placeholder */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <span className="text-white font-headline text-xl md:text-2xl">
                      {testimonial.name.charAt(0)}
                    </span>
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

                {/* Quote */}
                <blockquote className="text-sm md:text-base text-charcoal/80 font-body leading-relaxed mb-4">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Journey badge */}
                <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded-full">
                  <span className="text-xs md:text-sm font-subheader text-gold-dark font-semibold">
                    {testimonial.journey}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* WHAT TO EXPECT / PREPARATION SECTION */}
        <Section background="white" maxWidth="3xl">
          <SectionHeader title="How to Prepare for Your Session" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Before */}
            <div className="bg-beige-light/50 rounded-[1.5rem] p-5 md:p-6">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <span className="font-headline text-forest text-lg">1</span>
              </div>
              <h3 className="font-subheader font-semibold text-forest text-base mb-2">
                Before the Session
              </h3>
              <p className="text-sm text-charcoal/70 font-body leading-relaxed">
                You&apos;ll receive a confirmation email immediately after payment with your access
                link and everything you need to prepare. All you need is workout clothes, water,
                and an open mind.
              </p>
            </div>

            {/* During */}
            <div className="bg-beige-light/50 rounded-[1.5rem] p-5 md:p-6">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <span className="font-headline text-forest text-lg">2</span>
              </div>
              <h3 className="font-subheader font-semibold text-forest text-base mb-2">
                During the Session
              </h3>
              <p className="text-sm text-charcoal/70 font-body leading-relaxed">
                Show up ready to move. You&apos;ll join women from across India for this 90-minute
                transformation experience. Bring energy. Bring curiosity. Bring your whole self.
              </p>
            </div>

            {/* After */}
            <div className="bg-beige-light/50 rounded-[1.5rem] p-5 md:p-6">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <span className="font-headline text-forest text-lg">3</span>
              </div>
              <h3 className="font-subheader font-semibold text-forest text-base mb-2">
                After the Session
              </h3>
              <p className="text-sm text-charcoal/70 font-body leading-relaxed">
                You&apos;ll have 48 hours to decide if you want to continue with special trial
                member pricing. Check your email for next steps—we&apos;ll guide you through
                everything.
              </p>
            </div>
          </div>

          {/* What you need */}
          <div className="bg-forest rounded-[2rem] p-6 md:p-8 text-white">
            <h3 className="font-headline text-lg md:text-xl mb-5">What You Need:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {preparationItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm md:text-base">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-white/90 font-body">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/70 font-body border-t border-white/20 pt-5">
              <span className="font-semibold text-gold">NO GYM. NO EQUIPMENT. JUST YOU.</span>
            </p>
          </div>
        </Section>

        {/* FAQ SECTION */}
        <Section background="beige" maxWidth="2xl">
          <SectionHeader title="Everything You Need to Know" />
          <div className="space-y-2 md:space-y-3">
            {trialFaqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isExpanded={expandedFaq === index}
                onToggle={() => toggleFaq(index)}
              />
            ))}
          </div>
        </Section>

        {/* FINAL CTA SECTION */}
        <section className="bg-gradient-to-b from-forest to-forest-dark">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-5">
                90 Minutes to Discover What Hot &amp; Unstoppable Feels Like
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/80 font-body mb-8 md:mb-10">
                Stop wondering. Start experiencing.
              </p>

              {/* Session reminder */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 md:mb-8 inline-block">
                <p className="text-white/90 font-body text-sm md:text-base">
                  <span className="font-semibold">Selected:</span> {selectedSessionData?.label}
                </p>
              </div>

              <Link
                href={`/checkout?program=${program.slug}&session=${selectedSession}`}
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-charcoal font-subheader font-semibold py-4 md:py-5 px-10 md:px-12 rounded-full text-base md:text-lg transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.15)] transform hover:-translate-y-0.5 mb-6 md:mb-8"
              >
                Reserve My Spot
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>

              <p className="text-white/60 text-xs md:text-sm mb-4 md:mb-5">
                Questions first?
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-5 flex-wrap">
                <WhatsAppButton
                  variant="link"
                  message="Hi! I have questions about the Trial experience."
                  className="text-white/80 hover:text-white text-sm"
                />
                <span className="text-white/40 text-sm">Response within 2 hours</span>
              </div>

              <p className="text-white/50 text-xs md:text-sm mt-8 md:mt-10 font-body">
                2,500+ women transformed • 5,000+ sessions conducted • Featured in Telangana Today
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-forest-dark">
        <div className="container mx-auto px-6 md:px-8 py-8 md:py-10">
          <p className="text-center text-white/60 font-body text-xs md:text-sm mb-6 md:mb-8">
            Join the 2,500+ women who chose unstoppable
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-5 md:gap-7 text-xs md:text-sm text-white/50 font-body mb-6 md:mb-8">
            <Link href="/privacy" className="hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/80 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white/80 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center justify-center">
            <a
              href="https://instagram.com/thedmk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/80 flex items-center gap-2 text-xs md:text-sm transition-colors"
            >
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              @thedmk
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 md:gap-3 mt-6 md:mt-8 text-white/40 text-[10px] md:text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure payments via Razorpay</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <WhatsAppButton
        variant="fixed"
        message="Hi! I'm interested in the 90-minute Trial experience."
      />
    </>
  );
}
