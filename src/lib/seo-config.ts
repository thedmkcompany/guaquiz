/**
 * Centralized SEO Configuration
 *
 * Single source of truth for all SEO metadata across the site.
 * Includes site-wide defaults, social media configuration, and helper functions.
 */

import { Metadata } from "next";
import { Program } from "@/types";

// ============================================
// SITE CONFIGURATION
// ============================================

export const siteConfig = {
  name: "Glow Up Academy",
  alternateName: "TheDMK",
  shortName: "GUA",
  description:
    "Transform your body, mind, and wealth with India's premier women's transformation programs. Join 2,500+ women who've become hot and unstoppable.",
  tagline: "Where Unstoppable Becomes Your Identity",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://glowupacademy.in",
  domain: "glowupacademy.in",

  founder: {
    name: "Disha Methi Khandelwal",
    role: "Transformation Coach & Founder",
    credentials: "Master's in Applied Finance • 5,000+ Transformation Sessions",
    image: "/images/DMK/Disha Wine Blazer 2.png",
  },

  social: {
    twitter: "@thedmk_official",
    instagram: "@thedmk",
    facebook: "glowupacademy",
    linkedin: "company/glow-up-academy",
  },

  contact: {
    email: "tech.thedmk@gmail.com",
    phone: "+91-XXXX-XXXXXX", // Update with actual number
  },

  stats: {
    womenTransformed: "2,500+",
    sessions: "5,000+",
    successRate: "95%",
  },

  branding: {
    logo: "/images/GUA Logo.png",
    icon: "/favicon.ico",
    themeColor: "#6B3E3E", // wine color
  },
};

// ============================================
// DEFAULT METADATA
// ============================================

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "glow up",
    "transformation",
    "women fitness India",
    "personal development",
    "confidence coaching",
    "financial wellness women",
    "beauty transformation",
    "holistic wellness",
    "Disha Methi Khandelwal",
    "women empowerment",
    "body transformation India",
    "online transformation programs",
  ],
  authors: [{ name: siteConfig.founder.name, url: siteConfig.url }],
  creator: siteConfig.founder.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/api/og?page=home",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Women's Transformation Programs`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/api/og?page=home"],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

// ============================================
// PROGRAM-SPECIFIC METADATA
// ============================================

export const programMetadata = {
  essentials: {
    title: "24 Day Challenge - Build Your Foundation | Glow Up Academy",
    description:
      "Transform on your timeline with 24 Day Challenge. Now ₹1,999/month (was ₹2,499) — fitness, beauty, finance & confidence. Self-paced transformation for unstoppable women.",
    keywords: [
      "essentials program",
      "self-paced transformation",
      "beginner fitness India",
      "affordable transformation",
      "online wellness program",
    ],
    ogImage: "/api/og?program=essentials",
  },
  circle: {
    title: "Circle - Your Sisterhood to Unstoppable | Glow Up Academy",
    description:
      "Join the Circle waitlist for live workouts, group coaching, and sisterhood accountability. Community-driven transformation across fitness, beauty, finance & confidence.",
    keywords: [
      "women fitness community",
      "live workouts India",
      "group coaching",
      "accountability partner",
      "sisterhood transformation",
    ],
    ogImage: "/api/og?program=circle",
  },
  transform: {
    title: "Transform - Complete 1:1 Transformation with Disha | Glow Up Academy",
    description:
      "Premium 1:1 transformation with Disha. 6 months of personal coaching, custom plans, and VIP support for complete life transformation.",
    keywords: [
      "personal transformation coach",
      "1:1 coaching India",
      "premium transformation",
      "Disha Methi Khandelwal",
      "high-ticket coaching",
    ],
    ogImage: "/api/og?program=transform",
  },
  "transform-strategy-call": {
    title: "Transform Strategy Call - 60-Min Session with Disha | Glow Up Academy",
    description:
      "Book your personal strategy session with Disha. ₹1,999 for 60-minute transformation assessment and roadmap design. Credited back if you enroll in full Transform program.",
    keywords: [
      "strategy call",
      "transformation consultation",
      "Disha consultation",
      "personal assessment",
    ],
    ogImage: "/api/og?program=transform-strategy-call",
  },
};

// ============================================
// PAGE METADATA HELPERS
// ============================================

export interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

/**
 * Generate complete metadata for a page
 */
export function getPageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage = "/api/og?page=home",
    canonical,
    noindex = false,
  } = options;

  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords as string[], ...keywords],
    robots: noindex
      ? { index: false, follow: false }
      : defaultMetadata.robots,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: canonical || siteConfig.url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonical || undefined,
    },
  };
}

/**
 * Generate metadata for a program page
 */
export function getProgramMetadata(programSlug: string): Metadata {
  const programMeta =
    programMetadata[programSlug as keyof typeof programMetadata];

  if (!programMeta) {
    return defaultMetadata;
  }

  return getPageMetadata({
    title: programMeta.title,
    description: programMeta.description,
    keywords: programMeta.keywords,
    ogImage: programMeta.ogImage,
    canonical: `${siteConfig.url}/results/${programSlug}`,
  });
}

/**
 * Generate metadata for a result page
 */
export function getResultMetadata(program: Program): Metadata {
  const programSlug = program.slug;
  return getProgramMetadata(programSlug);
}

/**
 * Format price for metadata
 */
export function formatPriceForMeta(price: number, currency: string = "INR"): string {
  if (currency === "INR") {
    return `₹${price.toLocaleString("en-IN")}`;
  }
  return `${currency} ${price}`;
}

/**
 * Get OG image URL for a specific page
 */
export function getOGImageUrl(
  page: string,
  params?: Record<string, string>
): string {
  const url = new URL(`${siteConfig.url}/api/og`);
  url.searchParams.set("page", page);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}


