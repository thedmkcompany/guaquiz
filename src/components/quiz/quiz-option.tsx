"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface QuizOptionProps {
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function QuizOption({ text, isSelected, onSelect }: QuizOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full p-4 text-left rounded-xl border-2 transition-all duration-300",
        "hover:border-deep-cherry-light hover:bg-blush-pink-light",
        isSelected
          ? "border-deep-cherry bg-blush-pink-light shadow-md"
          : "border-blush-pink-dark bg-ivory"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-deep-grey font-body">{text}</span>
        {isSelected && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-6 h-6 rounded-full bg-deep-cherry flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
