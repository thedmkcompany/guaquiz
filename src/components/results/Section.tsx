"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  background?: "white" | "ivory" | "beige" | "forest";
  className?: string;
  containerClassName?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const backgroundClasses = {
  white: "bg-white/40 backdrop-blur-sm",
  ivory: "bg-ivory/40 backdrop-blur-sm",
  beige: "bg-beige-light/30 backdrop-blur-sm",
  forest: "bg-gradient-to-b from-forest to-forest-dark",
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function Section({
  children,
  background = "white",
  className,
  containerClassName,
  maxWidth = "5xl",
}: SectionProps) {
  return (
    <section className={cn(backgroundClasses[background], className)}>
      <div
        className={cn(
          "container mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-20 lg:py-24",
          containerClassName
        )}
      >
        <div className={cn(maxWidthClasses[maxWidth], "mx-auto")}>{children}</div>
      </div>
    </section>
  );
}

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
