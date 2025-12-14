"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Unified Header Component
 *
 * Supports multiple style variants for consistent header experience across the site.
 *
 * Variants:
 * - main: Homepage header with logo, subtitle "by THEDMK", and tagline (default)
 * - back: Back link navigation (configurable href and text)
 * - logo: Centered logo link (used on results pages)
 *
 * Position:
 * - sticky: Sticky positioning (default)
 * - fixed: Fixed positioning (requires pt-24 on main content)
 */

type HeaderVariant = "main" | "back" | "logo";
type HeaderPosition = "sticky" | "fixed";

interface HeaderProps {
  variant?: HeaderVariant;
  position?: HeaderPosition;
  /** Back link href (only for "back" variant) */
  backHref?: string;
  /** Back link text (only for "back" variant), defaults to "Back to Home" */
  backText?: string;
  className?: string;
}

export const Header = memo(function Header({
  variant = "main",
  position = "sticky",
  backHref = "/",
  backText = "Back to Home",
  className,
}: HeaderProps) {
  const positionClasses = {
    sticky: "sticky top-0",
    fixed: "fixed top-0 left-0 right-0",
  };

  const baseClasses = cn(
    "z-50 glass-overlay border-b border-white/20",
    positionClasses[position],
    className
  );

  // Main header variant - homepage style
  if (variant === "main") {
    return (
      <header className={cn(baseClasses, "px-4 sm:px-6 lg:px-8 py-3 sm:py-5")}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="font-headline text-xl sm:text-2xl font-bold text-forest">
                Glow Up Academy
              </p>
              <p className="text-xs sm:text-sm text-forest/60">by THEDMK</p>
            </div>
            <p className="font-body text-xs sm:text-sm text-forest/80 italic">
              Become Hot &amp; Unstoppable
            </p>
          </div>
        </div>
      </header>
    );
  }

  // Back header variant - navigation back link
  if (variant === "back") {
    return (
      <header className={baseClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={backHref}
            className="inline-flex items-center text-forest hover:text-forest-light transition-colors font-subheader font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backText}
          </Link>
        </div>
      </header>
    );
  }

  // Logo header variant - centered logo link (results pages)
  return (
    <header className={cn(baseClasses, "border-white/30")}>
      <div className="container mx-auto px-6 md:px-8 py-4 md:py-5">
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="font-headline text-lg md:text-xl text-forest hover:text-forest-light transition-colors"
          >
            Glow Up Academy{" "}
            <span className="text-gold font-normal">by THEDMK</span>
          </Link>
        </div>
      </div>
    </header>
  );
});

export default Header;
