import { memo } from "react";
import { Dumbbell, Sparkles, Wallet, Crown, LucideIcon } from "lucide-react";
import { ProgramPillar } from "@/lib/results-data";

const pillarIcons: Record<ProgramPillar["icon"], LucideIcon> = {
  body: Dumbbell,
  beauty: Sparkles,
  finance: Wallet,
  confidence: Crown,
};

interface PillarCardProps {
  pillar: ProgramPillar;
}

export const PillarCard = memo(function PillarCard({ pillar }: PillarCardProps) {
  const IconComponent = pillarIcons[pillar.icon];

  return (
    <div className="glass-card rounded-[2rem] shadow-medium hover:shadow-strong transition-all duration-300 flex flex-col h-full p-6 md:p-8 lg:p-10">
      {/* Icon + Title Row */}
      <div className="flex items-start gap-4 md:gap-5 mb-4 md:mb-5">
        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center text-gold shadow-soft border border-gold/10 shrink-0">
          <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] md:text-xs font-subheader uppercase tracking-wider text-forest/60 mb-0.5 md:mb-1">
            {pillar.title}
          </p>
          <h3 className="font-headline text-lg md:text-xl lg:text-2xl text-forest leading-tight">
            {pillar.headline}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm md:text-base text-charcoal/80 font-body mb-4 md:mb-5 leading-relaxed flex-grow">
        {pillar.description}
      </p>

      {/* Benefits Box - Frosted inner card */}
      <div className="frosted-glass rounded-2xl p-4 md:p-5 border border-white/30 mt-auto">
        <p className="text-xs md:text-sm font-subheader text-forest/70 mb-2 md:mb-3 font-semibold">
          What this means for you:
        </p>
        <ul className="space-y-1 md:space-y-1.5">
          {pillar.benefits.map((benefit, index) => (
            <li
              key={index}
              className="text-xs md:text-sm text-charcoal/70 font-body"
            >
              • {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
