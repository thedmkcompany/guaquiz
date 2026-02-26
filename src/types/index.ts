/**
 * @fileoverview Core Type Definitions
 *
 * Central type definitions for the DMK Quiz application.
 * These types are used throughout the codebase for type safety.
 *
 * @module types
 */

/**
 * Union type for all valid program identifiers.
 */
export type ProgramId = 'essentials' | 'webinar' | 'circle' | 'transform' | 'transform-strategy';

/**
 * Program definition representing a transformation program offering.
 *
 * Programs are the core product offerings with pricing, features,
 * and integration configurations for Wix and Razorpay.
 */
export interface Program {
  id: string;
  slug: string;
  name: string;
  tagline?: string; // Short tagline for the program
  description: string;
  price: number;
  originalPrice?: number; // For showing discounts
  currency: string;
  features: string[];
  wixProductId?: string; // The product ID from Wix Store
  wixPlanId?: string; // The pricing plan ID from Wix for CRM assignment
  // Subscription support
  isSubscription?: boolean; // Whether this is a recurring payment
  razorpayPlanId?: string; // Razorpay Plan ID for subscriptions
  subscriptionInterval?: 'monthly' | 'yearly'; // Billing frequency
  // Funnel-specific
  requiresCall?: boolean; // If true, show Calendly instead of direct payment (e.g., Transform)
  calendlyUrl?: string; // Calendly booking URL for high-ticket items
  upsellTo?: string; // Program ID to upsell to after purchase (e.g., Webinar -> Circle)
  tier: 'essentials' | 'webinar' | 'circle' | 'transform' | 'transform-strategy'; // Program tier for styling/logic
  schedulerUrl?: string; // External scheduler URL shown on success page (e.g., Zoom scheduler)
}

/**
 * Quiz question definition with options and scoring weights.
 */
export interface QuizQuestion {
  id: string;
  question: string;
  subtext?: string; // Supporting text shown below the question
  options: QuizOption[];
  multiSelect?: boolean;
}

/**
 * Individual quiz option with scoring weights.
 *
 * Each option contributes points to program scores when selected.
 * Negative scores can be used to disqualify programs.
 */
export interface QuizOption {
  /** Unique option identifier (e.g., 'q1-a') */
  id: string;
  /** Main option text displayed to user */
  text: string;
  /** Optional description shown below the option text */
  description?: string;
  /** Scoring weights for each program (can be negative) */
  scores: Partial<Record<ProgramId, number>>;
}

/**
 * User's answer to a single quiz question.
 */
export interface QuizAnswer {
  /** ID of the question being answered */
  questionId: string;
  /** IDs of selected options (supports multi-select) */
  selectedOptionIds: string[];
}

/**
 * Calculated quiz result with recommended program.
 */
export interface QuizResult {
  /** Recommended program ID */
  programId: string;
  /** URL-friendly slug for results page */
  programSlug: string;
  /** Highest score achieved */
  score: number;
  /** All program scores for debugging/analytics */
  allScores: Partial<Record<ProgramId, number>>;
}

/**
 * Lead capture form data collected after quiz completion.
 */
export interface QuizLead {
  /** Full name */
  name: string;
  /** Email address */
  email: string;
  /** WhatsApp number with country code */
  whatsapp: string;
}

/**
 * Complete quiz response for storage and analytics.
 *
 * Contains all data from a quiz session including answers,
 * scores, timing, and optional lead information.
 */
export interface QuizResponse {
  // Timestamps
  startedAt: string; // ISO timestamp
  completedAt: string; // ISO timestamp

  // All answers (Q1-Q8)
  answers: {
    [questionId: string]: string[]; // Array of selected option IDs
  };

  // Calculated scores
  scores: {
    essentials: number;
    webinar: number;
    circle: number;
    transform: number;
  };

  // Final recommendation
  recommendation: string; // Program slug

  // Device & tracking
  deviceType: 'mobile' | 'desktop' | 'tablet';
  referralSource?: string;

  // Lead info (optional until capture)
  lead?: QuizLead;
}

/**
 * Circle program start date selection option.
 *
 * Circle is a community-based program with live sessions on Monday,
 * so users choose between two Monday cohorts:
 * - 'coming-monday': The approaching Monday (may be today if Monday before 6 AM IST)
 * - 'following-monday': The Monday after coming Monday (+7 days)
 */
export type CircleStartDateOption = 'coming-monday' | 'following-monday';

/**
 * Calculated Circle start date with multiple formats.
 *
 * This interface provides all the data needed for:
 * - UI display (displayString)
 * - API/database storage (isoString)
 * - Payment flow tracking (option)
 * - Conditional rendering (isToday)
 */
export interface CircleStartDateSelection {
  /** Selected option by user */
  option: CircleStartDateOption;
  /** Date object for the selected Monday */
  date: Date;
  /** ISO 8601 string for API/database storage (UTC) */
  isoString: string;
  /** Human-readable display string ("Today (Monday)" or "Monday, December 23") */
  displayString: string;
  /** True if coming-monday is today (Monday before 6 AM IST) */
  isToday: boolean;
}

/**
 * Essentials program start date selection option.
 *
 * Essentials is a self-paced program with cohorts starting on 1st or 15th.
 * Users see only ONE option: whichever comes next (1st or 15th).
 * - 'coming-1st': The approaching 1st of the month (may be today if 1st before 6 AM IST)
 * - 'coming-15th': The approaching 15th of the month (may be today if 15th before 6 AM IST)
 */
export type EssentialsStartDateOption = 'coming-1st' | 'coming-15th';

/**
 * Calculated Essentials start date with multiple formats.
 *
 * This interface provides all the data needed for:
 * - UI display (displayString)
 * - API/database storage (isoString)
 * - Payment flow tracking (option)
 * - Conditional rendering (isToday)
 *
 * Similar to CircleStartDateSelection but for 1st/15th cadence.
 */
export interface EssentialsStartDateSelection {
  /** Selected option (always the next upcoming date: 1st or 15th) */
  option: EssentialsStartDateOption;
  /** Date object for the selected 1st or 15th */
  date: Date;
  /** ISO 8601 string for API/database storage (UTC) */
  isoString: string;
  /** Human-readable display string ("Today (1st)" or "January 15th") */
  displayString: string;
  /** True if the start date is today (1st or 15th before 6 AM IST) */
  isToday: boolean;
}

/**
 * Webinar session date selection option.
 *
 * Webinar is a live event on Sundays at 12 PM IST.
 * Unlike Circle (2 options) or Essentials (automatic), webinar has only one option:
 * the next upcoming Sunday. The option is included for consistency with other programs.
 */
export type WebinarSessionDateOption = 'next-sunday';

/**
 * Calculated Webinar session date with multiple formats.
 *
 * This interface provides all the data needed for:
 * - UI display (displayString with time)
 * - API/database storage (isoString)
 * - Payment flow tracking (option)
 *
 * Similar to EssentialsStartDateSelection but:
 * - Uses "session" terminology (it's a live event, not ongoing access)
 * - Includes time in display string (12:00 PM IST)
 * - No isToday flag (we always skip current Sunday)
 */
export interface WebinarSessionDateSelection {
  /** Selected option (always 'next-sunday' for automatic assignment) */
  option: WebinarSessionDateOption;
  /** Date object for the next Sunday session */
  date: Date;
  /** ISO 8601 string for API/database storage (UTC) */
  isoString: string;
  /** Human-readable display string ("Sunday, December 21 at 12:00 PM IST") */
  displayString: string;
}

