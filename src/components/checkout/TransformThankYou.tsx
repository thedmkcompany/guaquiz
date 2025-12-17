"use client";

import { Crown, Mail, Calendar, Video, ExternalLink } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";

interface TransformThankYouProps {
  customerEmail: string;
  schedulerUrl?: string;
}

export function TransformThankYou({ customerEmail, schedulerUrl }: TransformThankYouProps) {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body relative overflow-hidden flex items-center justify-center">
      <DecorativeBlobs />

      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        {/* Crown Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-full flex items-center justify-center shadow-glow-gold animate-pulse">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="glass-card rounded-[2.5rem] shadow-float border border-white/60 p-8 md:p-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-forest mb-4">
            Your strategy call is confirmed. <span className="text-3xl align-top">👑</span>
          </h1>

          <div className="my-8 py-6 px-4 bg-white/40 rounded-2xl border border-white/40 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-forest/70 mb-2">
              <Mail className="w-5 h-5 text-wine" />
              <span className="text-sm font-subheader">Check your email</span>
            </div>
            <p className="text-forest font-medium">{customerEmail}</p>
            <p className="text-sm text-forest/60 mt-2 font-body">
              Meeting details are waiting for you
            </p>
          </div>

          <div className="space-y-4 text-center mb-8">
            <p className="text-lg text-forest/80 font-body leading-relaxed">
              This is where your complete transformation begins.
            </p>

            <p className="text-lg text-forest/80 font-body leading-relaxed font-semibold">
              Hot is a mindset — and yours is about to shift.
            </p>

            <p className="text-wine font-semibold font-subheader italic mt-4">
              — The DMK
            </p>
          </div>

          {/* Book Call CTA */}
          {schedulerUrl && (
            <div className="mt-8">
              <a
                href={schedulerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-wine hover:bg-wine-dark text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-subheader"
              >
                <Calendar className="w-6 h-6" />
                Book Your Strategy Call
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>

        {/* What to Prepare */}
        <div className="glass-card rounded-[2rem] shadow-medium border border-white/60 p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-wine" />
            <h3 className="font-headline font-bold text-forest">What to Prepare for Your Call</h3>
          </div>
          <ul className="space-y-2 text-forest/80 text-sm font-body">
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span>Your fitness, beauty, and wellness goals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span>Current challenges you&apos;re facing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span>Questions about the Transform program</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span>A quiet space for our video call</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
