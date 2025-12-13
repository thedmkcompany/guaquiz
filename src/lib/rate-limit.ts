// ============================================
// RATE LIMITING
// ============================================
// In-memory rate limiter for API protection
// For production with multiple instances, use Redis-based solution
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// In-memory store (per-instance)
// For multi-instance deployments, replace with Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP, email, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No existing entry or window expired - allow and create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Within window - check count
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

// ============================================
// PRESET CONFIGURATIONS
// ============================================

export const RATE_LIMITS = {
  // Payment order creation: 10 requests per 15 minutes per IP
  PAYMENT_CREATE: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
  },
  // Payment verification: 20 requests per 15 minutes per IP
  PAYMENT_VERIFY: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
  },
  // Webhook endpoints: 100 requests per minute (from payment gateways)
  WEBHOOK: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
  // Per-email limit: 5 payment attempts per hour
  PAYMENT_PER_EMAIL: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
  },
} as const;

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers (in order of preference)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take first IP in case of proxy chain
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback for development
  return 'unknown';
}

/**
 * Create rate limit response with headers
 */
export function rateLimitResponse(resetIn: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMITED',
      retryAfter: Math.ceil(resetIn / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(resetIn / 1000)),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}
