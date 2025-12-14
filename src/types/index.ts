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
  subtext?: string; // Supporting text shown below the question
  options: QuizOption[];
  multiSelect?: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  description?: string; // Italic explanation shown below the option text
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

// Lead capture data
export interface QuizLead {
  name: string;
  email: string;
  whatsapp: string;
}

// Complete quiz response for storage/analytics
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
    trial: number;
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

