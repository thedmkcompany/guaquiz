import { memo } from "react";

interface BenefitCardProps {
  index: number;
  headline: string;
  description: string;
}

export const BenefitCard = memo(function BenefitCard({ index, headline, description }: BenefitCardProps) {
  return (
    <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-strong hover:scale-[1.01] transition-all duration-300 p-5 md:p-7 lg:p-9">
      <div className="flex items-start gap-4 md:gap-5 h-full">
        <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-forest to-forest-light text-white flex items-center justify-center font-subheader font-bold text-sm md:text-base shadow-soft">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-subheader font-semibold text-forest text-base md:text-lg mb-2 md:mb-3">
            {headline}
          </h3>
          <p className="text-sm md:text-base text-charcoal/70 font-body leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});
