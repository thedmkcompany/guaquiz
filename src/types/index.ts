// Program definitions
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
  upsellTo?: string; // Program ID to upsell to after purchase (e.g., Trial -> Circle)
  tier: 'essentials' | 'trial' | 'circle' | 'transform'; // Program tier for styling/logic
}

// Quiz types
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  // Scoring weights for each program
  scores: {
    [programId: string]: number;
  };
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuizResult {
  programId: string;
  programSlug: string;
  score: number;
  allScores: { [programId: string]: number };
}

