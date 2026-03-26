/**
 * @fileoverview Date Utility Functions for Circle, Essentials, and Webinar Programs
 *
 * Handles date calculations for program start dates in IST timezone:
 * - Circle: Mondays at 6 AM IST (live community sessions)
 * - Essentials: 1st and 15th of month at 6 AM IST (cohort-based access)
 * - Webinar: Sundays at 12 PM IST (live transformation sessions)
 *
 * @module date-utils
 */

import type { CircleStartDateOption, CircleStartDateSelection, ChallengeStartDateOption, ChallengeStartDateSelection, WebinarSessionDateSelection } from '@/types';

/**
 * IST timezone identifier for date calculations
 */
const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Circle first session time (6 AM IST)
 */
const CIRCLE_START_HOUR = 6;

/**
 * Essentials program start time (6 AM IST on 1st or 15th of month)
 */
const ESSENTIALS_START_HOUR = 6;

/**
 * Get current date/time in IST timezone
 *
 * @returns Date object representing current time in IST
 *
 * @example
 * ```typescript
 * const now = getCurrentISTDate();
 * console.log(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
 * ```
 */
export function getCurrentISTDate(): Date {
  const now = new Date();
  // Convert to IST string, then parse back to Date
  const istString = now.toLocaleString('en-US', { timeZone: IST_TIMEZONE });
  return new Date(istString);
}

/**
 * Get the coming Monday at 6 AM IST
 *
 * Logic:
 * - If today is Monday before 6 AM IST → returns today at 6 AM
 * - If today is Monday at/after 6 AM IST → returns next Monday (+7 days) at 6 AM
 * - Otherwise → returns the upcoming Monday at 6 AM
 *
 * @returns Date object for coming Monday at 6 AM IST
 *
 * @example
 * ```typescript
 * // Sunday, Dec 22, 2024 at 11:50 PM IST
 * const monday = getComingMondayIST();
 * // Returns: Monday, Dec 23, 2024 at 6:00 AM IST
 *
 * // Monday, Dec 23, 2024 at 5:30 AM IST
 * const monday = getComingMondayIST();
 * // Returns: Monday, Dec 23, 2024 at 6:00 AM IST (same day)
 *
 * // Monday, Dec 23, 2024 at 7:00 AM IST
 * const monday = getComingMondayIST();
 * // Returns: Monday, Dec 30, 2024 at 6:00 AM IST (next week)
 * ```
 */
export function getComingMondayIST(): Date {
  const now = new Date();
  // Get current date in IST
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: IST_TIMEZONE }));

  const dayOfWeek = istDate.getDay(); // 0=Sun, 1=Mon, 2=Tue, ..., 6=Sat

  // Special case: If today is Monday
  if (dayOfWeek === 1) {
    // Before 6 AM IST: start today (same Monday)
    if (istDate.getHours() < CIRCLE_START_HOUR) {
      istDate.setHours(CIRCLE_START_HOUR, 0, 0, 0);
      return istDate;
    }
    // At/After 6 AM IST: start next Monday (7 days later)
    const nextMonday = new Date(istDate);
    nextMonday.setDate(istDate.getDate() + 7);
    nextMonday.setHours(CIRCLE_START_HOUR, 0, 0, 0);
    return nextMonday;
  }

  // For other days: calculate days until next Monday
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
  const comingMonday = new Date(istDate);
  comingMonday.setDate(istDate.getDate() + daysUntilMonday);
  comingMonday.setHours(CIRCLE_START_HOUR, 0, 0, 0);

  return comingMonday;
}

/**
 * Get the Monday following the coming Monday (always +7 days from coming Monday)
 *
 * @returns Date object for following Monday at 6 AM IST
 *
 * @example
 * ```typescript
 * // Any day of the week
 * const following = getFollowingMondayIST();
 * // Returns: Monday that's 7 days after getComingMondayIST()
 * ```
 */
export function getFollowingMondayIST(): Date {
  const coming = getComingMondayIST();
  const following = new Date(coming);
  following.setDate(coming.getDate() + 7);
  return following;
}

/**
 * Check if two dates are the same day (ignoring time)
 *
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns true if dates are the same calendar day
 *
 * @example
 * ```typescript
 * const today = new Date('2024-12-23T10:00:00');
 * const laterToday = new Date('2024-12-23T18:00:00');
 * const tomorrow = new Date('2024-12-24T10:00:00');
 *
 * isSameDay(today, laterToday); // true
 * isSameDay(today, tomorrow); // false
 * ```
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Format date for Circle UI display
 *
 * @param date - Date to format
 * @param isToday - Optional flag indicating if this is today (shows "Today (Monday)")
 * @returns Formatted string for display
 *
 * @example
 * ```typescript
 * const monday = new Date('2024-12-23T00:30:00.000Z'); // Monday in IST
 * formatCircleStartDate(monday); // "Monday, December 23"
 * formatCircleStartDate(monday, true); // "Today (Monday)"
 * ```
 */
export function formatCircleStartDate(date: Date, isToday?: boolean): string {
  if (isToday) {
    return 'Today (Monday)';
  }

  // Format as "Monday, December 23"
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: IST_TIMEZONE,
  });
}

/**
 * Calculate Circle start date based on user selection
 *
 * @param option - User's selected start date option
 * @returns Object with date, ISO string, display string, and isToday flag
 *
 * @example
 * ```typescript
 * const selection = calculateCircleStartDate('coming-monday');
 * console.log(selection.displayString); // "Monday, December 23" or "Today (Monday)"
 * console.log(selection.isoString); // "2024-12-22T00:30:00.000Z"
 * console.log(selection.isToday); // true if Monday before 6 AM
 *
 * // Pass to payment API
 * const response = await fetch('/api/payment/razorpay/create-subscription', {
 *   body: JSON.stringify({
 *     programStartDate: selection.isoString,
 *     startDateOption: selection.option,
 *   })
 * });
 * ```
 */
export function calculateCircleStartDate(
  option: CircleStartDateOption
): CircleStartDateSelection {
  const date = option === 'coming-monday'
    ? getComingMondayIST()
    : getFollowingMondayIST();

  const now = getCurrentISTDate();
  const isToday = isSameDay(date, now);

  return {
    option,
    date,
    isoString: date.toISOString(),
    displayString: formatCircleStartDate(date, isToday),
    isToday,
  };
}

/**
 * Get the next 1st of month at 6 AM IST
 *
 * Logic:
 * - If today is 1st before 6 AM IST → returns today at 6 AM
 * - If today is 1st at/after 6 AM IST → returns 1st of next month at 6 AM
 * - Otherwise → returns 1st of next month at 6 AM
 *
 * @returns Date object for next 1st at 6 AM IST
 *
 * @example
 * ```typescript
 * // January 1st, 2025 at 5:30 AM IST
 * const next1st = getNext1stIST();
 * // Returns: January 1st, 2025 at 6:00 AM IST (same day)
 *
 * // January 1st, 2025 at 7:00 AM IST
 * const next1st = getNext1stIST();
 * // Returns: February 1st, 2025 at 6:00 AM IST (next month)
 *
 * // January 15th, 2025 at 10:00 AM IST
 * const next1st = getNext1stIST();
 * // Returns: February 1st, 2025 at 6:00 AM IST
 * ```
 */
export function getNext1stIST(): Date {
  const now = new Date();
  // Get current date in IST
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: IST_TIMEZONE }));

  const currentDay = istDate.getDate();

  // Special case: If today is 1st
  if (currentDay === 1) {
    // Before 6 AM IST: start today (same day)
    if (istDate.getHours() < ESSENTIALS_START_HOUR) {
      istDate.setHours(ESSENTIALS_START_HOUR, 0, 0, 0);
      return istDate;
    }
    // At/After 6 AM IST: start 1st of next month
    const next1st = new Date(istDate);
    next1st.setMonth(istDate.getMonth() + 1);
    next1st.setDate(1);
    next1st.setHours(ESSENTIALS_START_HOUR, 0, 0, 0);
    return next1st;
  }

  // For any other day: return 1st of next month
  const next1st = new Date(istDate);
  next1st.setMonth(istDate.getMonth() + 1);
  next1st.setDate(1);
  next1st.setHours(ESSENTIALS_START_HOUR, 0, 0, 0);
  return next1st;
}

/**
 * Get the next 15th of month at 6 AM IST
 *
 * Logic:
 * - If today is 15th before 6 AM IST → returns today at 6 AM
 * - If today is 15th at/after 6 AM IST → returns 15th of next month at 6 AM
 * - If today is before 15th → returns 15th of current month at 6 AM
 * - If today is after 15th → returns 15th of next month at 6 AM
 *
 * @returns Date object for next 15th at 6 AM IST
 *
 * @example
 * ```typescript
 * // January 15th, 2025 at 5:30 AM IST
 * const next15th = getNext15thIST();
 * // Returns: January 15th, 2025 at 6:00 AM IST (same day)
 *
 * // January 10th, 2025 at 10:00 AM IST
 * const next15th = getNext15thIST();
 * // Returns: January 15th, 2025 at 6:00 AM IST (same month)
 *
 * // January 20th, 2025 at 10:00 AM IST
 * const next15th = getNext15thIST();
 * // Returns: February 15th, 2025 at 6:00 AM IST (next month)
 * ```
 */
export function getNext15thIST(): Date {
  const now = new Date();
  // Get current date in IST
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: IST_TIMEZONE }));

  const currentDay = istDate.getDate();

  // Special case: If today is 15th
  if (currentDay === 15) {
    // Before 6 AM IST: start today (same day)
    if (istDate.getHours() < ESSENTIALS_START_HOUR) {
      istDate.setHours(ESSENTIALS_START_HOUR, 0, 0, 0);
      return istDate;
    }
    // At/After 6 AM IST: start 15th of next month
    const next15th = new Date(istDate);
    next15th.setMonth(istDate.getMonth() + 1);
    next15th.setDate(15);
    next15th.setHours(ESSENTIALS_START_HOUR, 0, 0, 0);
    return next15th;
  }

  // If before 15th: return 15th of current month
  if (currentDay < 15) {
    const next15th = new Date(istDate);
    next15th.setDate(15);
    next15th.setHours(ESSENTIALS_START_HOUR, 0, 0, 0);
    return next15th;
  }

  // If after 15th: return 15th of next month
  const next15th = new Date(istDate);
  next15th.setMonth(istDate.getMonth() + 1);
  next15th.setDate(15);
  next15th.setHours(ESSENTIALS_START_HOUR, 0, 0, 0);
  return next15th;
}

/**
 * Get the next Essentials program start date (whichever comes first: 1st or 15th)
 *
 * Compares the next 1st and next 15th dates and returns the earlier one.
 *
 * @returns Date object for the next Essentials cohort start date
 *
 * @example
 * ```typescript
 * // January 10th, 2025 at 10:00 AM IST
 * const nextDate = getNextEssentialsDateIST();
 * // Returns: January 15th, 2025 at 6:00 AM IST (comes before Feb 1st)
 *
 * // January 20th, 2025 at 10:00 AM IST
 * const nextDate = getNextEssentialsDateIST();
 * // Returns: February 1st, 2025 at 6:00 AM IST (comes before Feb 15th)
 * ```
 */
export function getNextChallengeDateIST(): Date {
  const next1st = getNext1stIST();
  const next15th = getNext15thIST();

  // Return whichever comes first
  return next1st < next15th ? next1st : next15th;
}

/**
 * Format date for Essentials UI display
 *
 * @param date - Date to format
 * @param isToday - Optional flag indicating if this is today
 * @returns Formatted string for display
 *
 * @example
 * ```typescript
 * const date = new Date('2025-01-15T00:30:00.000Z'); // 15th in IST
 * formatEssentialsStartDate(date); // "January 15th"
 * formatEssentialsStartDate(date, true); // "Today (15th)"
 *
 * const date2 = new Date('2025-02-01T00:30:00.000Z'); // 1st in IST
 * formatEssentialsStartDate(date2); // "February 1st"
 * formatEssentialsStartDate(date2, true); // "Today (1st)"
 * ```
 */
export function formatChallengeStartDate(date: Date, isToday?: boolean): string {
  if (isToday) {
    const dayOfMonth = date.getDate();
    const suffix = dayOfMonth === 1 ? '1st' : '15th';
    return `Today (${suffix})`;
  }

  // Format as "January 1st" or "January 15th"
  const month = date.toLocaleDateString('en-US', {
    month: 'long',
    timeZone: IST_TIMEZONE,
  });

  const day = date.getDate();
  const suffix = day === 1 ? '1st' : '15th';

  return `${month} ${suffix}`;
}

/**
 * Calculate Essentials start date (always returns the next upcoming 1st or 15th)
 *
 * Similar to calculateCircleStartDate but for 1st/15th cadence.
 * Automatically determines which date comes next and returns full selection data.
 *
 * @returns Object with date, ISO string, display string, option, and isToday flag
 *
 * @example
 * ```typescript
 * const selection = calculateEssentialsStartDate();
 * console.log(selection.displayString); // "January 15th" or "Today (1st)"
 * console.log(selection.isoString); // "2025-01-15T00:30:00.000Z"
 * console.log(selection.option); // "coming-1st" or "coming-15th"
 * console.log(selection.isToday); // true if 1st/15th before 6 AM
 *
 * // Pass to payment API
 * const response = await fetch('/api/payment/razorpay/create-subscription', {
 *   body: JSON.stringify({
 *     programStartDate: selection.isoString,
 *     startDateOption: selection.option,
 *   })
 * });
 * ```
 */
export function calculateChallengeStartDate(): ChallengeStartDateSelection {
  const date = getNextChallengeDateIST();
  const now = getCurrentISTDate();
  const isToday = isSameDay(date, now);

  // Determine which option this is based on the day of month
  const dayOfMonth = date.getDate();
  const option: ChallengeStartDateOption = dayOfMonth === 1 ? 'coming-1st' : 'coming-15th';

  return {
    option,
    date,
    isoString: date.toISOString(),
    displayString: formatChallengeStartDate(date, isToday),
    isToday,
  };
}

// Backward-compatible exports for existing imports.
export const getNextEssentialsDateIST = getNextChallengeDateIST;
export const formatEssentialsStartDate = formatChallengeStartDate;
export const calculateEssentialsStartDate = calculateChallengeStartDate;

// ============================================================================
// WEBINAR DATE UTILITIES
// ============================================================================

/**
 * Webinar session time (12 PM IST on Sundays)
 */
const WEBINAR_SESSION_HOUR = 12;

/**
 * Get the next Sunday at 12 PM IST (ALWAYS skips today if Sunday)
 *
 * Logic:
 * - If today is Sunday (any time) → returns NEXT Sunday (+7 days) at 12 PM
 * - Otherwise → returns the upcoming Sunday at 12 PM
 *
 * This differs from Circle/Essentials which allow "today" before the session time.
 * For webinar, we ALWAYS skip the current Sunday to ensure adequate preparation time.
 *
 * @returns Date object for next Sunday at 12 PM IST
 *
 * @example
 * ```typescript
 * // Sunday, Dec 17, 2025 at 5:00 AM IST
 * const sunday = getNextSundayIST();
 * // Returns: Sunday, Dec 24, 2025 at 12:00 PM IST (skip current Sunday)
 *
 * // Monday, Dec 18, 2025 at 10:00 AM IST
 * const sunday = getNextSundayIST();
 * // Returns: Sunday, Dec 22, 2025 at 12:00 PM IST (this coming Sunday)
 * ```
 */
export function getNextSundayIST(): Date {
  const now = new Date();
  // Get current date in IST
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: IST_TIMEZONE }));

  const dayOfWeek = istDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Special case: If today is Sunday, ALWAYS skip to next Sunday
  if (dayOfWeek === 0) {
    const nextSunday = new Date(istDate);
    nextSunday.setDate(istDate.getDate() + 7);
    nextSunday.setHours(WEBINAR_SESSION_HOUR, 0, 0, 0);
    return nextSunday;
  }

  // For other days: calculate days until next Sunday
  const daysUntilSunday = 7 - dayOfWeek;
  const nextSunday = new Date(istDate);
  nextSunday.setDate(istDate.getDate() + daysUntilSunday);
  nextSunday.setHours(WEBINAR_SESSION_HOUR, 0, 0, 0);

  return nextSunday;
}

/**
 * Format date for Webinar session display (includes time)
 *
 * Unlike Circle/Essentials, webinar formatting includes the session time
 * since it's a one-time live event at a specific time.
 *
 * @param date - Date to format
 * @returns Formatted string for display
 *
 * @example
 * ```typescript
 * const date = new Date('2025-12-21T06:30:00.000Z'); // Sunday in IST
 * formatWebinarSessionDate(date); // "Sunday, December 21 at 12:00 PM IST"
 * ```
 */
export function formatWebinarSessionDate(date: Date): string {
  // Format day and date: "Sunday, December 21"
  const dayAndDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: IST_TIMEZONE,
  });

  // Format time: "12:00 PM"
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE,
  });

  return `${dayAndDate} at ${time} IST`;
}

/**
 * Calculate Webinar session date (always returns next upcoming Sunday at 12 PM)
 *
 * Automatically determines the next Sunday and returns full selection data.
 * Unlike Circle, there's no user choice - it's always the next Sunday.
 *
 * @returns Object with date, ISO string, display string, and option
 *
 * @example
 * ```typescript
 * const selection = calculateWebinarSessionDate();
 * console.log(selection.displayString); // "Sunday, December 21 at 12:00 PM IST"
 * console.log(selection.isoString); // "2025-12-21T06:30:00.000Z"
 * console.log(selection.option); // "next-sunday"
 * ```
 */
export function calculateWebinarSessionDate(): WebinarSessionDateSelection {
  const date = getNextSundayIST();

  return {
    option: 'next-sunday',
    date,
    isoString: date.toISOString(),
    displayString: formatWebinarSessionDate(date),
  };
}
