"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: "default" | "gold" | "emerald";
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
        "h-2 w-full overflow-hidden rounded-full bg-blush-pink-light",
        className
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full",
          {
            "bg-deep-cherry": variant === "default",
            "bg-gradient-to-r from-gold-dark via-gold to-gold-light": variant === "gold",
            "bg-emerald": variant === "emerald",
          }
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
