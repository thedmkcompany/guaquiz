'use client';

/**
 * @fileoverview Essentials Start Date Display Component
 *
 * Shows the user their upcoming Essentials start date (1st or 15th).
 * Unlike Circle's selector, this is informational only - no choice to make.
 * The system automatically assigns the next available cohort date.
 *
 * @module EssentialsStartDateSelector
 */

import { Calendar, Info } from 'lucide-react';
import type { ChallengeStartDateSelection } from '@/types';

interface ChallengeStartDateSelectorProps {
  startDate: ChallengeStartDateSelection;
  className?: string;
}

/**
 * Essentials Start Date Display Component
 *
 * Displays a single informational card showing when the user's Essentials
 * program will begin. Shows either "Starting Today" or "Starting [Date]".
 *
 * @example
 * ```tsx
 * const startDate = calculateEssentialsStartDate();
 *
 * <EssentialsStartDateSelector startDate={startDate} />
 * ```
 */
export function ChallengeStartDateSelector({
  startDate,
  className = '',
}: ChallengeStartDateSelectorProps) {
  const dayOfMonth = startDate.date.getDate();
  const isFirst = dayOfMonth === 1;
  const cohortName = isFirst ? '1st of Month' : '15th of Month';

  // Calculate next cohort date (opposite of current)
  const nextCohortDay = isFirst ? '15th' : '1st';
  const nextCohortMonth = isFirst ? 'this month' : 'next month';

  return (
    <div className={className}>
      {/* Section Header */}
      <p className="text-xs uppercase tracking-wide text-forest/60 mb-2 font-subheader">
        Your Program Start Date
      </p>

      {/* Single informational card */}
      <div className="flex items-start gap-3 mb-3">
        {/* Calendar Icon */}
        <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-forest" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-headline text-lg text-forest font-semibold">
              {startDate.isToday ? 'Starting Today!' : `Starting ${startDate.displayString}`}
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-gold/40 text-forest px-2 py-0.5 rounded-full border border-gold/60 font-subheader">
              {cohortName}
            </span>
          </div>
          <p className="text-sm text-charcoal/70 font-body mb-2">
            {startDate.isToday
              ? 'Your program access begins at 6:00 AM IST today'
              : 'Your program access begins on this date at 6:00 AM IST'}
          </p>
          <div className="flex items-start gap-1.5 text-charcoal/60">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-body">
              All content unlocks automatically on your start date!
            </p>
          </div>
        </div>
      </div>

      {/* Reassurance Note */}
      <p className="text-xs text-charcoal/50 text-center mt-2 font-body">
        Next cohort: {nextCohortDay} of {nextCohortMonth}
      </p>
    </div>
  );
}

// Backward-compatible export name.
export const EssentialsStartDateSelector = ChallengeStartDateSelector;
