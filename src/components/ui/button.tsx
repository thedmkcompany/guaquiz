"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "luxe" | "gold";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none font-subheader",
          {
            // Primary - Deep Cherry
            "bg-deep-cherry text-white hover:bg-deep-cherry-dark focus:ring-deep-cherry":
              variant === "primary",
            // Secondary - Blush Pink
            "bg-blush-pink text-deep-cherry hover:bg-blush-pink-dark focus:ring-blush-pink":
              variant === "secondary",
            // Outline
            "border-2 border-deep-cherry bg-transparent text-deep-cherry hover:bg-deep-cherry hover:text-white focus:ring-deep-cherry":
              variant === "outline",
            // Ghost
            "bg-transparent text-deep-cherry hover:bg-blush-pink-light focus:ring-blush-pink":
              variant === "ghost",
            // Luxe - Gradient
            "btn-luxe focus:ring-deep-cherry":
              variant === "luxe",
            // Gold Accent
            "bg-gold text-deep-grey hover:bg-gold-dark focus:ring-gold":
              variant === "gold",
          },
          {
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-5 text-sm": size === "md",
            "h-13 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
