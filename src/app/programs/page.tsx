import Link from "next/link";
import { ArrowLeft, Check, ArrowRight, Crown, Calendar } from "lucide-react";
import { getAllPrograms, formatPrice } from "@/lib/programs";
import { Program } from "@/types";

export const metadata = {
  title: "Our Programs | DMK",
  description: "Explore all our transformation programs and find the one that's right for you.",
};

export default function ProgramsPage() {
  const programs = getAllPrograms();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Transformation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Not sure which program is right for you?{" "}
              <Link href="/quiz" className="text-purple-600 font-medium hover:underline">
                Take our quiz
              </Link>{" "}
              to get a personalized recommendation.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still not sure? Let us help you decide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Take the Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
    <div
      className={`bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-lg ${
        program.tier === "transform"
          ? "border-yellow-300 ring-2 ring-yellow-100"
          : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className={`px-6 py-4 ${getTierGradient(program.tier)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{program.name}</h2>
            {program.tagline && (
              <p className="text-white/80 text-sm">{program.tagline}</p>
            )}
          </div>
          {program.tier === "transform" && (
            <Crown className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      {/* Price */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(program.price)}
          </span>
          {program.originalPrice && (
            <span className="text-gray-400 line-through">
              {formatPrice(program.originalPrice)}
            </span>
          )}
        </div>
        {program.tier === "trial" && (
          <p className="text-sm text-green-600 mt-1">Risk-free trial</p>
        )}
      </div>

      {/* Description */}
      <div className="px-6 py-4">
        <p className="text-gray-600 text-sm">{program.description}</p>
      </div>

      {/* Features */}
      <div className="px-6 py-4 border-t border-gray-100">
        <ul className="space-y-2">
          {program.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
          {program.features.length > 4 && (
            <li className="text-sm text-gray-500">
              + {program.features.length - 4} more features
            </li>
          )}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-6 py-4 bg-gray-50">
        {isHighTicket ? (
          <Link
            href={`/book-call?program=${program.slug}`}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-all ${getTierButtonClass(program.tier)}`}
          >
            <Calendar className="w-4 h-4" />
            Book a Call
          </Link>
        ) : (
          <Link
            href={`/results/${program.slug}`}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-all ${getTierButtonClass(program.tier)}`}
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
    essentials: "bg-gradient-to-r from-blue-500 to-blue-600",
    trial: "bg-gradient-to-r from-green-500 to-green-600",
    circle: "bg-gradient-to-r from-purple-500 to-purple-600",
    transform: "bg-gradient-to-r from-yellow-500 to-orange-500",
  };
  return gradients[tier] || "bg-gradient-to-r from-gray-500 to-gray-600";
}

function getTierButtonClass(tier: Program["tier"]): string {
  const classes = {
    essentials: "bg-blue-600 hover:bg-blue-700",
    trial: "bg-green-600 hover:bg-green-700",
    circle: "bg-purple-600 hover:bg-purple-700",
    transform: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
  };
  return classes[tier] || "bg-gray-600 hover:bg-gray-700";
}
