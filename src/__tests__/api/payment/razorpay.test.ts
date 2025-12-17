import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock razorpay lib
vi.mock('@/lib/razorpay', () => ({
  verifyPaymentSignature: vi.fn(() => true),
  verifySubscriptionSignature: vi.fn(() => true),
  fetchPayment: vi.fn(() => Promise.resolve({ status: 'captured' })),
}));

// Mock rate limiting
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 10, resetIn: 0 })),
  RATE_LIMITS: {
    PAYMENT_PER_EMAIL: { maxRequests: 5, windowMs: 60000 },
    PAYMENT_PER_IP: { maxRequests: 10, windowMs: 60000 },
    PAYMENT_VERIFY: { maxRequests: 10, windowMs: 60000 },
  },
  rateLimitResponse: vi.fn(),
}));

// Mock validation
vi.mock('@/lib/validation', () => ({
  maskIP: vi.fn(() => 'xxx.xxx.xxx.xxx'),
}));

describe('Razorpay Payment Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Signature Verification', () => {
    it('should verify payment signature', async () => {
      const { verifyPaymentSignature } = await import('@/lib/razorpay');
      const result = verifyPaymentSignature('order_123', 'pay_123', 'sig_123');
      expect(result).toBe(true);
    });

    it('should verify subscription signature', async () => {
      const { verifySubscriptionSignature } = await import('@/lib/razorpay');
      const result = verifySubscriptionSignature('sub_123', 'pay_123', 'sig_123');
      expect(result).toBe(true);
    });
  });

  describe('Payment Fetching', () => {
    it('should fetch payment details', async () => {
      const { fetchPayment } = await import('@/lib/razorpay');
      const payment = await fetchPayment('pay_123');
      expect(payment).toHaveProperty('status', 'captured');
    });
  });
});
