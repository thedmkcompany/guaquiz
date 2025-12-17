import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockTextRequest, getResponseJson } from '../../helpers/test-utils';
import { POST } from '@/app/api/webhooks/razorpay/route';

// Mock razorpay module
vi.mock('@/lib/razorpay', () => ({
  verifyWebhookSignature: vi.fn(() => true),
  paiseToRupees: vi.fn((paise) => paise / 100),
}));

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  updateLeadPaymentStatus: vi.fn(() => Promise.resolve({ success: true })),
  markPaymentFailed: vi.fn(() => Promise.resolve()),
}));

// Mock Wix CRM
vi.mock('@/lib/wix-crm', () => ({
  syncToWixCRM: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock webhook store
vi.mock('@/lib/webhook-store', () => ({
  tryMarkEventProcessed: vi.fn(() => Promise.resolve(true)), // true = first time processing
}));

// Mock payment-api
vi.mock('@/lib/payment-api', () => ({
  parseCustomerName: vi.fn((name) => {
    const parts = (name || '').trim().split(' ');
    return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
  }),
}));

// Mock validation
vi.mock('@/lib/validation', () => ({
  maskEmail: vi.fn((email) => email?.replace(/^(.{2}).*(@.*)$/, '$1***$2') || '***'),
}));

describe('POST /api/webhooks/razorpay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const createWebhookPayload = (event: string, data: Record<string, unknown> = {}) => ({
    event,
    payload: {
      payment: {
        entity: {
          id: 'pay_test123',
          order_id: 'order_test123',
          amount: 499900,
          email: 'test@example.com',
          contact: '+919876543210',
          notes: {
            programId: 'essentials',
            programName: 'Essentials Program',
            customerEmail: 'test@example.com',
            customerName: 'Test User',
            customerPhone: '+919876543210',
          },
          ...data,
        },
      },
    },
  });

  describe('Signature Verification', () => {
    it('should reject request without signature', async () => {
      const body = JSON.stringify(createWebhookPayload('payment.captured'));
      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body,
        headers: {},
      });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid signature');
    });

    it('should reject request with invalid signature', async () => {
      const { verifyWebhookSignature } = await import('@/lib/razorpay');
      vi.mocked(verifyWebhookSignature).mockReturnValueOnce(false);

      const body = JSON.stringify(createWebhookPayload('payment.captured'));
      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body,
        headers: { 'x-razorpay-signature': 'invalid_signature' },
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('should accept request with valid signature', async () => {
      const body = JSON.stringify(createWebhookPayload('payment.captured'));
      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body,
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      const response = await POST(request);
      const data = await getResponseJson<{ received: boolean }>(response);

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });

  describe('Duplicate Event Prevention', () => {
    it('should ignore duplicate events', async () => {
      const { tryMarkEventProcessed } = await import('@/lib/webhook-store');
      vi.mocked(tryMarkEventProcessed).mockResolvedValueOnce(false); // false = already processed

      const body = JSON.stringify(createWebhookPayload('payment.captured'));
      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body,
        headers: {
          'x-razorpay-signature': 'valid_signature',
          'x-razorpay-event-id': 'evt_duplicate123',
        },
      });

      const response = await POST(request);
      const data = await getResponseJson<{ duplicate: boolean }>(response);

      expect(response.status).toBe(200);
      expect(data.duplicate).toBe(true);
    });

    it('should mark event as processed after handling', async () => {
      const { markEventProcessed } = await import('@/lib/webhook-store');

      const body = JSON.stringify(createWebhookPayload('payment.captured'));
      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body,
        headers: {
          'x-razorpay-signature': 'valid_signature',
          'x-razorpay-event-id': 'evt_new123',
        },
      });

      await POST(request);

      expect(markEventProcessed).toHaveBeenCalledWith('evt_new123', 'razorpay');
    });
  });

  describe('Payment Events', () => {
    it('should handle payment.captured event', async () => {
      const { updateLeadPaymentStatus } = await import('@/lib/supabase');
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      const body = JSON.stringify(createWebhookPayload('payment.captured'));
      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body,
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(updateLeadPaymentStatus).toHaveBeenCalled();
      expect(syncToWixCRM).toHaveBeenCalled();
    });

    it('should handle payment.failed event', async () => {
      const { markPaymentFailed } = await import('@/lib/supabase');

      const payload = {
        event: 'payment.failed',
        payload: {
          payment: {
            entity: {
              id: 'pay_failed123',
              order_id: 'order_test123',
              email: 'test@example.com',
              notes: { customerEmail: 'test@example.com' },
            },
          },
        },
      };

      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body: JSON.stringify(payload),
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      await POST(request);

      expect(markPaymentFailed).toHaveBeenCalled();
    });

    it('should handle order.paid event', async () => {
      const payload = {
        event: 'order.paid',
        payload: {
          order: { entity: { id: 'order_test123' } },
        },
      };

      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body: JSON.stringify(payload),
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Subscription Events', () => {
    it('should handle subscription.activated event', async () => {
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      const payload = {
        event: 'subscription.activated',
        payload: {
          subscription: {
            entity: {
              id: 'sub_test123',
              plan_id: 'plan_circle',
              status: 'active',
              notes: {
                programId: 'circle',
                programName: 'The Circle',
                customerEmail: 'test@example.com',
                customerName: 'Test User',
              },
            },
          },
        },
      };

      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body: JSON.stringify(payload),
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      await POST(request);

      expect(syncToWixCRM).toHaveBeenCalled();
    });

    it('should handle subscription.cancelled event', async () => {
      const payload = {
        event: 'subscription.cancelled',
        payload: {
          subscription: {
            entity: {
              id: 'sub_test123',
              plan_id: 'plan_circle',
              ended_at: 1234567890,
            },
          },
        },
      };

      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body: JSON.stringify(payload),
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body: 'not valid json',
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      const response = await POST(request);
      const data = await getResponseJson<{ received: boolean }>(response);

      // Should return 200 to prevent retries
      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });

    it('should handle unhandled event types', async () => {
      const payload = { event: 'unknown.event', payload: {} };

      const request = createMockTextRequest({
        url: 'http://localhost:3000/api/webhooks/razorpay',
        body: JSON.stringify(payload),
        headers: { 'x-razorpay-signature': 'valid_signature' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});
