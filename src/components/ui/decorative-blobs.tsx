/**
 * Decorative background blobs used across pages for visual consistency
 * Re-exports FeminineBlobs as DecorativeBlobs to eliminate duplication
 * Uses subtle pulse animation with staggered timing for luxury feel
 */
import { FeminineBlobs } from "./feminine-decorations";

/**
 * Standard decorative blobs for page backgrounds
 * Subtle breathing animations for premium aesthetic
 */
export function DecorativeBlobs() {
  return (
    <>
      {/* Top left - soft gold glow with gentle pulse */}
      <div
        className="absolute top-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      {/* Bottom right - wine undertone for warmth */}
      <div
        className="absolute bottom-10 right-10 w-80 h-80 bg-wine/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: '5s', animationDelay: '1s' }}
      />
      {/* Center - large soft beige wash */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-beige-light/20 rounded-full blur-3xl pointer-events-none -z-10" />
    </>
  );
}

/**
 * Alternative blob configuration for hero sections
 * Larger, more prominent with elegant animation
 */
export function HeroBlobs() {
  return (
    <>
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-wine/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{ animationDuration: '5s', animationDelay: '1.5s' }}
      />
    </>
  );
}

// Re-export FeminineBlobs for pages that use the richer blob variant
export { FeminineBlobs };
