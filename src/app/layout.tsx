import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics";

// Custom fonts from /public/fonts/

// Holiday - Headlines, hero text (luxe feminine serif)
const holiday = localFont({
  src: "../../public/fonts/HolidayFree.otf",
  variable: "--font-holiday",
  display: "swap",
  weight: "400",
});

// Roca Two - Sub-headers, CTAs (modern geometric sans)
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

// Body font - Be Vietnam Pro (Google Fonts)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Glow Up Academy | Find Your Perfect Program",
    template: "%s | Glow Up Academy",
  },
  description:
    "Transform your life with Glow Up Academy. Take our smart quiz to find the perfect program tailored to your goals and start your glow up journey today.",
  keywords: [
    "glow up",
    "transformation",
    "self improvement",
    "personal development",
    "online courses",
    "academy",
  ],
  authors: [{ name: "Glow Up Academy" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Glow Up Academy",
    title: "Glow Up Academy | Your Transformation Starts Here",
    description:
      "Transform your life with Glow Up Academy. Find the perfect program for your glow up journey.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager />
      </head>
      <body
        className={`${holiday.variable} ${rocaTwo.variable} ${theSeasons.variable} ${beVietnamPro.variable} antialiased`}
      >
        <GoogleTagManagerNoScript />
        {children}
      </body>
    </html>
  );
}
