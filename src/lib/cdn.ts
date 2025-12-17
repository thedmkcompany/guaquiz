/**
 * @fileoverview CDN Utilities for Vercel Blob Storage
 *
 * This module provides utilities for serving images from Vercel Blob Storage
 * instead of bundling them in the git repository.
 *
 * ## Why Use CDN?
 *
 * - **Smaller Git Repo**: Reduces repo size from 87MB to ~3MB
 * - **Faster Loading**: Images served via Vercel's global CDN
 * - **Auto Optimization**: Images automatically optimized and cached
 * - **Better Performance**: No need to deploy 84MB on every update
 *
 * @module cdn
 *
 * @example
 * ```tsx
 * import { getCDNUrl, isUsingCDN } from '@/lib/cdn';
 *
 * // In your component:
 * <Image
 *   src={getCDNUrl('/images/DMK/Disha-Wine-Blazer.png')}
 *   alt="Disha"
 * />
 *
 * // Check if CDN is enabled
 * if (isUsingCDN()) {
 *   console.log('Using CDN for images');
 * }
 * ```
 */

/**
 * Get the CDN URL for an asset
 *
 * @param path - The asset path (e.g., '/images/DMK/hero.png')
 * @returns Full CDN URL if blob storage is configured, otherwise local path
 *
 * @example
 * ```typescript
 * getCDNUrl('/images/DMK/Disha-Wine-Blazer.png')
 * // Returns: 'https://[blob-url]/images/DMK/Disha-Wine-Blazer.png'
 * // Or fallback to: '/images/DMK/Disha-Wine-Blazer.png' (local)
 * ```
 */
export function getCDNUrl(path: string): string {
  const blobUrl = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

  // If CDN is configured, use it
  if (blobUrl) {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${blobUrl}/${cleanPath}`;
  }

  // Fallback to local public folder
  // This allows gradual migration - some images on CDN, some local
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Check if CDN is enabled
 *
 * @returns true if Vercel Blob storage is configured
 */
export function isUsingCDN(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN);
}

/**
 * Image paths that should be served from CDN
 * Used by the upload script to know which files to migrate
 */
export const CDN_IMAGE_PATHS = {
  // Hero and brand images (large PNGs)
  dmk: [
    '/images/DMK/Hero Image Disha 2.png',
    '/images/DMK/Disha Wine Blazer.png',
    '/images/DMK/Disha White blazer.png',
    '/images/DMK/Disha Beige Blazer 2.png',
    '/images/DMK/Disha Beige Blazer.png',
    '/images/DMK/amada armos Disha.png',
    '/images/DMK/Disha City Background.png',
    '/images/DMK/Disha Power pose Green BG.png',
    '/images/DMK/Disha Close Up Face.png',
    '/images/DMK/Hero Image Disha.png',
    '/images/DMK/Essentials Hero Disha.png',
  ],

  // Circle program images and videos
  circle: [
    '/images/circle/Barsa Client Circle Transformation .mp4',
    '/images/circle/Circle live workout session with community members 2.mp4',
    '/images/circle/Circle live workout session with community members.mp4',
    '/images/circle/Apoorva Transformation.jpg.png',
    '/images/circle/Beautfy transformation_2.jpg.png',
    '/images/circle/Dhvani Transformation.jpg.png',
    '/images/circle/Pratyancha Gupta Transformatiop.jpg.png',
    '/images/circle/Fitness Geetika Transformation.jpg.png',
    '/images/circle/Circle community - women supporting women in transformation.jpg',
  ],

  // Transform program images
  transform: [
    '/images/transform/Akancha Sharma.jpg',
  ],

  // Misc large images
  misc: [
    '/images/misc/Aurvi Before & After (empowered energy).png',
    '/images/misc/Ishita G.jpg',
    '/images/misc/Roma N. .jpg',
  ],
} as const;

/**
 * Get all image paths that should be migrated to CDN
 */
export function getAllCDNImagePaths(): string[] {
  return [
    ...CDN_IMAGE_PATHS.dmk,
    ...CDN_IMAGE_PATHS.circle,
    ...CDN_IMAGE_PATHS.transform,
    ...CDN_IMAGE_PATHS.misc,
  ];
}

/**
 * Type-safe helper for commonly used images
 */
export const CDN_IMAGES = {
  hero: {
    disha1: getCDNUrl('/images/DMK/Hero Image Disha 2.png'),
    disha2: getCDNUrl('/images/DMK/Hero Image Disha.png'),
    essentials: getCDNUrl('/images/DMK/Essentials Hero Disha.png'),
  },
  blazers: {
    wine: getCDNUrl('/images/DMK/Disha Wine Blazer.png'),
    white: getCDNUrl('/images/DMK/Disha White blazer.png'),
    beige: getCDNUrl('/images/DMK/Disha Beige Blazer 2.png'),
  },
  circle: {
    video1: getCDNUrl('/images/circle/Barsa Client Circle Transformation .mp4'),
    video2: getCDNUrl('/images/circle/Circle live workout session with community members 2.mp4'),
  },
} as const;
