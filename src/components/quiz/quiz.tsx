"use client";

/**
 * @fileoverview Main Quiz Component
 *
 * Interactive quiz flow that collects user responses and recommends
 * a transformation program based on their answers.
 *
 * @module components/quiz
 *
 * ## Flow
 *
 * 1. **Intro Screen**: Welcome message and start button
 * 2. **Questions (Q1-Q8)**: Single or multi-select options
 * 3. **Transition Screen**: Appears after Q3 for engagement
 * 4. **Loading Screen**: Animated analysis before results
 * 5. **Lead Capture**: Name, email, WhatsApp collection
 * 6. **Redirect**: Navigate to personalized results page
 *
 * ## State Management
 *
 * - Answers stored in component state during quiz
 * - Final response saved to localStorage on completion
 * - Lead data synced to API for CRM integration
 *
 * @example
 * ```tsx
 * // In a page component
 * import { Quiz } from '@/components/quiz/quiz';
 *
 * export default function QuizPage() {
 *   return (
 *     <main className="min-h-screen">
 *       <Quiz />
 *     </main>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QuizAnswer, QuizLead, QuizResponse } from "@/types";
import { quizQuestions, calculateQuizResult } from "@/lib/quiz-data";
import { storeQuizResponse, type StoredQuizResponse } from "@/lib/lead-storage";
import { QuizOption } from "./quiz-option";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

/**
 * Quiz screen states representing the current phase of the quiz flow.
 */
type QuizScreen =
  | "intro"
  | "question"
  | "transition-after-q3"
  | "loading"
  | "lead-capture";

// Detect device type
function getDeviceType(): "mobile" | "desktop" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

// Get referral source from URL params
function getReferralSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || params.get("utm_source") || undefined;
}

// Constants - memoized outside component
const TOTAL_QUESTIONS = quizQuestions.length;

export function Quiz() {
  const router = useRouter();
  const [screen, setScreen] = useState<QuizScreen>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loadingLineIndex, setLoadingLineIndex] = useState(0);
  const [resultProgram, setResultProgram] = useState<string>("");

  // Lead capture state
  const [leadData, setLeadData] = useState<QuizLead>({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadErrors, setLeadErrors] = useState<Partial<QuizLead>>({});

  // Tracking data
  const quizStartTime = useRef<string>("");
  const quizResponseRef = useRef<QuizResponse | null>(null);

  // Timeout ref for cleanup (prevents memory leaks on unmount)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized derived values
  const currentQuestion = useMemo(
    () => quizQuestions[currentQuestionIndex],
    [currentQuestionIndex]
  );

  const progress = useMemo(
    () => ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100,
    [currentQuestionIndex]
  );

  const selectedOptionIds = useMemo(() => {
    const currentAnswer = answers.find(
      (a) => a.questionId === currentQuestion?.id
    );
    return currentAnswer?.selectedOptionIds || [];
  }, [answers, currentQuestion?.id]);

  const canProceed = selectedOptionIds.length > 0;
  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;

  // Record quiz start time when entering questions
  useEffect(() => {
    if (screen === "question" && !quizStartTime.current) {
      quizStartTime.current = new Date().toISOString();
    }
  }, [screen]);

  // Cleanup auto-advance timeout on unmount (prevents memory leaks)
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Loading screen animation -> lead capture
  useEffect(() => {
    if (screen === "loading") {
      const timers = [
        setTimeout(() => setLoadingLineIndex(1), 1000),
        setTimeout(() => setLoadingLineIndex(2), 2000),
        setTimeout(() => {
          // Calculate result
          const completeAnswers = quizQuestions.map((q) => {
            const existingAnswer = answers.find((a) => a.questionId === q.id);
            return existingAnswer || { questionId: q.id, selectedOptionIds: [] };
          });
          const result = calculateQuizResult(completeAnswers);
          setResultProgram(result.programSlug);

          // Build quiz response data
          const answersMap: { [key: string]: string[] } = {};
          completeAnswers.forEach((a) => {
            answersMap[a.questionId] = a.selectedOptionIds;
          });

          const quizResponse: QuizResponse = {
            startedAt: quizStartTime.current,
            completedAt: new Date().toISOString(),
            answers: answersMap,
            scores: {
              essentials: result.allScores.essentials || 0,
              circle: result.allScores.circle || 0,
              transform: result.allScores.transform || 0,
            },
            recommendation: result.programSlug,
            deviceType: getDeviceType(),
            referralSource: getReferralSource(),
          };

          quizResponseRef.current = quizResponse;

          // Store quiz response using unified storage (localStorage + sessionStorage)
          // This ensures data persists even if browser tab is closed
          storeQuizResponse(quizResponse as StoredQuizResponse);

          // Move to lead capture
          setScreen("lead-capture");
        }, 3000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [screen, answers]);

  // Transition after Q3 animation
  useEffect(() => {
    if (screen === "transition-after-q3") {
      const timer = setTimeout(() => {
        setScreen("question");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Memoized handlers
  const handleOptionSelect = useCallback((optionId: string) => {
    const question = quizQuestions[currentQuestionIndex];
    const isMultiSelect = question.multiSelect;

    setAnswers((prev) => {
      const questionId = question.id;
      const existingAnswerIndex = prev.findIndex((a) => a.questionId === questionId);
      const existingSelectedIds = existingAnswerIndex >= 0
        ? prev[existingAnswerIndex].selectedOptionIds
        : [];

      let newSelectedIds: string[];

      if (isMultiSelect) {
        if (existingSelectedIds.includes(optionId)) {
          newSelectedIds = existingSelectedIds.filter((id) => id !== optionId);
        } else {
          newSelectedIds = [...existingSelectedIds, optionId];
        }
      } else {
        newSelectedIds = [optionId];
      }

      const newAnswer: QuizAnswer = {
        questionId,
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

    // Auto-advance for single-select questions after a brief delay
    if (!isMultiSelect) {
      // Clear any existing timeout before setting a new one
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
          const nextIndex = currentQuestionIndex + 1;
          // Show transition screen after Q3 (index 2)
          if (currentQuestionIndex === 2) {
            setCurrentQuestionIndex(nextIndex);
            setScreen("transition-after-q3");
          } else {
            setCurrentQuestionIndex(nextIndex);
          }
        } else {
          // Last question - go to loading screen
          setScreen("loading");
        }
      }, 300); // Brief delay for visual feedback
    }
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      const nextIndex = currentQuestionIndex + 1;

      // Show transition screen after Q3 (index 2)
      if (currentQuestionIndex === 2) {
        setCurrentQuestionIndex(nextIndex);
        setScreen("transition-after-q3");
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    } else {
      // Quiz complete - show loading screen
      setScreen("loading");
    }
  }, [currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleStartQuiz = useCallback(() => {
    setScreen("question");
  }, []);

  // Validate lead form
  const validateLead = useCallback((): boolean => {
    const errors: Partial<QuizLead> = {};

    if (!leadData.name.trim()) {
      errors.name = "Please enter your name";
    }

    if (!leadData.email.trim()) {
      errors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!leadData.whatsapp.trim()) {
      errors.whatsapp = "Please enter your WhatsApp number";
    } else if (!/^[+]?[\d\s-]{10,}$/.test(leadData.whatsapp.replace(/\s/g, ""))) {
      errors.whatsapp = "Please enter a valid phone number";
    }

    setLeadErrors(errors);
    return Object.keys(errors).length === 0;
  }, [leadData]);

  // Handle lead submission
  const handleLeadSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLead()) return;

    setIsSubmittingLead(true);

    try {
      // Add lead data to quiz response
      if (quizResponseRef.current) {
        quizResponseRef.current.lead = leadData;

        // Store complete response using unified storage (localStorage + sessionStorage)
        // This ensures data persists across browser sessions
        storeQuizResponse(quizResponseRef.current as StoredQuizResponse);

        // Send to API for Wix CRM sync (fire-and-forget pattern)
        // Data is already saved to localStorage, so API failure won't lose user data
        try {
          const response = await fetch("/api/quiz/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: leadData.name,
              email: leadData.email,
              whatsapp: leadData.whatsapp,
              recommendation: resultProgram,
              answers: quizResponseRef.current.answers,
              deviceType: quizResponseRef.current.deviceType,
              referralSource: quizResponseRef.current.referralSource,
            }),
          });

          if (!response.ok) {
            // Log error but don't block user - data is saved locally.
            // 429 is expected when users retry quickly; treat as a soft warning.
            const errorText = await response.text().catch(() => "Unknown error");
            if (response.status === 429) {
              if (process.env.NODE_ENV === "development") {
                let retryAfterSeconds: number | null = null;
                try {
                  const parsed = JSON.parse(errorText) as { retryAfter?: number };
                  retryAfterSeconds =
                    typeof parsed.retryAfter === "number" ? parsed.retryAfter : null;
                } catch {
                  retryAfterSeconds = null;
                }
                const suffix = retryAfterSeconds
                  ? ` Retry after ~${retryAfterSeconds}s.`
                  : "";
                console.warn("[Quiz] API sync rate-limited (non-blocking)." + suffix);
              }
            } else {
              console.error("[Quiz] API sync failed:", response.status, errorText);
            }
          }
        } catch (apiError) {
          // Network error - log but don't block user
          console.error("[Quiz] API sync network error:", apiError);
        }
      }

      // Redirect to results page (after API call completes)
      router.push(`/results/${resultProgram}`);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to submit lead:", error);
      }
      // Still proceed to results even if submission fails
      router.push(`/results/${resultProgram}`);
    } finally {
      setIsSubmittingLead(false);
    }
  }, [validateLead, leadData, resultProgram, router]);

  // Intro Screen
  if (screen === "intro") {
    return (
      <div className="quiz-fullscreen quiz-intro-bg flex flex-col items-center justify-center px-6 text-center">
        {/* Brand Mark */}
        <p className="absolute top-6 left-1/2 -translate-x-1/2 font-accent text-gold text-lg tracking-wide italic">
          Glow Up Academy
        </p>

        <div className="max-w-xl mx-auto">
          {/* Headline */}
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl text-ivory font-bold mb-4 leading-tight">
            8 Questions to Your Personal Path
          </h1>

          {/* Subheadline */}
          <p className="text-ivory/90 font-body text-lg sm:text-xl mb-6">
            Answer honestly Babe! There are no wrong answers-just YOUR answers. Each response helps us design the perfect transformation path for you.
          </p>

          {/* Body Copy */}
          <p className="text-ivory/70 font-body text-base sm:text-lg mb-10 max-w-md mx-auto">
            This takes 2 minutes. Be honest about where you are right now, not where you think you &ldquo;should&rdquo; be. The more authentic your answers, the more personalized your path.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStartQuiz}
            className="quiz-btn-gold text-lg sm:text-xl px-10 py-4 rounded-full font-subheader font-bold inline-flex items-center gap-3 hover:scale-105 transition-transform"
          >
            Let&apos;s Begin
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Trust Line */}
          <p className="text-ivory/60 font-body text-sm mt-8">
            Used by 5,000+ women &bull; Created by TheDMK
          </p>
        </div>
      </div>
    );
  }

  // Transition Screen After Q3
  if (screen === "transition-after-q3") {
    return (
      <div className="quiz-fullscreen quiz-transition-bg flex flex-col items-center justify-center px-6 text-center">
        {/* Brand Mark */}
        <p className="absolute top-6 left-1/2 -translate-x-1/2 font-accent text-gold text-lg tracking-wide italic">
          Glow Up Academy
        </p>

        <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl text-ivory font-bold mb-6">
          Understanding your path...
        </h2>
        {/* Pulsing dots animation */}
        <div className="flex gap-3">
          <span className="w-3 h-3 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-3 h-3 rounded-full bg-gold animate-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-3 h-3 rounded-full bg-gold animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    );
  }

  // Loading Screen After Q8
  if (screen === "loading") {
    const loadingLines = [
      "Analyzing your answers...",
      "Designing your personalized path...",
      "Your transformation begins now.",
    ];

    return (
      <div className="quiz-fullscreen quiz-loading-bg flex flex-col items-center justify-center px-6 text-center">
        {/* Brand Mark */}
        <p className="absolute top-6 left-1/2 -translate-x-1/2 font-accent text-gold text-lg tracking-wide italic z-20">
          Glow Up Academy
        </p>

        {/* Gold geometric pattern animation */}
        <div className="quiz-loading-pattern absolute inset-0 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {loadingLines.map((line, index) => (
            <p
              key={index}
              className={`font-body text-lg sm:text-xl text-ivory transition-all duration-500 ${
                index <= loadingLineIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Lead Capture Screen
  if (screen === "lead-capture") {
    return (
      <div className="quiz-fullscreen quiz-lead-capture-bg flex flex-col items-center justify-center px-6">
        {/* Brand Mark */}
        <p className="absolute top-6 left-1/2 -translate-x-1/2 font-accent text-gold text-lg tracking-wide italic">
          Glow Up Academy
        </p>

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-headline text-3xl sm:text-4xl text-ivory font-bold mb-3">
              Your Transformation Path is Ready!
            </h2>
            <p className="text-ivory/80 font-body text-base sm:text-lg mb-4">
              Based on your answers, we&apos;ve designed a personalized path just for you.
            </p>

            {/* Why we need this info - Psychological Copy */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-2 border border-white/20 text-left">
              <p className="text-ivory/90 font-body text-sm leading-relaxed mb-3">
                <span className="font-semibold text-gold">Why we need your details:</span>
              </p>
              <ul className="space-y-2 text-ivory/80 font-body text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">✓</span>
                  <span>Send your personalized program recommendation instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">✓</span>
                  <span>Connect you with a transformation specialist for questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">✓</span>
                  <span>Share exclusive tips and success stories from women like you</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-ivory/90 font-body text-sm mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border-2 text-ivory placeholder-ivory/50 font-body focus:outline-none focus:ring-2 focus:ring-gold transition-all ${
                  leadErrors.name ? "border-red-400" : "border-ivory/30 focus:border-gold"
                }`}
              />
              {leadErrors.name && (
                <p className="mt-1 text-red-300 text-sm font-body">{leadErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-ivory/90 font-body text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border-2 text-ivory placeholder-ivory/50 font-body focus:outline-none focus:ring-2 focus:ring-gold transition-all ${
                  leadErrors.email ? "border-red-400" : "border-ivory/30 focus:border-gold"
                }`}
              />
              {leadErrors.email && (
                <p className="mt-1 text-red-300 text-sm font-body">{leadErrors.email}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-ivory/90 font-body text-sm mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="whatsapp"
                value={leadData.whatsapp}
                onChange={(e) => setLeadData({ ...leadData, whatsapp: e.target.value })}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border-2 text-ivory placeholder-ivory/50 font-body focus:outline-none focus:ring-2 focus:ring-gold transition-all ${
                  leadErrors.whatsapp ? "border-red-400" : "border-ivory/30 focus:border-gold"
                }`}
              />
              {leadErrors.whatsapp && (
                <p className="mt-1 text-red-300 text-sm font-body">{leadErrors.whatsapp}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingLead}
              className="w-full quiz-btn-gold text-lg px-8 py-4 rounded-full font-subheader font-bold inline-flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isSubmittingLead ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  See My Results
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Privacy note - Enhanced */}
          <div className="mt-6 text-center">
            <p className="text-ivory/70 font-body text-sm mb-2">
              🔒 Your information is 100% secure
            </p>
            <p className="text-ivory/50 font-body text-xs leading-relaxed">
              We respect your privacy. Your data is encrypted and will never be sold or shared with third parties. You can unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  return (
    <div className="quiz-fullscreen bg-ivory flex flex-col">
      {/* Progress Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-sm">
        <div className="h-1 w-full bg-beige">
          <div
            className="h-full bg-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Brand Mark */}
          <p className="font-accent text-wine text-sm tracking-wide italic">
            Glow Up Academy
          </p>
          <p className="text-sm font-body text-forest/80">
            {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
          </p>
        </div>
      </div>

      {/* Question Content - Scrollable container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="w-full max-w-3xl mx-auto min-h-full flex flex-col justify-center py-6">
          {/* Question */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-forest font-bold leading-tight mb-4">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtext && (
              <p className="font-body text-base sm:text-lg text-forest/70 max-w-xl mx-auto">
                {currentQuestion.subtext}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 sm:space-y-4">
            {currentQuestion.options.map((option, index) => (
              <QuizOption
                key={option.id}
                label={String.fromCharCode(65 + index)} // A, B, C, D
                text={option.text}
                description={option.description}
                isSelected={selectedOptionIds.includes(option.id)}
                onSelect={() => handleOptionSelect(option.id)}
              />
            ))}
          </div>

          {currentQuestion.multiSelect && (
            <p className="mt-6 text-sm text-forest/50 font-body text-center">
              Select all that apply
            </p>
          )}
        </div>
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-sm border-t border-beige">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-subheader font-medium transition-all min-h-[48px] ${
              currentQuestionIndex === 0
                ? "text-forest/30 cursor-not-allowed"
                : "text-forest/60 hover:text-forest hover:bg-beige-light"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-subheader font-bold transition-all min-h-[48px] ${
              canProceed
                ? "quiz-btn-gold hover:scale-105"
                : "bg-beige text-forest/40 cursor-not-allowed"
            }`}
          >
            {isLastQuestion ? "See My Results" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
