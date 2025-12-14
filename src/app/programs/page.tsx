import Link from "next/link";
import { Check, ArrowRight, Crown, Calendar } from "lucide-react";
import { getAllPrograms, formatPrice } from "@/lib/programs";
import { Program } from "@/types";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { MobileLogoLoop } from "@/components/MobileLogoLoop";
import { Header } from "@/components/ui/header";

export const metadata = {
  title: "Our Programs | DMK",
  description: "Explore all our transformation programs and find the one that's right for you.",
};

export default function ProgramsPage() {
  const programs = getAllPrograms();

  return (
    <div className="min-h-screen bg-gradient-pastel font-body">
      {/* Header */}
      <Header variant="back" position="fixed" />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <DecorativeBlobs />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-forest mb-6">
              Choose Your Transformation
            </h1>
            <p className="text-lg text-forest/80 max-w-2xl mx-auto font-body">
              Not sure which program is right for you?{" "}
              <Link href="/quiz" className="text-wine font-semibold hover:text-wine-light hover:underline underline-offset-4">
                Take our quiz
              </Link>{" "}
              to get a personalized recommendation.
            </p>
          </div>

          {/* Mobile Logo Loop - Below Hero */}
          <MobileLogoLoop className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8" />

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="text-forest/70 mb-6 font-subheader">
              Still not sure? Let us help you decide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 bg-wine text-white px-8 py-4 rounded-full font-semibold hover:bg-wine-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Take the Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/50 backdrop-blur-md border border-white/40 text-forest px-8 py-4 rounded-full font-semibold hover:bg-white/80 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const isHighTicket = program.requiresCall;

  return (
    <div className={`glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-2 transition-all duration-300 border border-white/50 group flex flex-col p-0 overflow-hidden ${
      program.tier === "transform"
        ? "ring-2 ring-gold/50 shadow-glow-gold"
        : ""
    }`}>
      {/* Header */}
      <div className={`px-8 py-8 ${getTierGradient(program.tier)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-headline font-bold text-white mb-2">{program.name}</h2>
            {program.tagline && (
              <p className="text-white/90 text-sm font-body">{program.tagline}</p>
            )}
          </div>
          {program.tier === "transform" && (
            <Crown className="w-8 h-8 text-gold drop-shadow-md" />
          )}
        </div>
      </div>

      {/* Price */}
      <div className="px-8 py-6 border-b border-gray-100/50 bg-white/40 backdrop-blur-sm">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-headline font-bold text-forest">
            {formatPrice(program.price)}
          </span>
          {program.originalPrice && (
            <span className="text-forest/40 line-through text-lg">
              {formatPrice(program.originalPrice)}
            </span>
          )}
        </div>
        {program.tier === "trial" && (
          <p className="text-sm text-green-700 font-semibold mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Risk-free trial
          </p>
        )}
      </div>

      {/* Description */}
      <div className="px-8 py-6">
        <p className="text-forest/80 leading-relaxed font-body">{program.description}</p>
      </div>

      {/* Features */}
      <div className="px-8 py-6 bg-white/30 backdrop-blur-sm flex-grow">
        <ul className="space-y-4">
          {program.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
              <Check className="w-5 h-5 text-wine flex-shrink-0 mt-0.5" />
              <span className="text-forest/80 font-body">{feature}</span>
            </li>
          ))}
          {program.features.length > 4 && (
            <li className="text-sm text-forest/50 pl-8 italic">
              + {program.features.length - 4} more features
            </li>
          )}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-8 py-8 bg-white/20">
        {isHighTicket ? (
          <Link
            href={`/book-call?program=${program.slug}`}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${getTierButtonClass(program.tier)}`}
          >
            <Calendar className="w-4 h-4" />
            Book a Call
          </Link>
        ) : (
          <Link
            href={`/results/${program.slug}`}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${getTierButtonClass(program.tier)}`}
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function getTierGradient(tier: Program["tier"]): string {
  const gradients = {
    essentials: "bg-gradient-to-br from-forest-light to-forest",
    trial: "bg-gradient-to-br from-forest-light to-forest",
    circle: "bg-gradient-to-br from-wine-light to-wine",
    transform: "bg-gradient-to-br from-forest to-forest-dark",
  };
  return gradients[tier] || "bg-gradient-to-br from-slate to-charcoal";
}

function getTierButtonClass(tier: Program["tier"]): string {
  const classes = {
    essentials: "bg-forest hover:bg-forest-light",
    trial: "bg-forest-light hover:bg-forest",
    circle: "bg-wine hover:bg-wine-light",
    transform: "bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-forest",
  };
  return classes[tier] || "bg-slate hover:bg-charcoal";
}
