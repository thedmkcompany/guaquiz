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

    // Store Q1 answer for archetype personalization on results page
    const q1Answer = completeAnswers.find((a) => a.questionId === "q1");
    if (q1Answer && q1Answer.selectedOptionIds.length > 0) {
      sessionStorage.setItem("dmk_q1_answer", q1Answer.selectedOptionIds[0]);
    }

    // Redirect to the results page with the recommended program
    router.push(`/results/${result.programSlug}`);
  };

  const canProceed = selectedOptionIds.length > 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Progress Indicator - Minimalist */}
      <div className="mb-8 sm:mb-10 px-2">
        <div className="flex justify-between items-center text-xs sm:text-sm text-forest/60 mb-3 font-subheader">
          <span>Question {currentQuestionIndex + 1}/{totalQuestions}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-wine rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(128,0,0,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card - Glass effect */}
      <div className="glass-card-strong rounded-[2.5rem] p-6 sm:p-10 mb-8 sm:mb-10 shadow-lg border border-white/60 relative overflow-hidden">
        {/* Decorative soft glow behind text */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-0" />
        
        <div className="relative z-10">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-forest leading-tight mb-8 text-center">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
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
            <p className="mt-6 text-xs sm:text-sm text-forest/40 font-body text-center tracking-wide uppercase">
              Select all that apply
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4 px-2">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="text-forest/60 hover:text-forest hover:bg-white/30 rounded-full px-6 transition-all"
        >
          <span className={currentQuestionIndex === 0 ? "invisible" : ""}>Back</span>
        </Button>

        <Button
          variant="wine"
          size="lg"
          onClick={handleNext}
          disabled={!canProceed || isCalculating}
          className="rounded-full px-8 py-6 shadow-xl shadow-wine/20 hover:shadow-wine/30 hover:-translate-y-1 transition-all min-w-[140px]"
        >
          {isCalculating ? (
            <span className="font-subheader">Calculating...</span>
          ) : isLastQuestion ? (
            <span className="font-subheader">Get Results</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-subheader">Continue</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
