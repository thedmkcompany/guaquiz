'use client';

/**
 * @fileoverview Webinar Session Display Component
 *
 * Shows the user their upcoming webinar session date and time.
 * This is informational only - no choice to make.
 * The system automatically assigns the next available Sunday session.
 *
 * @module WebinarSessionSelector
 */

import { Calendar, Info, Clock } from 'lucide-react';
import type { WebinarSessionDateSelection } from '@/types';

interface WebinarSessionSelectorProps {
  sessionDate: WebinarSessionDateSelection;
  className?: string;
}

/**
 * Webinar Session Display Component
 *
 * Displays a single informational card showing when the user's webinar
 * session will occur. Emphasizes it's a LIVE event at a specific time.
 *
 * @example
 * ```tsx
 * const sessionDate = calculateWebinarSessionDate();
 *
 * <WebinarSessionSelector sessionDate={sessionDate} />
 * ```
 */
export function WebinarSessionSelector({
  sessionDate,
  className = '',
}: WebinarSessionSelectorProps) {
  return (
    <div className={className}>
      {/* Section Header */}
      <p className="text-xs uppercase tracking-wide text-forest/60 mb-2 font-subheader">
        Your Live Session
      </p>

      {/* Single informational card */}
      <div className="flex items-start gap-3 mb-3">
        {/* Calendar Icon */}
        <div className="w-12 h-12 rounded-full bg-wine flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-headline text-lg text-forest font-semibold">
              {sessionDate.displayString}
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-charcoal/70 mb-2">
            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-wine/60" />
            <p className="text-sm font-body">
              90-minute live transformation experience
            </p>
          </div>
          <div className="flex items-start gap-1.5 text-charcoal/60">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-body">
              Join link will be sent to your email 24 hours before the session
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-wine/5 rounded-xl p-3 border border-wine/10">
        <p className="text-xs text-charcoal/60 font-body leading-relaxed">
          <span className="font-semibold text-forest">What to prepare:</span> Workout clothes, water bottle, and 90 minutes of uninterrupted time. No gym equipment needed.
        </p>
      </div>
    </div>
  );
}
