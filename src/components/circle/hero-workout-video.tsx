"use client";

import { getCDNUrl } from "@/lib/cdn";
import { HERO_WORKOUT_VIDEO_SHELL_CLASS } from "./hero-workout-video-shell";

/**
 * Hero workout poster + video. Loaded only on the client via next/dynamic({ ssr: false })
 * from the Circle page so SSR + hydration never compare different trees for this subtree.
 */
export default function HeroWorkoutVideo() {
  const posterSrc = getCDNUrl("/images/circle/Circle community - women supporting women in transformation.jpg");
  const videoSrc = getCDNUrl("/images/circle/Circle live workout session with community members.mp4");

  return (
    <div className={HERO_WORKOUT_VIDEO_SHELL_CLASS}>
      <div
        className="absolute inset-0"
        style={{
          filter: "brightness(1.02) contrast(0.92) saturate(0.7) sepia(0.15)",
        }}
      >
        <img
          src={posterSrc}
          alt="Circle community — women supporting each other"
          className="absolute inset-0 h-full w-full object-cover"
          width={1536}
          height={1152}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
          decoding="async"
          fetchPriority="high"
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(1,45,38,0.5) 0%, transparent 50%, rgba(212,175,55,0.1) 100%)",
        }}
      />
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-gold/40 z-10" />
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2 border-gold/40 z-10" />
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2 border-gold/40 z-10" />
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-gold/40 z-10" />
    </div>
  );
}
