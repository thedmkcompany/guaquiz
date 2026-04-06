"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Unified FAQ Accordion Component
 *
 * Supports multiple style variants for consistent FAQ experience across the site.
 *
 * Variants:
 * - glass: Glass card style with chevron up/down icons (default, used on results pages)
 * - card: White card with beige accents (used on circle page)
 * - minimal: Border-bottom only with gold accents (used on transform page)
 * - feminine: Gradient background with feminine styling (used on essentials/webinar)
 */

export interface FAQData {
  question: string;
  answer: string;
  id?: string;
}

type FAQVariant = "glass" | "card" | "minimal" | "feminine";

interface FAQAccordionProps {
  faq: FAQData;
  isExpanded: boolean;
  onToggle: () => void;
  variant?: FAQVariant;
  className?: string;
}

export function FAQAccordion({
  faq,
  isExpanded,
  onToggle,
  variant = "glass",
  className,
}: FAQAccordionProps) {
  // Variant-specific styles
  const variants = {
    glass: {
      container: "glass-card rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden",
      button: "w-full px-5 md:px-7 py-5 md:py-6 flex items-center justify-between text-left hover:bg-white/30 transition-colors focus:outline-none",
      question: "font-subheader font-medium text-charcoal text-sm md:text-base pr-4 md:pr-5",
      iconWrapper: "",
      icon: "w-4 h-4 md:w-5 md:h-5 text-forest flex-shrink-0",
      content: "px-5 md:px-7 pb-5 md:pb-6 bg-white/20 backdrop-blur-sm border-t border-white/30",
      answer: "text-sm md:text-base text-charcoal/70 font-body leading-relaxed",
      useChevronVariant: true,
    },
    card: {
      container: "bg-white/80 backdrop-blur-sm rounded-2xl mb-3 overflow-hidden border border-beige/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300",
      button: "w-full px-6 py-5 flex items-center justify-between text-left group",
      question: "font-semibold text-forest text-base pr-4 group-hover:text-wine transition-colors",
      iconWrapper: cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
        "bg-beige-light"
      ),
      iconWrapperExpanded: "bg-gold/20 rotate-180",
      icon: "w-4 h-4 text-forest/70",
      content: "px-6 pb-6",
      contentDivider: "h-px bg-gradient-to-r from-transparent via-beige to-transparent mb-4",
      answer: "text-base text-forest/75 leading-relaxed",
      useChevronVariant: false,
    },
    minimal: {
      container: "border-b border-gold/10 last:border-b-0",
      button: "w-full px-6 md:px-8 py-5 flex items-center justify-between text-left hover:bg-gold/5 transition-all duration-300 focus:outline-none group",
      question: "font-body font-medium text-forest text-sm md:text-base pr-4 group-hover:text-wine transition-colors",
      iconWrapper: cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
        "bg-gold/10"
      ),
      iconWrapperExpanded: "bg-gold/20 rotate-180",
      icon: "w-4 h-4 text-gold",
      content: "px-6 md:px-8 pb-6",
      answer: "text-sm md:text-base text-forest/70 font-body leading-relaxed pl-0 md:pl-4 border-l-2 border-gold/20",
      useChevronVariant: false,
    },
    feminine: {
      container: "relative rounded-[1.25rem] border transition-all duration-300 bg-gradient-to-br from-white to-ivory",
      button: "w-full px-5 py-4 flex items-center justify-between text-left",
      question: "font-subheader font-medium text-forest text-sm md:text-base pr-3",
      iconWrapper: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
      iconWrapperExpanded: "bg-gold text-white rotate-180",
      iconWrapperCollapsed: "bg-beige-light text-forest",
      icon: "w-4 h-4",
      content: "px-5 pb-5 border-t border-beige/30",
      answer: "text-sm md:text-base text-forest/70 font-body leading-relaxed pt-4",
      useChevronVariant: false,
    },
  };

  const v = variants[variant];

  // Build container classes - handle feminine variant's dynamic classes
  const containerClasses = cn(
    v.container,
    variant === "feminine" && (
      isExpanded
        ? "border-gold/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)]"
        : "border-beige/40 hover:border-beige-dark/30"
    ),
    className
  );

  // Build icon wrapper classes
  const iconWrapperClasses = cn(
    v.iconWrapper,
    isExpanded
      ? ("iconWrapperExpanded" in v ? v.iconWrapperExpanded : "")
      : ("iconWrapperCollapsed" in v ? v.iconWrapperCollapsed : "")
  );

  return (
    <div className={containerClasses}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(v.button, "cursor-pointer relative z-[1]")}
        aria-expanded={isExpanded}
      >
        <span className={v.question}>{faq.question}</span>
        {v.useChevronVariant ? (
          isExpanded ? (
            <ChevronUp className={v.icon} />
          ) : (
            <ChevronDown className={v.icon} />
          )
        ) : (
          <div className={iconWrapperClasses}>
            <ChevronDown className={v.icon} />
          </div>
        )}
      </button>

      {/* Expandable content — conditional mount only (grid/max-height accordions break in some browsers + Tailwind v4 scans) */}
      {isExpanded ? (
        <div className={v.content}>
          {variant !== "glass" && "contentDivider" in v && v.contentDivider ? (
            <div className={v.contentDivider} />
          ) : null}
          <p className={v.answer}>{faq.answer}</p>
        </div>
      ) : null}
    </div>
  );
}

// Re-export for backwards compatibility with existing FAQItem usage
export { FAQAccordion as FAQItem };
