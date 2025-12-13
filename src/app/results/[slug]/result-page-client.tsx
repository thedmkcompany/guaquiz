"use client";

import Link from "next/link";
import { Program } from "@/types";
import { formatPrice } from "@/lib/programs";
import { Check, ArrowRight, MessageCircle, Calendar, Crown } from "lucide-react";

interface ResultPageClientProps {
  program: Program;
}

export function ResultPageClient({ program }: ResultPageClientProps) {
  const isHighTicket = program.requiresCall;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Your Perfect Match</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Result Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Program Header */}
            <div className={`px-6 py-8 text-center ${getTierGradient(program.tier)}`}>
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">
                Recommended for you
              </p>
              <h1 className="text-3xl font-bold text-white mb-2">
                {program.name}
              </h1>
              {program.tagline && (
                <p className="text-white/90">{program.tagline}</p>
              )}
            </div>

            {/* Price Section */}
            <div className="px-6 py-6 border-b border-gray-100 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(program.price)}
                </span>
                {program.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(program.originalPrice)}
                  </span>
                )}
              </div>
              {program.tier === "trial" && (
                <p className="text-sm text-green-600 mt-1">
                  Risk-free trial experience
                </p>
              )}
            </div>

            {/* Description */}
            <div className="px-6 py-6 border-b border-gray-100">
              <p className="text-gray-600 text-center">{program.description}</p>
            </div>

            {/* Features */}
            <div className="px-6 py-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                What&apos;s included:
              </h3>
              <ul className="space-y-3">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Section */}
            <div className="px-6 py-6 bg-gray-50">
              {isHighTicket ? (
                // High-ticket: Show Calendly booking
                <div className="space-y-4">
                  <Link
                    href={`/book-call?program=${program.slug}`}
                    className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-white transition-all ${getTierButtonClass(program.tier)}`}
                  >
                    <Calendar className="w-5 h-5" />
                    Book Your Free Discovery Call
                  </Link>
                  <p className="text-sm text-gray-500 text-center">
                    20-minute call to see if Transform is right for you
                  </p>
                </div>
              ) : (
                // Direct payment programs
                <div className="space-y-4">
                  <Link
                    href={`/checkout?program=${program.slug}`}
                    className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-white transition-all ${getTierButtonClass(program.tier)}`}
                  >
                    Get Started Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Support Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Have questions? Chat with us
            </Link>
            {!isHighTicket && program.tier !== "transform" && (
              <Link
                href={`/book-call?program=${program.slug}`}
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Want a call instead?
              </Link>
            )}
          </div>

          {/* View Other Programs */}
          <div className="mt-8 text-center">
            <Link
              href="/programs"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              View all programs
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions for tier-based styling
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
