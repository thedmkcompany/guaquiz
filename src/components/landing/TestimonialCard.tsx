import { cn } from "@/lib/utils";

/**
 * TestimonialCard Component
 *
 * Design Tokens Used:
 * - Border radius: rounded-[2rem] (--radius-3xl) for card, rounded-3xl for image
 * - Shadows: --shadow-lg base, --shadow-hover-lg on hover
 * - Colors: bg-white, border-beige, text-forest
 * - Avatar: bg-gradient gold, rounded-full (pill)
 * - Transitions: transition-all duration-300
 * - Spacing: p-6 → p-8 → p-10 (responsive padding)
 */

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  role: string;
  age: number;
  imagePlaceholder?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  location,
  role,
  age,
  imagePlaceholder,
  className,
}: TestimonialCardProps) {
  return (
    <li
      className={cn(
        // Background - Glass effect
        "glass-card",
        // Super-rounded corners
        "rounded-[2rem]",
        // Generous padding
        "p-6 sm:p-8 lg:p-10",
        // Soft depth shadow
        "shadow-medium",
        // Subtle border for definition
        "border border-white/50",
        // Hover effect
        "transition-all duration-300 ease-out",
        "hover:shadow-float",
        "hover:-translate-y-1",
        "hover:bg-white/80",
        className
      )}
    >
      {/* Photo placeholder - also super-rounded */}
      <div className="w-full aspect-[4/3] bg-beige-light rounded-3xl mb-5 sm:mb-6 flex items-center justify-center overflow-hidden">
        <p className="text-forest/40 text-xs sm:text-sm text-center px-4">
          {imagePlaceholder || "[Photo placeholder]"}
        </p>
      </div>

      {/* Quote - body text style */}
      <blockquote className="text-sm sm:text-base text-forest/80 mb-5 sm:mb-6 leading-relaxed font-body">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Footer with avatar */}
      <footer className="flex items-center gap-3">
        {/* Avatar circle - gold gradient with soft shadow */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-charcoal font-bold text-sm sm:text-base shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-forest text-sm sm:text-base">
            {name}, {location}
          </p>
          <p className="text-xs sm:text-sm text-forest/60">
            {role}, {age}
          </p>
        </div>
      </footer>
    </li>
  );
}
