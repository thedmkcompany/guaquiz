import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

/**
 * CTAButton Component (Link-based)
 *
 * Design Tokens Used:
 * - Colors: bg-gold, text-charcoal (primary button variant)
 * - Border radius: rounded-full (pill shape)
 * - Shadows: --shadow-lg (soft depth), --shadow-hover-lg on hover
 * - Transitions: transition-all duration-300 ease-out
 * - Sizing: lg to xl scale responsive padding
 *
 * For button elements, use <Button variant="primary" size="lg" /> instead.
 */

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  fullWidthMobile?: boolean;
  className?: string;
}

export function CTAButton({
  href,
  children,
  fullWidthMobile = true,
  className,
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Layout
        "inline-flex items-center justify-center",
        // Sizing (lg → xl scale)
        "px-8 sm:px-10 md:px-12",
        "py-4 sm:py-5",
        // Typography
        "text-base sm:text-lg md:text-xl",
        "font-semibold",
        // Colors (primary variant)
        "text-charcoal bg-gold",
        "hover:bg-gold-dark",
        // Super-rounded: Full pill shape
        "rounded-full",
        // Soft depth shadow
        "shadow-[0_20px_50px_rgba(0,0,0,0.06)]",
        "hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)]",
        // Transitions
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5",
        "active:translate-y-0",
        // Focus state
        "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        "focus-visible:outline-none",
        // Width
        fullWidthMobile && "w-full sm:w-auto",
        className
      )}
    >
      {children}
      <span className="ml-3" aria-hidden="true">&rarr;</span>
    </Link>
  );
}
