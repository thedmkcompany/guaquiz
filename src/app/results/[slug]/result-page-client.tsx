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
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Footer } from "@/components/ui/footer";
import {
  Section,
  SectionHeader,
  PillarCard,
  TestimonialCard,
  FAQItem,
  BenefitCard,
} from "@/components/results";
import { MobileLogoLoop } from "@/components/MobileLogoLoop";
import {
  Check,
  Lock,
  Sparkles,
  ArrowRight,
  Calendar,
  Instagram,
} from "lucide-react";

interface ResultPageClientProps {
  program: Program;
}

export function ResultPageClient({ program }: ResultPageClientProps) {
  // Store quiz answers for personalization
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

  const isHighTicket = program.requiresCall;
  const content: ProgramContent = getProgramContent(program.id);

  // Derive full personalization from all quiz answers
  const personalization = useMemo(() => {
    return getFullQuizPersonalization(quizAnswers);
  }, [quizAnswers]);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const ctaHref = isHighTicket
    ? `/book-call?program=${program.slug}`
    : `/checkout?program=${program.slug}`;

  // Build dynamic text with program-specific personalization
  const heroSubheadline = content.heroSubheadlineTemplate
    .replace("{personalization}", personalization.heroSubheadline)
    .replace("{webinarPersonalization}", personalization.webinarHeroSubheadline);
  const whyWorksIntro = content.whyWorksIntroTemplate
    .replace("{reason}", personalization.whyThisWorksReason)
    .replace("{webinarReason}", personalization.webinarWhyThisWorksReason);

  return (
    <>
      <main className="bg-gradient-pastel relative overflow-hidden">
        {/* Decorative background blobs - Global for results page */}
        <DecorativeBlobs />

        {/* HERO SECTION - Enhanced with glass effects */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-5 md:mb-7">
                <div className="glass-card rounded-full inline-flex shadow-soft border border-gold/20 flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-gold" />
                  <span className="text-gold-dark font-subheader text-xs md:text-sm font-semibold">{content.badge}</span>
                </div>
              </div>

              <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-forest leading-tight text-center mb-5 md:mb-7">
                {content.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-charcoal/80 text-center max-w-3xl mx-auto mb-10 md:mb-12 font-body leading-relaxed px-2">
                {heroSubheadline}
              </p>

              <figure className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <Image
                  src={`/images/programs/${program.slug}-hero.jpg`}
                  alt={content.heroImageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-beige via-beige-light to-forest/20" />
              </figure>
            </div>
          </div>
        </section>

        {/* Mobile Logo Loop - Below Hero */}
        <MobileLogoLoop className="my-4" />

        {/* TRANSFORMATION JOURNEY - Uses PillarCard */}
        <Section background="white" maxWidth="5xl">
          <SectionHeader
            title={content.journeySectionHeadline}
            subtitle={content.journeyIntro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {content.pillars.map((pillar, index) => (
              <PillarCard key={index} pillar={pillar} />
            ))}
          </div>
        </Section>

        {/* DISHA VALIDATION - Unique, kept inline */}
        <Section background="beige" maxWidth="5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
            <figure className="lg:col-span-4">
              <div className="relative aspect-[3/4] max-w-[280px] md:max-w-[320px] lg:max-w-none mx-auto rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <Image
                  src="/images/disha-portrait.jpg"
                  alt="Disha Methi Khandelwal - Founder, Glow Up Academy"
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

            <div className="lg:col-span-8">
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-5 md:mb-7">
                {content.dishaHeadline}
              </h2>

              <div className="space-y-4 md:space-y-5 text-sm md:text-base text-charcoal/80 font-body leading-relaxed">
                {content.dishaQuote.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 md:mt-10 pt-5 md:pt-7 border-t border-beige-dark/20">
                <p className="font-headline text-xl md:text-2xl text-forest mb-1">
                  - {content.dishaSignature || "Disha Methi Khandelwal"}
                </p>
                <p className="text-xs md:text-sm text-charcoal/60 font-body">
                  Founder, Glow Up Academy
                </p>
                {content.dishaCredentials ? (
                  <p className="text-[10px] md:text-xs text-charcoal/50 font-body mt-1">
                    {content.dishaCredentials}
                  </p>
                ) : (
                  <p className="text-[10px] md:text-xs text-charcoal/50 font-body mt-1">
                    Master&apos;s in Applied Finance • Certified Wellness Expert
                  </p>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* INVESTMENT - Enhanced pricing card with glass */}
        <Section background="white" maxWidth="lg">
          {/* Glass floater with subtle border */}
          <div className="glass-card rounded-[2.5rem] shadow-float border border-white/60 p-2 flex flex-col">
            <div className="bg-gradient-to-b from-white/60 to-beige-light/40 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 lg:p-12 w-full">
              <div className="text-center">
                <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-forest mb-3">
                  {content.investmentHeadline}
                </h2>

                <div className="my-8 md:my-10">
                  <p className="font-headline text-4xl sm:text-5xl md:text-6xl text-forest mb-2 md:mb-3">
                    {formatPrice(program.price)}
                    {program.tier !== "transform" && (
                      <span className="text-lg md:text-xl font-body text-charcoal/50">
                        /month
                      </span>
                    )}
                  </p>
                  <p className="text-xs md:text-sm text-charcoal/60 font-body">
                    {content.pricePerDay}-{content.priceComparison}
                  </p>
                </div>

                <p className="text-sm md:text-base text-charcoal/70 font-body mb-8 md:mb-10 leading-relaxed">
                  {content.investmentDescription}
                </p>

                <Link
                  href={ctaHref}
                  className="btn-luxe w-full py-4 md:py-5 px-8 md:px-10 rounded-full font-subheader font-semibold text-base md:text-lg flex items-center justify-center gap-2 mb-6 md:mb-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.15)]"
                >
                  {isHighTicket ? (
                    <>
                      <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                      {content.ctaText}
                    </>
                  ) : (
                    <>
                      {content.ctaText}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </>
                  )}
                </Link>

                <ul className="space-y-2 md:space-y-3 text-left mb-6 md:mb-8">
                  {content.trustSignals.map((signal, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-xs md:text-sm text-charcoal/70 font-body"
                    >
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-forest flex-shrink-0" />
                      {signal}
                    </li>
                  ))}
                </ul>

                <p className="text-xs md:text-sm text-charcoal/50 font-body">
                  Questions? Contact us via Instagram{" "}
                  <a
                    href="https://instagram.com/_thedmk_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest hover:text-forest-dark inline font-medium underline"
                  >
                    @_thedmk_
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* PERSONALIZED INSIGHTS - Based on Quiz Answers */}
        <Section background="beige" maxWidth="3xl">
          <SectionHeader
            title="Why This is Perfect for You"
            subtitle="Based on your quiz answers, here's what we know about your transformation journey."
          />
          <div className="space-y-4">
            {/* Goal Focus */}
            <div className="glass-card rounded-2xl p-5 md:p-6 border border-white/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <h3 className="font-subheader font-semibold text-forest mb-1">Your Goal</h3>
                  <p className="text-sm md:text-base text-charcoal/80 font-body">{personalization.goalFocus}</p>
                </div>
              </div>
            </div>

            {/* Rise Style */}
            <div className="glass-card rounded-2xl p-5 md:p-6 border border-white/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-wine/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-wine" />
                </div>
                <div>
                  <h3 className="font-subheader font-semibold text-forest mb-1">How You Rise</h3>
                  <p className="text-sm md:text-base text-charcoal/80 font-body">{personalization.riseStyle}</p>
                </div>
              </div>
            </div>

            {/* Time Commitment */}
            <div className="glass-card rounded-2xl p-5 md:p-6 border border-white/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-forest/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-subheader font-semibold text-forest mb-1">Your Commitment</h3>
                  <p className="text-sm md:text-base text-charcoal/80 font-body">{personalization.timeCommitment}</p>
                </div>
              </div>
            </div>

            {/* History Acknowledgment */}
            <div className="glass-card rounded-2xl p-5 md:p-6 border border-white/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-beige-dark/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-subheader font-semibold text-forest mb-1">Your Journey</h3>
                  <p className="text-sm md:text-base text-charcoal/80 font-body">{personalization.historyAcknowledgment}</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* WHY THIS WORKS - Uses BenefitCard */}
        <Section background="white" maxWidth="3xl">
          <SectionHeader title={content.whyWorksHeadline} subtitle={whyWorksIntro} />
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {content.whyWorksBenefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                index={index}
                headline={benefit.headline}
                description={benefit.description}
              />
            ))}
          </div>
        </Section>

        {/* TESTIMONIALS - Uses TestimonialCard */}
        <Section background="white" maxWidth="5xl">
          <SectionHeader title={content.testimonialsHeadline} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {content.testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} asListItem={false} />
            ))}
          </div>
        </Section>

        {/* FAQ - Uses FAQItem */}
        <Section background="beige" maxWidth="2xl">
          <SectionHeader title={content.faqHeadline} />
          <div className="space-y-2 md:space-y-3">
            {content.faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isExpanded={expandedFaq === index}
                onToggle={() => toggleFaq(index)}
              />
            ))}
          </div>
        </Section>

        {/* UPGRADE PATH (Optional) - Unique, kept inline */}
        {content.upgradePath && (
          <Section background="white" maxWidth="xl" containerClassName="py-10 md:py-14">
            <article className="bg-beige-light/50 rounded-[2rem] p-7 md:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-beige-dark/10 text-center">
              <h3 className="font-headline text-lg md:text-xl lg:text-2xl text-forest mb-3 md:mb-4">
                {content.upgradePath.headline}
              </h3>
              <p className="text-sm md:text-base text-charcoal/70 font-body mb-6 md:mb-8 leading-relaxed">
                {content.upgradePath.description}
              </p>
              <Link
                href={content.upgradePath.ctaHref}
                className="inline-flex items-center gap-2 border-2 border-wine text-wine px-6 md:px-8 py-3 md:py-4 rounded-full font-subheader font-medium text-sm md:text-base hover:bg-wine hover:text-white transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]"
              >
                {content.upgradePath.ctaText}
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
              <p className="text-xs md:text-sm text-charcoal/50 font-body mt-4 md:mt-5">
                Or start with {program.name} and see where it takes you.
              </p>
            </article>
          </Section>
        )}

        {/* FINAL CTA - Unique, kept inline */}
        <section className="bg-gradient-to-b from-forest to-forest-dark">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-14 md:py-20 lg:py-24">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-5">
                {content.finalCtaHeadline}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/80 font-body mb-8 md:mb-10">
                {content.finalCtaSubheadline}
              </p>

              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-charcoal font-subheader font-semibold py-4 md:py-5 px-10 md:px-12 rounded-full text-base md:text-lg transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-2px_rgba(0,0,0,0.15)] transform hover:-translate-y-0.5 mb-6 md:mb-8"
              >
                {isHighTicket ? (
                  <>
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    {content.finalCtaButtonText}
                  </>
                ) : (
                  <>
                    {content.finalCtaButtonText}
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </>
                )}
              </Link>

              <p className="text-white/60 text-xs md:text-sm mb-4 md:mb-5">
                Questions before you commit? Reach out via{" "}
                <a
                  href="https://instagram.com/_thedmk_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white font-medium underline"
                >
                  Instagram
                </a>
                {" "}or{" "}
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white font-body underline"
                >
                  Email
                </Link>
              </p>
              <p className="text-white/50 text-xs md:text-sm mt-8 md:mt-10 font-body">
                {content.trustReminder}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
