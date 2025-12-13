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
        "w-full p-5 sm:p-6 text-left rounded-[1.5rem] transition-all duration-300 group relative overflow-hidden",
        isSelected
          ? "bg-wine text-white shadow-lg scale-[1.02]"
          : "bg-white/60 hover:bg-white/90 shadow-sm hover:shadow-md text-charcoal border border-white/40"
      )}
    >
      {/* Background decoration for selected state */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-wine to-wine-light opacity-100 z-0" />
      )}
      
      <div className="flex items-center justify-between relative z-10">
        <span className={cn(
          "font-subheader text-base sm:text-lg font-medium",
          isSelected ? "text-white" : "text-forest"
        )}>
          {text}
        </span>
        
        <div className={cn(
          "flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
          isSelected ? "bg-white/20 text-white" : "bg-forest/5 text-forest/40 group-hover:bg-forest/10"
        )}>
          {isSelected ? (
            <Check className="w-5 h-5" />
          ) : (
            <div className="w-3 h-3 rounded-full border-2 border-current" />
          )}
        </div>
      </div>
    </button>
  );
}
