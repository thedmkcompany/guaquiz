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
    // Inline critical CSS to reduce render-blocking
    inlineCss: true,
  },

  // Target modern browsers only (eliminates ~14KB of polyfills)
  // Browsers that don't support ES2020+ will not work
  transpilePackages: [],

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
      // ============================================
      // SECURITY HEADERS (all routes)
      // ============================================
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.googletagmanager.com https://www.google-analytics.com",
              "frame-src https://checkout.razorpay.com https://api.razorpay.com https://test.payu.in https://secure.payu.in https://calendly.com https://server-side-tagging-c4wk5cth4a-uc.a.run.app",
              "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://calendly.com https://assets.calendly.com https://server-side-tagging-c4wk5cth4a-uc.a.run.app",
              "worker-src 'self' blob:",
              "media-src 'self' https://*.public.blob.vercel-storage.com",
            ].join("; "),
          },
        ],
      },
      // ============================================
      // CACHING HEADERS
      // ============================================
      {
        // Cache static pages at edge for faster TTFB
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Cache other static pages
        source: "/(about|privacy|terms|refund|contact|programs|circle|transform|book-call)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
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
      {
        // Cache CSS and JS chunks
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // REMOVED: Blob redirect - This bypassed Next.js Image optimization!
  // Images now use getCDNUrl() directly with Next.js Image component
  // which enables automatic WebP conversion and resizing.
  //
  // Old redirect was:
  // source: "/images/:path*" -> Blob CDN (permanent: true)
  // This caused 5.8MB images to load without optimization!
};

export default nextConfig;
