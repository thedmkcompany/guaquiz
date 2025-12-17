import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics";
import { Header } from "@/components/ui/header";
import { defaultMetadata, siteConfig } from "@/lib/seo-config";

// Custom fonts from /public/fonts/
// Brand Typography (from 09-BRAND-COLORS.md):
// - Primary: Roca Two (Headlines, logo text)
// - Secondary: Be Vietnam Pro (Body text, captions)
// - Accent: The Seasons (Quotes, signatures)

// Roca Two - Headlines, logo text, CTAs (modern geometric sans)
const rocaTwo = localFont({
  src: "../../public/fonts/roca-two.woff2",
  variable: "--font-roca-two",
  display: "swap",
  weight: "400 700",
});

// The Seasons - Quotes, signatures (accent serif)
const theSeasons = localFont({
  src: "../../public/fonts/the-seasons.otf",
  variable: "--font-the-seasons",
  display: "swap",
  weight: "400",
});

// Be Vietnam Pro - Body text, captions (Google Fonts)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

// Holiday - Optional luxe emphasis (not in brand spec, kept for special use)
const holiday = localFont({
  src: "../../public/fonts/HolidayFree.otf",
  variable: "--font-holiday",
  display: "swap",
  weight: "400",
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
        className={`${holiday.variable} ${rocaTwo.variable} ${theSeasons.variable} ${beVietnamPro.variable} antialiased overflow-x-hidden`}
      >
        <GoogleTagManagerNoScript />
        <Header variant="logo" />
        {children}
      </body>
    </html>
  );
}
