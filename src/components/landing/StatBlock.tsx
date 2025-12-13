import { cn } from "@/lib/utils";

/**
 * StatBlock Component
 *
 * Design Tokens Used:
 * - Font family: font-headline (Playfair Display) for value
 * - Font sizes: text-4xl → text-5xl → text-6xl (responsive)
 * - Colors: text-gold for value, text-ivory/80 for label
 * - Spacing: py-6 → py-8, px-4 → px-6 (generous padding)
 *
 * Used in: Dark (forest) backgrounds for credibility sections
 */

interface StatBlockProps {
  value: string;
  label: string;
  className?: string;
}

export function StatBlock({ value, label, className }: StatBlockProps) {
  return (
    <div
      className={cn(
        // Generous padding for soft UI feel
        "py-6 sm:py-8",
        "px-4 sm:px-6",
        className
      )}
    >
      {/* Large stat value - headline font */}
      <p className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-gold drop-shadow-sm">
        {value}
      </p>
      {/* Label - body font */}
      <p className="mt-3 text-sm sm:text-base text-ivory/80 font-body">
        {label}
      </p>
    </div>
  );
}
