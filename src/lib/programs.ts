import { Program } from "@/types";

// ============================================
// DMK FUNNEL PROGRAMS
// ============================================
// 4 tiers based on quiz scoring:
// - Essentials: Entry-level (₹2,499)
// - Trial: Low-commitment trial (₹499) - upsells to Circle
// - Circle: Mid-tier community (₹4,499)
// - Transform: High-ticket 1:1 (₹1,49,999) - requires sales call
// ============================================

export const programs: Program[] = [
  {
    id: "essentials",
    slug: "essentials",
    name: "Essentials",
    tagline: "Start your transformation journey",
    description: "Perfect for beginners who want to build a strong foundation. Get access to core modules and start seeing results.",
    price: 2499,
    currency: "INR",
    tier: "essentials",
    features: [
      "Core transformation modules",
      "Self-paced learning",
      "Lifetime access to content",
      "Email support",
    ],
    isSubscription: false,
    wixProductId: "",
    wixPlanId: "",
  },
  {
    id: "trial",
    slug: "trial",
    name: "Trial",
    tagline: "Experience the magic first",
    description: "Try before you commit. Get a taste of our methodology with this affordable trial experience.",
    price: 499,
    currency: "INR",
    tier: "trial",
    features: [
      "7-day trial access",
      "Sample modules",
      "Live trial session",
      "Community preview",
    ],
    isSubscription: false,
    upsellTo: "circle", // After trial, upsell to Circle
    wixProductId: "",
    wixPlanId: "",
  },
  {
    id: "circle",
    slug: "circle",
    name: "Circle",
    tagline: "Join our transformation community",
    description: "Be part of an exclusive community of women on the same journey. Get group coaching, live sessions, and accountability.",
    price: 4499,
    currency: "INR",
    tier: "circle",
    features: [
      "Everything in Essentials",
      "Weekly live group sessions",
      "Private community access",
      "Group coaching calls",
      "Accountability partners",
      "Bonus masterclasses",
    ],
    isSubscription: false,
    wixProductId: "",
    wixPlanId: "",
  },
  {
    id: "transform",
    slug: "transform",
    name: "Transform",
    tagline: "Complete 1:1 transformation",
    description: "For those ready for a complete life transformation. Personalized 1:1 coaching, custom plans, and VIP support.",
    price: 149999,
    currency: "INR",
    tier: "transform",
    features: [
      "Everything in Circle",
      "Personal 1:1 coaching",
      "Custom transformation plan",
      "Weekly private calls",
      "VIP WhatsApp support",
      "Lifetime access + updates",
      "3-month intensive program",
    ],
    isSubscription: false,
    requiresCall: true, // High-ticket requires sales call
    calendlyUrl: "", // Add your Calendly URL
    wixProductId: "",
    wixPlanId: "",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getProgramById(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getProgramByTier(tier: Program['tier']): Program | undefined {
  return programs.find((p) => p.tier === tier);
}

export function getAllPrograms(): Program[] {
  return programs;
}

export function getDirectPaymentPrograms(): Program[] {
  return programs.filter((p) => !p.requiresCall);
}

export function getHighTicketPrograms(): Program[] {
  return programs.filter((p) => p.requiresCall);
}

// Format price for display
export function formatPrice(price: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Get tier display color (for UI styling)
export function getTierColor(tier: Program['tier']): string {
  const colors = {
    essentials: "blue",
    trial: "green",
    circle: "purple",
    transform: "gold",
  };
  return colors[tier] || "gray";
}
