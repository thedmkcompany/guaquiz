import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Unified Header Component (Server Component)
 *
 * Supports multiple style variants for consistent header experience across the site.
 * Converted to Server Component for better performance (no client JS needed).
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

// Inline SVG arrow for back button (avoids lucide-react bundle)
function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 mr-2"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

export function Header({
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/GUA Logo.png"
                alt="Glow Up Academy"
                width={180}
                height={60}
                className="h-12 sm:h-14 w-auto"
              />
            </Link>
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
            <ArrowLeftIcon />
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
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/GUA Logo.png"
              alt="Glow Up Academy"
              width={180}
              height={60}
              className="h-12 md:h-14 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
