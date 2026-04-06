"use client";

export function ElegantButton({
  onClick,
  children,
  variant = "primary",
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const baseStyles =
    "block w-full max-w-lg mx-auto sm:max-w-xl md:max-w-2xl h-12 sm:h-14 font-semibold text-base sm:text-lg rounded-2xl text-center transition-all duration-300 active:scale-[0.98]";
  const variants = {
    primary:
      "bg-gradient-to-r from-gold via-gold to-gold-light text-forest shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] hover:-translate-y-0.5",
    secondary:
      "bg-gradient-to-r from-wine to-wine-light text-ivory shadow-[0_4px_20px_rgba(128,0,0,0.25)] hover:shadow-[0_6px_28px_rgba(128,0,0,0.35)] hover:-translate-y-0.5",
  };

  return (
    <button type="button" onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
