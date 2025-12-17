/**
 * Structured Data (JSON-LD) Schema Generators
 *
 * Generates Schema.org compliant JSON-LD for SEO and rich snippets.
 * Supports Organization, Person, Product, Review, FAQ, Breadcrumb schemas.
 */

import { Program } from "@/types";
import { FAQ, Testimonial } from "@/lib/results-data";
import { siteConfig } from "@/lib/seo-config";

// ============================================
// BASE TYPES
// ============================================

export type WithContext<T> = T & {
  "@context": "https://schema.org";
};

// ============================================
// ORGANIZATION SCHEMA
// ============================================

export interface OrganizationSchema {
  "@type": "Organization";
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  description: string;
  founder: {
    "@type": "Person";
    name: string;
  };
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    email?: string;
    availableLanguage: string;
  };
}

export function generateOrganizationSchema(): WithContext<OrganizationSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.branding.logo}`,
    description: siteConfig.description,
    founder: {
      "@type": "Person",
      name: siteConfig.founder.name,
    },
    sameAs: [
      `https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`,
      `https://instagram.com/${siteConfig.social.instagram.replace("@", "")}`,
      `https://facebook.com/${siteConfig.social.facebook}`,
      `https://linkedin.com/${siteConfig.social.linkedin}`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      contactType: "Customer Service",
      availableLanguage: "en",
    },
  };
}

// ============================================
// PERSON SCHEMA
// ============================================

export interface PersonSchema {
  "@type": "Person";
  name: string;
  jobTitle: string;
  worksFor: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  image?: string;
  description?: string;
  alumniOf?: string;
  knowsAbout?: string[];
  sameAs?: string[];
}

export function generatePersonSchema(
  options?: Partial<PersonSchema>
): WithContext<PersonSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.role,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    image: `${siteConfig.url}${siteConfig.founder.image}`,
    description: `${siteConfig.founder.name} is a transformation coach specializing in women's holistic wellness across fitness, beauty, financial confidence, and mindset.`,
    alumniOf: "Master's in Applied Finance",
    knowsAbout: [
      "Women's Fitness",
      "Nutrition Coaching",
      "Financial Wellness",
      "Confidence Coaching",
      "Beauty & Self-Care",
      "Holistic Transformation",
    ],
    sameAs: [
      `https://instagram.com/${siteConfig.social.instagram.replace("@", "")}`,
    ],
    ...options,
  };
}

// ============================================
// PRODUCT SCHEMA
// ============================================

export interface ProductSchema {
  "@type": "Product";
  name: string;
  description: string;
  image?: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  offers: {
    "@type": "Offer";
    url: string;
    priceCurrency: string;
    price: number;
    availability: string;
    validFrom?: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  review?: Array<{
    "@type": "Review";
    reviewRating: {
      "@type": "Rating";
      ratingValue: number;
      bestRating: number;
    };
    author: {
      "@type": "Person";
      name: string;
    };
    reviewBody: string;
  }>;
}

export function generateProductSchema(
  program: Program,
  options?: {
    rating?: number;
    reviewCount?: number;
    testimonials?: Testimonial[];
  }
): WithContext<ProductSchema> {
  const schema: ProductSchema = {
    "@type": "Product",
    name: program.name,
    description: program.description,
    image: `${siteConfig.url}/api/og?program=${program.slug}`,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/results/${program.slug}`,
      priceCurrency: program.currency,
      price: program.price,
      availability: "https://schema.org/InStock",
    },
  };

  // Add aggregate rating if provided
  if (options?.rating && options?.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: options.rating,
      reviewCount: options.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add reviews from testimonials
  if (options?.testimonials && options.testimonials.length > 0) {
    schema.review = options.testimonials.map((testimonial) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
      author: {
        "@type": "Person",
        name: testimonial.name,
      },
      reviewBody: testimonial.quote,
    }));
  }

  return {
    "@context": "https://schema.org",
    ...schema,
  };
}

// ============================================
// FAQ SCHEMA
// ============================================

export interface FAQSchema {
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export function generateFAQSchema(faqs: FAQ[]): WithContext<FAQSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================
// REVIEW SCHEMA
// ============================================

export interface ReviewSchema {
  "@type": "Review";
  itemReviewed: {
    "@type": "Product";
    name: string;
    image?: string;
  };
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
  };
  author: {
    "@type": "Person";
    name: string;
  };
  reviewBody: string;
  datePublished?: string;
}

export function generateReviewSchema(
  testimonial: Testimonial,
  programName: string
): WithContext<ReviewSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: programName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: 5,
      bestRating: 5,
    },
    author: {
      "@type": "Person",
      name: testimonial.name,
    },
    reviewBody: testimonial.quote,
  };
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================

export interface BreadcrumbSchema {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): WithContext<BreadcrumbSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url || undefined,
    })),
  };
}

// ============================================
// ITEM LIST SCHEMA (for programs page)
// ============================================

export interface ItemListSchema {
  "@type": "ItemList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    url: string;
    name: string;
  }>;
}

export function generateItemListSchema(
  programs: Program[]
): WithContext<ItemListSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: programs.map((program, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}/results/${program.slug}`,
      name: program.name,
    })),
  };
}

// ============================================
// AGGREGATE RATING SCHEMA
// ============================================

export interface AggregateRatingSchema {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function generateAggregateRatingSchema(
  rating: number,
  reviewCount: number
): AggregateRatingSchema {
  return {
    "@type": "AggregateRating",
    ratingValue: rating,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

// ============================================
// CONTACT POINT SCHEMA
// ============================================

export interface ContactPointSchema {
  "@type": "ContactPoint";
  telephone?: string;
  contactType: string;
  email?: string;
  availableLanguage: string[];
}

export function generateContactPointSchema(): ContactPointSchema {
  return {
    "@type": "ContactPoint",
    email: siteConfig.contact.email,
    contactType: "Customer Service",
    availableLanguage: ["en", "hi"],
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Combine multiple schemas into an array
 */
export function combineSchemas(...schemas: unknown[]): unknown[] {
  return schemas.filter(Boolean);
}

/**
 * Sanitize text for JSON-LD (remove HTML, special chars)
 */
export function sanitizeForSchema(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&[^;]+;/g, "") // Remove HTML entities
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim();
}
