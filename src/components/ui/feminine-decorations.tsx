/**
 * Feminine decorative elements for the Essentials page
 * Uses brand colors: Forest Green (#012D26), Wine (#800000), Gold (#D4AF37), Ivory (#FAF6F0), Beige (#E8DCC3)
 */
import { Sparkles, Heart } from "lucide-react";

/**
 * Soft floating decorative blobs with feminine warmth
 * Uses beige and gold tones for a soft, inviting aesthetic
 */
export function FeminineBlobs() {
  return (
    <>
      {/* Top left - soft beige glow */}
      <div className="absolute top-10 left-5 w-72 h-72 bg-beige/20 rounded-full blur-3xl pointer-events-none -z-10" />
      {/* Top right - subtle gold accent */}
      <div className="absolute top-32 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-10" />
      {/* Center - large soft ivory wash */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-beige-light/30 rounded-full blur-3xl pointer-events-none -z-10" />
      {/* Bottom - wine undertone for warmth */}
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-wine/5 rounded-full blur-3xl pointer-events-none -z-10" />
      {/* Bottom left - beige accent */}
      <div className="absolute bottom-40 left-10 w-56 h-56 bg-beige/25 rounded-full blur-3xl pointer-events-none -z-10" />
    </>
  );
}

/**
 * Elegant curved divider with gold accent
 */
export function FeminineDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-8 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-beige-dark/40 to-transparent" />
      <Sparkles className="w-4 h-4 text-gold/60" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-beige-dark/40 to-transparent" />
    </div>
  );
}

/**
 * Decorative sparkle cluster for accents
 */
export function SparkleCluster({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Sparkles className="w-3 h-3 text-gold/50 absolute -top-1 -left-1" />
      <Sparkles className="w-4 h-4 text-gold/70" />
      <Sparkles className="w-2 h-2 text-gold/40 absolute -bottom-1 -right-1" />
    </div>
  );
}

/**
 * Floating decorative elements for feminine pages
 * Uses synchronized 4s pulse cycle with staggered delays for cohesive luxury feel
 */
export function FloatingDecor() {
  return (
    <>
      {/* Floating sparkles - synchronized 4s cycle */}
      <div className="absolute top-24 right-[15%] opacity-30 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}>
        <Sparkles className="w-5 h-5 text-gold" />
      </div>
      <div className="absolute top-[40%] left-[8%] opacity-20 pointer-events-none animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <Sparkles className="w-4 h-4 text-gold" />
      </div>
      <div className="absolute bottom-[30%] right-[10%] opacity-25 pointer-events-none animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }}>
        <Sparkles className="w-6 h-6 text-gold" />
      </div>
      {/* Subtle heart accents */}
      <div className="absolute top-[60%] left-[5%] opacity-15 pointer-events-none animate-pulse" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>
        <Heart className="w-4 h-4 text-wine" />
      </div>
      <div className="absolute bottom-[45%] right-[8%] opacity-10 pointer-events-none animate-pulse" style={{ animationDuration: '4s', animationDelay: '3s' }}>
        <Heart className="w-3 h-3 text-wine" />
      </div>
    </>
  );
}

/**
 * Elegant section header with feminine styling
 */
export function FeminineHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header className={`text-center mb-8 md:mb-12 ${className}`}>
      {eyebrow && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-3 h-3 text-gold" />
          <span className="text-xs md:text-sm font-subheader uppercase tracking-widest text-gold-dark">
            {eyebrow}
          </span>
          <Sparkles className="w-3 h-3 text-gold" />
        </div>
      )}
      <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-forest mb-3 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-lg text-charcoal/70 font-body max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      {/* Decorative underline */}
      <div className="flex justify-center mt-4 md:mt-5">
        <div className="w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
      </div>
    </header>
  );
}

/**
 * Feminine badge component
 */
export function FeminineBadge({
  children,
  icon: Icon = Sparkles,
  className = "",
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
        bg-gradient-to-r from-ivory via-beige-light to-ivory
        border border-gold/20 shadow-soft ${className}`}
    >
      <Icon className="w-3.5 h-3.5 text-gold" />
      <span className="text-xs md:text-sm font-subheader font-semibold text-forest">
        {children}
      </span>
      <Icon className="w-3.5 h-3.5 text-gold" />
    </div>
  );
}

/**
 * Elegant quote block with feminine styling
 */
export function FeminineQuote({
  quote,
  author,
  role,
  className = "",
}: {
  quote: string;
  author?: string;
  role?: string;
  className?: string;
}) {
  return (
    <blockquote className={`relative ${className}`}>
      {/* Large decorative quote mark */}
      <span className="absolute -top-4 -left-2 text-6xl text-gold/20 font-accent leading-none select-none">
        &ldquo;
      </span>
      <p className="font-accent text-lg md:text-xl text-charcoal/80 italic leading-relaxed pl-4 border-l-2 border-gold/30">
        {quote}
      </p>
      {author && (
        <footer className="mt-4 pl-4">
          <span className="font-headline text-forest">— {author}</span>
          {role && (
            <span className="text-sm text-charcoal/60 font-body ml-2">{role}</span>
          )}
        </footer>
      )}
    </blockquote>
  );
}

/**
 * Soft card wrapper with feminine styling
 */
export function FeminineCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`
        glass-card rounded-[2rem] p-6 md:p-8
        border border-beige/40
        shadow-soft
        ${hover ? "hover:shadow-medium hover:-translate-y-1 transition-all duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Circular icon container with feminine gradient
 */
export function FeminineIcon({
  children,
  variant = "gold",
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "gold" | "wine" | "forest" | "beige";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const variants = {
    gold: "bg-gradient-to-br from-gold/20 to-gold/10 border-gold/20 text-gold",
    wine: "bg-gradient-to-br from-wine/15 to-wine/5 border-wine/15 text-wine",
    forest: "bg-gradient-to-br from-forest/15 to-forest/5 border-forest/15 text-forest",
    beige: "bg-gradient-to-br from-beige to-beige-light border-beige-dark/20 text-forest",
  };

  const sizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12 md:w-14 md:h-14",
    lg: "w-14 h-14 md:w-16 md:h-16",
  };

  return (
    <div
      className={`
        ${sizes[size]} rounded-full border
        flex items-center justify-center
        shadow-soft
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
