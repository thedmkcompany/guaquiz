"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProgramBySlug, formatPrice } from "@/lib/programs";
import { CalendlyEmbed } from "@/components/support";
import { ArrowLeft, Crown, Check, Clock, Video, Gift } from "lucide-react";

export function BookCallClient() {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program") || "transform";
  const program = getProgramBySlug(programSlug);

  // Default to Transform program for book-call page
  const displayProgram = program || getProgramBySlug("transform");

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={program ? `/results/${program.slug}` : "/"}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Info */}
            <div>
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Crown className="w-4 h-4" />
                  Free Discovery Call
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Let&apos;s See If Transform Is Right For You
                </h1>
                <p className="text-lg text-gray-600">
                  Book a free 20-minute call with our team. No pressure, no
                  obligations - just a friendly conversation about your goals.
                </p>
              </div>

              {/* What to Expect */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="font-semibold text-gray-900 mb-4">
                  What to Expect on the Call
                </h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">
                        20 minutes
                      </span>
                      <span className="text-gray-600">
                        {" "}
                        - Quick but meaningful conversation
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Video className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">
                        Video call
                      </span>
                      <span className="text-gray-600">
                        {" "}
                        - We&apos;ll send you a link
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Gift className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">
                        No obligations
                      </span>
                      <span className="text-gray-600">
                        {" "}
                        - We&apos;re here to help, not pressure
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What We'll Discuss */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="font-semibold text-gray-900 mb-4">
                  We&apos;ll Discuss
                </h2>
                <ul className="space-y-2">
                  {[
                    "Your current situation and goals",
                    "What's been holding you back",
                    "Whether Transform is the right fit",
                    "What your personalized journey would look like",
                    "Any questions you have",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Program Preview */}
              {displayProgram && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                  <h3 className="font-bold text-xl mb-2">{displayProgram.name}</h3>
                  <p className="text-white/90 mb-4">{displayProgram.tagline}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {formatPrice(displayProgram.price)}
                    </span>
                    <span className="text-white/70">one-time investment</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Calendly Embed */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Pick a Time That Works
                </h2>
                <p className="text-gray-400 text-sm">
                  Select a slot that&apos;s convenient for you
                </p>
              </div>
              <div className="p-4">
                <CalendlyEmbed
                  url={displayProgram?.calendlyUrl || undefined}
                  height="600px"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
