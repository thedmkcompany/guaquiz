import { QuizQuestion, QuizAnswer, QuizResult } from "@/types";
import { programs } from "./programs";

// ============================================
// QUIZ QUESTIONS (8 questions)
// ============================================
// Scoring weights determine which program is recommended:
// - Higher scores for "essentials" = beginner, low budget, self-paced
// - Higher scores for "trial" = curious, want to try first
// - Higher scores for "circle" = community-oriented, group support
// - Higher scores for "transform" = serious, high commitment, 1:1 focus
// ============================================

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What brings you here today?",
    options: [
      {
        id: "q1-a",
        text: "I want to start taking better care of myself",
        scores: { essentials: 3, trial: 2, circle: 1, transform: 0 },
      },
      {
        id: "q1-b",
        text: "I'm curious to see what this is about",
        scores: { essentials: 1, trial: 3, circle: 1, transform: 0 },
      },
      {
        id: "q1-c",
        text: "I want to be part of a supportive community",
        scores: { essentials: 0, trial: 1, circle: 3, transform: 1 },
      },
      {
        id: "q1-d",
        text: "I'm ready for a complete life transformation",
        scores: { essentials: 0, trial: 0, circle: 1, transform: 3 },
      },
    ],
  },
  {
    id: "q2",
    question: "How would you describe your current situation?",
    options: [
      {
        id: "q2-a",
        text: "Just getting started on my journey",
        scores: { essentials: 3, trial: 2, circle: 0, transform: 0 },
      },
      {
        id: "q2-b",
        text: "I've tried things before but nothing stuck",
        scores: { essentials: 1, trial: 1, circle: 3, transform: 1 },
      },
      {
        id: "q2-c",
        text: "I know what I need, just need the right guidance",
        scores: { essentials: 0, trial: 1, circle: 2, transform: 3 },
      },
      {
        id: "q2-d",
        text: "Not sure yet, want to explore",
        scores: { essentials: 1, trial: 3, circle: 1, transform: 0 },
      },
    ],
  },
  {
    id: "q3",
    question: "What type of support works best for you?",
    options: [
      {
        id: "q3-a",
        text: "Self-paced learning I can do on my own time",
        scores: { essentials: 3, trial: 1, circle: 0, transform: 0 },
      },
      {
        id: "q3-b",
        text: "A mix of content and some live sessions",
        scores: { essentials: 1, trial: 2, circle: 3, transform: 0 },
      },
      {
        id: "q3-c",
        text: "Group coaching with others on the same journey",
        scores: { essentials: 0, trial: 1, circle: 3, transform: 1 },
      },
      {
        id: "q3-d",
        text: "Personal 1-on-1 attention and custom guidance",
        scores: { essentials: 0, trial: 0, circle: 1, transform: 3 },
      },
    ],
  },
  {
    id: "q4",
    question: "How much time can you dedicate weekly?",
    options: [
      {
        id: "q4-a",
        text: "1-2 hours when I find the time",
        scores: { essentials: 3, trial: 2, circle: 0, transform: 0 },
      },
      {
        id: "q4-b",
        text: "3-5 hours, I can make this a priority",
        scores: { essentials: 1, trial: 1, circle: 3, transform: 1 },
      },
      {
        id: "q4-c",
        text: "5-10 hours, I'm serious about this",
        scores: { essentials: 0, trial: 0, circle: 2, transform: 3 },
      },
      {
        id: "q4-d",
        text: "Just want to try it out first",
        scores: { essentials: 1, trial: 3, circle: 0, transform: 0 },
      },
    ],
  },
  {
    id: "q5",
    question: "What's your investment comfort level?",
    options: [
      {
        id: "q5-a",
        text: "I want to start small and see results first",
        scores: { essentials: 2, trial: 3, circle: 0, transform: 0 },
      },
      {
        id: "q5-b",
        text: "I'm willing to invest in myself moderately",
        scores: { essentials: 3, trial: 1, circle: 2, transform: 0 },
      },
      {
        id: "q5-c",
        text: "I believe in investing properly for real results",
        scores: { essentials: 0, trial: 0, circle: 3, transform: 2 },
      },
      {
        id: "q5-d",
        text: "I'm ready to go all-in for transformation",
        scores: { essentials: 0, trial: 0, circle: 1, transform: 3 },
      },
    ],
  },
  {
    id: "q6",
    question: "How do you prefer to learn?",
    options: [
      {
        id: "q6-a",
        text: "Watching videos and reading at my own pace",
        scores: { essentials: 3, trial: 1, circle: 0, transform: 0 },
      },
      {
        id: "q6-b",
        text: "A quick trial or sample to understand the approach",
        scores: { essentials: 1, trial: 3, circle: 1, transform: 0 },
      },
      {
        id: "q6-c",
        text: "Interactive group sessions and discussions",
        scores: { essentials: 0, trial: 1, circle: 3, transform: 1 },
      },
      {
        id: "q6-d",
        text: "Direct mentorship tailored to my needs",
        scores: { essentials: 0, trial: 0, circle: 1, transform: 3 },
      },
    ],
  },
  {
    id: "q7",
    question: "What matters most to you right now?",
    options: [
      {
        id: "q7-a",
        text: "Getting started with the basics",
        scores: { essentials: 3, trial: 1, circle: 0, transform: 0 },
      },
      {
        id: "q7-b",
        text: "Testing if this approach works for me",
        scores: { essentials: 1, trial: 3, circle: 0, transform: 0 },
      },
      {
        id: "q7-c",
        text: "Being surrounded by like-minded people",
        scores: { essentials: 0, trial: 1, circle: 3, transform: 1 },
      },
      {
        id: "q7-d",
        text: "Achieving dramatic, lasting results",
        scores: { essentials: 0, trial: 0, circle: 2, transform: 3 },
      },
    ],
  },
  {
    id: "q8",
    question: "Where do you see yourself in 3 months?",
    options: [
      {
        id: "q8-a",
        text: "Having built good foundational habits",
        scores: { essentials: 3, trial: 1, circle: 1, transform: 0 },
      },
      {
        id: "q8-b",
        text: "Deciding if I want to go deeper",
        scores: { essentials: 1, trial: 3, circle: 1, transform: 0 },
      },
      {
        id: "q8-c",
        text: "Thriving in a supportive community",
        scores: { essentials: 0, trial: 0, circle: 3, transform: 1 },
      },
      {
        id: "q8-d",
        text: "Completely transformed and unrecognizable",
        scores: { essentials: 0, trial: 0, circle: 1, transform: 3 },
      },
    ],
  },
];

// ============================================
// SCORING ALGORITHM
// ============================================

export function calculateQuizResult(answers: QuizAnswer[]): QuizResult {
  // Initialize scores for each program
  const scores: { [programId: string]: number } = {};
  programs.forEach((p) => {
    scores[p.id] = 0;
  });

  // Calculate total scores based on answers
  answers.forEach((answer) => {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;

    answer.selectedOptionIds.forEach((optionId) => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return;

      // Add option scores to totals
      Object.entries(option.scores).forEach(([programId, score]) => {
        scores[programId] = (scores[programId] || 0) + score;
      });
    });
  });

  // Find the program with the highest score
  let maxScore = 0;
  let recommendedProgramId = programs[0].id;

  Object.entries(scores).forEach(([programId, score]) => {
    if (score > maxScore) {
      maxScore = score;
      recommendedProgramId = programId;
    }
  });

  const recommendedProgram = programs.find((p) => p.id === recommendedProgramId);

  return {
    programId: recommendedProgramId,
    programSlug: recommendedProgram?.slug || "essentials",
    score: maxScore,
    allScores: scores,
  };
}

// Get total number of questions
export function getTotalQuestions(): number {
  return quizQuestions.length;
}
