"use client";

import { Crown, Mail, Calendar, Clock, Info } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { formatWebinarSessionDate } from "@/lib/date-utils";

interface WebinarThankYouProps {
  customerEmail: string;
  sessionDate?: Date | null;
}

export function WebinarThankYou({ customerEmail, sessionDate }: WebinarThankYouProps) {
  const sessionDateFormatted = sessionDate
    ? formatWebinarSessionDate(sessionDate)
    : null;

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
            You&apos;re in. <span className="text-3xl align-top">👑</span>
          </h1>

          {/* Session Date Info */}
          {sessionDateFormatted && (
            <div className="mb-6 py-6 px-4 bg-gradient-to-br from-wine/10 via-gold/10 to-wine/10 border-2 border-wine/30 rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-6 h-6 text-wine" />
                <span className="text-wine font-bold text-sm uppercase tracking-wider">
                  Your Live Session
                </span>
              </div>
              <p className="font-headline text-xl md:text-2xl font-bold text-forest mb-3">
                {sessionDateFormatted}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-forest/70 mb-2">
                <Clock className="w-4 h-4 text-wine/60" />
                <span className="font-body">90-minute transformation experience</span>
              </div>
              <div className="flex items-start justify-center gap-2 text-xs text-forest/60 mt-3 max-w-md mx-auto">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-body text-left">
                  Join link and preparation details will be sent to your email 24 hours before the session
                </p>
              </div>
            </div>
          )}

          <div className="my-8 py-6 px-4 bg-white/40 rounded-2xl border border-white/40 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-forest/70 mb-2">
              <Mail className="w-5 h-5 text-wine" />
              <span className="text-sm font-subheader">Check your email</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-forest font-medium">{customerEmail}</p>
            </div>
            <p className="text-sm text-forest/60 font-body">
              Confirmation and session details are in your inbox
            </p>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-lg text-forest/80 font-body leading-relaxed">
              The DMK Woman doesn&apos;t wait. She acts.
            </p>
            <p className="text-lg text-forest/80 font-body leading-relaxed">
              And you just did.
            </p>

            <p className="text-xl text-wine font-semibold font-subheader mt-6">
              See you {sessionDateFormatted ? 'on Sunday' : 'soon'}, Queen.
            </p>

            <p className="text-wine font-semibold font-subheader italic">
              — The DMK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
