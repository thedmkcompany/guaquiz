import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * SectionHeading Component
 *
 * Design Tokens Used:
 * - Font family: font-headline (Playfair Display)
 * - Font sizes: text-2xl → text-3xl → text-4xl (responsive h2 scale)
 * - Font weight: font-bold (700)
 * - Spacing: mb-8 → mb-10 → mb-12 → mb-16 (responsive bottom margin)
 */

interface SectionHeadingProps {
  children: ReactNode;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  children,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        // Typography from textStyles.h2
        "font-headline",
        "text-2xl sm:text-3xl lg:text-4xl",
        "font-bold",
        // Responsive bottom margin
        "mb-6 sm:mb-8 md:mb-10 lg:mb-12",
        centered && "text-center",
        className
      )}
    >
      {children}
    </h2>
  );
}
