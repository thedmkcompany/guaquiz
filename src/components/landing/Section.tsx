import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Section Component
 *
 * Design Tokens Used:
 * - Section padding: px-4 sm:px-6 lg:px-8 (horizontal)
 * - Section padding: py-12 sm:py-16 md:py-20 lg:py-24 (vertical - lg scale)
 * - Max widths: xl(36rem) to 6xl(72rem) from design-tokens.ts
 * - Border radius: rounded-[2rem] (--radius-3xl) for floater
 * - Shadows: shadow-lg (--shadow-lg) for floater
 */

type MaxWidth = "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
type Background = "ivory" | "beige" | "forest";

interface SectionProps {
  children: ReactNode;
  maxWidth?: MaxWidth;
  background?: Background;
  className?: string;
  id?: string;
  /** Add floater frame effect with inner rounded content */
  floater?: boolean;
}

const maxWidthClasses: Record<MaxWidth, string> = {
  xl: "max-w-xl",       // 36rem / 576px
  "2xl": "max-w-2xl",   // 42rem / 672px
  "3xl": "max-w-3xl",   // 48rem / 768px
  "4xl": "max-w-4xl",   // 56rem / 896px
  "5xl": "max-w-5xl",   // 64rem / 1024px
  "6xl": "max-w-6xl",   // 72rem / 1152px
};

const backgroundClasses: Record<Background, string> = {
  ivory: "bg-ivory",
  beige: "bg-beige-light",
  forest: "bg-forest text-ivory",
};

export function Section({
  children,
  maxWidth = "5xl",
  background,
  className,
  id,
  floater = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        // Section padding (from sectionPadding tokens)
        "px-4 sm:px-6 lg:px-8",
        "py-12 sm:py-16 md:py-20 lg:py-24",
        background && backgroundClasses[background],
        className
      )}
    >
      <div
        className={cn(
          "mx-auto",
          maxWidthClasses[maxWidth],
          // Floater layout: generous padding with frame effect
          // Uses: --radius-3xl (2rem), --shadow-lg, border-beige
          floater && cn(
            "p-8 sm:p-10 lg:p-12",
            "rounded-[2.5rem]",
            "glass-card-strong",
            "border-[6px] border-white/40",
            "shadow-float"
          )
        )}
      >
        {children}
      </div>
    </section>
  );
}
