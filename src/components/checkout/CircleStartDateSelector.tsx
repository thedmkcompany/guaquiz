'use client';

/**
 * @fileoverview Circle Start Date Selector Component
 *
 * Provides a radio button interface for users to select their Circle program
 * start date. Users choose between two Monday cohorts:
 * - Coming Monday (may be "Today" if it's Monday before 6 AM IST)
 * - Following Monday (+7 days from coming Monday)
 *
 * @module CircleStartDateSelector
 */

import type { CircleStartDateOption } from '@/types';

interface CircleStartDateSelectorProps {
  value: CircleStartDateOption;
  onChange: (option: CircleStartDateOption) => void;
  comingMondayDate: Date;
  followingMondayDate: Date;
  isTodayMonday: boolean;
  className?: string;
}

/**
 * Circle Start Date Selector Component
 *
 * Displays two radio button options for selecting Circle program start date.
 * The UI adapts based on whether today is Monday:
 * - If Monday (before 6 AM): Shows "Start Today (Monday)" and "Start Next Monday"
 * - Otherwise: Shows "Start Coming Monday" and "Start Following Monday"
 *
 * @example
 * ```tsx
 * const [option, setOption] = useState<CircleStartDateOption>('coming-monday');
 * const coming = getComingMondayIST();
 * const following = getFollowingMondayIST();
 * const isMonday = getCurrentISTDate().getDay() === 1;
 *
 * <CircleStartDateSelector
 *   value={option}
 *   onChange={setOption}
 *   comingMondayDate={coming}
 *   followingMondayDate={following}
 *   isTodayMonday={isMonday}
 * />
 * ```
 */
export function CircleStartDateSelector({
  value,
  onChange,
  comingMondayDate,
  followingMondayDate,
  isTodayMonday,
  className = '',
}: CircleStartDateSelectorProps) {
  // Format dates for display
  const formatMonday = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  };

  const comingMondayFormatted = formatMonday(comingMondayDate);
  const followingMondayFormatted = formatMonday(followingMondayDate);

  // Dynamic labels based on whether today is Monday
  const option1Label = isTodayMonday ? 'Start Today (Monday)' : `Start ${comingMondayFormatted}`;
  const option1Badge = isTodayMonday ? 'THIS MONDAY' : 'COMING MONDAY';
  const option2Label = `Start ${followingMondayFormatted}`;
  const option2Badge = isTodayMonday ? 'NEXT MONDAY' : 'FOLLOWING MONDAY';

  return (
    <div className={`space-y-2.5 md:space-y-3 ${className}`}>
      {/* Section Header */}
      <label className="text-xs md:text-sm font-medium text-ivory/90 font-subheader block mb-2 md:mb-3">
        Choose Your Start Date
      </label>

      {/* Option 1: Coming Monday */}
      <button
        type="button"
        onClick={() => onChange('coming-monday')}
        className={`w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-200 ${
          value === 'coming-monday'
            ? 'border-gold bg-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
            : 'border-ivory/30 bg-ivory/10 hover:border-gold/60'
        }`}
        aria-pressed={value === 'coming-monday'}
        aria-label={`Select ${option1Label}`}
      >
        <div className="flex items-start gap-2.5 md:gap-3">
          {/* Radio Circle */}
          <div
            className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
              value === 'coming-monday' ? 'border-gold bg-gold' : 'border-ivory/50'
            }`}
            aria-hidden="true"
          >
            {value === 'coming-monday' && (
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-forest" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 flex-wrap">
              <span className="font-semibold text-ivory text-sm md:text-base font-headline leading-tight">{option1Label}</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider bg-gold/30 text-gold-light px-1.5 md:px-2 py-0.5 rounded-full border border-gold/50 font-subheader whitespace-nowrap">
                {option1Badge}
              </span>
            </div>
            <p className="text-xs md:text-sm text-ivory/70 font-body leading-snug">
              {isTodayMonday
                ? 'Join the community starting today and attend the live session'
                : 'Begin with the full community on Monday\'s first live session'}
            </p>
          </div>
        </div>
      </button>

      {/* Option 2: Following Monday */}
      <button
        type="button"
        onClick={() => onChange('following-monday')}
        className={`w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-200 ${
          value === 'following-monday'
            ? 'border-gold bg-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
            : 'border-ivory/30 bg-ivory/10 hover:border-gold/60'
        }`}
        aria-pressed={value === 'following-monday'}
        aria-label={`Select ${option2Label}`}
      >
        <div className="flex items-start gap-2.5 md:gap-3">
          {/* Radio Circle */}
          <div
            className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
              value === 'following-monday' ? 'border-gold bg-gold' : 'border-ivory/50'
            }`}
            aria-hidden="true"
          >
            {value === 'following-monday' && (
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-forest" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 flex-wrap">
              <span className="font-semibold text-ivory text-sm md:text-base font-headline leading-tight">{option2Label}</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider bg-gold/30 text-gold-light px-1.5 md:px-2 py-0.5 rounded-full border border-gold/50 font-subheader whitespace-nowrap">
                {option2Badge}
              </span>
            </div>
            <p className="text-xs md:text-sm text-ivory/70 font-body leading-snug">
              {isTodayMonday
                ? 'Prepare for a week and start fresh next Monday with your girlies'
                : 'Take an extra week to prepare and join the following Monday cohort'}
            </p>
          </div>
        </div>
      </button>

      {/* Reassurance Note */}
      <p className="text-[10px] md:text-xs text-ivory/50 text-center mt-1.5 md:mt-2 font-body">
        You can change this selection before payment
      </p>
    </div>
  );
}
