"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Program } from "@/types";
import { formatPrice } from "@/lib/programs";
import {
  getProgramContent,
  getQuizPersonalization,
  ProgramContent,
} from "@/lib/results-data";
import { WhatsAppButton } from "@/components/support/whatsapp-button";
import {
  Section,
  SectionHeader,
  PillarCard,
  TestimonialCard,
  FAQItem,
  BenefitCard,
} from "@/components/results";
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
  const [personalization, setPersonalization] = useState({
    heroSubheadline: "",
    whyThisWorksReason: "",
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const isHighTicket = program.requiresCall;
  const content: ProgramContent = getProgramContent(program.id);

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

  const ctaHref = isHighTicket
    ? `/book-call?program=${program.slug}`
    : `/checkout?program=${program.slug}`;

  // Build dynamic text
  const heroSubheadline = content.heroSubheadlineTemplate.replace(
    "{personalization}",
    personalization.heroSubheadline
  );
  const whyWorksIntro = content.whyWorksIntroTemplate.replace(
    "{reason}",
    personalization.whyThisWorksReason
  );

  return (
    <>
      {/* HEADER - Enhanced glass overlay */}
      <header className="glass-overlay border-b border-white/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-center">
            <Link href="/" className="font-headline text-lg md:text-xl text-forest hover:text-forest-light transition-colors">
              Glow Up Academy{" "}
              <span className="text-gold font-normal">by THEDMK</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-gradient-pastel-vertical">
        {/* HERO SECTION - Enhanced with glass effects */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-5 md:mb-7">
                <span className="inline-flex items-center gap-2 glass-card-strong px-4 py-2 md:px-5 md:py-2.5 rounded-full font-subheader text-xs md:text-sm shadow-soft border border-gold/20">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-gold" />
                  <span className="text-gold-dark font-semibold">{content.badge}</span>
                </span>
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
                  — Disha Methi Khandelwal
                </p>
                <p className="text-xs md:text-sm text-charcoal/60 font-body">
                  Founder, Glow Up Academy
                </p>
                <p className="text-[10px] md:text-xs text-charcoal/50 font-body mt-1">
                  Master&apos;s in Applied Finance • Certified Wellness Expert
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* INVESTMENT - Enhanced pricing card with glass */}
        <Section background="white" maxWidth="lg">
          {/* Glass floater with subtle border */}
          <div className="glass-card-strong rounded-[2.5rem] p-2 shadow-float border border-white/60">
            <div className="bg-gradient-to-b from-white/60 to-beige-light/40 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 lg:p-12">
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
                    {content.pricePerDay}—{content.priceComparison}
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
                  Questions?{" "}
                  <WhatsAppButton
                    variant="link"
                    message={`Hi! I have a question about ${program.name}.`}
                    className="text-forest hover:text-forest-dark inline"
                  />
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* WHY THIS WORKS - Uses BenefitCard */}
        <Section background="beige" maxWidth="3xl">
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
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
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
                Questions before you commit?
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-5 flex-wrap">
                <WhatsAppButton
                  variant="link"
                  message={`Hi! I have questions about ${program.name}.`}
                  className="text-white/80 hover:text-white text-sm"
                />
                <span className="text-white/40 text-sm">or</span>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white font-body text-sm underline"
                >
                  Email us
                </Link>
              </div>

              <p className="text-white/50 text-xs md:text-sm mt-8 md:mt-10 font-body">
                {content.trustReminder}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-forest-dark">
        <div className="container mx-auto px-6 md:px-8 py-8 md:py-10">
          <p className="text-center text-white/60 font-body text-xs md:text-sm mb-6 md:mb-8">
            Trusted by 2,500+ women across India and globally
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
        message={`Hi! I'm interested in the ${program.name} program.`}
      />
    </>
  );
}
