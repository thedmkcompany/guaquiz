/**
 * Vitest Setup File
 * Runs before all tests
 */

import { beforeAll, afterEach, afterAll, vi } from 'vitest';

// Setup environment variables for testing
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
  process.env.RAZORPAY_KEY_SECRET = 'test_secret';
  process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook_secret';
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_key';
  process.env.PAYU_MERCHANT_KEY = 'test_merchant_key';
  process.env.PAYU_MERCHANT_SALT = 'test_salt';
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
});

// Cleanup after each test
afterEach(() => {
  // Clear all timers
  vi.clearAllTimers();
});

// Cleanup after all tests
afterAll(() => {
  // Restore all mocks
  vi.restoreAllMocks();
});
