// Program definitions
export interface Program {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  wixProductId?: string; // The product ID from Wix Store
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

// Checkout types
export interface CheckoutRequest {
  programId: string;
  customerEmail?: string;
  customerName?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  checkoutId: string;
}
