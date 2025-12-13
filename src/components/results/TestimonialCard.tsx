"use client";

import Image from "next/image";
import { Testimonial } from "@/lib/results-data";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="glass-card rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-medium border border-white/50 hover:shadow-strong hover:scale-[1.01] transition-all duration-300">
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        {/* Photo */}
        <figure className="mb-5">
          <div className="relative w-18 h-18 md:w-22 md:h-22 rounded-full overflow-hidden shadow-soft ring-2 ring-white/50">
            <Image
              src={testimonial.photoUrl || "/images/placeholder-avatar.jpg"}
              alt={testimonial.name}
              fill
              className="object-cover"
              sizes="88px"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-beige-light/20 to-forest/10 rounded-full" />
          </div>
        </figure>

        {/* Quote */}
        <blockquote className="text-sm md:text-base lg:text-lg text-charcoal/80 font-body leading-relaxed mb-5 italic">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Attribution */}
        <footer>
          <p className="font-subheader font-semibold text-forest text-sm md:text-base">
            {testimonial.name}
          </p>
          <p className="text-xs md:text-sm text-charcoal/60 font-body">
            {testimonial.role}, {testimonial.age} • {testimonial.location}
          </p>
          <p className="text-[10px] md:text-xs text-forest/70 font-body mt-1">
            {testimonial.membershipDuration}
          </p>
        </footer>
      </div>
    </article>
  );
}
