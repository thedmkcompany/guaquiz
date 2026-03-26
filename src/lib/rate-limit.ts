/**
 * @fileoverview Rate Limiting Utilities
 *
 * Redis-based rate limiter for API protection against abuse.
 * Implements a sliding window algorithm with configurable limits.
 *
 * @module rate-limit
 *
 * ## Architecture
 *
 * Uses Upstash Redis for distributed rate limiting across serverless instances.
 * Falls back to allowing requests if Redis is unavailable (fail-open strategy).
 *
 * ## Preset Configurations
 *
 * | Preset | Limit | Window | Use Case |
 * |--------|-------|--------|----------|
 * | PAYMENT_CREATE | 10 | 15 min | Order creation per IP |
 * | PAYMENT_VERIFY | 20 | 15 min | Payment verification per IP |
 * | PAYMENT_PER_EMAIL | 5 | 1 hour | Payment attempts per email |
 * | WEBHOOK | 100 | 1 min | Webhook endpoints |
 * | CHAT | 30 | 15 min | Sales chat (Claude) per IP |
 *
 * @example
 * ```typescript
 * import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rate-limit';
 *
 * export async function POST(request: Request) {
 *   const ip = getClientIP(request);
 *   const limit = await checkRateLimit(`payment_${ip}`, RATE_LIMITS.PAYMENT_CREATE);
 *
 *   if (!limit.allowed) {
 *     return rateLimitResponse(limit.resetIn);
 *   }
 *
 *   // Process request...
 * }
 * ```
 */

import { Redis } from '@upstash/redis';

/**
 * Configuration for rate limiting behavior.
 */
export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed per window */
  maxRequests: number;
}

/**
 * Redis client for distributed rate limiting.
 * @internal
 */
let redis: Redis | null = null;

/**
 * Get or create Redis client instance.
 * @internal
 */
function getRedisClient(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('[Rate Limit] Redis credentials not configured. Rate limiting disabled.');
    return null;
  }

  try {
    redis = new Redis({ url, token });
    return redis;
  } catch (error) {
    console.error('[Rate Limit] Failed to initialize Redis:', error);
    return null;
  }
}

/**
 * Checks if a request should be rate limited using Redis.
 *
 * Implements a fixed-window rate limiting algorithm. Each unique identifier
 * (typically IP or email) is tracked independently across all serverless instances.
 *
 * @param identifier - Unique identifier for the rate limit bucket (e.g., IP, email)
 * @param config - Rate limit configuration with windowMs and maxRequests
 * @returns Object containing:
 *   - `allowed`: Whether the request should proceed
 *   - `remaining`: Number of requests left in window
 *   - `resetIn`: Milliseconds until window resets
 *
 * @example
 * ```typescript
 * // Rate limit by IP
 * const result = await checkRateLimit(`payment_${clientIP}`, {
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   maxRequests: 10
 * });
 *
 * if (!result.allowed) {
 *   console.log(`Retry in ${result.resetIn}ms`);
 * }
 * ```
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const client = getRedisClient();

  // If Redis unavailable, deny payment-critical requests (fail-closed)
  if (!client) {
    console.warn('[Rate Limit] Redis unavailable - fail-closed for security');
    return {
      allowed: false,
      remaining: 0,
      resetIn: 60000,
    };
  }

  try {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Use Redis sorted set with timestamps as scores
    // This allows for accurate sliding window rate limiting

    // Remove old entries outside the window
    await client.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const count = await client.zcount(key, windowStart, now);

    // Check if limit exceeded
    if (count >= config.maxRequests) {
      // Get oldest entry to calculate resetIn
      const oldest = await client.zrange(key, 0, 0, { withScores: true });
      const oldestTimestamp = oldest.length > 0 ? (oldest[0] as { score: number }).score : now;
      const resetIn = Math.max(0, oldestTimestamp + config.windowMs - now);

      return {
        allowed: false,
        remaining: 0,
        resetIn,
      };
    }

    // Add current request with timestamp as both member and score
    await client.zadd(key, { score: now, member: `${now}:${Math.random()}` });

    // Set expiry on key (window + 1 minute buffer)
    await client.expire(key, Math.ceil((config.windowMs + 60000) / 1000));

    return {
      allowed: true,
      remaining: config.maxRequests - (count + 1),
      resetIn: config.windowMs,
    };
  } catch (error) {
    console.error('[Rate Limit] Redis error - fail-closed for security:', error);

    // Fail-closed: On Redis error, deny the request for safety
    return {
      allowed: false,
      remaining: 0,
      resetIn: 60000,
    };
  }
}

/**
 * Preset rate limit configurations for common use cases.
 *
 * @example
 * ```typescript
 * // Use preset for payment creation
 * const limit = await checkRateLimit(key, RATE_LIMITS.PAYMENT_CREATE);
 *
 * // Or use with email-based limiting
 * const emailLimit = await checkRateLimit(`email_${email}`, RATE_LIMITS.PAYMENT_PER_EMAIL);
 * ```
 */
export const RATE_LIMITS = {
  /** Payment order creation: 10 requests per 15 minutes per IP */
  PAYMENT_CREATE: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
  },
  /** Payment verification: 20 requests per 15 minutes per IP */
  PAYMENT_VERIFY: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
  },
  /** Webhook endpoints: 100 requests per minute (from payment gateways) */
  WEBHOOK: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
  /** Per-email limit: 5 payment attempts per hour */
  PAYMENT_PER_EMAIL: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
  },
  /** Sales chat (Claude): 30 messages per 15 minutes per IP */
  CHAT: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 30,
  },
} as const;

/**
 * Extracts the client IP address from request headers.
 *
 * Checks headers in order of preference:
 * 1. `x-forwarded-for` (first IP in chain)
 * 2. `x-real-ip`
 * 3. Falls back to 'unknown'
 *
 * @param request - The incoming HTTP request
 * @returns Client IP address or 'unknown' if not determinable
 *
 * @example
 * ```typescript
 * const ip = getClientIP(request);
 * // Use for rate limiting
 * const limit = await checkRateLimit(`payment_${ip}`, RATE_LIMITS.PAYMENT_CREATE);
 * ```
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Creates a standardized 429 Too Many Requests response.
 *
 * Includes proper headers for client retry handling:
 * - `Retry-After`: Seconds until rate limit resets
 * - `X-RateLimit-Remaining`: Always 0 (rate limited)
 *
 * @param resetIn - Milliseconds until the rate limit window resets
 * @returns HTTP 429 Response with JSON body and rate limit headers
 *
 * @example
 * ```typescript
 * const limit = await checkRateLimit(key, config);
 * if (!limit.allowed) {
 *   return rateLimitResponse(limit.resetIn);
 * }
 * ```
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
