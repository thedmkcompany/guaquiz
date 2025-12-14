/**
 * Application Constants
 * Centralized constants for consistency across the application
 */

// ============================================
// API ERROR MESSAGES
// ============================================

export const API_ERRORS = {
  // Validation errors
  MISSING_FIELDS: 'Missing required fields',
  INVALID_AMOUNT: 'Invalid amount',
  INVALID_PROGRAM: 'Invalid program',
  PRICE_MISMATCH: 'Invalid amount for selected program',

  // Payment errors
  PAYMENT_FAILED: 'Unable to process payment. Please try again.',
  VERIFICATION_FAILED: 'Payment verification failed',
  MISSING_PAYMENT_FIELDS: 'Missing required payment fields',
  MISSING_ORDER_OR_SUB: 'Missing order_id or subscription_id',

  // Auth errors
  UNAUTHORIZED: 'Unauthorized',
  INVALID_SIGNATURE: 'Invalid signature',

  // Rate limiting
  RATE_LIMITED: 'Too many requests. Please try again later.',

  // Generic
  SERVER_ERROR: 'An error occurred. Please try again later.',
  NOT_CONFIGURED: 'Service not configured',
} as const;

// ============================================
// HTTP STATUS CODES
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;

// ============================================
// PAYMENT GATEWAYS
// ============================================

export const PAYMENT_GATEWAY = {
  RAZORPAY: 'razorpay',
  PAYU: 'payu',
} as const;

export type PaymentGateway = (typeof PAYMENT_GATEWAY)[keyof typeof PAYMENT_GATEWAY];

// ============================================
// PAYMENT STATUS
// ============================================

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CAPTURED: 'captured',
  AUTHORIZED: 'authorized',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// ============================================
// WEBHOOK EVENTS
// ============================================

export const RAZORPAY_EVENTS = {
  PAYMENT_CAPTURED: 'payment.captured',
  PAYMENT_FAILED: 'payment.failed',
  ORDER_PAID: 'order.paid',
  SUBSCRIPTION_ACTIVATED: 'subscription.activated',
  SUBSCRIPTION_CHARGED: 'subscription.charged',
  SUBSCRIPTION_PENDING: 'subscription.pending',
  SUBSCRIPTION_HALTED: 'subscription.halted',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  SUBSCRIPTION_COMPLETED: 'subscription.completed',
} as const;

export const PAYU_STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PENDING: 'pending',
} as const;

// ============================================
// CURRENCY
// ============================================

export const CURRENCY = {
  INR: 'INR',
  USD: 'USD',
} as const;

export const DEFAULT_CURRENCY = CURRENCY.INR;

// ============================================
// LOGGING CONTEXTS
// ============================================

export const LOG_CONTEXT = {
  PAYMENT: 'Payment',
  RAZORPAY: 'Razorpay',
  PAYU: 'PayU',
  WEBHOOK: 'Webhook',
  SECURITY: 'Security',
  CRM: 'CRM',
  RATE_LIMIT: 'RateLimit',
} as const;

// ============================================
// ENVIRONMENT
// ============================================

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';

// ============================================
// LIMITS
// ============================================

export const LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 20,
  MAX_AMOUNT: 10000000, // 1 crore INR
  MIN_AMOUNT: 1,
} as const;
