"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizAnswer } from "@/types";
import { quizQuestions, calculateQuizResult } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizOption } from "./quiz-option";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Quiz() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Get current answer for this question
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion.id
  );
  const selectedOptionIds = currentAnswer?.selectedOptionIds || [];

  const handleOptionSelect = (optionId: string) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      let newSelectedIds: string[];

      if (currentQuestion.multiSelect) {
        // Toggle selection for multi-select
        if (selectedOptionIds.includes(optionId)) {
          newSelectedIds = selectedOptionIds.filter((id) => id !== optionId);
        } else {
          newSelectedIds = [...selectedOptionIds, optionId];
        }
      } else {
        // Single select - replace
        newSelectedIds = [optionId];
      }

      const newAnswer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedOptionIds: newSelectedIds,
      };

      if (existingAnswerIndex >= 0) {
        const updated = [...prev];
        updated[existingAnswerIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate result and redirect
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsCalculating(true);

    // Ensure all questions have answers
    const completeAnswers = quizQuestions.map((q) => {
      const existingAnswer = answers.find((a) => a.questionId === q.id);
      return existingAnswer || { questionId: q.id, selectedOptionIds: [] };
    });

    const result = calculateQuizResult(completeAnswers);

    // Store result in sessionStorage for the result page
    sessionStorage.setItem("quizResult", JSON.stringify(result));

    // Redirect to the results page with the recommended program
    router.push(`/results/${result.programSlug}`);
  };

  const canProceed = selectedOptionIds.length > 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <QuizOption
              key={option.id}
              text={option.text}
              isSelected={selectedOptionIds.includes(option.id)}
              onSelect={() => handleOptionSelect(option.id)}
            />
          ))}
        </div>

        {currentQuestion.multiSelect && (
          <p className="mt-3 text-sm text-gray-500">
            You can select multiple options
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isCalculating}
        >
          {isCalculating ? (
            "Calculating..."
          ) : isLastQuestion ? (
            "See My Results"
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
