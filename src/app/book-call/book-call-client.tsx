"use client";

import { useSearchParams } from "next/navigation";
import { getProgramBySlug, formatPrice } from "@/lib/programs";
import { CalendlyEmbed } from "@/components/support";
import { Crown, Check, Clock, Video, Gift } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Header } from "@/components/ui/header";

export function BookCallClient() {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program") || "transform";
  const program = getProgramBySlug(programSlug);

  // Default to Transform program for book-call page
  const displayProgram = program || getProgramBySlug("transform");

  return (
    <div className="min-h-screen bg-gradient-pastel font-body text-forest">
      {/* Header */}
      <Header
        variant="back"
        position="fixed"
        backHref={program ? `/results/${program.slug}` : "/"}
        backText="Back"
      />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <DecorativeBlobs />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Info */}
            <div className="order-2 lg:order-1">
              {/* Header */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold-dark px-4 py-1.5 rounded-full text-sm font-semibold mb-6 tracking-wide uppercase">
                  <Crown className="w-4 h-4" />
                  Free Discovery Call
                </div>
                <h1 className="text-3xl lg:text-4xl font-headline font-bold text-forest mb-6 leading-tight">
                  Let&apos;s See If Transform Is Right For You
                </h1>
                <p className="text-lg text-forest/80 font-body leading-relaxed">
                  Book a free 20-minute call with our team. No pressure, no
                  obligations - just a friendly conversation about your goals.
                </p>
              </div>

              {/* What to Expect */}
              <div className="glass-card rounded-[2rem] mb-8 border border-white/60 flex flex-col p-8">
                <h2 className="font-headline font-bold text-xl text-forest mb-6">
                  What to Expect on the Call
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <span className="font-bold text-forest block font-subheader text-lg">
                        20 minutes
                      </span>
                      <span className="text-forest/70 font-body">
                        Quick but meaningful conversation
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-wine" />
                    </div>
                    <div>
                      <span className="font-bold text-forest block font-subheader text-lg">
                        Video call
                      </span>
                      <span className="text-forest/70 font-body">
                        We&apos;ll send you a link
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <span className="font-bold text-forest block font-subheader text-lg">
                        No obligations
                      </span>
                      <span className="text-forest/70 font-body">
                        We&apos;re here to help, not pressure
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What We'll Discuss */}
              <div className="glass-card rounded-[2rem] mb-8 border border-white/60 flex flex-col p-8">
                <h2 className="font-headline font-bold text-xl text-forest mb-6">
                  We&apos;ll Discuss
                </h2>
                <ul className="space-y-3">
                  {[
                    "Your current situation and goals",
                    "What's been holding you back",
                    "Whether Transform is the right fit",
                    "What your personalized journey would look like",
                    "Any questions you have",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-wine flex-shrink-0 mt-0.5" />
                      <span className="text-forest/80 font-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Program Preview */}
              {displayProgram && (
                <div className="bg-forest rounded-[2rem] p-8 text-ivory relative overflow-hidden shadow-float">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                   
                  <h3 className="font-headline font-bold text-2xl mb-2 relative z-10">{displayProgram.name}</h3>
                  <p className="text-ivory/80 mb-6 relative z-10 font-body">{displayProgram.tagline}</p>
                  <div className="flex items-baseline gap-3 relative z-10">
                    <span className="text-4xl font-headline font-bold text-gold">
                      {formatPrice(displayProgram.price)}
                    </span>
                    <span className="text-ivory/60 font-body">one-time investment</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Calendly Embed */}
            <div className="order-1 lg:order-2">
               <div className="glass-card rounded-[2.5rem] shadow-float border border-white/40 sticky top-24 overflow-hidden flex flex-col p-0">
                <div className="bg-forest px-8 py-6 relative overflow-hidden w-full">
                   <div className="absolute inset-0 bg-gradient-to-r from-forest to-forest-light opacity-50" />
                  <h2 className="text-xl font-headline font-bold text-ivory relative z-10">
                    Pick a Time That Works
                  </h2>
                  <p className="text-ivory/60 text-sm font-body relative z-10">
                    Select a slot that&apos;s convenient for you
                  </p>
                </div>
                <div className="p-2 sm:p-4 bg-white/50 backdrop-blur-sm h-[650px] w-full">
                  <CalendlyEmbed
                    url={displayProgram?.calendlyUrl || undefined}
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
