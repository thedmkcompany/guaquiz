/**
 * API Error Handler
 * Centralized error handling for API routes
 */

import { NextResponse } from 'next/server';

// ============================================
// CUSTOM ERROR CLASSES
// ============================================

/**
 * Custom API Error with status code and optional code
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends APIError {
  constructor(message: string, code?: string) {
    super(message, 400, code || 'VALIDATION_ERROR');
  }
}

/**
 * Authentication Error (401)
 */
export class AuthenticationError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends APIError {
  constructor(
    public resetIn: number,
    message: string = 'Too many requests. Please try again later.'
  ) {
    super(message, 429, 'RATE_LIMITED');
  }
}

/**
 * Payment Error (502)
 */
export class PaymentGatewayError extends APIError {
  constructor(message: string = 'Payment processing failed') {
    super(message, 502, 'PAYMENT_GATEWAY_ERROR');
  }
}

// ============================================
// ERROR HANDLER
// ============================================

interface ErrorHandlerOptions {
  context: string;
  userMessage?: string;
  includeStack?: boolean;
}

/**
 * Handle API errors and return appropriate response
 */
export function handleAPIError(
  error: unknown,
  options: ErrorHandlerOptions
): NextResponse {
  const { context, userMessage, includeStack = false } = options;

  // Log full error server-side
  if (process.env.NODE_ENV === 'development' || includeStack) {
    console.error(`[${context}] Error:`, error);
  } else {
    console.error(
      `[${context}] Error:`,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  // Handle known API errors
  if (error instanceof APIError) {
    const response: Record<string, unknown> = {
      error: error.message,
    };

    if (error.code) {
      response.code = error.code;
    }

    // Add retry-after header for rate limit errors
    if (error instanceof RateLimitError) {
      return new NextResponse(JSON.stringify(response), {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(error.resetIn / 1000)),
        },
      });
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle unknown errors - don't leak internal details
  const genericMessage =
    userMessage || 'An error occurred. Please try again later.';

  return NextResponse.json(
    { error: genericMessage },
    { status: 500 }
  );
}

// ============================================
// SUCCESS RESPONSE HELPERS
// ============================================

/**
 * Create a success JSON response
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Create an error JSON response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse {
  const response: Record<string, unknown> = { error: message };
  if (code) response.code = code;
  return NextResponse.json(response, { status });
}

// ============================================
// TRY-CATCH WRAPPER
// ============================================

type AsyncHandler<T> = () => Promise<T>;

/**
 * Wrap async function with error handling
 */
export async function withErrorHandling<T>(
  handler: AsyncHandler<T>,
  options: ErrorHandlerOptions
): Promise<T | NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return handleAPIError(error, options);
  }
}
