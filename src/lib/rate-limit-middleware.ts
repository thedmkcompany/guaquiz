/**
 * Rate Limit Middleware
 * Simplified rate limiting for API routes
 */

import { NextRequest } from 'next/server';
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
  RATE_LIMITS,
} from './rate-limit';

// ============================================
// TYPES
// ============================================

export type RateLimitType = keyof typeof RATE_LIMITS;

export interface RateLimitOptions {
  /** Rate limit by IP address */
  ipLimit?: RateLimitType;
  /** Rate limit by email (requires body to be parsed) */
  emailLimit?: RateLimitType;
}

export interface RateLimitContext {
  ip: string;
  email?: string;
}

// ============================================
// RATE LIMIT CHECKER
// ============================================

/**
 * Check rate limits for a request
 * Returns null if allowed, or a 429 response if rate limited
 */
export function checkRateLimits(
  context: RateLimitContext,
  options: RateLimitOptions
): Response | null {
  const { ip, email } = context;
  const { ipLimit, emailLimit } = options;

  // Check IP rate limit
  if (ipLimit) {
    const ipKey = `${ipLimit}_${ip}`;
    const ipCheck = checkRateLimit(ipKey, RATE_LIMITS[ipLimit]);

    if (!ipCheck.allowed) {
      return rateLimitResponse(ipCheck.resetIn);
    }
  }

  // Check email rate limit
  if (emailLimit && email) {
    const emailKey = `${emailLimit}_${email.toLowerCase()}`;
    const emailCheck = checkRateLimit(emailKey, RATE_LIMITS[emailLimit]);

    if (!emailCheck.allowed) {
      return rateLimitResponse(emailCheck.resetIn);
    }
  }

  return null; // Not rate limited
}

/**
 * Apply rate limits to a payment request
 * This is the main function to use in payment routes
 */
export function applyPaymentRateLimits(
  request: NextRequest,
  email?: string
): Response | null {
  const ip = getClientIP(request);

  return checkRateLimits(
    { ip, email },
    {
      ipLimit: 'PAYMENT_CREATE',
      emailLimit: email ? 'PAYMENT_PER_EMAIL' : undefined,
    }
  );
}

/**
 * Apply rate limits for verification endpoints
 */
export function applyVerifyRateLimits(request: NextRequest): Response | null {
  const ip = getClientIP(request);

  return checkRateLimits(
    { ip },
    { ipLimit: 'PAYMENT_VERIFY' }
  );
}

/**
 * Apply rate limits for webhook endpoints
 */
export function applyWebhookRateLimits(request: NextRequest): Response | null {
  const ip = getClientIP(request);

  return checkRateLimits(
    { ip },
    { ipLimit: 'WEBHOOK' }
  );
}

// ============================================
// HELPER: Get context from request
// ============================================

/**
 * Extract rate limit context from request
 */
export function getRateLimitContext(request: NextRequest): RateLimitContext {
  return {
    ip: getClientIP(request),
  };
}

/**
 * Create rate limit context with email from body
 */
export function createRateLimitContext(
  request: NextRequest,
  email?: string
): RateLimitContext {
  return {
    ip: getClientIP(request),
    email,
  };
}
