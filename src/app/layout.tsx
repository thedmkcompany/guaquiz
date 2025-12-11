import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

// Body font - Be Vietnam Pro
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

// Fallback for Holiday (using Playfair Display until custom font is added)
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// Fallback for Roca 2 (using Poppins until custom font is added)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
      <body
        className={`${beVietnamPro.variable} ${playfairDisplay.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
