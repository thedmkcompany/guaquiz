import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockRequest, getResponseJson, createSubscriptionRegistrationRequest } from '../../helpers/test-utils';
import { POST } from '@/app/api/payment/razorpay/create-subscription-registration/route';

// Mock razorpay lib
vi.mock('@/lib/razorpay', () => ({
  createSubscriptionRegistrationLink: vi.fn(() =>
    Promise.resolve({
      id: 'inv_test123',
      short_url: 'https://rzp.io/i/test123',
      status: 'issued',
      expire_by: Math.floor(Date.now() / 1000) + 86400 * 30,
    })
  ),
}));

// Mock rate limiting
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 10, resetIn: 0 })),
  RATE_LIMITS: {
    PAYMENT_CREATE: { maxRequests: 5, windowMs: 60000 },
  },
  rateLimitResponse: vi.fn(() => new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429 })),
}));

// Mock programs
vi.mock('@/lib/programs', () => ({
  getProgramById: vi.fn((id: string) => {
    const programs: Record<string, { id: string; name: string; price: number }> = {
      essentials: { id: 'essentials', name: 'Essentials Program', price: 4999 },
      transform: { id: 'transform', name: 'Transform Program', price: 49999 },
      circle: { id: 'circle', name: 'The Circle', price: 999 },
    };
    return programs[id] || null;
  }),
}));

describe('POST /api/payment/razorpay/create-subscription-registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Validation', () => {
    it('should reject request with missing planId', async () => {
      const body = createSubscriptionRegistrationRequest({ planId: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with missing name', async () => {
      const body = createSubscriptionRegistrationRequest({ name: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with missing email', async () => {
      const body = createSubscriptionRegistrationRequest({ email: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with missing phone', async () => {
      const body = createSubscriptionRegistrationRequest({ phone: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with invalid email format', async () => {
      const body = createSubscriptionRegistrationRequest({ email: 'invalid-email' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid email format');
    });

    it('should reject request with invalid phone format', async () => {
      const body = createSubscriptionRegistrationRequest({ phone: '12345' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid phone number');
    });

    it('should reject phone number not starting with 6-9', async () => {
      const body = createSubscriptionRegistrationRequest({ phone: '+911234567890' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should reject request with invalid programId', async () => {
      const body = createSubscriptionRegistrationRequest({ programId: 'invalid-program' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid program');
    });
  });

  describe('Success Cases', () => {
    it('should create subscription registration link successfully', async () => {
      const body = createSubscriptionRegistrationRequest();
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{
        success: boolean;
        registrationLinkId: string;
        shortUrl: string;
        status: string;
      }>(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.registrationLinkId).toBe('inv_test123');
      expect(data.shortUrl).toBe('https://rzp.io/i/test123');
      expect(data.status).toBe('issued');
    });

    it('should accept phone with +91 prefix', async () => {
      const body = createSubscriptionRegistrationRequest({ phone: '+919876543210' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept phone without +91 prefix', async () => {
      const body = createSubscriptionRegistrationRequest({ phone: '9876543210' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept phone with spaces', async () => {
      const body = createSubscriptionRegistrationRequest({ phone: '+91 98765 43210' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should work without paymentMethod (customer choice)', async () => {
      const body = createSubscriptionRegistrationRequest();
      delete (body as Record<string, unknown>).paymentMethod;
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should work without callbackUrl', async () => {
      const body = createSubscriptionRegistrationRequest();
      delete (body as Record<string, unknown>).callbackUrl;
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Payment Method Handling', () => {
    it('should accept upi as payment method', async () => {
      const body = createSubscriptionRegistrationRequest({ paymentMethod: 'upi' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept card as payment method', async () => {
      const body = createSubscriptionRegistrationRequest({ paymentMethod: 'card' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept emandate as payment method', async () => {
      const body = createSubscriptionRegistrationRequest({ paymentMethod: 'emandate' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('UPI Amount Limit', () => {
    it('should enforce UPI limit of 15000 for high-value programs', async () => {
      const { createSubscriptionRegistrationLink } = await import('@/lib/razorpay');

      const body = createSubscriptionRegistrationRequest({
        programId: 'transform', // 49999 price
        paymentMethod: 'upi',
      });
      const request = createMockRequest({ body });

      await POST(request);

      // Check that createSubscriptionRegistrationLink was called with maxAmount <= 15000
      expect(createSubscriptionRegistrationLink).toHaveBeenCalled();
      const callArgs = vi.mocked(createSubscriptionRegistrationLink).mock.calls[0][0];
      expect(callArgs.maxAmount).toBeLessThanOrEqual(15000);
    });

    it('should use full program price for card payments', async () => {
      const { createSubscriptionRegistrationLink } = await import('@/lib/razorpay');

      const body = createSubscriptionRegistrationRequest({
        programId: 'transform', // 49999 price
        paymentMethod: 'card',
      });
      const request = createMockRequest({ body });

      await POST(request);

      expect(createSubscriptionRegistrationLink).toHaveBeenCalled();
      const callArgs = vi.mocked(createSubscriptionRegistrationLink).mock.calls[0][0];
      expect(callArgs.maxAmount).toBe(49999);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const { checkRateLimit, rateLimitResponse } = await import('@/lib/rate-limit');

      vi.mocked(checkRateLimit).mockResolvedValueOnce({
        allowed: false,
        remaining: 0,
        resetIn: 60,
      });

      const body = createSubscriptionRegistrationRequest();
      const request = createMockRequest({ body });

      await POST(request);

      expect(rateLimitResponse).toHaveBeenCalledWith(60);
    });
  });

  describe('Callback URL', () => {
    it('should pass callback URL to registration link creation', async () => {
      const { createSubscriptionRegistrationLink } = await import('@/lib/razorpay');

      const callbackUrl = 'https://example.com/checkout/success?program=essentials&email=test@example.com';
      const body = createSubscriptionRegistrationRequest({ callbackUrl });
      const request = createMockRequest({ body });

      await POST(request);

      expect(createSubscriptionRegistrationLink).toHaveBeenCalled();
      const callArgs = vi.mocked(createSubscriptionRegistrationLink).mock.calls[0][0];
      expect(callArgs.callbackUrl).toBe(callbackUrl);
    });
  });

  describe('Error Handling', () => {
    it('should handle Razorpay API errors gracefully', async () => {
      const { createSubscriptionRegistrationLink } = await import('@/lib/razorpay');

      vi.mocked(createSubscriptionRegistrationLink).mockRejectedValueOnce(
        new Error('Razorpay API error')
      );

      const body = createSubscriptionRegistrationRequest();
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to create registration link');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in name', async () => {
      const body = createSubscriptionRegistrationRequest({ name: "O'Brien-Smith Jr." });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle unicode characters in name', async () => {
      const body = createSubscriptionRegistrationRequest({ name: 'राहुल Kumar' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle email with subdomain', async () => {
      const body = createSubscriptionRegistrationRequest({ email: 'test@mail.example.com' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle email with plus sign', async () => {
      const body = createSubscriptionRegistrationRequest({ email: 'test+tag@example.com' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});
