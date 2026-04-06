import Link from "next/link";
import Image from "next/image";
import { getAllPrograms, getPriceStrikeDisplay } from "@/lib/programs";
import { Program } from "@/types";
import { Footer } from "@/components/ui/footer";
import { getPageMetadata, siteConfig } from "@/lib/seo-config";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateItemListSchema } from "@/lib/structured-data";
import { getCDNUrl } from "@/lib/cdn";

// Inline SVG arrow to avoid lucide-react bundle
function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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

export const metadata = getPageMetadata({
  title: "Our Programs - Find Your Perfect Transformation Path",
  description:
    "Explore Glow Up Academy's transformation programs for Indian women. From 24 Day Challenge to Circle community and premium 1:1 Transform. Fitness, beauty, finance & confidence.",
  keywords: [
    "transformation programs India",
    "women fitness programs",
    "online coaching India",
    "holistic wellness programs",
    "affordable transformation",
    "premium coaching India",
  ],
  ogImage: "/api/og?page=programs",
  canonical: `${siteConfig.url}/programs`,
});

export default function ProgramsPage() {
  const allPrograms = getAllPrograms();
  const orderedPrograms = [
    allPrograms.find(p => p.slug === 'essentials'),
    allPrograms.find(p => p.slug === 'circle'),
    allPrograms.find(p => p.slug === 'transform'),
  ].filter((p): p is Program => p !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-beige/10 to-ivory">
      {/* Structured Data for SEO */}
      <StructuredData data={generateItemListSchema(allPrograms)} />

      {/* Hero */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Image - Enhanced */}
          <div className="relative w-48 h-48 mx-auto mb-10">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-wine/30 via-gold/30 to-beige/40 rounded-full blur-2xl animate-pulse" />

            {/* Image container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-wine/20">
              <Image
                src={getCDNUrl("/images/DMK/Essentials Hero Disha.png")}
                alt="Disha Methi Khandelwal"
                fill
                className="object-cover"
                priority
                sizes="192px"
                quality={80}
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full border-2 border-white shadow-lg" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-wine rounded-full border-2 border-white shadow-lg" />
          </div>

          {/* Text */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-forest mb-6 leading-tight">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-wine via-wine-dark to-wine bg-clip-text text-transparent">
                Transformation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-forest/70 mb-10 leading-relaxed max-w-2xl mx-auto">
              From your first step to complete sisterhood, we have a program for you.
            </p>

            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-wine to-wine-dark text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl"
            >
              Not sure? Take the quiz
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-16" />

      {/* Programs */}
      <div className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          {orderedPrograms.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProgramCard({ program }: { program: Program; index: number }) {
  const promoPrice = getPriceStrikeDisplay(program);
  const programLink = program.slug === 'circle'
    ? '/circle'
    : program.slug === 'transform'
    ? '/transform'
    : `/results/${program.slug}`;

  const isTransform = program.slug === 'transform';
  const isEssentials = program.slug === 'essentials';
  const isCircle = program.slug === 'circle';

  return (
    <div className={`relative group bg-white rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
      isTransform
        ? 'border-gold/40 hover:border-gold'
        : isEssentials
        ? 'border-wine/30 hover:border-wine'
        : 'border-forest/10 hover:border-forest/30'
    }`}>
      {/* Badges */}
      {isEssentials && (
        <div className="absolute -top-3 left-8 bg-wine text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md font-subheader tracking-wide">
          Start here
        </div>
      )}
      {isTransform && (
        <div className="absolute -top-3 left-8 bg-gradient-to-r from-gold to-gold-light text-forest text-xs font-semibold px-4 py-1.5 rounded-full shadow-md font-subheader tracking-wide">
          Premium
        </div>
      )}

      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isTransform
          ? 'bg-gradient-to-br from-gold/5 to-transparent'
          : isEssentials
          ? 'bg-gradient-to-br from-wine/5 to-transparent'
          : 'bg-gradient-to-br from-forest/5 to-transparent'
      }`} />

      <div className="relative">
        {/* Name */}
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-forest uppercase tracking-tight mb-4">
          {program.name}
        </h2>

        {/* Price */}
        <div className={`text-4xl md:text-5xl font-headline font-bold mb-6 ${
          isTransform ? 'text-gold' : 'text-forest'
        }`}>
          {isCircle ? (
            "Waitlist"
          ) : (
            <>
              {promoPrice.strikeText ? (
                <span className="text-2xl md:text-3xl text-forest/45 line-through font-body font-normal mr-2 md:mr-3 align-middle">
                  {promoPrice.strikeText}
                </span>
              ) : null}
              {promoPrice.saleText}
              {program.isSubscription && (
                <span className="text-base font-body font-normal text-forest/50">/month</span>
              )}
            </>
          )}
        </div>

        {/* Tagline - Bold */}
        <p className="text-xl md:text-2xl font-bold text-forest mb-6 leading-snug">
          {program.tagline}
        </p>

        {/* Description */}
        <p className="text-lg text-forest/80 leading-relaxed mb-10">
          {program.description}
        </p>

        {/* Features */}
        <div className="mb-10">
          <div className="text-base font-bold text-forest/60 uppercase tracking-wider mb-5">
            What you get:
          </div>
          <ul className="space-y-3">
            {program.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-4 text-base md:text-lg text-forest/80">
                <span className={`text-2xl leading-none mt-0.5 ${
                  isTransform ? 'text-gold' : isEssentials ? 'text-wine' : 'text-forest'
                }`}>
                  •
                </span>
                <span className="flex-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strategy call note for Transform */}
        {isTransform && (
          <div className="mb-8 p-4 bg-gold/10 rounded-2xl border border-gold/30">
            <p className="text-base font-bold text-forest">
              Starts with: ₹1,999 strategy call
            </p>
          </div>
        )}

        {/* CTA */}
        <Link
          href={programLink}
          className={`block w-full text-center py-5 rounded-full font-bold text-lg transition-all duration-300 ${
            isTransform
              ? 'bg-gradient-to-r from-gold to-gold-light text-forest hover:shadow-xl hover:scale-105'
              : isEssentials
              ? 'bg-wine text-white hover:bg-wine-dark hover:shadow-xl'
              : 'bg-forest text-white hover:bg-forest-light hover:shadow-xl'
          }`}
        >
          {isCircle ? "Join waitlist →" : "Learn More →"}
        </Link>
      </div>
    </div>
  );
}
