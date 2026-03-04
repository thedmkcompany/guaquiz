/**
 * @fileoverview Program Definitions and Pricing
 *
 * This module contains all transformation program definitions with their
 * pricing, features, and configuration for payment gateways and CRM.
 *
 * @module programs
 *
 * ## Program Tiers
 *
 * | Tier | Price | Description |
 * |------|-------|-------------|
 * | Essentials | ₹1,999 | Entry-level, self-paced |
 * | Webinar | ₹199 | Low-commitment taster (upsells to Circle) |
 * | Circle | ₹3,999 | Community-driven group coaching |
 * | Transform Strategy | ₹1,999 | 1:1 strategy session |
 * | Transform | ₹1,20,000 | 1:1 transformation |
 *
 * ## Usage
 *
 * @example
 * ```typescript
 * import { getProgramById, formatPrice } from '@/lib/programs';
 *
 * const program = getProgramById('circle');
 * if (program) {
 *   console.log(`${program.name}: ${formatPrice(program.price)}`);
 *   // Output: "Circle: ₹3,999"
 * }
 * ```
 */

import { Program } from "@/types";

/**
 * All available transformation programs.
 *
 * Each program includes pricing, features, and integration IDs for
 * Wix CRM and Razorpay payment gateway.
 *
 * @constant
 * @type {Program[]}
 */
export const programs: Program[] = [
  {
    id: "essentials",
    slug: "essentials",
    name: "Essentials",
    tagline: "Structure on your schedule.",
    description: "The complete system for women who rise on their own time. Everything you need, exactly when you need it.",
    price: 1999,
    currency: "INR",
    tier: "essentials",
    features: [
      "24 recorded workouts",
      "On-demand workout library",
      "Meal guides & habit trackers",
      "Cancel anytime",
    ],
    isSubscription: true,
    subscriptionInterval: 'monthly',
    // Configure these in Wix Dashboard and Razorpay Dashboard:
    wixPlanId: process.env.WIX_PLAN_ID_ESSENTIALS || "",
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_ESSENTIALS || "",
  },
  {
    id: "webinar",
    slug: "webinar",
    name: "Webinar",
    tagline: "Your first step into hot and unstoppable.",
    description: "Experience DMK live. Test the energy, meet the method, and decide if this is your tribe.",
    price: 199,
    currency: "INR",
    tier: "webinar",
    features: [
      "90-minute live transformation session",
      "Full-body workout + mindset coaching",
      "Community energy that ignites you",
      "Direct path to Circle if you're ready",
    ],
    isSubscription: false,
    upsellTo: "circle", // After webinar, upsell to Circle
    wixPlanId: process.env.WIX_PLAN_ID_WEBINAR || "",
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_WEBINAR || "",
  },
  {
    id: "circle",
    slug: "circle",
    name: "Circle",
    tagline: "Your tribe. Your transformation.",
    description: "Accountability meets sisterhood. Live workouts, weekly check-ins, and a community of unstoppable women.",
    price: 3999,
    currency: "INR",
    tier: "circle",
    features: [
      "6 live sessions weekly",
      "Weekly group coaching calls",
      "Private Circle community",
      "Nutrition & habit coaching",
      "Monthly body composition tracking",
      "Priority WhatsApp support",
    ],
    isSubscription: true,
    subscriptionInterval: 'monthly',
    wixPlanId: process.env.WIX_PLAN_ID_CIRCLE || "",
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_CIRCLE || "",
  },
  {
    id: "transform-strategy-call",
    slug: "transform-strategy-call",
    name: "Transform Strategy Call",
    tagline: "60-minute strategy session with Disha",
    description: "Book a personal strategy session with Disha to design your transformation roadmap. This fee is credited back if you enroll in the full Transform program.",
    price: 1999,
    currency: "INR",
    tier: "transform-strategy",
    features: [
      "60-minute private strategy session",
      "Complete transformation assessment",
      "Personalized roadmap across fitness, beauty, finance & confidence",
      "Q&A with Disha",
      "₹1,999 credited to Transform enrollment",
    ],
    isSubscription: false,
    schedulerUrl: "https://scheduler.zoom.us/teamdmk/strategy-call-with-disha",
    wixPlanId: process.env.WIX_PLAN_ID_TRANSFORM_STRATEGY || "",
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_TRANSFORM_STRATEGY || "",
  },
  {
    id: "transform",
    slug: "transform",
    name: "Transform",
    tagline: "Your personal transformation architect.",
    description: "1-on-1 with Disha. Custom everything. This is where complete transformation happens.",
    price: 120000,
    currency: "INR",
    tier: "transform",
    features: [
      "24 weeks of personalized training",
      "Weekly 1-on-1 sessions with Disha",
      "Custom workout & nutrition plans",
      "Mindset, beauty & finance coaching",
      "Direct access to Coaches",
      "Post-program maintenance plan",
    ],
    isSubscription: false,
    requiresCall: true, // High-ticket requires strategy call (₹1,999)
    calendlyUrl: process.env.CALENDLY_URL_TRANSFORM || "",
    wixPlanId: process.env.WIX_PLAN_ID_TRANSFORM || "",
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID_TRANSFORM || "",
  },
];

/**
 * Optimized lookup maps for O(1) program retrieval.
 * Pre-computed at module load time for performance.
 * @internal
 */
const programsById = new Map<string, Program>(
  programs.map((p) => [p.id, p])
);

/** @internal */
const programsBySlug = new Map<string, Program>(
  programs.map((p) => [p.slug, p])
);

/** @internal */
const programsByTier = new Map<Program['tier'], Program>(
  programs.map((p) => [p.tier, p])
);

/**
 * Retrieves a program by its unique ID.
 *
 * @param id - The program ID (e.g., 'circle', 'transform')
 * @returns The matching program or undefined if not found
 *
 * @example
 * ```typescript
 * const program = getProgramById('circle');
 * if (program) {
 *   console.log(program.price); // 3999
 * }
 * ```
 */
export function getProgramById(id: string): Program | undefined {
  return programsById.get(id);
}

/**
 * Retrieves a program by its URL slug.
 *
 * @param slug - The URL-friendly slug (e.g., 'circle', 'transform-strategy-call')
 * @returns The matching program or undefined if not found
 *
 * @example
 * ```typescript
 * // In results page: /results/circle
 * const program = getProgramBySlug(params.slug);
 * ```
 */
export function getProgramBySlug(slug: string): Program | undefined {
  return programsBySlug.get(slug);
}

/**
 * Retrieves a program by its tier classification.
 *
 * @param tier - The program tier
 * @returns The matching program or undefined if not found
 */
export function getProgramByTier(tier: Program['tier']): Program | undefined {
  return programsByTier.get(tier);
}

/**
 * Returns all available programs.
 *
 * @returns Array of all program definitions
 */
export function getAllPrograms(): Program[] {
  return programs;
}

/**
 * Returns programs that support direct payment (no call required).
 *
 * These programs can be purchased directly through the checkout flow
 * without scheduling a strategy call first.
 *
 * @returns Array of programs where `requiresCall` is false
 *
 * @example
 * ```typescript
 * const directPrograms = getDirectPaymentPrograms();
 * // Returns: Essentials, Webinar, Circle, Transform Strategy
 * ```
 */
export function getDirectPaymentPrograms(): Program[] {
  return programs.filter((p) => !p.requiresCall);
}

/**
 * Returns high-ticket programs that require a strategy call.
 *
 * These programs require the user to book a call before purchasing.
 * Currently only Transform falls into this category.
 *
 * @returns Array of programs where `requiresCall` is true
 */
export function getHighTicketPrograms(): Program[] {
  return programs.filter((p) => p.requiresCall);
}

/**
 * Formats a price for display with Indian locale formatting.
 *
 * @param price - The price in smallest currency unit (e.g., 3999 for ₹3,999)
 * @param currency - ISO currency code (default: 'INR')
 * @returns Formatted price string with currency symbol
 *
 * @example
 * ```typescript
 * formatPrice(3999);        // "₹3,999"
 * formatPrice(120000);      // "₹1,20,000"
 * formatPrice(100, 'USD');  // "$100"
 * ```
 */
export function formatPrice(price: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Returns the brand color associated with a program tier.
 *
 * Used for consistent UI styling across the application.
 *
 * @param tier - The program tier
 * @returns Color name from brand palette
 *
 * @example
 * ```typescript
 * const color = getTierColor('circle'); // 'wine'
 * // Use in Tailwind: `bg-${color}-500`
 * ```
 */
export function getTierColor(tier: Program['tier']): string {
  const colors: Record<string, string> = {
    essentials: "gold",           // Gold - Prestige & warmth
    webinar: "beige",             // Beige - Soft femininity
    circle: "wine",               // Wine - Passion & luxury
    transform: "forest",          // Forest - Strength & sophistication
    "transform-strategy": "wine", // Wine - Premium strategy call
  };
  return colors[tier] || "slate";
}
