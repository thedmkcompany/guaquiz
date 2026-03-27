import Image from "next/image";
import dynamic from "next/dynamic";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  generateOrganizationSchema,
  generatePersonSchema,
  combineSchemas,
} from "@/lib/structured-data";
import { getCDNUrl } from "@/lib/cdn";

// Lazy load below-fold components
const Footer = dynamic(
  () => import("@/components/ui/footer").then((m) => m.Footer),
  { ssr: true }
);

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f3e8] font-body text-[#0f3c36]">
      {/* Structured Data for SEO */}
      <StructuredData
        data={combineSchemas(
          generateOrganizationSchema(),
          generatePersonSchema()
        )}
      />

      <main>
        {/* Hero section */}
        <section className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-accent italic text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] sm:leading-[1.05] tracking-[0.005em] text-[#123b34]">
                Ready to glow tf up?
              </h1>
              <p className="mt-4 px-2 sm:px-0 font-headline text-base sm:text-xl lg:text-2xl font-medium leading-[1.35] text-[#123b34]">
                Made for Indian women juggling <span className="text-[#7e0f1d]">family</span>,{" "}
                <span className="text-[#7e0f1d]">work</span>, and everything in between
              </p>
            </div>

            <div className="mt-8 sm:mt-10 max-w-5xl mx-auto rounded-[1.75rem] overflow-hidden border border-[#0f3c36]/15 bg-[#efe7d6] shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
              <div className="relative aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/mKAMswgUhxE?rel=0&modestbranding=1"
                  title="Glow Up Academy Hero Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Reference-style system section (adapted to GUA brand/copy) */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto text-center px-6 sm:px-10 py-12 sm:py-16">
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="h-px w-8 sm:w-14 bg-[#c2a85a]/60" />
                <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#0f3c36]/60">
                  Women&apos;s Transformation System
                </p>
                <span className="h-px w-8 sm:w-14 bg-[#c2a85a]/60" />
              </div>

              <h1 className="sm:hidden font-headline text-[2.5rem] leading-[1.08] tracking-[0.005em] text-[#123b34] mb-6 font-semibold">
                <span className="block">You don&apos;t need more willpower.</span>
                <span className="block">
                  You need a <span className="font-accent italic text-[#7e0f1d]">framework.</span>
                </span>
              </h1>
              <h1 className="hidden sm:block font-headline text-5xl sm:text-6xl lg:text-7xl leading-[1.06] tracking-[0.01em] text-[#123b34] mb-6 font-semibold">
                <span className="block">You don&apos;t need more willpower.</span>
                <span className="block">
                  You need a <span className="font-accent italic text-[#7e0f1d]">framework.</span>
                </span>
              </h1>

              <p className="max-w-3xl mx-auto text-base sm:text-xl leading-relaxed text-[#0f3c36]/75 mb-10">
                GlowUp Academy&apos;s <strong>4-Pillar Integration Method</strong> helps you transform
                your body, mindset, confidence, and lifestyle together, so results actually last.
              </p>

              <div className="max-w-4xl mx-auto mb-10 text-center">
                <p className="font-subheader text-sm sm:text-base md:text-lg tracking-[0.04em] sm:tracking-[0.06em] text-[#0f3c36]/85 leading-relaxed flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
                  <span><span className="font-headline text-[#0f3c36]">5,000+</span> <span>Sessions Conducted</span></span>
                  <span className="hidden sm:inline text-[#0f3c36]/35">|</span>
                  <span><span className="font-headline text-[#0f3c36]">98%</span> <span>stick with it</span></span>
                  <span className="hidden sm:inline text-[#0f3c36]/35">|</span>
                  <span><span className="font-headline text-[#0f3c36]">15,000+</span> <span>Women Transformed</span></span>
                </p>
              </div>

              <a
                href="#programs-section"
                className="inline-flex items-center gap-2 bg-[#7e0f1d] text-[#f7f3e8] px-8 sm:px-10 py-4 text-xs sm:text-sm tracking-[0.2em] uppercase hover:bg-[#6b0c18] transition-colors"
              >
                Find Where I Start
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Old-site style gallery section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center font-headline text-3xl sm:text-4xl font-bold text-[#0f3c36] mb-8">
              What Hot &amp; Unstoppable Looks Like
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
              {[
                {
                  src: "/images/misc/Photo of Woman in Confident Pose.png",
                  alt: "Mitali transformation",
                  quote:
                    "I went from inconsistent and unmotivated to unstoppable in 90 days. Disha taught me that discipline is the real luxury.",
                  name: "Mitali Sharma, Delhi",
                  role: "MBBS Student & Youtuber, 23",
                  initial: "M",
                },
                {
                  src: "/images/misc/Aurvi Before & After (empowered energy).png",
                  alt: "Aurvi transformation",
                  objectPosition: "center 22%",
                  quote:
                    "Finally, I feel confident in my body AND my life. This isn't just fitness, it's complete transformation.",
                  name: "Aurvi Mishra, Pune",
                  role: "Purchase Executive, 25",
                  initial: "A",
                },
                {
                  src: "/images/misc/Photo of woman, radiant smile.jpg",
                  alt: "Dhreeti transformation",
                  quote:
                    "The structure I needed without the pressure I dreaded. I show up for myself now, not from guilt, from love.",
                  name: "Dhreeti Vithlani, London",
                  role: "Actress, 24",
                  initial: "D",
                },
              ].map((item) => (
                <div key={item.src} className="snap-start shrink-0 w-[68vw] sm:w-[60vw] md:w-auto md:min-w-0 rounded-[1.75rem] overflow-hidden border border-[#0f3c36]/12 shadow-[0_16px_30px_rgba(0,0,0,0.08)] bg-white/70">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={getCDNUrl(item.src)}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                      sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 33vw"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-[15px] leading-8 text-[#0f3c36]/85 italic min-h-[124px]">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="h-px bg-[#0f3c36]/10 my-3" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#c2a85a]/80 text-[#0f3c36] font-semibold text-xs flex items-center justify-center">
                        {item.initial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0f3c36] leading-tight">{item.name}</p>
                        <p className="text-xs text-[#0f3c36]/55">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder story section (reference-inspired split layout) */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-6xl mx-auto bg-[#f7f3e8] border border-[#0f3c36]/10">
            <div className="grid lg:grid-cols-2">
              <div className="p-4 sm:p-8 lg:p-10">
                <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto rounded-[1.5rem] overflow-hidden">
                  <Image
                    src={getCDNUrl("/images/DMK/Disha Wine Blazer 2.png")}
                    alt="Disha Methi Khandelwal, Founder of Glow Up Academy"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
                <div className="sm:hidden mt-3 max-w-[420px] mx-auto rounded-xl border border-[#c2a85a]/60 bg-[#fff8ea] px-3 py-2.5">
                  <p className="text-xs leading-relaxed text-[#0f3c36]/90 font-semibold">
                    Master&apos;s in Applied Finance | Health Coach | Certified STRONG Trainer | Corporate Wellness
                    Expert | 10+ Years Experience
                  </p>
                </div>
              </div>

              <div className="px-4 sm:px-2 lg:px-2 py-4 sm:py-8 lg:py-12 flex flex-col justify-center">
                <p className="font-accent italic text-[2.5rem] sm:text-5xl text-[#7e0f1d] mb-3">hello gorgeous</p>
                <h3 className="font-headline text-3xl sm:text-5xl lg:text-6xl tracking-[0.015em] leading-[1.08] sm:leading-[1.03] text-[#7e0f1d] mb-5 sm:whitespace-nowrap">
                  IT&apos;S YOUR FOUNDER,
                </h3>
                <div className="h-px w-24 bg-gradient-to-r from-[#c2a85a] to-transparent mb-4 sm:mb-7" />

                <div className="hidden sm:block space-y-4 font-subheader text-[15px] sm:text-[16px] leading-[1.7] tracking-[0.005em] text-[#0f3c36]/82 max-w-[62ch]">
                  <p>
                    Whether you found us through Instagram, transformations, or referrals, I&apos;m so glad you&apos;re here.
                    Glow Up Academy was built because I kept asking myself: why are women expected to compromise on
                    their body, confidence, and ambition?
                  </p>
                  <p>
                    I left Chartered Accountancy to build this work. Since then, we&apos;ve delivered 5,000+ sessions
                    and supported 15,000+ women globally with a method that integrates fitness, mindset, and lifestyle.
                  </p>
                  <p>
                    This isn&apos;t about short-term motivation. It&apos;s a system designed to help you become strong,
                    clear, and consistent in real life.
                  </p>
                  <p>
                    If you&apos;re ready to become your next-level self, you&apos;re in the right place.
                  </p>
                </div>
                <div className="sm:hidden max-w-[62ch] mt-1">
                  <details className="rounded-xl border border-[#c2a85a]/50 bg-[#fff8ea]/70 px-4 py-3">
                    <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.1em] text-[#7e0f1d]">
                      Read more
                    </summary>
                    <div className="mt-3 space-y-3 font-subheader text-[15px] leading-[1.6] tracking-[0.005em] text-[#0f3c36]/82">
                      <p>
                        Whether you found us through Instagram, transformations, or referrals, I&apos;m so glad you&apos;re here.
                        Glow Up Academy was built because I kept asking myself: why are women expected to compromise on
                        their body, confidence, and ambition?
                      </p>
                      <p>
                        I left Chartered Accountancy to build this work. Since then, we&apos;ve delivered 5,000+ sessions
                        and supported 15,000+ women globally with a method that integrates fitness, mindset, and lifestyle.
                      </p>
                      <p>
                        This isn&apos;t about short-term motivation. It&apos;s a system designed to help you become strong,
                        clear, and consistent in real life.
                      </p>
                      <p>
                        If you&apos;re ready to become your next-level self, you&apos;re in the right place.
                      </p>
                    </div>
                  </details>
                </div>
                <div className="hidden sm:inline-flex mt-6 max-w-[62ch] rounded-2xl border border-[#c2a85a]/60 bg-[#fff8ea] px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                  <p className="font-headline text-xs sm:text-sm font-bold tracking-[0.08em] text-[#0f3c36] uppercase leading-relaxed">
                    Master&apos;s in Applied Finance | Health Coach | Certified STRONG Trainer | Corporate Wellness
                    Expert | 10+ Years Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program tiers section */}
        <section id="programs-section" className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-6xl mx-auto mb-4 bg-[#047857] text-[#f7f3e8] text-center py-3 px-4 text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold">
              Limited slots available - book now
          </div>
          <div className="max-w-6xl mx-auto bg-[#f4efe4] border border-[#cdbf9a] p-6 sm:p-8 lg:p-10">
            <div className="flex gap-5 overflow-x-auto overflow-y-visible pt-3 pb-2 snap-x snap-mandatory">
              {[
                {
                  level: "LEVEL 0",
                  name: "Trial Webinar",
                  subtitle: "For the skeptic. Taste it before you commit to anything.",
                  points: [
                    "90-min masterclass with Disha that changes everything",
                    "Experience the glowup framework",
                    "Your questions answered in real time",
                  ],
                  price: "₹199 - one-time",
                  cta: "Reserve My Spot",
                  href: "/results/webinar",
                  featured: false,
                },
                {
                  level: "LEVEL 1 BEGINNER",
                  name: "24 Day Challenge",
                  subtitle: "Build your essentials at your own pace with real structure.",
                  points: [
                    "Working at your own pace",
                    "Not just workouts, complete transformation",
                    "Structure without pressure with weekly support calls",
                  ],
                  price: "₹1,999",
                  cta: "Join the Challenge",
                  href: "/results/essentials",
                  featured: true,
                },
                {
                  level: "LEVEL 2 BEGINNER TO INTERMEDIATE",
                  name: "Circle Community",
                  subtitle: "For women who fly higher with their tribe around them.",
                  points: [
                    "Monthly LIVE group coaching",
                    "Private women's community",
                    "Meal planning guidance - Indian friendly",
                  ],
                  price: "₹4,999/month",
                  cta: "Join Circle",
                  href: "/circle",
                  featured: false,
                },
                {
                  level: "LEVEL 3 - BEGINNER TO ADVANCE",
                  name: "Elite Transform",
                  subtitle: "1:1 attention so you dont fail this time",
                  points: [
                    "1:1 coaching - personalized just for you",
                    "Expert women coaches to help you achieve your goals",
                    "Guaranteed transformation",
                  ],
                  price: "Application + strategy call",
                  cta: "Apply Now",
                  href: "/transform",
                  featured: false,
                },
              ].map((program) => (
                <div key={program.name} className="snap-start min-w-[68vw] sm:min-w-[300px] lg:min-w-0 lg:flex-1 relative">
                  {program.level === "LEVEL 1 BEGINNER" ? (
                    <div className="absolute top-0 left-0 right-0 z-20 -translate-y-1/2 text-center bg-[#7e0f1d] py-1.5 text-[10px] font-semibold tracking-[0.14em] text-[#f7f3e8] uppercase shadow-[0_8px_18px_rgba(126,15,29,0.35)]">
                      Start Here
                    </div>
                  ) : null}
                  <div
                    className={`border p-5 sm:p-6 flex flex-col min-h-[520px] ${
                      program.featured
                        ? "border-[#c2a85a] bg-[#fbf6ea]"
                        : "border-[#cdbf9a] bg-[#f9f4e8]"
                    }`}
                  >
                  <p className="text-[9px] sm:text-[10px] tracking-[0.04em] uppercase text-[#9e7f39] mb-2 whitespace-nowrap">
                    <span className="font-bold">{(program.level.match(/^LEVEL\s+\d/) || [program.level])[0]}</span>
                    {program.level.match(/^LEVEL\s+\d/) ? (
                      <span className="font-normal"> {program.level.replace(/^LEVEL\s+\d/, "").trim()}</span>
                    ) : null}
                  </p>
                  <h3 className="font-headline text-4xl text-[#0f3c36] mb-2">{program.name}</h3>
                  <p className="text-sm italic text-[#21453f]/85 mb-6 leading-relaxed">{program.subtitle}</p>
                  <ul className="space-y-3 text-sm text-[#123b34] flex-1">
                    {program.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-[#9e7f39]">-</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[#8e6f2a] text-sm mt-6 mb-4">{program.price}</p>
                  <a
                    href={program.href}
                    className={`block text-center border px-4 py-3 text-xs tracking-[0.2em] uppercase transition-colors ${
                      program.featured
                        ? "bg-[#7e0f1d] border-[#7e0f1d] text-[#f7f3e8] hover:bg-[#6b0c18]"
                        : program.cta === "Apply Now"
                          ? "bg-[#7e0f1d] border-[#7e0f1d] text-[#f7f3e8] hover:bg-[#6b0c18]"
                          : "border-[#9e7f39] text-[#0f3c36] hover:bg-[#efe5cb]"
                    }`}
                  >
                    {program.cta}
                  </a>
                </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
