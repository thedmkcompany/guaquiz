"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQ } from "@/lib/results-data";

interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
}

export function FAQItem({ faq, isExpanded, onToggle }: FAQItemProps) {
  return (
    <article className="glass-card rounded-[1.5rem] overflow-hidden shadow-soft border border-white/50 hover:shadow-medium transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-5 md:px-7 py-5 md:py-6 flex items-center justify-between text-left hover:bg-white/30 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="font-subheader font-medium text-charcoal text-sm md:text-base pr-4 md:pr-5">
          {faq.question}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-forest flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-forest flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="px-5 md:px-7 pb-5 md:pb-6 bg-white/20 backdrop-blur-sm border-t border-white/30">
          <p className="text-sm md:text-base text-charcoal/70 font-body leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </article>
  );
}
