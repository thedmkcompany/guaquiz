"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: "default" | "gold" | "forest" | "wine";
}

export function Progress({
  value,
  max = 100,
  className,
  variant = "default",
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={cn(
        "h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-white/60 backdrop-blur-sm shadow-inner",
        className
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full relative",
          "shadow-[0_2px_8px_rgba(0,0,0,0.1)]",
          {
            "bg-gradient-to-r from-wine to-wine-light": variant === "default" || variant === "wine",
            "bg-gradient-to-r from-gold-dark via-gold to-gold-light": variant === "gold",
            "bg-gradient-to-r from-forest to-forest-light": variant === "forest",
          }
        )}
        style={{ width: `${percentage}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
