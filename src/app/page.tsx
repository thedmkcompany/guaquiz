import Image from "next/image";
import {
  Section,
  SectionHeading,
  CTAButton,
  TestimonialCard,
  StatBlock,
} from "@/components/landing";
import { Footer } from "@/components/ui/footer";
import { MobileLogoLoop } from "@/components/MobileLogoLoop";
import { Sparkles, ArrowRight, Star, Heart } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  generateOrganizationSchema,
  generatePersonSchema,
  combineSchemas,
} from "@/lib/structured-data";

/*
  HIGH-END SOFT UI DESIGN TOKENS:
  - Super-rounded: rounded-[2rem] for cards, rounded-full for buttons
  - Soft shadows: shadow-[0_20px_50px_rgba(0,0,0,0.06)]
  - Glass effect: bg-white/70 backdrop-blur-xl border-white/40
  - Floater layout: generous padding, frame borders
*/

// Testimonial data
const testimonials = [
  {
    quote: "I went from inconsistent and unmotivated to unstoppable in 90 days. Disha taught me that discipline is the real luxury.",
    name: "Mitali Sharma",
    location: "Delhi",
    role: "MBBS Student & Youtuber",
    age: 23,
    photoUrl: "/images/misc/Photo of Woman in Confident Pose.png",
  },
  {
    quote: "Finally, I feel confident in my body AND my life. This isn't just fitness, it's complete transformation.",
    name: "Aurvi Mishra",
    location: "Pune",
    role: "Purchase Executive",
    age: 25,
    photoUrl: "/images/misc/Aurvi Before & After (empowered energy).png",
  },
  {
    quote: "The structure I needed without the pressure I dreaded. I show up for myself now, not from guilt, from love.",
    name: "Dhreeti Vithlani",
    location: "London",
    role: "Actress",
    age: 24,
    photoUrl: "/images/misc/Photo of woman, radiant smile.jpg",
  },
];

// Stats data - Updated with latest information
const stats = [
  { value: "4,500+", label: "Fitness sessions conducted" },
  { value: "15,000+", label: "Women trained globally" },
  { value: "40K+", label: "Instagram community" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* Structured Data for SEO */}
      <StructuredData
        data={combineSchemas(
          generateOrganizationSchema(),
          generatePersonSchema()
        )}
      />

      <main>
        {/* ============================================
            HERO SECTION - Feminine & Aesthetic Design
            ============================================ */}
        <section className="relative min-h-[90svh] sm:min-h-[100svh] flex items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 overflow-hidden">
          {/* Dreamy Background - Using Brand Colors */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Soft beige gradient orb - top right */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-beige/60 via-beige-light/30 to-transparent rounded-full blur-3xl opacity-80" />
            {/* Warm gold glow - left */}
            <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-gradient-to-r from-gold/25 via-beige/20 to-transparent rounded-full blur-3xl" />
            {/* Soft wine accent - bottom */}
            <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-gradient-to-t from-wine/15 via-beige-light/10 to-transparent rounded-full blur-3xl" />
            {/* Center ethereal glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/40 via-beige/20 to-transparent rounded-full blur-2xl" />

            {/* Floating decorative elements - synchronized 4s cycle for cohesive luxury feel */}
            <div className="absolute top-24 left-[15%] opacity-40 animate-pulse" style={{ animationDuration: '4s' }}>
              <Heart className="w-4 h-4 text-wine/60" />
            </div>
            <div className="absolute top-32 right-[20%] opacity-30 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div className="absolute bottom-40 left-[25%] opacity-30 animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }}>
              <Star className="w-4 h-4 text-gold/70 fill-gold/30" />
            </div>
            <div className="absolute bottom-32 right-[15%] opacity-40 animate-pulse" style={{ animationDuration: '4s', animationDelay: '3s' }}>
              <Heart className="w-3 h-3 text-wine/50" />
            </div>

            {/* Delicate floating dots - smooth float animation */}
            <div className="absolute top-20 left-[30%] w-2 h-2 bg-gold/30 rounded-full animate-float" />
            <div className="absolute top-48 right-[30%] w-1.5 h-1.5 bg-wine/25 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-48 left-[40%] w-2 h-2 bg-beige-dark/40 rounded-full animate-float" style={{ animationDelay: '3s' }} />
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="relative z-10 w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                {/* Elegant Badge */}
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 mb-6 sm:mb-8 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] animate-fade-in">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="h-4 w-px bg-forest/20" />
                  <span className="text-sm text-forest/70">
                    Trusted by <span className="font-semibold text-forest">15,000+</span> women
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-tight sm:leading-[1.12] mb-5 sm:mb-6 md:mb-8">
                  <span className="text-forest">Discover Your Path to</span>
                  <br />
                  <span className="relative inline-block">
                    <span className="font-accent text-[1.1em] italic bg-gradient-to-r from-wine via-wine-light to-wine bg-clip-text text-transparent">
                      Hot &amp; Unstoppable
                    </span>
                    {/* Decorative underline */}
                    <svg className="absolute -bottom-1 left-0 w-full h-3 text-gold/40" viewBox="0 0 200 12" preserveAspectRatio="none">
                      <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                  <br />
                  <span className="text-forest">in 2 Minutes</span>
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg text-forest/70 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-6 sm:mb-7 md:mb-8 font-body">
                  <span className="font-semibold text-forest">15,000+ women</span> transformed their bodies, confidence, and lives.
                  <span className="block mt-2 font-accent italic text-wine/70">
                    Your personalized path starts here.
                  </span>
                </p>

                {/* CTA Button */}
                <div className="flex flex-col items-center lg:items-start gap-4 mb-9 sm:mb-12 md:mb-10">
                  <a
                    href="/quiz"
                    className="group relative inline-flex items-center gap-3 px-10 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-wine via-wine to-wine-dark text-white font-semibold text-lg rounded-full shadow-[0_10px_40px_rgba(128,0,0,0.25)] hover:shadow-[0_15px_50px_rgba(128,0,0,0.35)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    <span className="relative z-10">Take the Quiz</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </a>

                  <p className="text-xs sm:text-sm text-forest/45 font-medium tracking-wide">
                    Free • 2 Minutes • Personalized Results
                  </p>
                </div>
              </div>

              {/* Right Column - DMK Image */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                <div className="relative">
                  {/* Decorative ring behind image */}
                  <div className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-gold/20 animate-spin-slow" />
                  <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-wine/10" />

                  {/* Image container with elegant frame */}
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.15)] ring-4 ring-white/80 ring-offset-4 ring-offset-transparent">
                    {/* Hero Image wrapper with luxury filters */}
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        filter: "brightness(1.02) contrast(0.9) saturate(0.6) sepia(0.25)",
                      }}
                    >
                      <Image
                        src="/images/DMK/Hero Image Disha 2.jpg"
                        alt="Disha Methi Khandelwal - Transformation Architect"
                        fill
                        className="object-cover object-top"
                        priority
                        sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 420px"
                      />
                    </div>
                    {/* Soft overlay for pastel blend - Brand Filter */}
                    <div
                      className="absolute inset-0 pointer-events-none z-10 mix-blend-soft-light"
                      style={{
                        background: "linear-gradient(to bottom, rgba(232,220,195,0.4) 0%, rgba(232,220,195,0.1) 40%, transparent 60%, rgba(128,0,0,0.2) 100%)",
                      }}
                    />
                    {/* Gloss Reflection/Sheen */}
                    <div
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)",
                      }}
                    />
                    {/* Subtle vignette */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none z-10"
                      style={{
                        boxShadow: "inset 0 0 100px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>

                  {/* Floating accent elements around image */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold/20 rounded-full blur-sm animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-wine/15 rounded-full blur-md animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-1/4 -left-6">
                    <Sparkles className="w-5 h-5 text-gold/60 animate-pulse" />
                  </div>
                  <div className="absolute bottom-1/4 -right-4">
                    <Heart className="w-4 h-4 text-wine/50 animate-pulse" style={{ animationDelay: '0.8s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Logo Loop - Below Hero */}
        <MobileLogoLoop className="mt-3" />

        {/* ============================================
            DISHA'S STORY SECTION
            ============================================ */}
        <Section maxWidth="3xl" className="relative py-10">
          <SectionHeading className="text-forest">
            Meet Disha, The Woman Who Chose Transformation Over Convention
          </SectionHeading>

          {/* Photo - Centered after headline */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="w-48 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80 bg-forest rounded-[2rem] sm:rounded-[2.5rem] shadow-float overflow-hidden relative group">
              <Image
                src="/images/DMK/Disha Beige Blazer 2.png"
                alt="Disha Methi Khandelwal - Founder of Glow Up Academy"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
            </div>
          </div>

          {/* Text content - Glass card */}
          <div className="glass-card rounded-[2rem] sm:rounded-[2.5rem] shadow-medium border border-white/40 overflow-hidden relative p-6 sm:p-8 md:p-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="space-y-4 sm:space-y-5 text-forest/80 relative z-10">
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-forest font-headline">
                Hi, I&apos;m Disha Methi Khandelwal, Founder of TheDMK &amp; Glow Up Academy.
              </p>

              <p className="text-sm sm:text-base leading-relaxed">
                They called me crazy for leaving CA (Chartered Accountancy) to pursue fitness. CA is the ultimate safe career in India: prestigious, stable, respected. But I knew transformation was my calling, not accounting.
              </p>

              <p className="font-semibold text-forest text-sm sm:text-base border-l-2 border-gold pl-4">
                That decision changed everything.
              </p>

              <p className="text-sm sm:text-base leading-relaxed">
                Today, I&apos;ve conducted <strong>4,500+ fitness sessions</strong> and trained <strong>15,000+ women</strong> from Hyderabad professionals to NRIs across the globe. Not through crash diets or punishment, but through holistic transformation that combines fitness, nutrition, and sustainable lifestyle changes.
              </p>

              <p className="text-base sm:text-lg md:text-xl font-medium text-forest pt-2 font-headline">
                Here&apos;s what I learned: Hot isn&apos;t just a body. It&apos;s a mindset, an aura, a life you design.
              </p>

              <p className="text-sm sm:text-base leading-relaxed">
                This quiz reveals which transformation path is right for your goals, lifestyle, and timeline. Whether you need structure with flexibility, community accountability, or personalized coaching, you&apos;ll know in 2 minutes.
              </p>

              {/* Signature */}
              <div className="pt-4 sm:pt-6">
                <p className="font-accent text-2xl sm:text-3xl text-forest italic">
                  TheDMK
                </p>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-forest/60">
                  Master&apos;s in Applied Finance | Health Coach | Certified STRONG Trainer | Corporate Wellness Expert | 10+ Years Experience
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================
            HOW THIS WORKS SECTION
            ============================================ */}
        <Section maxWidth="5xl" className="relative overflow-hidden py-10">
          {/* Decorative Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none -z-10" />

          <SectionHeading className="text-forest">How This Works</SectionHeading>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8 md:gap-8 lg:gap-10">
            {[
              {
                step: 1,
                title: "Answer 8 Questions",
                description: "2 minutes. Your goals, lifestyle, and what you're ready for right now.",
              },
              {
                step: 2,
                title: "Get Your Personalized Path",
                description: "Based on your answers, we'll recommend the exact program designed for you.",
              },
              {
                step: 3,
                title: "Start Your Transformation",
                description: "Choose to begin immediately, or explore your options. No pressure. Just clarity.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="group h-full"
              >
                <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] shadow-medium transition-all duration-500 hover:shadow-float hover:-translate-y-2 border border-white/50 hover:border-white/80 flex flex-col text-center p-6 sm:p-8 md:p-10">
                  {/* Step number - pill shape with soft shadow */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6 md:mb-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <span className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-charcoal">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-forest mb-3 sm:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-forest/70 leading-relaxed font-body">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 sm:mt-12 md:mt-16 text-center text-sm sm:text-base text-forest/80 max-w-2xl mx-auto italic font-medium">
            No generic recommendations. No one-size-fits-all. Your answers determine your
            perfect starting point. Because transformation only works when it fits YOUR life.
          </p>
        </Section>

        {/* ============================================
            CREDIBILITY / STATS SECTION
            ============================================ */}
        <Section maxWidth="5xl" className="py-10">
          {/* Inner floater card for stats - Dark Forest Variant */}
          <div className="p-6 sm:p-10 md:p-12 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] bg-forest text-ivory shadow-float relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <SectionHeading className="!mb-6 sm:!mb-10 md:!mb-12 text-ivory">The Results Speak</SectionHeading>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 md:gap-12 lg:gap-16 text-center">
                {stats.map((stat, index) => (
                  <StatBlock
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    className={
                      index === 1
                        ? "border-y border-white/10 sm:border-y-0 sm:border-x py-8 sm:py-0"
                        : undefined
                    }
                  />
                ))}
              </div>

              {/* Featured in - Glass pill */}
              <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 text-center">
                <p className="text-xs sm:text-sm uppercase tracking-widest text-ivory/40 mb-4 sm:mb-5 font-subheader">
                  Featured In
                </p>
                <div className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-default">
                  <span className="text-lg sm:text-xl text-ivory/90 font-headline font-medium tracking-wide group-hover:text-white transition-colors drop-shadow-sm">Telangana Today</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================
            TESTIMONIALS SECTION - Swipable Carousel
            ============================================ */}
        <Section maxWidth="6xl" className="py-10">
          <SectionHeading className="text-forest">
            What Hot &amp; Unstoppable Looks Like
          </SectionHeading>

          {/* Swipable Carousel Container */}
          <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
            {/* Scroll Container */}
            <div
              className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-6 lg:px-0 pb-4 scrollbar-hide"
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] snap-center"
                >
                  <TestimonialCard
                    {...testimonial}
                    variant="featured"
                    asListItem={false}
                  />
                </div>
              ))}
            </div>

            {/* Swipe Hint */}
            <p className="text-center text-xs text-forest/40 mt-6 lg:hidden">
              Swipe to see more
            </p>
          </div>
        </Section>

        {/* ============================================
            SECONDARY CTA SECTION - Floater Card
            ============================================ */}
        <Section maxWidth="3xl" className="pt-10 pb-14 sm:pb-24 md:pb-32">
          <div className="glass-card rounded-[2rem] sm:rounded-[2.5rem] shadow-float border border-white/60 overflow-hidden relative flex flex-col text-center p-7 sm:p-10 md:p-14">
             <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full">
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-forest mb-4 sm:mb-5 md:mb-6">
                The DMK Woman doesn&apos;t Wait. She Acts.
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-forest/80 mb-3 sm:mb-4 max-w-xl mx-auto">
                Disha has trained 15,000+ women worldwide. You could be next.
              </p>

              <p className="text-base sm:text-lg md:text-xl font-semibold text-forest/90 mb-8 sm:mb-9 md:mb-10 max-w-xl mx-auto">
                Building India&apos;s Most Confident Women Worldwide
              </p>

              <CTAButton href="/quiz">Discover Your Path</CTAButton>

              <p className="mt-6 sm:mt-7 md:mt-8 text-xs sm:text-sm text-forest/50 font-medium">
                Free | 2 Minutes | Personalized Results
                <br />
                No credit card required
              </p>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
