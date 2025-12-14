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
    subtext: "Think about your energy, consistency, and how you show up for yourself right now.",
    options: [
      {
        id: "q1-a",
        text: "Survival mode — I'm getting by, but not thriving",
        description: "I'm exhausted. I'm inconsistent. I need to start somewhere simple and build up.",
        scores: { essentials: 10, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q1-b",
        text: "Inconsistent — I start strong but can't stay consistent",
        description: "I have motivation in bursts, but it never lasts. I need to figure out what I'm missing.",
        scores: { essentials: 0, trial: 10, circle: 0, transform: 0 },
      },
      {
        id: "q1-c",
        text: "Ready to go all in — discipline is my next luxury",
        description: "I'm done with half-measures. I'm ready to fully commit and transform everything.",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 5 },
      },
    ],
  },
  {
    id: "q2",
    question: "What does becoming \"hot and unstoppable\" mean to you?",
    subtext: "There's no wrong answer—just your truth. What do YOU want most?",
    options: [
      {
        id: "q2-a",
        text: "Feeling powerful in my body again",
        description: "I want to feel strong, confident, and energized when I move through my day.",
        scores: { essentials: 5, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q2-b",
        text: "Building unshakeable confidence",
        description: "I want to trust myself, set boundaries, and show up without second-guessing.",
        scores: { essentials: 0, trial: 0, circle: 5, transform: 0 },
      },
      {
        id: "q2-c",
        text: "Creating a sustainable, high-performing lifestyle",
        description: "I want structure, systems, and habits that make success inevitable.",
        scores: { essentials: 0, trial: 0, circle: 5, transform: 0 },
      },
      {
        id: "q2-d",
        text: "All of the above — I want the complete transformation",
        description: "I don't want to choose. I want body, confidence, lifestyle... everything.",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 10 },
      },
    ],
  },
  {
    id: "q3",
    question: "How do you rise?",
    subtext: "This is important. How do you work best? Be honest.",
    options: [
      {
        id: "q3-a",
        text: "On my own time. I need flexibility to fit my life",
        description: "Rigid schedules don't work for me. I need to work at my own pace, on my timeline.",
        scores: { essentials: 25, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q3-b",
        text: "With a community. I thrive with my queens around me",
        description: "I'm more consistent when I have sisters holding me accountable and rising with me.",
        scores: { essentials: 0, trial: 10, circle: 25, transform: 0 },
      },
      {
        id: "q3-c",
        text: "With personal guidance. I want a transformation architect",
        description: "I want personalized, bespoke coaching designed specifically for me. Nothing generic.",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 30 },
      },
    ],
  },
  {
    id: "q4",
    question: "How much time are you investing in yourself weekly?",
    subtext: "Be realistic. How much time can you genuinely commit right now?",
    options: [
      {
        id: "q4-a",
        text: "2-3 hours per week",
        description: "I have limited time but I'm ready to make the most of what I have.",
        scores: { essentials: 5, trial: 0, circle: 0, transform: 0 },
      },
      {
        id: "q4-b",
        text: "4-6 hours per week",
        description: "I can carve out meaningful time if the structure and support are right.",
        scores: { essentials: 0, trial: 5, circle: 5, transform: 0 },
      },
      {
        id: "q4-c",
        text: "7+ hours per week",
        description: "I'm going all in. Time isn't the constraint. Commitment is.",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 10 },
      },
    ],
  },
  {
    id: "q5",
    question: "What does your ideal transformation experience look like?",
    subtext: "Close your eyes. Imagine the perfect setup. What feels right?",
    options: [
      {
        id: "q5-a",
        text: "Structure without pressure. Discipline that feels luxurious",
        description: "I want clear guidance, but I need to move at my own pace. No rigidity.",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 0 },
      },
      {
        id: "q5-b",
        text: "Accountability and community. I want my tribe",
        description: "I want to show up with sisters who get it, celebrate wins, and keep me consistent.",
        scores: { essentials: 0, trial: 5, circle: 15, transform: 0 },
      },
      {
        id: "q5-c",
        text: "High-touch personalization. Custom everything",
        description: "I want every element designed for ME. Bespoke workouts, personal coaching, white-glove service.",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 15 },
      },
    ],
  },
  {
    id: "q6",
    question: "What's your relationship with transformation programs?",
    subtext: "Have you tried before? What happened? Your history matters.",
    options: [
      {
        id: "q6-a",
        text: "This is my first real commitment",
        description: "I've thought about it, but I've never fully committed. This time feels different.",
        scores: { essentials: 0, trial: 15, circle: 0, transform: 0 },
      },
      {
        id: "q6-b",
        text: "I've started and stopped. I need something different",
        description: "I've tried programs before. They worked temporarily, then I quit. I need what I've been missing.",
        scores: { essentials: 0, trial: 15, circle: 0, transform: 0 },
      },
      {
        id: "q6-c",
        text: "I've seen results but hit a ceiling.",
        description: "I've had success with programs, but I've plateaued. I'm ready for the next level.",
        scores: { essentials: 0, trial: 0, circle: 5, transform: 5 },
      },
    ],
  },
  {
    id: "q7",
    question: "What investment level aligns with where you are?",
    subtext: "Transformation is an investment in yourself. What feels right for you right now?",
    options: [
      {
        id: "q7-a",
        text: "Foundation level: ₹2,000-3,000/month",
        description: "I'm ready to start, but I need to keep investment accessible while I build momentum.",
        scores: { essentials: 50, trial: 10, circle: -999, transform: -999 },
      },
      {
        id: "q7-b",
        text: "Community level: ₹4,000-6,000/month",
        description: "I'm ready to invest meaningfully in transformation with structure and support.",
        scores: { essentials: 0, trial: 15, circle: 25, transform: -999 },
      },
      {
        id: "q7-c",
        text: "Immersive level: ₹10,000+/month",
        description: "I'm ready for personalized, high-touch transformation. Investment isn't the barrier—results are.",
        scores: { essentials: 0, trial: 0, circle: 10, transform: 20 },
      },
      {
        id: "q7-d",
        text: "Full transformation: ₹1,00,000+",
        description: "I'm ready to go all in. This is the most important investment I'll make this year.",
        scores: { essentials: 0, trial: 0, circle: 0, transform: 40 },
      },
    ],
  },
  {
    id: "q8",
    question: "The DMK Woman doesn't wait. When does your transformation begin?",
    subtext: "Your last question. When are you ready to start?",
    options: [
      {
        id: "q8-a",
        text: "This week. I'm ready now",
        description: "I'm done waiting. I'm done preparing. I'm ready to start immediately.",
        scores: { essentials: 0, trial: -5, circle: 15, transform: 15 },
      },
      {
        id: "q8-b",
        text: "Within the month. I need to prepare",
        description: "I'm committed, but I need a few weeks to get things in order first.",
        scores: { essentials: 0, trial: 5, circle: 0, transform: 0 },
      },
      {
        id: "q8-c",
        text: "I'm still exploring my options",
        description: "I'm interested, but I'm not ready to commit yet. I want to see what's available.",
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
