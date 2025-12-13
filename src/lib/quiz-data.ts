import { QuizQuestion, QuizAnswer, QuizResult } from "@/types";

// ============================================
// DMK QUIZ - 8 QUESTIONS
// ============================================
// Scoring weights determine which program is recommended:
// - essentials: Budget-conscious, self-paced, flexibility
// - trial: First-timers, commitment-hesitant, want to try first
// - circle: Community-oriented, ready to commit, group accountability
// - transform: High-ticket, personal guidance, all-in transformation
// ============================================

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "How would you describe your current era?",
    options: [
      {
        id: "q1-a",
        text: "Survival mode—I'm getting by, but not thriving",
        scores: { essentials: 10, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q1-b",
        text: "Inconsistent—I start strong but can't stay consistent",
        scores: { essentials: 0, trial: 10, circle: 0, transform: 0 },
      },
      {
        id: "q1-c",
        text: "Ready to go all in—discipline is my next luxury",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 5 },
      },
    ],
  },
  {
    id: "q2",
    question: "What does becoming hot and unstoppable mean to you?",
    options: [
      {
        id: "q2-a",
        text: "Feeling powerful in my body again",
        scores: { essentials: 5, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q2-b",
        text: "Building unshakeable confidence",
        scores: { essentials: 0, trial: 0, circle: 5, transform: 0 },
      },
      {
        id: "q2-c",
        text: "Creating a sustainable, high-performing lifestyle",
        scores: { essentials: 0, trial: 0, circle: 5, transform: 0 },
      },
      {
        id: "q2-d",
        text: "All of the above—I want the complete transformation",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 10 },
      },
    ],
  },
  {
    id: "q3",
    question: "How do you rise?",
    options: [
      {
        id: "q3-a",
        text: "On my own time—I need flexibility to fit my life",
        scores: { essentials: 25, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q3-b",
        text: "With a community—I thrive with my queens around me",
        scores: { essentials: 0, trial: 10, circle: 25, transform: 0 },
      },
      {
        id: "q3-c",
        text: "With personal guidance—I want a transformation architect",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 30 },
      },
    ],
  },
  {
    id: "q4",
    question: "How much time are you investing in yourself weekly?",
    options: [
      {
        id: "q4-a",
        text: "2-3 hours/week",
        scores: { essentials: 5, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q4-b",
        text: "4-6 hours/week",
        scores: { essentials: 0, trial: 5, circle: 5, transform: 0 },
      },
      {
        id: "q4-c",
        text: "7+ hours/week",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 10 },
      },
    ],
  },
  {
    id: "q5",
    question: "What does your ideal transformation experience look like?",
    options: [
      {
        id: "q5-a",
        text: "Structure without pressure—discipline that feels luxurious",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 0 },
      },
      {
        id: "q5-b",
        text: "Accountability and community—I want my tribe",
        scores: { essentials: 0, trial: 5, circle: 15, transform: 0 },
      },
      {
        id: "q5-c",
        text: "High-touch personalization—custom everything",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 15 },
      },
    ],
  },
  {
    id: "q6",
    question: "What's your relationship with transformation programs?",
    options: [
      {
        id: "q6-a",
        text: "This is my first real commitment",
        scores: { essentials: 0, trial: 15, circle: 0, transform: 0 },
      },
      {
        id: "q6-b",
        text: "I've started and stopped—I need something different",
        scores: { essentials: 0, trial: 15, circle: 0, transform: 0 },
      },
      {
        id: "q6-c",
        text: "I've seen results but hit a ceiling",
        scores: { essentials: 0, trial: 0, circle: 5, transform: 5 },
      },
    ],
  },
  {
    id: "q7",
    question: "What investment level aligns with where you are?",
    options: [
      {
        id: "q7-a",
        text: "Foundation level: ₹2,000-3,000/month",
        scores: { essentials: 50, trial: 10, circle: -999, transform: -999 },
      },
      {
        id: "q7-b",
        text: "Community level: ₹4,000-6,000/month",
        scores: { essentials: 0, trial: 15, circle: 25, transform: -999 },
      },
      {
        id: "q7-c",
        text: "Immersive level: ₹10,000+/month",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 20 },
      },
      {
        id: "q7-d",
        text: "Full transformation: ₹1,00,000+",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 40 },
      },
    ],
  },
  {
    id: "q8",
    question: "The DMK Woman doesn't wait. When does your transformation begin?",
    options: [
      {
        id: "q8-a",
        text: "This week—I'm ready now",
        scores: { essentials: 0, trial: -5, circle: 15, transform: 15 },
      },
      {
        id: "q8-b",
        text: "Within the month—I need to prepare",
        scores: { essentials: 0, trial: 5, circle: 0, transform: 0 },
      },
      {
        id: "q8-c",
        text: "I'm still exploring my options",
        scores: { essentials: 0, trial: 10, circle: 0, transform: 0 },
      },
    ],
  },
];

// ============================================
// SCORING ALGORITHM
// ============================================

export function calculateQuizResult(answers: QuizAnswer[]): QuizResult {
  // Initialize scores for each program
  const scores: { [programId: string]: number } = {
    essentials: 0,
    trial: 0,
    circle: 0,
    transform: 0,
  };

  // Track specific answers for edge case logic
  const answerMap: { [questionId: string]: string } = {};

  // Calculate total scores based on answers
  answers.forEach((answer) => {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;

    answer.selectedOptionIds.forEach((optionId) => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return;

      // Track the answer
      answerMap[question.id] = optionId;

      // Add option scores to totals
      Object.entries(option.scores).forEach(([programId, score]) => {
        scores[programId] = (scores[programId] || 0) + score;
      });
    });
  });

  // EDGE CASE: If Transform budget (q7-c or q7-d) but low time commitment (q4-a), disqualify Transform
  if ((answerMap["q7"] === "q7-c" || answerMap["q7"] === "q7-d") && answerMap["q4"] === "q4-a") {
    scores.transform = 0;
  }

  // EDGE CASE: If Circle and Trial are within 10 points AND q6 = "started/stopped" → favor Trial
  if (Math.abs(scores.circle - scores.trial) <= 10 && answerMap["q6"] === "q6-b") {
    scores.trial += 5; // Slight boost to trial
  }

  // Ensure no negative scores
  Object.keys(scores).forEach((key) => {
    if (scores[key] < 0) scores[key] = 0;
  });

  // Find the program with the highest score using tie-breaker priority
  // Priority: transform > trial > circle > essentials (per spec)
  const priority = ["transform", "trial", "circle", "essentials"];
  const maxScore = Math.max(...Object.values(scores));

  let recommendedProgramId = "essentials"; // Default fallback

  for (const programId of priority) {
    if (scores[programId] === maxScore && maxScore > 0) {
      recommendedProgramId = programId;
      break;
    }
  }

  return {
    programId: recommendedProgramId,
    programSlug: recommendedProgramId,
    score: maxScore,
    allScores: scores,
  };
}

// Get total number of questions
export function getTotalQuestions(): number {
  return quizQuestions.length;
}
