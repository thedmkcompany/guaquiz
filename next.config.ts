import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================
  // IMAGE OPTIMIZATION (Vercel)
  // ============================================
  images: {
    // Enable modern image formats for smaller file sizes
    formats: ["image/avif", "image/webp"],
    // Limit image sizes to prevent oversized images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Allowed quality values for Image component
    qualities: [75, 80],
    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
    // Allow unoptimized images in development for faster builds
    unoptimized: process.env.NODE_ENV === "development",

    // Allow using Vercel Blob public URLs directly (when components use getCDNUrl)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },

  // ============================================
  // PERFORMANCE OPTIMIZATIONS
  // ============================================
  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: ["lucide-react", "@supabase/supabase-js"],
  },

  // ============================================
  // PRODUCTION OPTIMIZATIONS
  // ============================================
  // Compress responses
  compress: true,

  // Generate ETags for better caching
  generateEtags: true,

  // Power the build by Turbopack (faster builds)
  // Already enabled by default in Next.js 15+

  // ============================================
  // HEADERS (Security + Caching)
  // ============================================
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts
        source: "/:all*(woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // If assets are migrated to Vercel Blob, keep existing `/images/**` paths working
  // by redirecting to the Blob CDN at runtime.
  async redirects() {
    const base = process.env.NEXT_PUBLIC_BLOB_BASE_URL;
    if (!base) return [];

    const cleanBase = base.replace(/\/+$/, "");

    return [
      {
        source: "/images/:path*",
        destination: `${cleanBase}/images/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
