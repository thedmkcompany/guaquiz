"use client";

import { useState, memo } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  timeRange: string;
  headline: string;
  subheadline: string;
  description: string;
  unlocks: string[];
  isFirst?: boolean;
  isLast?: boolean;
}

export const TimelineItem = memo(function TimelineItem({
  timeRange,
  headline,
  subheadline,
  description,
  unlocks,
  isFirst = false,
  isLast = false,
}: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(isFirst);

  return (
    <article className="relative">
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-[22px] md:left-[26px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-gold to-gold/20" />
      )}

      <div
        className={cn(
          "glass-card rounded-[2rem] border border-white/60 transition-all duration-300 flex flex-col p-5 md:p-7 lg:p-8",
          isExpanded ? "shadow-float" : "shadow-medium"
        )}
      >
        {/* Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left focus:outline-none"
        >
          <div className="flex items-start gap-4 md:gap-5">
            {/* Time badge */}
            <div className="flex-shrink-0 w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-gold to-gold-dark text-charcoal flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(212,175,55,0.4)]">
              <Clock className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-subheader font-bold text-gold-dark text-xs md:text-sm uppercase tracking-wider">
                  {timeRange}
                </span>
                <div className="flex-shrink-0 text-forest/50">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
              <h3 className="font-headline text-lg md:text-xl lg:text-2xl text-forest mt-1 md:mt-2">
                {headline}
              </h3>
              <p className="font-subheader text-sm md:text-base text-charcoal/70 mt-1">
                {subheadline}
              </p>
            </div>
          </div>
        </button>

        {/* Expandable content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[500px] opacity-100 mt-5 md:mt-6" : "max-h-0 opacity-0"
          )}
        >
          <div className="pl-15 md:pl-18">
            <p className="text-sm md:text-base text-charcoal/80 font-body leading-relaxed mb-5 md:mb-6">
              {description}
            </p>

            {/* What this unlocks */}
            <div className="bg-beige-light/50 rounded-xl md:rounded-2xl p-4 md:p-5">
              <p className="font-subheader font-semibold text-forest text-xs md:text-sm uppercase tracking-wider mb-3">
                What this unlocks:
              </p>
              <ul className="space-y-2">
                {unlocks.map((unlock, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm md:text-base text-charcoal/70 font-body"
                  >
                    <span className="text-gold flex-shrink-0 mt-0.5">•</span>
                    {unlock}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
