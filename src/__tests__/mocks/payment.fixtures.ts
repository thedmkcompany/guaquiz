/**
 * Payment Test Fixtures
 * Reusable test data for payment endpoints
 */

import type { CreateOrderRequest } from '@/types/payment';

/**
 * Valid create order request
 */
export const validCreateOrderRequest: CreateOrderRequest = {
  amount: 2499,
  programId: 'essentials',
  customerEmail: 'test@example.com',
  customerName: 'Test User',
  customerPhone: '+919876543210',
};

/**
 * Valid trial program request
 */
export const validTrialRequest: CreateOrderRequest = {
  amount: 499,
  programId: 'trial',
  customerEmail: 'trial@example.com',
  customerName: 'Trial User',
  customerPhone: '+919123456789',
};

/**
 * Valid Circle program request
 */
export const validCircleRequest: CreateOrderRequest = {
  amount: 4499,
  programId: 'circle',
  customerEmail: 'circle@example.com',
  customerName: 'Circle User',
};

/**
 * Invalid requests for testing error cases
 */
export const invalidRequests = {
  missingAmount: {
    programId: 'essentials',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
  missingProgramId: {
    amount: 2499,
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
  missingEmail: {
    amount: 2499,
    programId: 'essentials',
    customerName: 'Test User',
  },
  missingName: {
    amount: 2499,
    programId: 'essentials',
    customerEmail: 'test@example.com',
  },
  invalidAmount: {
    amount: -100,
    programId: 'essentials',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
  zeroAmount: {
    amount: 0,
    programId: 'essentials',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
  wrongAmount: {
    amount: 9999, // Wrong amount for essentials (should be 2499)
    programId: 'essentials',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
  invalidProgram: {
    amount: 2499,
    programId: 'nonexistent',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
};

/**
 * Valid Razorpay verify request
 */
export const validVerifyRequest = {
  razorpay_order_id: 'order_test123',
  razorpay_payment_id: 'pay_test123',
  razorpay_signature: 'valid_signature_here',
};

/**
 * Invalid verify requests
 */
export const invalidVerifyRequests = {
  missingPaymentId: {
    razorpay_order_id: 'order_test123',
    razorpay_signature: 'signature',
  },
  missingSignature: {
    razorpay_order_id: 'order_test123',
    razorpay_payment_id: 'pay_test123',
  },
  missingOrderId: {
    razorpay_payment_id: 'pay_test123',
    razorpay_signature: 'signature',
  },
  invalidSignature: {
    razorpay_order_id: 'order_test123',
    razorpay_payment_id: 'pay_test123',
    razorpay_signature: 'invalid_signature',
  },
};

/**
 * Mock Razorpay webhook payloads
 */
export const webhookPayloads = {
  paymentCaptured: {
    entity: 'event',
    account_id: 'acc_test123',
    event: 'payment.captured',
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: 'pay_test123',
          entity: 'payment',
          amount: 249900,
          currency: 'INR',
          status: 'captured',
          order_id: 'order_test123',
          method: 'card',
          description: 'Payment for Essentials',
          email: 'test@example.com',
          contact: '+919876543210',
          notes: {
            programId: 'essentials',
            programName: 'Essentials',
            customerEmail: 'test@example.com',
            customerName: 'Test User',
            customerPhone: '+919876543210',
          },
          created_at: Date.now(),
          captured: true,
        },
      },
    },
    created_at: Date.now(),
  },
  paymentFailed: {
    entity: 'event',
    account_id: 'acc_test123',
    event: 'payment.failed',
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: 'pay_failed123',
          entity: 'payment',
          amount: 249900,
          currency: 'INR',
          status: 'failed',
          order_id: 'order_test123',
          method: 'card',
          description: 'Payment for Essentials',
          email: 'test@example.com',
          contact: '+919876543210',
          notes: {
            error: 'Insufficient funds',
          },
          created_at: Date.now(),
          captured: false,
        },
      },
    },
    created_at: Date.now(),
  },
};

/**
 * Security test payloads
 */
export const securityTestPayloads = {
  sqlInjection: {
    amount: 2499,
    programId: "essentials'; DROP TABLE users; --",
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
  xssAttempt: {
    amount: 2499,
    programId: 'essentials',
    customerEmail: 'test@example.com',
    customerName: '<script>alert("xss")</script>',
  },
  oversizedPayload: {
    amount: 2499,
    programId: 'essentials',
    customerEmail: 'test@example.com',
    customerName: 'A'.repeat(10000), // Very long name
  },
};
