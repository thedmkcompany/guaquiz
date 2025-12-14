import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Unified Section Component
 *
 * Combines features from landing and results section components.
 *
 * Design Tokens Used:
 * - Section padding: px-4 sm:px-6 lg:px-8 (horizontal)
 * - Section padding: py-12 sm:py-16 md:py-20 lg:py-24 (vertical)
 * - Max widths: sm to 6xl from Tailwind defaults
 * - Border radius: rounded-[2.5rem] for floater mode
 * - Shadows: shadow-float for floater mode
 */

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
type Background = "white" | "ivory" | "beige" | "forest" | "transparent";

interface SectionProps {
  children: ReactNode;
  maxWidth?: MaxWidth;
  background?: Background;
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Add floater frame effect with inner rounded content */
  floater?: boolean;
}

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: "max-w-sm",       // 24rem / 384px
  md: "max-w-md",       // 28rem / 448px
  lg: "max-w-lg",       // 32rem / 512px
  xl: "max-w-xl",       // 36rem / 576px
  "2xl": "max-w-2xl",   // 42rem / 672px
  "3xl": "max-w-3xl",   // 48rem / 768px
  "4xl": "max-w-4xl",   // 56rem / 896px
  "5xl": "max-w-5xl",   // 64rem / 1024px
  "6xl": "max-w-6xl",   // 72rem / 1152px
};

const backgroundClasses: Record<Background, string> = {
  white: "bg-white/40 backdrop-blur-sm",
  ivory: "bg-ivory/40 backdrop-blur-sm",
  beige: "bg-beige-light/30 backdrop-blur-sm",
  forest: "bg-gradient-to-b from-forest to-forest-dark text-ivory",
  transparent: "",
};

export function Section({
  children,
  maxWidth = "5xl",
  background,
  className,
  containerClassName,
  id,
  floater = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        // Section padding
        "px-4 sm:px-6 lg:px-8",
        "py-12 sm:py-16 md:py-20 lg:py-24",
        background && backgroundClasses[background],
        className
      )}
    >
      {floater ? (
        <div className={cn("mx-auto", maxWidthClasses[maxWidth], containerClassName)}>
          <div className="glass-card-strong rounded-[2.5rem] shadow-float border-[6px] border-white/40 p-8 sm:p-10 lg:p-12">
            {children}
          </div>
        </div>
      ) : (
        <div className={cn("mx-auto", maxWidthClasses[maxWidth], containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}

/**
 * Section Header Component
 * Consistent header styling for section titles and subtitles
 */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <header className={cn("text-center mb-6 md:mb-10 lg:mb-12", className)}>
      <h2 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl text-forest mb-2 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-lg text-charcoal/70 font-body px-2">
          {subtitle}
        </p>
      )}
    </header>
  );
}
