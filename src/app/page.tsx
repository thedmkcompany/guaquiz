import {
  Section,
  SectionHeading,
  CTAButton,
  TestimonialCard,
  StatBlock,
} from "@/components/landing";

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
    name: "Priya M.",
    location: "Mumbai",
    role: "Marketing Director",
    age: 29,
    imagePlaceholder: "[Photo of woman, confident pose]",
  },
  {
    quote: "Finally, I feel confident in my body AND my life. This isn't just fitness—it's complete transformation.",
    name: "Meera S.",
    location: "London",
    role: "NRI, Finance Professional",
    age: 27,
    imagePlaceholder: "[Photo of woman, empowered energy]",
  },
  {
    quote: "The structure I needed without the pressure I dreaded. I show up for myself now—not from guilt, from love.",
    name: "Rhea K.",
    location: "Bangalore",
    role: "Entrepreneur",
    age: 30,
    imagePlaceholder: "[Photo of woman, radiant smile]",
  },
];

// Stats data
const stats = [
  { value: "5,000+", label: "Fitness sessions conducted" },
  { value: "2,500+", label: "Women transformed globally" },
  { value: "28K+", label: "Instagram community" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* ============================================
          HEADER - Glass Effect Sticky Header
          ============================================ */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 glass-overlay border-b border-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="font-headline text-xl sm:text-2xl font-bold text-forest">
                Glow Up Academy
              </p>
              <p className="text-xs sm:text-sm text-forest/60">by THEDMK</p>
            </div>
            <p className="font-body text-xs sm:text-sm text-forest/80 italic">
              Become Hot &amp; Unstoppable
            </p>
          </div>
        </div>
      </header>

      <main>
        {/* ============================================
            HERO SECTION - Floater Card Design
            ============================================ */}
        <Section maxWidth="4xl">
          {/* Floater container with frame effect */}
          <div className="p-8 sm:p-10 lg:p-14 rounded-[2.5rem] glass-card-strong border-[6px] border-white/40 shadow-float relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-0" />
            
            <div className="text-center relative z-10">
              <h1 className="font-headline text-[28px] leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold text-forest mb-6 sm:mb-8">
                Discover Your Personal Path to Hot &amp; Unstoppable
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-forest/80 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-12">
                2,500+ Indian women have transformed their bodies, confidence, and lives through
                Glow Up Academy. In just 2 minutes, discover which transformation path is designed for you.
              </p>

              <div className="mb-8 sm:mb-10">
                <CTAButton href="/quiz">Take the Quiz</CTAButton>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-forest/70">
                  Created by <strong className="font-semibold">Disha Methi Khandelwal</strong>, Transformation Architect
                </p>
                <p className="text-xs sm:text-sm text-forest/60 uppercase tracking-wide">
                  Free &bull; 2 Minutes &bull; Personalized Results
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================
            DISHA'S STORY SECTION
            ============================================ */}
        <Section maxWidth="5xl" className="relative">
          <SectionHeading className="text-forest">
            Meet Disha—The Woman Who Chose Transformation Over Convention
          </SectionHeading>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-start">
            {/* Photo - Super-rounded with soft shadow */}
            <div className="flex justify-center md:justify-start order-2 md:order-1">
              <div className="w-56 h-72 sm:w-64 sm:h-80 md:w-full md:h-96 lg:h-[28rem] bg-forest rounded-[2.5rem] flex items-center justify-center shadow-float overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent opacity-40 mix-blend-multiply" />
                <p className="text-ivory/60 text-center px-6 text-sm relative z-10">
                  [Professional photo of Disha - Power pose, deep forest green background, warm confident smile]
                </p>
              </div>
            </div>

            {/* Text content - Glass card */}
            <div className="p-8 sm:p-10 rounded-[2.5rem] glass-card border border-white/40 shadow-medium order-1 md:order-2">
              <div className="space-y-5 text-forest/80">
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-forest font-headline">
                  Hi, I&apos;m Disha Methi Khandelwal—Founder of Glow Up Academy.
                </p>

                <p className="text-sm sm:text-base leading-relaxed">
                  They called me crazy for leaving CA (Chartered Accountancy) to pursue fitness.
                  CA is the ultimate safe career in India—prestigious, stable, respected.
                  But I knew transformation was my calling, not accounting.
                </p>

                <p className="font-semibold text-forest text-sm sm:text-base border-l-2 border-gold pl-4">
                  That decision changed everything.
                </p>

                <p className="text-sm sm:text-base leading-relaxed">
                  Today, I&apos;ve conducted <strong>5,000+ fitness sessions</strong> and helped
                  <strong> 2,500+ Indian women</strong>—from Mumbai professionals to NRIs in London
                  and Dubai—become hot and unstoppable. Not through crash diets. Not through punishment.
                  Through complete transformation of body, beauty, finance, and confidence.
                </p>

                <p className="text-base sm:text-lg md:text-xl font-medium text-forest pt-2 font-headline">
                  Because here&apos;s what I learned: Hot isn&apos;t just a body. It&apos;s a mindset.
                  An aura. A life you design.
                </p>

                <p className="text-sm sm:text-base leading-relaxed">
                  This quiz reveals which transformation path is right for YOUR goals, YOUR lifestyle,
                  YOUR timeline. Whether you need structure with flexibility, community accountability,
                  or completely personalized coaching—you&apos;ll know in 2 minutes.
                </p>

                {/* Signature */}
                <div className="pt-6">
                  <p className="font-accent text-2xl sm:text-3xl text-forest italic">
                    — Disha
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-forest/60">
                    Master&apos;s in Applied Finance &bull; Certified Zumba &amp; STRONG Trainer &bull; Corporate Wellness Expert
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================
            HOW THIS WORKS SECTION
            ============================================ */}
        <Section maxWidth="5xl">
          <SectionHeading className="text-forest">How This Works</SectionHeading>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
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
                className="text-center p-8 sm:p-10 rounded-[2rem] glass-card border border-white/50 hover:border-white/80 shadow-medium transition-all duration-500 hover:shadow-float hover:-translate-y-2 group"
              >
                {/* Step number - pill shape with soft shadow */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <span className="font-headline text-2xl sm:text-3xl font-bold text-charcoal">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-forest mb-4">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-forest/70 leading-relaxed font-body">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-12 sm:mt-16 text-center text-sm sm:text-base text-forest/80 max-w-2xl mx-auto italic font-medium">
            No generic recommendations. No one-size-fits-all. Your answers determine your
            perfect starting point. Because transformation only works when it fits YOUR life.
          </p>
        </Section>

        {/* ============================================
            CREDIBILITY / STATS SECTION
            ============================================ */}
        <Section maxWidth="5xl">
          {/* Inner floater card for stats - Dark Forest Variant */}
          <div className="p-10 sm:p-12 lg:p-16 rounded-[2.5rem] bg-forest text-ivory shadow-float relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <SectionHeading className="!mb-10 sm:!mb-12 text-ivory">The Results Speak</SectionHeading>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center">
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
              <div className="mt-14 sm:mt-16 text-center">
                <p className="text-xs sm:text-sm uppercase tracking-widest text-ivory/40 mb-5 font-subheader">
                  Featured In
                </p>
                <div className="inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-base sm:text-lg text-ivory/90 font-headline font-medium tracking-wide">Telangana Today</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================
            TESTIMONIALS SECTION
            ============================================ */}
        <Section maxWidth="6xl">
          <SectionHeading className="text-forest">
            What Hot &amp; Unstoppable Looks Like
          </SectionHeading>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                {...testimonial}
                className={
                  index === 2
                    ? "md:col-span-2 lg:col-span-1"
                    : undefined
                }
              />
            ))}
          </ul>
        </Section>

        {/* ============================================
            SECONDARY CTA SECTION - Floater Card
            ============================================ */}
        <Section maxWidth="3xl" className="pb-24 sm:pb-32">
          <div className="p-10 sm:p-14 rounded-[2.5rem] glass-card-strong border border-white/60 shadow-float text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent pointer-events-none" />
             
            <div className="relative z-10">
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-forest mb-6">
                The DMK Woman Doesn&apos;t Wait. She Acts.
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-forest/80 mb-10 max-w-xl mx-auto">
                Disha has transformed 2,500+ women. You could be next.
              </p>

              <CTAButton href="/quiz">Discover Your Path</CTAButton>

              <p className="mt-8 text-xs sm:text-sm text-forest/50 font-medium">
                Free &bull; 2 Minutes &bull; Personalized Results
                <br />
                No credit card required
              </p>
            </div>
          </div>
        </Section>
      </main>

      {/* ============================================
          FOOTER - Super-rounded top corners
          ============================================ */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-forest text-ivory rounded-t-[3rem] sm:rounded-t-[4rem] relative z-10 -mt-12 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm sm:text-base text-ivory/70 mb-6 font-medium">
            Join 2,500+ women who chose unstoppable
          </p>

          <a
            href="https://instagram.com/thedmk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-gold hover:text-white hover:bg-white/20 transition-all duration-300 font-semibold text-sm sm:text-base mb-12 hover:scale-105 hover:shadow-lg"
          >
            @thedmk
          </a>

          <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-ivory/50">
            <a href="#" className="hover:text-ivory transition-colors">
              Privacy Policy
            </a>
            <span aria-hidden="true" className="text-ivory/20">|</span>
            <a href="#" className="hover:text-ivory transition-colors">
              Terms
            </a>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-ivory/30">
            &copy; {new Date().getFullYear()} Glow Up Academy by THEDMK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
