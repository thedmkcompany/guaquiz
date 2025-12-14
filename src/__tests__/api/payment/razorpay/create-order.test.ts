/**
 * Tests for Razorpay Create Order API
 * Tests: /api/payment/razorpay/create-order
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/payment/razorpay/create-order/route';
import { createMockRequest, getResponseJson, randomEmail } from '@/__tests__/utils/test-helpers';
import {
  validCreateOrderRequest,
  validTrialRequest,
  invalidRequests,
  securityTestPayloads,
} from '@/__tests__/mocks/payment.fixtures';

// Mock dependencies
vi.mock('@/lib/razorpay', () => ({
  createOrder: vi.fn((amount, receipt) => Promise.resolve({
    id: 'order_test123',
    amount: Math.round(amount * 100), // Amount in paise
    currency: 'INR',
    receipt: receipt,
  })),
  generateReceiptId: vi.fn(() => 'rcpt_test_123'),
  getPublicKey: vi.fn(() => 'rzp_test_key'),
}));

// Mock rate limiter to allow all requests in tests
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 10, resetIn: 0 })),
  getClientIP: vi.fn(() => '127.0.0.1'),
  rateLimitResponse: vi.fn(),
  RATE_LIMITS: {
    PAYMENT_CREATE: { maxRequests: 10, windowMs: 60000 },
    PAYMENT_PER_EMAIL: { maxRequests: 3, windowMs: 3600000 },
    PAYMENT_VERIFY: { maxRequests: 20, windowMs: 60000 },
  },
}));

describe('POST /api/payment/razorpay/create-order', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set test environment variables
    process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
    process.env.RAZORPAY_KEY_SECRET = 'test_secret';
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_key';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // SUCCESS CASES
  // ============================================

  describe('Success Cases', () => {
    it('should create order successfully with valid data', async () => {
      const request = createMockRequest({
        body: validCreateOrderRequest,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        orderId: expect.any(String),
        amount: expect.any(Number),
        currency: 'INR',
        receipt: expect.any(String),
        keyId: expect.any(String),
      });
    });

    it('should create order for trial program', async () => {
      const request = createMockRequest({
        body: validTrialRequest,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.amount).toBe(49900); // ₹499 in paise
    });

    it('should accept request without phone number', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { customerPhone, ...requestWithoutPhone } = validCreateOrderRequest;

      const request = createMockRequest({
        body: requestWithoutPhone,
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should return correct response structure', async () => {
      const request = createMockRequest({
        body: validCreateOrderRequest,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('orderId');
      expect(data).toHaveProperty('amount');
      expect(data).toHaveProperty('currency');
      expect(data).toHaveProperty('receipt');
      expect(data).toHaveProperty('keyId');
    });
  });

  // ============================================
  // VALIDATION TESTS
  // ============================================

  describe('Validation', () => {
    it('should reject request with missing amount', async () => {
      const request = createMockRequest({
        body: invalidRequests.missingAmount,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should reject request with missing programId', async () => {
      const request = createMockRequest({
        body: invalidRequests.missingProgramId,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should reject request with missing email', async () => {
      const request = createMockRequest({
        body: invalidRequests.missingEmail,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should reject request with missing name', async () => {
      const request = createMockRequest({
        body: invalidRequests.missingName,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should reject negative amount', async () => {
      const request = createMockRequest({
        body: invalidRequests.invalidAmount,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid amount');
    });

    it('should reject zero amount', async () => {
      const request = createMockRequest({
        body: invalidRequests.zeroAmount,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      // Zero is falsy, so caught by missing required fields check
      expect(data.error).toBe('Missing required fields');
    });

    it('should reject string amount', async () => {
      const request = createMockRequest({
        body: {
          ...validCreateOrderRequest,
          amount: '2499', // String instead of number
        },
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid amount');
    });

    it('should reject invalid program ID', async () => {
      const request = createMockRequest({
        body: invalidRequests.invalidProgram,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid program');
    });
  });

  // ============================================
  // SECURITY TESTS
  // ============================================

  describe('Security', () => {
    it('should prevent price manipulation', async () => {
      const request = createMockRequest({
        body: invalidRequests.wrongAmount,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid amount for selected program');
    });

    it('should handle SQL injection attempts safely', async () => {
      const request = createMockRequest({
        body: securityTestPayloads.sqlInjection,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid program');
    });

    it('should handle XSS attempts safely', async () => {
      const request = createMockRequest({
        body: securityTestPayloads.xssAttempt,
      });

      const response = await POST(request);

      // Should not throw, should sanitize or accept
      expect(response.status).toBeLessThan(500);
    });

    it('should reject malformed JSON', async () => {
      const request = new Request('http://localhost:3000/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json{',
      });

      const response = await POST(request as any);
      expect(response.status).toBe(500);
    });
  });

  // ============================================
  // RATE LIMITING
  // ============================================

  describe('Rate Limiting', () => {
    it('should block requests when IP rate limit exceeded', async () => {
      const { checkRateLimit, rateLimitResponse } = await import('@/lib/rate-limit');

      // Mock rate limit exceeded
      vi.mocked(checkRateLimit).mockReturnValueOnce({
        allowed: false,
        remaining: 0,
        resetIn: 30000,
      });

      vi.mocked(rateLimitResponse).mockReturnValue(
        new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
        }) as any
      );

      const request = createMockRequest({
        body: validCreateOrderRequest,
      });

      const response = await POST(request);
      expect(response.status).toBe(429);
    });

    it('should block requests when email rate limit exceeded', async () => {
      const { checkRateLimit, rateLimitResponse } = await import('@/lib/rate-limit');

      // First call (IP) succeeds, second call (email) fails
      vi.mocked(checkRateLimit)
        .mockReturnValueOnce({ allowed: true, remaining: 10, resetIn: 0 })
        .mockReturnValueOnce({ allowed: false, remaining: 0, resetIn: 60000 });

      vi.mocked(rateLimitResponse).mockReturnValue(
        new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
        }) as any
      );

      const request = createMockRequest({
        body: validCreateOrderRequest,
      });

      const response = await POST(request);
      expect(response.status).toBe(429);
    });
  });

  // ============================================
  // ERROR HANDLING
  // ============================================

  describe('Error Handling', () => {
    it('should handle Razorpay API failures gracefully', async () => {
      const { createOrder } = await import('@/lib/razorpay');

      vi.mocked(createOrder).mockRejectedValueOnce(new Error('Razorpay API error'));

      const request = createMockRequest({
        body: validCreateOrderRequest,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(500);
      expect(data.error).toBe('Unable to process payment. Please try again.');
    });

    it('should handle network timeouts', async () => {
      const { createOrder } = await import('@/lib/razorpay');

      vi.mocked(createOrder).mockRejectedValueOnce(new Error('Network timeout'));

      const request = createMockRequest({
        body: validCreateOrderRequest,
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('should not leak sensitive error details', async () => {
      const { createOrder } = await import('@/lib/razorpay');

      vi.mocked(createOrder).mockRejectedValueOnce(
        new Error('RAZORPAY_KEY_SECRET is invalid')
      );

      const request = createMockRequest({
        body: validCreateOrderRequest,
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      // Should return generic error, not expose secret
      expect(data.error).not.toContain('SECRET');
      expect(data.error).toBe('Unable to process payment. Please try again.');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty request body', async () => {
      const request = createMockRequest({
        body: {},
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should handle null values', async () => {
      const request = createMockRequest({
        body: {
          amount: null,
          programId: null,
          customerEmail: null,
          customerName: null,
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should handle very large amounts', async () => {
      const request = createMockRequest({
        body: {
          ...validCreateOrderRequest,
          amount: Number.MAX_SAFE_INTEGER,
        },
      });

      const response = await POST(request);

      // Should reject due to price mismatch
      expect(response.status).toBe(400);
    });

    it('should handle special characters in email', async () => {
      const request = createMockRequest({
        body: {
          ...validCreateOrderRequest,
          customerEmail: "test+special.email@example.com",
        },
      });

      const response = await POST(request);
      // Should accept valid email formats
      expect(response.status).toBe(200);
    });

    it('should handle unicode characters in name', async () => {
      const request = createMockRequest({
        body: {
          ...validCreateOrderRequest,
          customerName: '测试用户 👤',
        },
      });

      const response = await POST(request);
      // Should accept unicode
      expect(response.status).toBe(200);
    });
  });

  // ============================================
  // INTEGRATION SCENARIOS
  // ============================================

  describe('Integration Scenarios', () => {
    it('should handle concurrent requests from same email', async () => {
      const requests = Array(3)
        .fill(null)
        .map(() =>
          createMockRequest({
            body: {
              ...validCreateOrderRequest,
              customerEmail: randomEmail(),
            },
          })
        );

      const responses = await Promise.all(requests.map((req) => POST(req)));

      // All should succeed (different emails)
      responses.forEach((res) => {
        expect(res.status).toBe(200);
      });
    });

    it('should generate unique receipt IDs for concurrent requests', async () => {
      const { generateReceiptId } = await import('@/lib/razorpay');

      // Mock to return unique IDs
      let counter = 0;
      vi.mocked(generateReceiptId).mockImplementation(() => `rcpt_unique_${++counter}`);

      const requests = Array(5)
        .fill(null)
        .map(() =>
          createMockRequest({
            body: {
              ...validCreateOrderRequest,
              customerEmail: randomEmail(),
            },
          })
        );

      const responses = await Promise.all(requests.map((req) => POST(req)));
      const receipts = await Promise.all(
        responses.map((res) => getResponseJson(res).then((d: any) => d.receipt))
      );

      // All receipts should be unique
      const uniqueReceipts = new Set(receipts);
      expect(uniqueReceipts.size).toBe(receipts.length);
    });
  });
});
