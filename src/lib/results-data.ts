// Types imported from @/types as needed

// ============================================
// QUIZ PERSONALIZATION TAGS
// ============================================
// Based on quiz responses, dynamically insert copy

export interface QuizPersonalization {
  heroSubheadline: string;
  whyThisWorksReason: string;
  readyStatement: string;
  // Trial-specific personalization
  trialHeroSubheadline: string;
  trialWhyThisWorksReason: string;
}

export interface QuizPersonalizationMap {
  [q1OptionId: string]: QuizPersonalization;
}

export const quizPersonalization: QuizPersonalizationMap = {
  "q1-a": {
    // Survival mode - needs to work around demanding schedule
    heroSubheadline:
      "Based on your quiz answers, you're ready to move from survival to thriving—the perfect foundation for lasting transformation.",
    whyThisWorksReason: "you need to work around a demanding schedule",
    readyStatement: "move from surviving to thriving",
    // Trial-specific
    trialHeroSubheadline:
      "You need to see results before committing—we get it.",
    trialWhyThisWorksReason: "you need to see what works before fully committing",
  },
  "q1-b": {
    // Inconsistent - wants to start at own pace
    heroSubheadline:
      "Based on your quiz answers, you're ready for structure with flexibility—the perfect foundation for lasting transformation.",
    whyThisWorksReason: "you want to start at your own pace",
    readyStatement: "build consistency that lasts",
    // Trial-specific
    trialHeroSubheadline:
      "You've started and stopped before—this time is different.",
    trialWhyThisWorksReason: "you need to experience first before committing",
  },
  "q1-c": {
    // Ready to go all in - values independence
    heroSubheadline:
      "Based on your quiz answers, you're ready to go all in—this is the foundation that makes discipline feel luxurious.",
    whyThisWorksReason: "you value independence",
    readyStatement: "transform at the highest level",
    // Trial-specific
    trialHeroSubheadline:
      "You're ready to experience, not just believe—smart choice.",
    trialWhyThisWorksReason: "you're looking for proof before you invest fully",
  },
};

export function getQuizPersonalization(q1OptionId: string): QuizPersonalization {
  return (
    quizPersonalization[q1OptionId] || {
      heroSubheadline:
        "Based on your quiz answers, you're ready for structure with flexibility—the perfect foundation for lasting transformation.",
      whyThisWorksReason: "you need to work around a demanding schedule",
      readyStatement: "build consistency",
      trialHeroSubheadline:
        "You've started and stopped before—this time is different.",
      trialWhyThisWorksReason: "you need to experience first before committing",
    }
  );
}

// ============================================
// FULL QUIZ PERSONALIZATION (Multi-Answer)
// ============================================
// Extended personalization using all quiz answers

export interface QuizAnswers {
  q1?: string; // Current era
  q2?: string; // Goals
  q3?: string; // Rise style
  q4?: string; // Time commitment
  q5?: string; // Ideal experience
  q6?: string; // History with programs
  q7?: string; // Investment level
  q8?: string; // When to start
}

export interface FullQuizPersonalization extends QuizPersonalization {
  goalFocus: string;
  riseStyle: string;
  historyAcknowledgment: string;
  timeCommitment: string;
  urgencyMessage: string;
}

// Q2: Goals personalization
const q2Personalization: { [key: string]: string } = {
  "q2-a": "Your focus on feeling powerful in your body is exactly where transformation begins.",
  "q2-b": "Building unshakeable confidence is at the heart of what we do. When you trust yourself, everything changes.",
  "q2-c": "Creating sustainable, high-performing systems is how successful women operate.",
  "q2-d": "You want complete transformation—body, confidence, and lifestyle. And you deserve it all.",
};

// Q3: Rise style personalization
const q3Personalization: { [key: string]: string } = {
  "q3-a": "You thrive with flexibility, working at your own pace. This program respects your autonomy.",
  "q3-b": "You rise with your tribe. The community energy and sisterhood will be your superpower.",
  "q3-c": "You want personalized guidance. Having a transformation architect in your corner changes everything.",
};

// Q4: Time commitment personalization
const q4Personalization: { [key: string]: string } = {
  "q4-a": "With 2-3 hours weekly, you'll see meaningful progress. Consistency beats intensity.",
  "q4-b": "With 4-6 hours weekly, you have the perfect balance for steady transformation.",
  "q4-c": "With 7+ hours weekly, you're ready for accelerated results.",
};

// Q6: History acknowledgment
const q6Personalization: { [key: string]: string } = {
  "q6-a": "This is your first real commitment—and you've chosen wisely.",
  "q6-b": "You've started and stopped before. This program is designed to break that cycle.",
  "q6-c": "You've hit a ceiling and need the next level. This is your breakthrough.",
};

// Q8: Urgency personalization
const q8Personalization: { [key: string]: string } = {
  "q8-a": "You're ready to start this week. That energy? Channel it.",
  "q8-b": "You want to prepare first—that's thoughtful. Use this time wisely.",
  "q8-c": "You're exploring options. Take the next step when you're ready.",
};

export function getFullQuizPersonalization(answers: QuizAnswers): FullQuizPersonalization {
  const basePersonalization = getQuizPersonalization(answers.q1 || "q1-b");

  return {
    ...basePersonalization,
    goalFocus: q2Personalization[answers.q2 || "q2-d"] || q2Personalization["q2-d"],
    riseStyle: q3Personalization[answers.q3 || "q3-a"] || q3Personalization["q3-a"],
    timeCommitment: q4Personalization[answers.q4 || "q4-b"] || q4Personalization["q4-b"],
    historyAcknowledgment: q6Personalization[answers.q6 || "q6-a"] || q6Personalization["q6-a"],
    urgencyMessage: q8Personalization[answers.q8 || "q8-a"] || q8Personalization["q8-a"],
  };
}

// ============================================
// PROGRAM CONTENT - COMPLETE DATA PER PROGRAM
// ============================================

export interface ProgramPillar {
  icon: "body" | "beauty" | "finance" | "confidence";
  title: string;
  headline: string;
  description: string;
  benefits: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  age: number;
  membershipDuration: string;
  quote: string;
  photoUrl?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface UpgradePath {
  headline: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface ProgramContent {
  // Hero Section
  badge: string;
  heroHeadline: string;
  heroSubheadlineTemplate: string; // Uses {personalization} placeholder
  heroImageAlt: string;

  // Transformation Journey Section
  journeySectionHeadline: string;
  journeyIntro: string;

  // 4 Pillars
  pillars: ProgramPillar[];

  // Disha Validation Section
  dishaHeadline: string;
  dishaQuote: string;
  dishaSignature?: string; // Optional custom signature (default: "Disha Methi Khandelwal")
  dishaCredentials?: string; // Optional custom credentials

  // Investment Section
  investmentHeadline: string;
  pricePerDay: string;
  priceComparison: string;
  investmentDescription: string;
  ctaText: string;
  trustSignals: string[];

  // Why This Works Section
  whyWorksHeadline: string;
  whyWorksIntroTemplate: string; // Uses {reason} placeholder
  whyWorksBenefits: {
    headline: string;
    description: string;
  }[];

  // Testimonials
  testimonialsHeadline: string;
  testimonials: Testimonial[];

  // FAQs
  faqHeadline: string;
  faqs: FAQ[];

  // Upgrade Path (optional)
  upgradePath?: UpgradePath;

  // Final CTA
  finalCtaHeadline: string;
  finalCtaSubheadline: string;
  finalCtaButtonText: string;
  trustReminder: string;
}

// ============================================
// ESSENTIALS PROGRAM CONTENT
// ============================================

const essentialsContent: ProgramContent = {
  // Hero Section
  badge: "Your Personalized Path",
  heroHeadline: "Build Your Foundation—Become Unstoppable on Your Timeline",
  heroSubheadlineTemplate:
    "{personalization} Essentials gives you everything you need to fall in love with working on yourself, at your own pace.",
  heroImageAlt: "Woman working out at home, confident and empowered, morning light, peaceful energy",

  // Transformation Journey Section
  journeySectionHeadline: "This Is How You Become Unstoppable",
  journeyIntro:
    "Essentials isn't a program. It's your personal transformation library—designed by Disha to help you build the body, confidence, and habits that make you feel powerful every single day.",

  // 4 Pillars
  pillars: [
    {
      icon: "body",
      title: "PILLAR 1: BODY TRANSFORMATION",
      headline: "Build Strength That Shows",
      description:
        "Transform your body with proven 30-day fitness programs you can do anytime, anywhere. No gym needed. No equipment required. Just you, your commitment, and a structured path to the body that makes you feel unstoppable.",
      benefits: [
        "Wake up energized",
        "Move through your day with power",
        "See your body respond to consistency",
        "Build the discipline that changes everything",
      ],
    },
    {
      icon: "beauty",
      title: "PILLAR 2: BEAUTY & RADIANCE",
      headline: "Look as Unstoppable as You Feel",
      description:
        "Master the beauty routines and self-care rituals that make confidence visible. From skin that glows to habits that make you feel luxurious, this is how you become the woman who turns heads—not through filters, through radiance.",
      benefits: [
        "Walk into any room and own it",
        "Feel beautiful without makeup",
        "Build rituals that make self-care feel like luxury, not a chore",
      ],
    },
    {
      icon: "finance",
      title: "PILLAR 3: FINANCIAL POWER",
      headline: "Build Money Confidence",
      description:
        "Transform your relationship with money through mindset shifts and wealth-building habits. Financial power isn't just about numbers—it's about the confidence to invest in yourself, set boundaries, and build the life you deserve.",
      benefits: [
        "Make financial decisions with clarity",
        "Build wealth habits that compound",
        "Feel powerful, not anxious, about money",
      ],
    },
    {
      icon: "confidence",
      title: "PILLAR 4: CONFIDENCE MASTERY",
      headline: "Become Unshakeable",
      description:
        "Transform from the inside out with mindset practices, boundary-setting frameworks, and the inner work that makes external transformation last. This is where you become the woman who doesn't wait for permission—she acts.",
      benefits: [
        "Set boundaries without guilt",
        "Show up for yourself daily",
        "Build self-trust that nothing can shake",
      ],
    },
  ],

  // Disha Validation Section
  dishaHeadline: '"This Is the Foundation I Used"',
  dishaQuote: `When I left my CA studies to pursue transformation, I didn't have a fancy gym or expensive equipment.

I built my foundation with the exact framework you're getting in Essentials: structured workouts you can do at home, holistic nutrition that feels sustainable, and daily habits that build discipline without pressure.

Over 5,000+ sessions later, this foundation has transformed 2,500+ women across India and around the world.

It works. Because transformation isn't about perfection. It's about consistency. And Essentials gives you the structure to be consistent—on your timeline, in your space, at your pace.

I'll guide you through every step.`,

  // Investment Section
  investmentHeadline: "Your Investment in Becoming Unstoppable",
  pricePerDay: "₹83/day",
  priceComparison: "less than a meal delivery or salon visit",
  investmentDescription:
    "Not just workouts. Complete transformation—body, beauty, finance, confidence. The woman you're becoming is worth far more than ₹83/day.",
  ctaText: "Start Your Transformation",
  trustSignals: [
    "Cancel anytime—no commitments, just results",
    "Secure checkout via Razorpay",
    "Start immediately after payment",
  ],

  // Why This Works Section
  whyWorksHeadline: "Why Essentials Is Perfect for You",
  whyWorksIntroTemplate: "You chose flexibility because {reason}.",
  whyWorksBenefits: [
    {
      headline: "START IMMEDIATELY, WORK AT YOUR PACE",
      description:
        "No waiting for class times. No rigid schedules. You get instant access to everything—workouts, guides, rituals, frameworks. Start today. Work when it fits your life.",
    },
    {
      headline: "STRUCTURE WITHOUT PRESSURE",
      description:
        "You get the exact structure that creates results—workout progressions, nutrition frameworks, daily practices—but you control the pace. This is discipline that feels luxurious, not punishing.",
    },
    {
      headline: "COMPLETE TRANSFORMATION FRAMEWORK",
      description:
        "This isn't just fitness. It's the 4-pillar system that creates lasting change: body, beauty, finance, confidence. You're not just getting in shape—you're becoming unstoppable.",
    },
  ],

  // Testimonials
  testimonialsHeadline: "This Is What Becoming Unstoppable Looks Like",
  testimonials: [
    {
      id: "ess-1",
      name: "Ananya R.",
      location: "Delhi",
      role: "Marketing Manager",
      age: 28,
      membershipDuration: "Essentials Member, 4 Months",
      quote:
        "I finally found something I could stick to. Essentials gave me structure without pressure, and the confidence I built changed everything—not just my body, but my entire life. I show up for myself now.",
      photoUrl: "/images/testimonials/ananya.jpg",
    },
    {
      id: "ess-2",
      name: "Kavya M.",
      location: "Hyderabad",
      role: "Entrepreneur",
      age: 32,
      membershipDuration: "Essentials Member, 6 Months",
      quote:
        "Working out at home felt 'less than' until Essentials. Now I realize consistency matters more than location. I'm stronger, more energized, and more confident than I've ever been—all on my own timeline.",
      photoUrl: "/images/testimonials/kavya.jpg",
    },
  ],

  // FAQs
  faqHeadline: "Everything You Need to Know",
  faqs: [
    {
      question: "What if I need extra support?",
      answer:
        "Essentials includes weekly accountability check-ins and access to our community support. You're never alone—just working at your pace.",
    },
    {
      question: "Can I upgrade later if I want more?",
      answer:
        "Absolutely. Many Essentials members upgrade when they're ready for live workouts and group coaching. Start here, evolve when it feels right.",
    },
    {
      question: "Is this really enough to transform?",
      answer:
        "Yes. This is the same foundation Disha built her transformation on—and the same framework that's helped 2,500+ women become unstoppable. It's not about more. It's about consistency.",
    },
    {
      question: "What if I've tried programs before and quit?",
      answer:
        "That's exactly why Essentials works. It's designed for real life—not Instagram perfection. You work at your pace, with structure that supports you, not pressure that breaks you.",
    },
    {
      question: "Do I need any equipment?",
      answer:
        "No. Everything is designed for home workouts with zero equipment. Your body, your space, your transformation.",
    },
    {
      question: "How quickly will I see results?",
      answer:
        "Most women feel different within 7-10 days (more energy, better mood). Physical changes typically show by week 3-4. But the real transformation? That's the woman you become over 3-6 months of consistency.",
    },
  ],

  // Upgrade Path
  upgradePath: {
    headline: "Want Live Community Support?",
    description:
      "Many Essentials members add live workouts, group coaching, and sisterhood accountability when they're ready for that next level of transformation. If that sounds right for you now—or later—you can explore our live community program. Start with Essentials and upgrade anytime. No pressure. Just options.",
    ctaText: "Explore Live Community Option",
    ctaHref: "/circle",
  },

  // Final CTA
  finalCtaHeadline: "Strong. Consistent. Unstoppable.",
  finalCtaSubheadline: "That's who you're becoming. Starting today.",
  finalCtaButtonText: "Join Essentials Now",
  trustReminder: "2,500+ women transformed. Cancel anytime. Start immediately.",
};

// ============================================
// TRIAL PROGRAM CONTENT
// ============================================

const trialContent: ProgramContent = {
  badge: "Your First Step",
  heroHeadline: "Experience the Magic—Risk Free",
  heroSubheadlineTemplate:
    "{trialPersonalization} Trial gives you 7 days to experience our methodology before committing fully.",
  heroImageAlt: "Woman discovering her potential, curious and excited energy",

  journeySectionHeadline: "7 Days to Discover Your Unstoppable Self",
  journeyIntro:
    "Trial isn't a watered-down version—it's a concentrated taste of transformation. Experience our methodology, feel the difference, then decide if you're ready for more.",

  pillars: [
    {
      icon: "body",
      title: "PILLAR 1: MOVEMENT JUMPSTART",
      headline: "Feel the Difference in 7 Days",
      description:
        "Experience quick daily workouts designed to kickstart your body and build momentum. By day 7, you'll understand why our methodology works.",
      benefits: [
        "Quick 15-20 minute daily workouts",
        "Feel your energy shift",
        "Build momentum that carries forward",
      ],
    },
    {
      icon: "beauty",
      title: "PILLAR 2: GLOW PREVIEW",
      headline: "Instant Beauty Wins",
      description:
        "Get access to beauty tips and rituals you can implement immediately. Quick wins that show you what's possible.",
      benefits: [
        "Skincare quick-start guide",
        "Morning ritual framework",
        "Visible glow within days",
      ],
    },
    {
      icon: "finance",
      title: "PILLAR 3: MONEY MINDSET INTRO",
      headline: "Shift Your Money Story",
      description:
        "Begin transforming your relationship with money through foundational mindset exercises.",
      benefits: [
        "Identify your money blocks",
        "Start building abundance thinking",
        "Preview of wealth habits",
      ],
    },
    {
      icon: "confidence",
      title: "PILLAR 4: CONFIDENCE SPARK",
      headline: "Ignite Your Inner Power",
      description:
        "Experience the mindset practices that help you show up differently—even in just 7 days.",
      benefits: [
        "Daily affirmation practice",
        "Boundary-setting introduction",
        "Build early momentum",
      ],
    },
  ],

  dishaHeadline: '"The Framework Behind 2,500+ Transformations"',
  dishaQuote: `In this 90-minute experience, you'll get the complete Glow Up Academy framework—the same one I've perfected over 5,000+ fitness sessions with everyone from busy corporate professionals to international clients.

This isn't theory. It's proven. It's what works.`,
  dishaSignature: "Disha",
  dishaCredentials: "Corporate Wellness Expert for Greenko, Gold's Gym, and leading organizations",

  investmentHeadline: "Your 7-Day Investment",
  pricePerDay: "₹71/day",
  priceComparison: "less than a coffee",
  investmentDescription:
    "7 days of full access to prove we're the real deal. No risk. No pressure. Just experience.",
  ctaText: "Try For ₹499",
  trustSignals: [
    "No automatic billing after trial",
    "You choose whether to continue",
    "Instant access",
  ],

  whyWorksHeadline: "Why Trial Is Perfect for You",
  whyWorksIntroTemplate: "You want to try before committing because {trialReason}.",
  whyWorksBenefits: [
    {
      headline: "ZERO RISK, REAL EXPERIENCE",
      description:
        "₹499 gives you 7 full days of our methodology. No tricks, no hidden fees, no automatic upgrades. Just honest experience.",
    },
    {
      headline: "PROOF BEFORE COMMITMENT",
      description:
        "Feel the difference in your body, energy, and confidence before deciding. Let the results speak.",
    },
    {
      headline: "CLEAR PATH FORWARD",
      description:
        "After your trial, you'll know exactly which program fits your transformation goals. No guessing.",
    },
  ],

  testimonialsHeadline: "They Started With Trial Too",
  testimonials: [
    {
      id: "trial-1",
      name: "Sneha R.",
      location: "Pune",
      role: "IT Professional",
      age: 26,
      membershipDuration: "Started with Trial, Now Circle Member",
      quote:
        "I was skeptical of everything. Trial changed that. By day 4, I knew this was different. I signed up for Circle before my trial ended.",
      photoUrl: "/images/testimonials/sneha.jpg",
    },
    {
      id: "trial-2",
      name: "Priya K.",
      location: "Mumbai",
      role: "Teacher",
      age: 34,
      membershipDuration: "Started with Trial, Now Essentials Member",
      quote:
        "I needed proof before I could trust again. Trial gave me exactly that. Now I'm building consistency I never thought possible.",
      photoUrl: "/images/testimonials/priya-k.jpg",
    },
  ],

  faqHeadline: "Trial Questions Answered",
  faqs: [
    {
      question: "What exactly do I get in 7 days?",
      answer:
        "Full access to sample modules from our core program, including workouts, beauty tips, and mindset content. Plus, you'll join one live session to experience the community energy firsthand.",
    },
    {
      question: "What happens after the trial ends?",
      answer:
        "You'll be invited to join Circle or Essentials at a special rate. There's no automatic billing—you choose if and when to continue. No pressure, no tricks.",
    },
    {
      question: "Why is the trial so affordable?",
      answer:
        "We want you to experience the DMK difference without risk. The ₹499 covers our operational costs while giving you genuine value. It's our way of saying 'try us, you'll love us.'",
    },
    {
      question: "Can I do the trial if I'm a complete beginner?",
      answer:
        "The trial is perfect for beginners! It's designed to give you quick wins and build momentum without overwhelming you.",
    },
  ],

  finalCtaHeadline: "7 Days. ₹499. Zero Risk.",
  finalCtaSubheadline: "Your transformation could start today.",
  finalCtaButtonText: "Start Your Trial",
  trustReminder: "No automatic billing. You decide what's next.",
};

// ============================================
// CIRCLE PROGRAM CONTENT
// ============================================

const circleContent: ProgramContent = {
  badge: "Your Sisterhood Awaits",
  heroHeadline: "Transform Together—Rise with Your Queens",
  heroSubheadlineTemplate:
    "{personalization} Circle gives you live community support, accountability partners, and the sisterhood that makes transformation inevitable.",
  heroImageAlt: "Group of confident women supporting each other, powerful community energy",

  journeySectionHeadline: "This Is How Queens Rise Together",
  journeyIntro:
    "Circle isn't just a program—it's a sisterhood. Live sessions, accountability partners, and a community of women who won't let you quit on yourself. This is where consistency becomes automatic.",

  pillars: [
    {
      icon: "body",
      title: "PILLAR 1: LIVE FITNESS",
      headline: "Train with Your Tribe",
      description:
        "Weekly live workout sessions with Disha and the community. Feel the energy of training together—even from home. Accountability that shows up in your body.",
      benefits: [
        "Weekly live workout sessions",
        "Recorded sessions for catch-up",
        "Progressive training programs",
        "Community motivation",
      ],
    },
    {
      icon: "beauty",
      title: "PILLAR 2: BEAUTY MASTERCLASSES",
      headline: "Glow Up Together",
      description:
        "Monthly beauty masterclasses, skincare deep-dives, and styling sessions. Learn together, glow together.",
      benefits: [
        "Monthly expert sessions",
        "Skincare & haircare protocols",
        "Style confidence building",
        "Community beauty challenges",
      ],
    },
    {
      icon: "finance",
      title: "PILLAR 3: WEALTH BUILDING",
      headline: "Build Financial Power",
      description:
        "Monthly financial workshops, investment basics, and wealth mindset sessions. Build money confidence with your sisters.",
      benefits: [
        "Monthly wealth workshops",
        "Budgeting & saving frameworks",
        "Investment introduction",
        "Abundance mindset practices",
      ],
    },
    {
      icon: "confidence",
      title: "PILLAR 4: SISTERHOOD",
      headline: "Accountability That Works",
      description:
        "Accountability partner matching, group coaching calls, and a private community that has your back. This is where discipline becomes natural.",
      benefits: [
        "Matched accountability partners",
        "Bi-weekly group coaching",
        "Private community access",
        "Celebration of every win",
      ],
    },
  ],

  dishaHeadline: '"Why I Created Circle"',
  dishaQuote: `After 5,000+ fitness sessions, I learned transformation isn't about willpower—it's about sisterhood.

I created Circle for women like you—ambitious, driven, ready for complete transformation but needing the right structure and support.

You'll work with my expert team of coaches (personally trained by me), join 2,500+ women in our community, and follow the 4-pillar framework that took me from dropping CA to building multiple successful businesses.

This is where you stop doing it alone.`,
  dishaCredentials: "Founder & Transformation Architect | Featured in Telangana Today • Corporate Wellness Expert",

  investmentHeadline: "Your Investment in Community Transformation",
  pricePerDay: "₹150/day",
  priceComparison: "less than a gym membership you'll actually use",
  investmentDescription:
    "Live sessions, accountability partners, community support, and complete transformation. The sisterhood that changes everything.",
  ctaText: "Join The Circle",
  trustSignals: [
    "Cancel anytime—no long-term commitments",
    "Live sessions recorded if you miss",
    "Accountability partner matching",
  ],

  whyWorksHeadline: "Why Circle Is Perfect for You",
  whyWorksIntroTemplate: "You chose community because {reason}.",
  whyWorksBenefits: [
    {
      headline: "ACCOUNTABILITY THAT ACTUALLY WORKS",
      description:
        "You'll be matched with an accountability partner at your level. Someone who understands your journey and won't let you give up. This is the missing piece.",
    },
    {
      headline: "LIVE ENERGY, REAL CONNECTION",
      description:
        "Feel the energy of training with your tribe. Weekly live sessions bring the community together, even when you're in your living room.",
    },
    {
      headline: "SISTERHOOD THAT HAS YOUR BACK",
      description:
        "A private community of women on the same journey. Celebrate wins, share struggles, and know you're never alone. This is where transformation sticks.",
    },
  ],

  testimonialsHeadline: "This Is What Sisterhood Creates",
  testimonials: [
    {
      id: "circle-1",
      name: "Roshni T.",
      location: "Mumbai",
      role: "HR Manager",
      age: 30,
      membershipDuration: "Circle Member, 8 Months",
      quote:
        "I walked into my reunion and owned the room. The community changed everything—I finally had women who understood my journey and wouldn't let me quit.",
      photoUrl: "/images/testimonials/roshni.jpg",
    },
    {
      id: "circle-2",
      name: "Aishwarya B.",
      location: "Kolkata",
      role: "Doctor",
      age: 35,
      membershipDuration: "Circle Member, 5 Months",
      quote:
        "My accountability partner texted me every morning. I couldn't let her down—and I couldn't let myself down. Dropped 3 dress sizes and gained a sisterhood.",
      photoUrl: "/images/testimonials/aishwarya.jpg",
    },
  ],

  faqHeadline: "Circle Questions Answered",
  faqs: [
    {
      question: "What if I can't attend the live sessions?",
      answer:
        "All live sessions are recorded and available within 24 hours. While live attendance is best for the energy and connection, you won't miss content.",
    },
    {
      question: "How does accountability partner matching work?",
      answer:
        "We match you based on goals, schedule, and personality. You'll connect weekly, share wins and struggles, and keep each other accountable. Many members say this is the most valuable part.",
    },
    {
      question: "What if I'm intimidated by group settings?",
      answer:
        "Our community is welcoming and judgment-free. Every woman started somewhere. You'll find your people quickly.",
    },
    {
      question: "Can I bring a friend?",
      answer:
        "Yes! We offer a 'Sister Sign-Up' discount—you both get 10% off when you join together. Email us for the special link.",
    },
    {
      question: "How much time do I need weekly?",
      answer:
        "Plan for 4-6 hours: 3-4 for workouts, 1 for live sessions, and optional community time. Many members do more because they enjoy it.",
    },
    {
      question: "What's your refund policy?",
      answer:
        "100% money-back guarantee within 14 days. Engage fully, attend sessions, try the accountability. If Circle isn't right for you, we'll refund every rupee.",
    },
  ],

  finalCtaHeadline: "Your Queens Are Waiting.",
  finalCtaSubheadline: "Rise together. Transform together. Become unstoppable together.",
  finalCtaButtonText: "Join The Circle",
  trustReminder: "2,500+ women transformed. Accountability partners matched. Community ready.",
};

// ============================================
// TRANSFORM PROGRAM CONTENT
// ============================================

const transformContent: ProgramContent = {
  badge: "The Ultimate Investment",
  heroHeadline: "Complete Transformation—Personalized for You",
  heroSubheadlineTemplate:
    "{personalization} Transform gives you 1:1 coaching, custom plans, and VIP support for total life transformation.",
  heroImageAlt: "Powerful woman, completely transformed, executive presence",

  journeySectionHeadline: "This Is Total Transformation",
  journeyIntro:
    "Transform isn't a program—it's a partnership. 3 months of 1:1 coaching, custom plans designed around YOUR life, and VIP support that makes transformation inevitable. For women ready to invest at the highest level.",

  pillars: [
    {
      icon: "body",
      title: "PILLAR 1: PERSONALIZED FITNESS",
      headline: "Custom Training for Your Body",
      description:
        "Workout plans designed specifically for YOUR body, schedule, and goals. Weekly adjustments based on your progress. This is personal training at the highest level.",
      benefits: [
        "Custom workout plans",
        "Weekly 1:1 calls",
        "Real-time adjustments",
        "Nutrition personalization",
      ],
    },
    {
      icon: "beauty",
      title: "PILLAR 2: LUXURY BEAUTY OVERHAUL",
      headline: "Your Complete Glow Up",
      description:
        "Personal styling consultations, advanced skincare protocols, and a complete beauty transformation designed around your features and lifestyle.",
      benefits: [
        "Personal style audit",
        "Custom skincare protocol",
        "Wardrobe consultation",
        "Confidence styling",
      ],
    },
    {
      icon: "finance",
      title: "PILLAR 3: WEALTH ARCHITECTURE",
      headline: "Build Serious Wealth",
      description:
        "1:1 financial coaching to optimize your money, build investments, and create multiple income streams. This is where financial freedom becomes real.",
      benefits: [
        "Personal financial assessment",
        "Investment strategy",
        "Income diversification",
        "Wealth mindset mastery",
      ],
    },
    {
      icon: "confidence",
      title: "PILLAR 4: EXECUTIVE PRESENCE",
      headline: "Command Any Room",
      description:
        "Deep mindset work, boundary mastery, and the confidence coaching that creates leaders. Walk into any room and own it.",
      benefits: [
        "Leadership coaching",
        "Public speaking confidence",
        "Boundary mastery",
        "Unshakeable self-trust",
      ],
    },
  ],

  dishaHeadline: '"From CA to Transformation Architect"',
  dishaQuote: `I understand high-achieving women because I am one.

I have a Master's in Applied Finance. I was pursuing CA—the ultimate safe career in India. But I chose passion over prestige.

Since then, I've:
• Conducted 5,000+ transformation sessions
• Helped 2,500+ women become unstoppable
• Built WebVeda to 400,000+ students
• Founded successful businesses across education, wellness, and lifestyle
• Worked with corporate leaders from Greenko to Harvard-affiliated events

Transform is where I personally architect your 6-month journey. My expert team delivers your weekly 1:1 coaching. I oversee everything and personally coach you monthly.

This is the highest level of transformation Glow Up Academy offers.

And it starts with a 45-minute strategy call—just you and me.`,
  dishaCredentials: "Master's in Applied Finance • Corporate Wellness Expert • Multi-Business Entrepreneur",

  investmentHeadline: "Your Investment in Complete Transformation",
  pricePerDay: "₹1,667/day",
  priceComparison: "the cost of becoming the woman you're meant to be",
  investmentDescription:
    "3 months of 1:1 coaching, custom everything, VIP support. The investment that changes your entire life trajectory.",
  ctaText: "Book Your Discovery Call",
  trustSignals: [
    "EMI options available",
    "Payment plans discussed on call",
    "Results guarantee",
  ],

  whyWorksHeadline: "Why Transform Is Perfect for You",
  whyWorksIntroTemplate: "You're ready for complete transformation because {reason}.",
  whyWorksBenefits: [
    {
      headline: "EVERYTHING CUSTOM, NOTHING GENERIC",
      description:
        "Your workout plan. Your nutrition protocol. Your beauty strategy. Your financial roadmap. Everything designed around YOUR life, YOUR goals, YOUR obstacles.",
    },
    {
      headline: "1:1 ACCESS TO YOUR TRANSFORMATION ARCHITECT",
      description:
        "Weekly private calls with Disha. VIP WhatsApp access for questions between sessions. The level of support that makes transformation inevitable.",
    },
    {
      headline: "RESULTS GUARANTEE",
      description:
        "Follow the program, do the work, and you WILL transform. If you don't see measurable results in 90 days, we continue coaching you free until you do.",
    },
  ],

  testimonialsHeadline: "This Is What Total Transformation Looks Like",
  testimonials: [
    {
      id: "transform-1",
      name: "Dr. Lakshmi V.",
      location: "Bangalore",
      role: "Surgeon",
      age: 38,
      membershipDuration: "Transform Graduate",
      quote:
        "As a surgeon, my schedule is impossible. Disha created a system that worked with my 80-hour weeks. Lost 15 kg, launched a wellness side business, and finally feel like the woman I was meant to be.",
      photoUrl: "/images/testimonials/lakshmi.jpg",
    },
    {
      id: "transform-2",
      name: "Sunita A.",
      location: "Gurgaon",
      role: "CEO",
      age: 42,
      membershipDuration: "Transform Graduate",
      quote:
        "The investment scared me—until I calculated the ROI. Complete body transformation, doubled my business revenue, and built confidence that changes how I lead. Transform paid for itself 10x over.",
      photoUrl: "/images/testimonials/sunita.jpg",
    },
  ],

  faqHeadline: "Transform Questions Answered",
  faqs: [
    {
      question: "Why is Transform so expensive?",
      answer:
        "Transform isn't expensive—it's an investment with proven ROI. You get 1:1 personal coaching, custom plans for your unique situation, weekly private calls, and VIP access. Our Transform members see results that justify the investment many times over.",
    },
    {
      question: "What if I've tried everything and nothing works?",
      answer:
        "Transform is DESIGNED for women who've 'tried everything.' The reason other approaches failed is they were generic. Transform is custom-built around YOUR life, YOUR obstacles, and YOUR goals. Your coach won't let you quit.",
    },
    {
      question: "What if I have a demanding career/family?",
      answer:
        "Most Transform members are high-achieving women with demanding lives. That's exactly why they need personalized support. We create systems that integrate with your life, not compete with it.",
    },
    {
      question: "Is EMI available?",
      answer:
        "Yes! We offer EMI options through our payment partners. During your Discovery Call, we'll discuss payment plans that work for your budget. Investment shouldn't be a barrier to transformation.",
    },
    {
      question: "What happens on the Discovery Call?",
      answer:
        "It's a 20-minute conversation to understand your goals, challenges, and whether Transform is the right fit. There's no pressure—this call is about alignment. If Transform isn't right for you, we'll recommend the best alternative.",
    },
    {
      question: "What's your guarantee?",
      answer:
        "Transform comes with a results guarantee: Follow the program and work with your coach, and you WILL see transformation. If you don't see measurable results in 90 days (and you've done the work), we'll continue coaching you free until you do.",
    },
  ],

  finalCtaHeadline: "Ready for Everything to Change?",
  finalCtaSubheadline: "Let's talk about your transformation.",
  finalCtaButtonText: "Book Your Discovery Call",
  trustReminder: "Limited spots. Results guaranteed. Payment plans available.",
};

// ============================================
// PROGRAM CONTENT MAP
// ============================================

const programContentMap: { [programId: string]: ProgramContent } = {
  essentials: essentialsContent,
  trial: trialContent,
  circle: circleContent,
  transform: transformContent,
};

export function getProgramContent(programId: string): ProgramContent {
  return programContentMap[programId] || essentialsContent;
}

// ============================================
// HELPER EXPORTS FOR RESULT PAGE
// ============================================

export interface TransformationArchetype {
  id: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
}

const archetypes: { [key: string]: TransformationArchetype } = {
  "q1-a": {
    id: "survivor-to-thriver",
    name: "Survivor to Thriver",
    title: "Survivor to Thriver",
    tagline: "From surviving to thriving",
    description: "You've been pushing through—now it's time to build sustainable systems that support your growth.",
  },
  "q1-b": {
    id: "consistency-seeker",
    name: "Consistency Seeker",
    title: "Consistency Seeker",
    tagline: "From inconsistent to unstoppable",
    description: "You've tried before. This time, with the right structure, you'll finally stay consistent.",
  },
  "q1-c": {
    id: "all-in-transformer",
    name: "All-In Transformer",
    title: "All-In Transformer",
    tagline: "Ready to go all in",
    description: "You're ready to invest fully in yourself and see what's possible when you commit completely.",
  },
};

export function getArchetypeByQ1Answer(q1OptionId: string): TransformationArchetype {
  return archetypes[q1OptionId] || archetypes["q1-b"];
}

export function getProgramPillars(programId: string): ProgramPillar[] {
  const content = getProgramContent(programId);
  return content.pillars;
}

export function getTestimonialsByProgram(programId: string): Testimonial[] {
  const content = getProgramContent(programId);
  return content.testimonials;
}

export function getFAQsByProgram(programId: string): FAQ[] {
  const content = getProgramContent(programId);
  return content.faqs;
}

export interface ProgramCopy {
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  pricePerDay: string;
  trustSignals: string[];
}

export function getProgramCopy(programId: string, q1OptionId?: string): ProgramCopy {
  const content = getProgramContent(programId);
  const personalization = getQuizPersonalization(q1OptionId || "q1-b");

  return {
    heroHeadline: content.heroHeadline,
    heroSubheadline: content.heroSubheadlineTemplate.replace("{personalization}", personalization.heroSubheadline),
    ctaText: content.ctaText,
    pricePerDay: content.pricePerDay,
    trustSignals: content.trustSignals,
  };
}

