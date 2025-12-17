/**
 * @fileoverview Shared Payment API Utilities
 *
 * Consolidates common patterns for payment route handlers including:
 * - Request validation with Zod schemas
 * - Program/price verification
 * - Rate limiting integration
 * - Standardized error responses
 *
 * @module payment-api
 *
 * ## Security Features
 *
 * - **Price Validation**: Prevents price manipulation attacks
 * - **Plan ID Verification**: Ensures subscription plan integrity
 * - **Rate Limiting**: IP and email-based protection
 * - **PII Masking**: Logs sensitive data safely
 *
 * ## Usage
 *
 * @example
 * ```typescript
 * import {
 *   withPaymentHandler,
 *   validatePaymentWithProgram,
 *   checkPaymentRateLimits
 * } from '@/lib/payment-api';
 *
 * export async function POST(request: NextRequest) {
 *   return withPaymentHandler(request, async ({ clientIP, body }) => {
 *     // Check rate limits
 *     const rateCheck = checkPaymentRateLimits(clientIP, body.email);
 *     if (!rateCheck.allowed) return rateCheck.response;
 *
 *     // Validate and get program
 *     const validation = validatePaymentWithProgram(body, clientIP);
 *     if (validation instanceof NextResponse) return validation;
 *
 *     const { data, program } = validation;
 *     // Process payment...
 *   });
 * }
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';
import { getProgramById } from './programs';
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
  RATE_LIMITS,
  type RateLimitConfig,
} from './rate-limit';
import { maskEmail, maskIP } from './validation';
import type { Program } from '@/types';

// ============================================
// ZOD SCHEMAS
// ============================================

/** Schema for customer name - trims whitespace */
const customerNameSchema = z.string().min(2, 'Name must be at least 2 characters').trim();

/** Schema for email - validates format and normalizes */
const emailSchema = z.string().email('Invalid email address').toLowerCase().trim();

/** Schema for phone - optional, normalizes format */
const phoneSchema = z.string().optional().transform((val) => val?.trim() || '');

/** Schema for positive currency amount */
const amountSchema = z.number().positive('Amount must be positive');

/** Schema for program ID */
const programIdSchema = z.string().min(1, 'Program ID is required');

/** Base payment request schema */
export const PaymentRequestSchema = z.object({
  amount: amountSchema,
  programId: programIdSchema,
  programName: z.string().optional(),
  customerEmail: emailSchema,
  customerName: customerNameSchema,
  customerPhone: phoneSchema,
});

/** Subscription request schema */
export const SubscriptionRequestSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  programId: programIdSchema,
  programName: z.string().optional(),
  customerEmail: emailSchema,
  customerName: customerNameSchema,
  customerPhone: phoneSchema,
  totalCount: z.number().int().positive().optional(),
  programStartDate: z.string().optional(),
  startDateOption: z.enum(['coming-monday', 'following-monday']).optional(),
});

/** Razorpay verification schema */
export const RazorpayVerifySchema = z.object({
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
  razorpay_order_id: z.string().optional(),
  razorpay_subscription_id: z.string().optional(),
}).refine(
  (data) => data.razorpay_order_id || data.razorpay_subscription_id,
  { message: 'Either order_id or subscription_id is required' }
);

// ============================================
// TYPE EXPORTS
// ============================================

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;
export type SubscriptionRequest = z.infer<typeof SubscriptionRequestSchema>;
export type RazorpayVerifyRequest = z.infer<typeof RazorpayVerifySchema>;

// ============================================
// PARSED NAME INTERFACE
// ============================================

export interface ParsedName {
  firstName: string;
  lastName: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parse full name into first and last name components
 */
export function parseCustomerName(fullName: string): ParsedName {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

/**
 * Get base URL from environment or fallback to localhost
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

// ============================================
// ERROR RESPONSE HELPERS
// ============================================

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

/** Standard error response codes */
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_PROGRAM: 'INVALID_PROGRAM',
  PRICE_MISMATCH: 'PRICE_MISMATCH',
  PLAN_MISMATCH: 'PLAN_MISMATCH',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
} as const;

/**
 * Create a standardized error response
 */
export function errorResponse(
  message: string,
  status: number,
  code?: string,
  details?: Record<string, string[]>
): NextResponse<ApiError> {
  const body: ApiError = { error: message };
  if (code) body.code = code;
  if (details) body.details = details;
  return NextResponse.json(body, { status });
}

/**
 * Create validation error response from Zod error
 */
export function validationErrorResponse(error: ZodError): NextResponse<ApiError> {
  const details: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!details[path]) details[path] = [];
    details[path].push(issue.message);
  }

  return errorResponse(
    'Validation failed',
    400,
    ErrorCode.VALIDATION_ERROR,
    details
  );
}

/**
 * Create program not found error
 */
export function programNotFoundError(): NextResponse<ApiError> {
  return errorResponse('Invalid program', 400, ErrorCode.INVALID_PROGRAM);
}

/**
 * Create price mismatch error with security logging
 */
export function priceMismatchError(context: {
  programId: string;
  expectedPrice: number;
  receivedAmount: number;
  clientIP: string;
  email: string;
}): NextResponse<ApiError> {
  console.error('[SECURITY] Price manipulation attempt:', {
    programId: context.programId,
    expectedPrice: context.expectedPrice,
    receivedAmount: context.receivedAmount,
    ip: maskIP(context.clientIP),
    email: maskEmail(context.email),
  });

  return errorResponse(
    'Invalid amount for selected program',
    400,
    ErrorCode.PRICE_MISMATCH
  );
}

/**
 * Create plan ID mismatch error with security logging
 */
export function planMismatchError(context: {
  programId: string;
  expectedPlanId: string;
  receivedPlanId: string;
  clientIP: string;
  email: string;
}): NextResponse<ApiError> {
  console.error('[SECURITY] Plan ID mismatch:', {
    programId: context.programId,
    expectedPlanId: context.expectedPlanId,
    receivedPlanId: context.receivedPlanId,
    ip: maskIP(context.clientIP),
    email: maskEmail(context.email),
  });

  return errorResponse(
    'Invalid subscription plan',
    400,
    ErrorCode.PLAN_MISMATCH
  );
}

/**
 * Create generic processing error
 */
export function processingError(message = 'Unable to process request. Please try again.'): NextResponse<ApiError> {
  return errorResponse(message, 500, ErrorCode.PROCESSING_ERROR);
}

// ============================================
// VALIDATION HELPERS
// ============================================

export interface ValidatedPayment {
  data: PaymentRequest;
  program: Program;
}

export interface ValidatedSubscription {
  data: SubscriptionRequest;
  program: Program;
}

/**
 * Validate payment request and verify program/price
 * Returns validated data and program, or error response
 */
export function validatePaymentWithProgram(
  body: unknown,
  clientIP: string
): ValidatedPayment | NextResponse<ApiError> {
  // Parse and validate request body
  const parseResult = PaymentRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error);
  }

  const data = parseResult.data;

  // Verify program exists
  const program = getProgramById(data.programId);
  if (!program) {
    return programNotFoundError();
  }

  // Verify price matches (security: prevent price manipulation)
  if (data.amount !== program.price) {
    return priceMismatchError({
      programId: data.programId,
      expectedPrice: program.price,
      receivedAmount: data.amount,
      clientIP,
      email: data.customerEmail,
    });
  }

  return { data, program };
}

/**
 * Validate subscription request and verify program/plan
 * Returns validated data and program, or error response
 */
export function validateSubscriptionWithProgram(
  body: unknown,
  clientIP: string
): ValidatedSubscription | NextResponse<ApiError> {
  // Parse and validate request body
  const parseResult = SubscriptionRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error);
  }

  const data = parseResult.data;

  // Verify program exists
  const program = getProgramById(data.programId);
  if (!program) {
    return programNotFoundError();
  }

  // Verify plan ID matches if program has one configured
  if (program.razorpayPlanId && data.planId !== program.razorpayPlanId) {
    return planMismatchError({
      programId: data.programId,
      expectedPlanId: program.razorpayPlanId,
      receivedPlanId: data.planId,
      clientIP,
      email: data.customerEmail,
    });
  }

  return { data, program };
}

// ============================================
// RATE LIMITING HELPERS
// ============================================

export interface RateLimitCheck {
  allowed: boolean;
  response?: Response;
}

/**
 * Check rate limits by IP and optionally by email
 * Returns allowed status and rate limit response if blocked
 */
export async function checkPaymentRateLimits(
  clientIP: string,
  email?: string,
  ipConfig: RateLimitConfig = RATE_LIMITS.PAYMENT_CREATE,
  emailConfig: RateLimitConfig = RATE_LIMITS.PAYMENT_PER_EMAIL
): Promise<RateLimitCheck> {
  // Check IP rate limit
  const ipLimit = await checkRateLimit(`payment_create_${clientIP}`, ipConfig);
  if (!ipLimit.allowed) {
    return { allowed: false, response: rateLimitResponse(ipLimit.resetIn) };
  }

  // Check email rate limit if provided
  if (email) {
    const emailLimit = await checkRateLimit(
      `payment_email_${email.toLowerCase()}`,
      emailConfig
    );
    if (!emailLimit.allowed) {
      return { allowed: false, response: rateLimitResponse(emailLimit.resetIn) };
    }
  }

  return { allowed: true };
}

// ============================================
// REQUEST HANDLER WRAPPER
// ============================================

export interface HandlerContext {
  clientIP: string;
  body: unknown;
}

type HandlerResult = NextResponse | Response;

/**
 * Wrapper for payment API handlers
 * Handles common concerns: rate limiting, JSON parsing, error handling
 */
export async function withPaymentHandler<T extends HandlerResult>(
  request: NextRequest,
  handler: (ctx: HandlerContext) => Promise<T>,
  options: {
    rateLimitKey?: string;
    rateLimitConfig?: RateLimitConfig;
    skipRateLimit?: boolean;
  } = {}
): Promise<T | Response> {
  try {
    const clientIP = getClientIP(request);

    // Apply rate limiting unless skipped
    if (!options.skipRateLimit) {
      const key = options.rateLimitKey || `payment_${clientIP}`;
      const config = options.rateLimitConfig || RATE_LIMITS.PAYMENT_CREATE;
      const limit = await checkRateLimit(key, config);

      if (!limit.allowed) {
        return rateLimitResponse(limit.resetIn);
      }
    }

    // Parse JSON body
    const body = await request.json();

    // Execute handler
    return await handler({ clientIP, body });
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON in request body', 400, ErrorCode.VALIDATION_ERROR) as T;
    }

    // Log and return generic error
    console.error('[Payment API] Handler error:', error instanceof Error ? error.message : 'Unknown error');
    return processingError() as T;
  }
}

/**
 * Parse and validate request with a Zod schema
 */
export function parseRequest<T>(
  body: unknown,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse<ApiError> } {
  const result = schema.safeParse(body);

  if (!result.success) {
    return { success: false, response: validationErrorResponse(result.error) };
  }

  return { success: true, data: result.data };
}
