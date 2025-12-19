import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics";
import { Header } from "@/components/ui/header";
import { defaultMetadata, siteConfig } from "@/lib/seo-config";

// Custom fonts from /public/fonts/
// Brand Typography - Optimized for Performance:
// - Primary: Roca Two (Headlines, logo text) - preloaded
// - Secondary: Be Vietnam Pro (Body text) - reduced weights
// - Accent: The Seasons (Quotes only) - optional display

// Roca Two - Headlines, logo text, CTAs (modern geometric sans)
const rocaTwo = localFont({
  src: "../../public/fonts/roca-two.woff2",
  variable: "--font-roca-two",
  display: "swap",
  weight: "400 700",
  preload: true,
});

// The Seasons - Quotes, signatures (accent serif)
const theSeasons = localFont({
  src: "../../public/fonts/the-seasons.otf",
  variable: "--font-the-seasons",
  display: "optional", // Non-critical: use fallback if not loaded quickly
  weight: "400",
  preload: false,
});

// Be Vietnam Pro - Body text, captions (Google Fonts)
// Reduced weights: 400 (regular), 500 (medium), 600 (semibold)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager />
        {/* Preconnect for performance optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preconnect to Vercel Blob CDN for faster image loading */}
        <link rel="preconnect" href="https://ktgyku22jawoj5vt.public.blob.vercel-storage.com" />
        {/* Preload LCP hero image to eliminate resource load delay */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=https%3A%2F%2Fktgyku22jawoj5vt.public.blob.vercel-storage.com%2Fimages%2FDMK%2FHero%2520Image%2520Disha%25202.png&w=640&q=80"
          type="image/webp"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content={siteConfig.branding.themeColor} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body
        className={`${rocaTwo.variable} ${theSeasons.variable} ${beVietnamPro.variable} antialiased overflow-x-hidden`}
      >
        <GoogleTagManagerNoScript />
        <Header variant="logo" />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
