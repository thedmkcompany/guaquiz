"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Program } from "@/types";
import { formatPrice } from "@/lib/programs";
import {
  getProgramContent,
  getFullQuizPersonalization,
  ProgramContent,
  QuizAnswers,
} from "@/lib/results-data";
import { getQuizAnswers, migrateLegacyStorage, getQ1Answer } from "@/lib/lead-storage";
import {
  FeminineBlobs,
  FeminineDivider,
  FloatingDecor,
  FeminineHeader,
  FeminineBadge,
  FeminineCard,
  FeminineIcon,
} from "@/components/ui/feminine-decorations";
import { MobileLogoLoop } from "@/components/MobileLogoLoop";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import {
  Check,
  Lock,
  Sparkles,
  ArrowRight,
  Calendar,
  Instagram,
  Dumbbell,
  Crown,
  Wallet,
  Heart,
  Star,
} from "lucide-react";

interface EssentialsResultClientProps {
  program: Program;
}

// Icon mapping for pillars
const pillarIcons = {
  body: Dumbbell,
  beauty: Sparkles,
  finance: Wallet,
  confidence: Crown,
};

// Helper to render HTML strings (for italicized Essentials)
const renderHTML = (htmlString: string) => {
  return <span dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export function EssentialsResultClient({ program }: EssentialsResultClientProps) {
  const [quizAnswers] = useState<QuizAnswers>(() => {
    // Migrate any legacy sessionStorage data
    migrateLegacyStorage();

    // Get quiz answers from unified storage
    const storedAnswers = getQuizAnswers();
    if (storedAnswers) {
      return storedAnswers as QuizAnswers;
    } else {
      // Fallback to Q1 answer or default
      const q1 = getQ1Answer() || "q1-b";
      return { q1 };
    }
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const content: ProgramContent = getProgramContent(program.id);

  const personalization = useMemo(() => {
    return getFullQuizPersonalization(quizAnswers);
  }, [quizAnswers]);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const ctaHref = `/checkout?program=${program.slug}`;
  const heroSubheadline = content.heroSubheadlineTemplate
    .replace("{personalization}", personalization.heroSubheadline);
  const whyWorksIntro = content.whyWorksIntroTemplate
    .replace("{reason}", personalization.whyThisWorksReason);

  return (
    <>
      <main className="bg-gradient-pastel relative overflow-hidden">
        {/* Feminine decorative background */}
        <FeminineBlobs />
        <FloatingDecor />

        {/* HERO SECTION - Soft, inviting feminine design */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-24 lg:py-28">
            <div className="max-w-4xl mx-auto">
              {/* Badge with sparkles */}
              <div className="text-center mb-6 md:mb-8">
                <FeminineBadge>{content.badge}</FeminineBadge>
              </div>

              {/* Headline with elegant styling */}
              <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-forest leading-tight text-center mb-6 md:mb-8">
                {content.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-charcoal/75 text-center max-w-3xl mx-auto mb-10 md:mb-14 font-body leading-relaxed px-2">
                {renderHTML(heroSubheadline)}
              </p>

              {/* Hero Image with soft feminine frame */}
              <figure className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-float">
                {/* Soft decorative border */}
                <div className="absolute inset-0 rounded-[2.5rem] border-4 border-beige/30 z-10 pointer-events-none" />
                <Image
                  src="/images/DMK/Essentials Hero Disha.png"
                  alt={content.heroImageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-beige/20 via-transparent to-gold/10" />
              </figure>
            </div>
          </div>
        </section>

        {/* Mobile Logo Loop */}
        <MobileLogoLoop className="my-6" />

        <FeminineDivider />

        {/* PERSONALIZED INSIGHTS */}
        <section className="bg-beige-light/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-3xl mx-auto">
              <FeminineHeader
                eyebrow="Personalized for You"
                title="Why This is Perfect for You"
                subtitle="Based on your quiz answers, here's what we know about your transformation journey."
              />

              <div className="space-y-4">
                {/* Goal Focus */}
                <FeminineCard className="!p-5 md:!p-6">
                  <div className="flex items-start gap-4">
                    <FeminineIcon variant="gold" size="sm">
                      <Sparkles className="w-4 h-4" />
                    </FeminineIcon>
                    <div>
                      <h3 className="font-subheader font-semibold text-forest mb-1">
                        Your Goal
                      </h3>
                      <p className="text-sm md:text-base text-charcoal/75 font-body">
                        {personalization.goalFocus}
                      </p>
                    </div>
                  </div>
                </FeminineCard>

                {/* Rise Style */}
                <FeminineCard className="!p-5 md:!p-6">
                  <div className="flex items-start gap-4">
                    <FeminineIcon variant="wine" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </FeminineIcon>
                    <div>
                      <h3 className="font-subheader font-semibold text-forest mb-1">
                        How You Rise
                      </h3>
                      <p className="text-sm md:text-base text-charcoal/75 font-body">
                        {personalization.riseStyle}
                      </p>
                    </div>
                  </div>
                </FeminineCard>

                {/* Time Commitment */}
                <FeminineCard className="!p-5 md:!p-6">
                  <div className="flex items-start gap-4">
                    <FeminineIcon variant="forest" size="sm">
                      <Calendar className="w-4 h-4" />
                    </FeminineIcon>
                    <div>
                      <h3 className="font-subheader font-semibold text-forest mb-1">
                        Your Commitment
                      </h3>
                      <p className="text-sm md:text-base text-charcoal/75 font-body">
                        {personalization.timeCommitment}
                      </p>
                    </div>
                  </div>
                </FeminineCard>

                {/* History Acknowledgment */}
                <FeminineCard className="!p-5 md:!p-6">
                  <div className="flex items-start gap-4">
                    <FeminineIcon variant="beige" size="sm">
                      <Heart className="w-4 h-4 text-wine/70" />
                    </FeminineIcon>
                    <div>
                      <h3 className="font-subheader font-semibold text-forest mb-1">
                        Your Journey
                      </h3>
                      <p className="text-sm md:text-base text-charcoal/75 font-body">
                        {personalization.historyAcknowledgment}
                      </p>
                    </div>
                  </div>
                </FeminineCard>
              </div>
            </div>
          </div>
        </section>

        <FeminineDivider />

        {/* TRANSFORMATION JOURNEY - Feminine pillar cards */}
        <section className="bg-ivory/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-5xl mx-auto">
              <FeminineHeader
                eyebrow="Your Journey"
                title={content.journeySectionHeadline}
                subtitle={content.journeyIntro}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                {content.pillars.map((pillar, index) => {
                  const IconComponent = pillarIcons[pillar.icon];
                  return (
                    <FeminineCard key={index} className="flex flex-col h-full">
                      {/* Icon + Title */}
                      <div className="flex items-start gap-4 mb-5">
                        <FeminineIcon variant="gold" size="md">
                          <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                        </FeminineIcon>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] md:text-xs font-subheader uppercase tracking-wider text-gold-dark mb-1">
                            {pillar.title}
                          </p>
                          <h3 className="font-headline text-lg md:text-xl text-forest leading-tight">
                            {pillar.headline}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-charcoal/75 font-body mb-5 leading-relaxed flex-grow">
                        {pillar.description}
                      </p>

                      {/* Benefits with soft styling */}
                      <div className="bg-beige-light/50 rounded-2xl p-4 md:p-5 border border-beige/40 mt-auto">
                        <p className="text-xs md:text-sm font-subheader text-forest/70 mb-3 font-semibold flex items-center gap-2">
                          <Heart className="w-3 h-3 text-wine/60" />
                          What this means for you:
                        </p>
                        <ul className="space-y-1.5">
                          {pillar.benefits.map((benefit, i) => (
                            <li
                              key={i}
                              className="text-xs md:text-sm text-charcoal/70 font-body flex items-start gap-2"
                            >
                              <Star className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FeminineCard>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <FeminineDivider />

        {/* DISHA VALIDATION - Elegant feminine styling */}
        <section className="bg-beige-light/40 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start">
                {/* Portrait with soft feminine frame */}
                <figure className="lg:col-span-4">
                  <div className="relative aspect-[3/4] max-w-[280px] md:max-w-[320px] lg:max-w-none mx-auto">
                    {/* Decorative outer ring */}
                    <div className="absolute -inset-2 rounded-[2.5rem] border-2 border-gold/20" />
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-float">
                      <Image
                        src="/images/DMK/Disha Beige Blazer.png"
                        alt="Disha Methi Khandelwal - Founder, Glow Up Academy"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 33vw"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-beige-light/20 to-wine/5" />
                    </div>
                  </div>
                </figure>

                <div className="lg:col-span-8">
                  <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-6">
                    {content.dishaHeadline}
                  </h2>

                  <div className="space-y-4 md:space-y-5">
                    {content.dishaQuote.split("\n\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-sm md:text-base text-charcoal/75 font-body leading-relaxed"
                      >
                        {renderHTML(paragraph)}
                      </p>
                    ))}
                  </div>

                  {/* Signature with elegant styling */}
                  <div className="mt-8 md:mt-10 pt-6 border-t border-beige-dark/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-beige flex items-center justify-center">
                        <Heart className="w-5 h-5 text-wine/70" />
                      </div>
                      <div>
                        <p className="font-headline text-xl md:text-2xl text-forest">
                          - {content.dishaSignature || "Disha Methi Khandelwal"}
                        </p>
                        <p className="text-xs md:text-sm text-charcoal/60 font-body">
                          Founder, Glow Up Academy
                        </p>
                        <p className="text-[10px] md:text-xs text-charcoal/50 font-body mt-0.5">
                          {content.dishaCredentials ||
                            "Master's in Applied Finance | Certified Wellness Expert"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeminineDivider />

        {/* INVESTMENT - Feminine pricing card */}
        <section className="bg-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-lg mx-auto">
              {/* Elegant investment card */}
              <div className="relative">
                {/* Decorative background elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-wine/5 rounded-full blur-2xl" />

                <FeminineCard hover={false} className="relative z-10 p-8 md:p-10 lg:p-12">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest">
                        {content.investmentHeadline}
                      </h2>
                      <Sparkles className="w-4 h-4 text-gold" />
                    </div>

                    {/* Price with elegant presentation */}
                    <div className="my-8 md:my-10">
                      <p className="font-headline text-4xl sm:text-5xl md:text-6xl text-forest mb-2">
                        {formatPrice(program.price)}
                        <span className="text-lg md:text-xl font-body text-charcoal/50">
                          /month
                        </span>
                      </p>
                      <p className="text-xs md:text-sm text-charcoal/60 font-body">
                        {content.pricePerDay} - {content.priceComparison}
                      </p>
                    </div>

                    <p className="text-sm md:text-base text-charcoal/70 font-body mb-8 leading-relaxed">
                      {content.investmentDescription}
                    </p>

                    {/* Feminine CTA button */}
                    <Link
                      href={ctaHref}
                      className="btn-luxe w-full py-4 md:py-5 px-8 rounded-full font-subheader font-semibold text-base md:text-lg flex items-center justify-center gap-2 mb-8 shadow-float transition-all duration-300 hover:-translate-y-1"
                    >
                      {content.ctaText}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>

                    {/* Trust signals with feminine icons */}
                    <ul className="space-y-3 text-left mb-6">
                      {content.trustSignals.map((signal, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-xs md:text-sm text-charcoal/70 font-body"
                        >
                          <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-forest" />
                          </div>
                          {signal}
                        </li>
                      ))}
                    </ul>

                    <p className="text-xs md:text-sm text-charcoal/50 font-body">
                      Questions?{" "}
                      <Link
                        href="/contact"
                        className="text-forest hover:text-forest-dark inline underline"
                      >
                        Contact us
                      </Link>
                    </p>
                  </div>
                </FeminineCard>
              </div>
            </div>
          </div>
        </section>

        {/* WHY THIS WORKS */}
        <section className="bg-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-3xl mx-auto">
              <FeminineHeader
                eyebrow="The Method"
                title={content.whyWorksHeadline}
                subtitle={whyWorksIntro}
              />

              <div className="space-y-4 md:space-y-6">
                {content.whyWorksBenefits.map((benefit, index) => (
                  <FeminineCard key={index} className="!p-6 md:!p-8">
                    <div className="flex items-start gap-4 md:gap-5">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-headline text-lg md:text-xl text-gold-dark">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-subheader font-semibold text-forest text-sm md:text-base mb-2">
                          {benefit.headline}
                        </h3>
                        <p className="text-sm md:text-base text-charcoal/70 font-body leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </FeminineCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FeminineDivider />

        {/* TESTIMONIALS */}
        <section className="bg-ivory/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-5xl mx-auto">
              <FeminineHeader
                eyebrow="Real Stories"
                title={content.testimonialsHeadline}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                {content.testimonials.map((testimonial) => (
                  <FeminineCard key={testimonial.id} className="!p-6 md:!p-8">
                    <div className="flex flex-col items-center text-center h-full">
                      {/* Photo with elegant ring */}
                      <figure className="mb-5">
                        <div className="relative">
                          <div className="absolute -inset-1 rounded-full border border-gold/30" />
                          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-soft">
                            <Image
                              src={
                                testimonial.photoUrl ||
                                "/images/placeholder-avatar.jpg"
                              }
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-beige-light/20 to-wine/5 rounded-full" />
                          </div>
                        </div>
                      </figure>

                      {/* Quote */}
                      <blockquote className="text-sm md:text-base text-charcoal/75 font-body leading-relaxed mb-5 italic flex-grow">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>

                      {/* Attribution */}
                      <footer className="mt-auto">
                        <p className="font-subheader font-semibold text-forest text-sm md:text-base">
                          {testimonial.name}
                        </p>
                        <p className="text-xs md:text-sm text-charcoal/60 font-body">
                          {testimonial.role}, {testimonial.age} |{" "}
                          {testimonial.location}
                        </p>
                        <p className="text-[10px] md:text-xs text-gold-dark font-body mt-1 flex items-center justify-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {testimonial.membershipDuration}
                        </p>
                      </footer>
                    </div>
                  </FeminineCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FeminineDivider />

        {/* FAQ */}
        <section className="bg-beige-light/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-2xl mx-auto">
              <FeminineHeader eyebrow="Questions?" title={content.faqHeadline} />

              <div className="space-y-3">
                {content.faqs.map((faq, index) => (
                  <FAQAccordion
                    key={index}
                    faq={faq}
                    isExpanded={expandedFaq === index}
                    onToggle={() => toggleFaq(index)}
                    variant="feminine"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UPGRADE PATH */}
        {content.upgradePath && (
          <section className="bg-white/30 backdrop-blur-sm">
            <div className="container mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-16">
              <div className="max-w-xl mx-auto">
                <FeminineCard className="text-center !p-8 md:!p-10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <h3 className="font-headline text-lg md:text-xl text-forest">
                      {content.upgradePath.headline}
                    </h3>
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <p className="text-sm md:text-base text-charcoal/70 font-body mb-6 leading-relaxed">
                    {content.upgradePath.description}
                  </p>
                  <Link
                    href={content.upgradePath.ctaHref}
                    className="inline-flex items-center gap-2 border-2 border-wine text-wine px-6 py-3 rounded-full font-subheader font-medium text-sm hover:bg-wine hover:text-white transition-all duration-300"
                  >
                    {content.upgradePath.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-charcoal/50 font-body mt-4">
                    Or start with {program.name} and see where it takes you.
                  </p>
                </FeminineCard>
              </div>
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="bg-gradient-to-b from-forest to-forest-dark relative overflow-hidden">
          {/* Subtle gold accents */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-16 md:py-24 lg:py-28 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                <Sparkles className="w-5 h-5 text-gold" />
                <Sparkles className="w-4 h-4 text-gold" />
              </div>

              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6">
                {content.finalCtaHeadline}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/80 font-body mb-10">
                {content.finalCtaSubheadline}
              </p>

              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-charcoal font-subheader font-semibold py-4 md:py-5 px-12 md:px-14 rounded-full text-base md:text-lg transition-all duration-300 shadow-float hover:-translate-y-1 mb-8"
              >
                {content.finalCtaButtonText}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>

              <p className="text-white/60 text-xs md:text-sm mb-5">
                Questions before you commit?
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white font-body text-sm underline"
                >
                  Contact us
                </Link>
              </div>
              <p className="text-white/50 text-xs md:text-sm mt-10 font-body">
                {content.trustReminder}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-forest-dark">
        <div className="container mx-auto px-6 md:px-8 py-10 md:py-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-4 h-4 text-wine/60" />
            <p className="text-center text-white/60 font-body text-xs md:text-sm">
              Trusted by 2,500+ women across India and globally
            </p>
            <Heart className="w-4 h-4 text-wine/60" />
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-white/50 font-body mb-6">
            <Link href="/privacy" className="hover:text-white/80 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/80 transition-colors">
              Terms
            </Link>
            <Link href="/refund" className="hover:text-white/80 transition-colors">
              Refund
            </Link>
            <Link href="/about" className="hover:text-white/80 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-white/80 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center justify-center">
            <a
              href="https://instagram.com/_thedmk_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/80 flex items-center gap-2 text-xs md:text-sm transition-colors"
            >
              <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              @_thedmk_
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-white/40 text-[10px] md:text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure payments via Razorpay</span>
          </div>
        </div>
      </footer>
    </>
  );
}
