import { QuizQuestion, QuizAnswer, QuizResult } from "@/types";
import { programs } from "./programs";

// Define your quiz questions here
// Each option has scores that weight towards different programs
export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is your primary goal?",
    options: [
      {
        id: "q1-a",
        text: "Option A",
        scores: { "program-1": 3, "program-2": 1, "program-3": 0, "program-4": 0 },
      },
      {
        id: "q1-b",
        text: "Option B",
        scores: { "program-1": 1, "program-2": 3, "program-3": 1, "program-4": 0 },
      },
      {
        id: "q1-c",
        text: "Option C",
        scores: { "program-1": 0, "program-2": 1, "program-3": 3, "program-4": 1 },
      },
      {
        id: "q1-d",
        text: "Option D",
        scores: { "program-1": 0, "program-2": 0, "program-3": 1, "program-4": 3 },
      },
    ],
  },
  {
    id: "q2",
    question: "What is your experience level?",
    options: [
      {
        id: "q2-a",
        text: "Beginner",
        scores: { "program-1": 3, "program-2": 2, "program-3": 0, "program-4": 0 },
      },
      {
        id: "q2-b",
        text: "Intermediate",
        scores: { "program-1": 1, "program-2": 2, "program-3": 2, "program-4": 1 },
      },
      {
        id: "q2-c",
        text: "Advanced",
        scores: { "program-1": 0, "program-2": 1, "program-3": 2, "program-4": 3 },
      },
    ],
  },
  {
    id: "q3",
    question: "What is your budget range?",
    options: [
      {
        id: "q3-a",
        text: "Under 5,000",
        scores: { "program-1": 3, "program-2": 0, "program-3": 0, "program-4": 0 },
      },
      {
        id: "q3-b",
        text: "5,000 - 10,000",
        scores: { "program-1": 1, "program-2": 3, "program-3": 1, "program-4": 0 },
      },
      {
        id: "q3-c",
        text: "10,000 - 15,000",
        scores: { "program-1": 0, "program-2": 1, "program-3": 3, "program-4": 1 },
      },
      {
        id: "q3-d",
        text: "15,000+",
        scores: { "program-1": 0, "program-2": 0, "program-3": 1, "program-4": 3 },
      },
    ],
  },
  {
    id: "q4",
    question: "How much time can you commit weekly?",
    options: [
      {
        id: "q4-a",
        text: "1-2 hours",
        scores: { "program-1": 3, "program-2": 1, "program-3": 0, "program-4": 0 },
      },
      {
        id: "q4-b",
        text: "3-5 hours",
        scores: { "program-1": 1, "program-2": 3, "program-3": 2, "program-4": 0 },
      },
      {
        id: "q4-c",
        text: "5-10 hours",
        scores: { "program-1": 0, "program-2": 1, "program-3": 3, "program-4": 2 },
      },
      {
        id: "q4-d",
        text: "10+ hours",
        scores: { "program-1": 0, "program-2": 0, "program-3": 1, "program-4": 3 },
      },
    ],
  },
  {
    id: "q5",
    question: "What type of support do you prefer?",
    options: [
      {
        id: "q5-a",
        text: "Self-paced learning",
        scores: { "program-1": 3, "program-2": 2, "program-3": 0, "program-4": 0 },
      },
      {
        id: "q5-b",
        text: "Community support",
        scores: { "program-1": 1, "program-2": 3, "program-3": 1, "program-4": 0 },
      },
      {
        id: "q5-c",
        text: "Group coaching",
        scores: { "program-1": 0, "program-2": 1, "program-3": 3, "program-4": 1 },
      },
      {
        id: "q5-d",
        text: "1-on-1 mentorship",
        scores: { "program-1": 0, "program-2": 0, "program-3": 1, "program-4": 3 },
      },
    ],
  },
];

// Calculate quiz results based on answers
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
    programSlug: recommendedProgram?.slug || "program-1",
    score: maxScore,
    allScores: scores,
  };
}
