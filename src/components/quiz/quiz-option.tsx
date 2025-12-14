"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface QuizOptionProps {
  label: string; // A, B, C, D
  text: string;
  description?: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const QuizOption = memo(function QuizOption({
  label,
  text,
  description,
  isSelected,
  onSelect,
}: QuizOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-2xl transition-all duration-300 group relative overflow-hidden",
        "py-5 px-5 sm:py-6 sm:px-6",
        "min-h-[60px]",
        isSelected
          ? "quiz-option-selected"
          : "quiz-option-unselected"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Label Circle */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-subheader font-bold text-sm transition-all duration-300",
            isSelected
              ? "bg-white/20 text-forest"
              : "bg-beige text-forest/60 group-hover:bg-beige-dark"
          )}
        >
          {label})
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main Text */}
          <p
            className={cn(
              "font-subheader text-base sm:text-lg md:text-xl font-medium leading-snug",
              isSelected ? "text-forest" : "text-forest"
            )}
          >
            {text}
          </p>

          {/* Description */}
          {description && (
            <p
              className={cn(
                "font-body text-sm sm:text-base mt-2 leading-relaxed italic",
                isSelected ? "text-forest/70" : "text-forest/60"
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* Selection Indicator */}
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-1",
            isSelected
              ? "border-gold bg-gold"
              : "border-beige-dark group-hover:border-wine"
          )}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-forest"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
});
