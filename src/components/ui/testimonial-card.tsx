import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Unified TestimonialCard Component
 *
 * Supports two usage patterns:
 * 1. Flat props: <TestimonialCard quote="..." name="..." ... />
 * 2. Object prop: <TestimonialCard testimonial={{ quote, name, ... }} />
 *
 * Variants:
 * - default: Standard card with small photo
 * - featured: Large image card for carousel/swipable layouts
 */

export interface TestimonialData {
  id?: string;
  quote: string;
  name: string;
  location: string;
  role: string;
  age: number;
  photoUrl?: string;
  imagePlaceholder?: string;
  membershipDuration?: string;
}

interface TestimonialCardProps {
  // Object pattern (results pages)
  testimonial?: TestimonialData;
  // Flat props pattern (landing page)
  quote?: string;
  name?: string;
  location?: string;
  role?: string;
  age?: number;
  photoUrl?: string;
  imagePlaceholder?: string;
  membershipDuration?: string;
  // Common
  className?: string;
  /** Render as list item (li) for accessibility in lists */
  asListItem?: boolean;
  /** Card variant: default or featured (large image) */
  variant?: "default" | "featured";
}

export function TestimonialCard({
  testimonial,
  quote: quoteProp,
  name: nameProp,
  location: locationProp,
  role: roleProp,
  age: ageProp,
  photoUrl: photoUrlProp,
  imagePlaceholder: imagePlaceholderProp,
  membershipDuration: membershipDurationProp,
  className,
  asListItem = true,
  variant = "default",
}: TestimonialCardProps) {
  // Merge object and flat props (object takes precedence)
  const quote = testimonial?.quote ?? quoteProp ?? "";
  const name = testimonial?.name ?? nameProp ?? "";
  const location = testimonial?.location ?? locationProp ?? "";
  const role = testimonial?.role ?? roleProp ?? "";
  const age = testimonial?.age ?? ageProp ?? 0;
  const photoUrl = testimonial?.photoUrl ?? photoUrlProp;
  const imagePlaceholder = testimonial?.imagePlaceholder ?? imagePlaceholderProp;
  const membershipDuration = testimonial?.membershipDuration ?? membershipDurationProp;

  const hasPhoto = !!photoUrl;

  // Featured variant - Large image card for carousel
  if (variant === "featured") {
    const cardContent = (
      <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float transition-all duration-300 ease-out flex flex-col h-full overflow-hidden">
        {/* Large Photo */}
        {hasPhoto && (
          <div className="relative w-full aspect-[4/5] overflow-hidden">
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 280px, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          {/* Quote */}
          <blockquote className="text-sm sm:text-base text-charcoal/80 font-body leading-relaxed mb-4 flex-grow italic">
            &ldquo;{quote}&rdquo;
          </blockquote>

          {/* Attribution */}
          <footer className="flex items-center gap-3 pt-3 border-t border-forest/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-charcoal font-bold text-sm shadow-md shrink-0">
              {name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-forest text-sm">
                {name}, {location}
              </p>
              <p className="text-xs text-forest/60">
                {role}, {age}
              </p>
            </div>
          </footer>
        </div>
      </div>
    );

    if (asListItem) {
      return <li className={cn("list-none h-full", className)}>{cardContent}</li>;
    }
    return <div className={cn("h-full", className)}>{cardContent}</div>;
  }

  // Default variant - Original card style
  const cardContent = (
    <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-float hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full p-6 sm:p-8 lg:p-10">
      {/* Photo or placeholder */}
      {hasPhoto ? (
        <figure className="mb-5 shrink-0 flex justify-center md:justify-start">
          <div className="relative w-18 h-18 md:w-22 md:h-22 rounded-full overflow-hidden shadow-soft ring-2 ring-white/50">
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="88px"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-beige-light/20 to-forest/10 rounded-full" />
          </div>
        </figure>
      ) : imagePlaceholder ? (
        <div className="w-full aspect-[4/3] bg-beige-light rounded-3xl mb-5 sm:mb-6 flex items-center justify-center overflow-hidden shrink-0">
          <p className="text-forest/40 text-xs sm:text-sm text-center px-4">
            {imagePlaceholder}
          </p>
        </div>
      ) : (
        // Default avatar circle when no photo or placeholder
        <div className="mb-5 flex justify-center md:justify-start">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-charcoal font-bold text-lg sm:text-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]">
            {name.charAt(0)}
          </div>
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-sm sm:text-base lg:text-lg text-charcoal/80 font-body leading-relaxed mb-5 sm:mb-6 flex-grow italic">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Attribution footer */}
      <footer className="flex items-center gap-3 mt-auto">
        {/* Small avatar if we showed a large photo/placeholder above */}
        {(hasPhoto || imagePlaceholder) && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-charcoal font-bold text-sm sm:text-base shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] shrink-0">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-forest text-sm sm:text-base">
            {name}, {location}
          </p>
          <p className="text-xs sm:text-sm text-forest/60">
            {role}, {age}
          </p>
          {membershipDuration && (
            <p className="text-[10px] md:text-xs text-forest/70 font-body mt-1">
              {membershipDuration}
            </p>
          )}
        </div>
      </footer>
    </div>
  );

  if (asListItem) {
    return (
      <li className={cn("list-none h-full", className)}>
        {cardContent}
      </li>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      {cardContent}
    </div>
  );
}
