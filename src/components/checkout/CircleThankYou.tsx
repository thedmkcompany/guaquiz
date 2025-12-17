"use client";

import { Crown, Mail, Calendar } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { formatCircleStartDate, getCurrentISTDate, isSameDay } from "@/lib/date-utils";

interface CircleThankYouProps {
  customerEmail: string;
  startDate?: Date | null;
}

export function CircleThankYou({ customerEmail, startDate }: CircleThankYouProps) {
  const isStartingToday = startDate && isSameDay(startDate, getCurrentISTDate());
  const startDateFormatted = startDate ? formatCircleStartDate(startDate, isStartingToday || undefined) : null;

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
            Welcome to The Circle, Queen. <span className="text-3xl align-top">👑</span>
          </h1>

          <p className="text-xl md:text-2xl text-wine font-medium font-subheader mb-6">
            You just joined a tribe of unstoppable women.
          </p>

          {/* Start Date Info */}
          {startDateFormatted && (
            <div className="mb-6 py-4 px-4 bg-gradient-to-br from-gold/10 via-wine/10 to-gold/10 border-2 border-gold/30 rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-wine" />
                <span className="text-wine font-bold text-sm uppercase tracking-wider">
                  {isStartingToday ? 'Starting Today' : 'Your Start Date'}
                </span>
              </div>
              <p className="font-headline text-lg font-bold text-forest">
                {isStartingToday
                  ? "Your Circle program starts today at 6 AM IST"
                  : `Your Circle program starts ${startDateFormatted}`}
              </p>
            </div>
          )}

          <div className="my-8 py-6 px-4 bg-white/40 rounded-2xl border border-white/40 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-forest/70 mb-2">
              <Mail className="w-5 h-5 text-wine" />
              <span className="text-sm font-subheader">Check your email</span>
            </div>
            <p className="text-forest font-medium">{customerEmail}</p>
            <p className="text-sm text-forest/60 mt-2 font-body">
              Welcome message and onboarding details are waiting
            </p>
          </div>

          <div className="space-y-4 text-center mb-6">
            <p className="text-lg text-forest/80 font-body leading-relaxed font-semibold">
              Strong. Soft. Unstoppable.
            </p>
            <p className="text-lg text-forest/80 font-body leading-relaxed">
              That&apos;s you now.
            </p>

            <p className="text-wine font-semibold font-subheader italic mt-4">
              — The DMK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
