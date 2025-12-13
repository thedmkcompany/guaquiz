"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Button Component
 *
 * Design Tokens Used:
 * - Border radius: rounded-full (pill) for all buttons
 * - Shadows: shadow-[0_20px_50px_rgba(0,0,0,0.06)] (soft depth)
 * - Transitions: transition-all duration-300
 *
 * Variants:
 * - primary: Gold background (main CTA)
 * - secondary: Forest outline
 * - ghost: Transparent with subtle hover
 * - glass: For dark/image overlays
 * - forest: Forest gradient
 * - wine: Wine gradient (accent)
 *
 * Sizes:
 * - sm: 36px height, text-sm
 * - md: 44px height, text-base
 * - lg: 52px height, text-lg
 * - xl: 60px height, text-xl
 */

type ButtonVariant = "primary" | "secondary" | "ghost" | "glass" | "forest" | "wine";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Make button full width */
  fullWidth?: boolean;
  /** Show loading state */
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  // Primary: Gold (main CTA)
  primary: cn(
    "bg-gold text-charcoal",
    "shadow-[0_20px_50px_rgba(0,0,0,0.06)]",
    "hover:bg-gold-dark hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] hover:-translate-y-0.5",
    "active:translate-y-0",
    "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
  ),
  // Secondary: Forest outline
  secondary: cn(
    "bg-transparent text-forest border-2 border-forest",
    "hover:bg-forest hover:text-ivory",
    "focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
  ),
  // Ghost: Subtle hover
  ghost: cn(
    "bg-transparent text-forest",
    "hover:bg-beige-light",
    "focus-visible:ring-2 focus-visible:ring-beige focus-visible:ring-offset-2"
  ),
  // Glass: For overlays
  glass: cn(
    "bg-white/10 backdrop-blur-md text-ivory border border-white/20",
    "hover:bg-white/20",
    "focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
  ),
  // Forest: Gradient
  forest: cn(
    "bg-gradient-to-br from-forest to-forest-light text-ivory",
    "shadow-[0_20px_50px_rgba(0,0,0,0.06)]",
    "hover:from-forest-dark hover:to-forest hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] hover:-translate-y-0.5",
    "active:translate-y-0",
    "focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
  ),
  // Wine: Accent gradient
  wine: cn(
    "bg-gradient-to-br from-wine to-wine-light text-ivory",
    "shadow-[0_20px_50px_rgba(0,0,0,0.06)]",
    "hover:from-wine-dark hover:to-wine hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] hover:-translate-y-0.5",
    "active:translate-y-0",
    "focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2"
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-4 py-2 text-sm gap-1.5",
  md: "min-h-[44px] px-6 py-3 text-base gap-2",
  lg: "min-h-[52px] px-8 py-4 text-lg gap-2.5",
  xl: "min-h-[60px] px-10 py-5 text-xl gap-3",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "font-semibold",
          // Super-rounded (pill shape)
          "rounded-full",
          // Smooth transitions
          "transition-all duration-300 ease-out",
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          // Custom classes
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
