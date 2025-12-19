import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

interface FooterProps {
  variant?: "default" | "minimal";
  className?: string;
}

export function Footer({ variant = "default", className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className={`py-8 px-4 text-center ${className}`}>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-forest/60 mb-4">
          <Link href="/privacy" className="hover:text-forest transition-colors">
            Privacy
          </Link>
          <span className="text-forest/30">|</span>
          <Link href="/terms" className="hover:text-forest transition-colors">
            Terms
          </Link>
          <span className="text-forest/30">|</span>
          <Link href="/refund" className="hover:text-forest transition-colors">
            Refund
          </Link>
          <span className="text-forest/30">|</span>
          <Link href="/about" className="hover:text-forest transition-colors">
            About
          </Link>
          <span className="text-forest/30">|</span>
          <Link href="/contact" className="hover:text-forest transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-xs text-forest/40">
          &copy; {currentYear} THEDMK. All rights reserved.
        </p>
      </footer>
    );
  }

  return (
    <footer className={`px-4 sm:px-6 lg:px-8 py-10 sm:py-12 bg-forest text-ivory rounded-t-[3rem] sm:rounded-t-[4rem] relative z-10 -mt-12 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] ${className}`}>
      <div className="max-w-5xl mx-auto text-center">
        {/* Logos */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/GUA Logo.png"
              alt="Glow Up Academy"
              width={150}
              height={50}
              className="h-10 sm:h-12 w-auto brightness-0 invert"
            />
          </Link>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/DMK LOGO WHITE.png"
              alt="TheDMK"
              width={120}
              height={50}
              className="h-10 sm:h-12 w-auto"
            />
          </Link>
        </div>

        {/* Instagram Link */}
        <a
          href="https://instagram.com/thedmkco"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-gold hover:text-white hover:bg-white/20 transition-all duration-300 font-semibold text-sm mb-8 hover:scale-105"
        >
          <Instagram className="w-4 h-4" />
          @thedmkco
        </a>

        {/* Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-xs sm:text-sm text-ivory/50 mb-6">
          <Link href="/privacy" className="hover:text-ivory transition-colors">
            Privacy
          </Link>
          <span aria-hidden="true" className="text-ivory/20">|</span>
          <Link href="/terms" className="hover:text-ivory transition-colors">
            Terms
          </Link>
          <span aria-hidden="true" className="text-ivory/20">|</span>
          <Link href="/refund" className="hover:text-ivory transition-colors">
            Refund
          </Link>
          <span aria-hidden="true" className="text-ivory/20">|</span>
          <Link href="/about" className="hover:text-ivory transition-colors">
            About
          </Link>
          <span aria-hidden="true" className="text-ivory/20">|</span>
          <Link href="/contact" className="hover:text-ivory transition-colors">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-ivory/30">
          &copy; {currentYear} THEDMK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
