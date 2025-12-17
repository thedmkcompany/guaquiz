import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockRequest, getResponseJson, mockEnv } from '../../helpers/test-utils';
import { POST } from '@/app/api/webhooks/payu/route';

// Mock PayU module
vi.mock('@/lib/payu', () => ({
  verifyWebhookAuth: vi.fn(() => true),
  verifyPaymentHash: vi.fn(() => true),
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
  generatePayUEventId: vi.fn((txnid, status, mihpayid) => `payu_${txnid}_${status}_${mihpayid}`),
}));

// Mock payment-api
vi.mock('@/lib/payment-api', () => ({
  parseCustomerName: vi.fn((name) => {
    const parts = (name || '').trim().split(' ');
    return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
  }),
}));

describe('POST /api/webhooks/payu', () => {
  let restoreEnv: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    restoreEnv = mockEnv({
      PAYU_WEBHOOK_SECRET: 'test_webhook_secret',
    });
  });

  afterEach(() => {
    restoreEnv();
    vi.resetAllMocks();
  });

  const createPayUWebhookPayload = (overrides: Record<string, string> = {}) => ({
    txnid: 'TXN_TEST_123',
    status: 'success',
    mihpayid: 'PAY_123456',
    amount: '4999.00',
    email: 'test@example.com',
    phone: '+919876543210',
    productinfo: 'Essentials Program',
    firstname: 'Test User',
    hash: 'valid_hash_signature',
    udf1: 'essentials',
    ...overrides,
  });

  describe('Authorization', () => {
    it('should reject request without authorization header', async () => {
      const { verifyWebhookAuth } = await import('@/lib/payu');
      vi.mocked(verifyWebhookAuth).mockReturnValueOnce(false);

      const body = createPayUWebhookPayload();
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
      });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should accept request with valid authorization', async () => {
      const body = createPayUWebhookPayload();
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      const response = await POST(request);
      const data = await getResponseJson<{ received: boolean }>(response);

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });

  describe('Hash Verification', () => {
    it('should reject request without hash', async () => {
      const body = createPayUWebhookPayload({ hash: '' });
      delete (body as Record<string, unknown>).hash;

      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(401);
      expect(data.error).toBe('Missing signature');
    });

    it('should reject request with invalid hash', async () => {
      const { verifyPaymentHash } = await import('@/lib/payu');
      vi.mocked(verifyPaymentHash).mockReturnValueOnce(false);

      const body = createPayUWebhookPayload({ hash: 'invalid_hash' });
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid signature');
    });
  });

  describe('Duplicate Event Prevention', () => {
    it('should ignore duplicate events', async () => {
      const { tryMarkEventProcessed } = await import('@/lib/webhook-store');
      vi.mocked(tryMarkEventProcessed).mockResolvedValueOnce(false); // false = already processed

      const body = createPayUWebhookPayload();
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      const response = await POST(request);
      const data = await getResponseJson<{ duplicate: boolean }>(response);

      expect(response.status).toBe(200);
      expect(data.duplicate).toBe(true);
    });

    it('should mark event as processed after handling', async () => {
      const { markEventProcessed, generatePayUEventId } = await import('@/lib/webhook-store');

      const body = createPayUWebhookPayload();
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      await POST(request);

      expect(generatePayUEventId).toHaveBeenCalled();
      expect(markEventProcessed).toHaveBeenCalled();
    });
  });

  describe('Payment Status Handling', () => {
    it('should handle successful payment', async () => {
      const { updateLeadPaymentStatus } = await import('@/lib/supabase');
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      const body = createPayUWebhookPayload({ status: 'success' });
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      await POST(request);

      expect(updateLeadPaymentStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          paymentId: 'PAY_123456',
          amount: 4999,
          gateway: 'payu',
          status: 'paid',
        })
      );
      expect(syncToWixCRM).toHaveBeenCalled();
    });

    it('should handle failed payment', async () => {
      const { markPaymentFailed } = await import('@/lib/supabase');
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      const body = createPayUWebhookPayload({ status: 'failure' });
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      await POST(request);

      expect(markPaymentFailed).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
        'payu'
      );
      expect(syncToWixCRM).not.toHaveBeenCalled();
    });

    it('should handle unknown status gracefully', async () => {
      const body = createPayUWebhookPayload({ status: 'pending' });
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const request = new Request('http://localhost:3000/api/webhooks/payu', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer test_webhook_secret',
        },
        body: 'not valid json',
      });

      const response = await POST(request as any);

      // Should return 200 to prevent retries
      expect(response.status).toBe(200);
    });

    it('should handle CRM sync failures gracefully', async () => {
      const { syncToWixCRM } = await import('@/lib/wix-crm');
      vi.mocked(syncToWixCRM).mockRejectedValueOnce(new Error('CRM error'));

      const body = createPayUWebhookPayload();
      const request = createMockRequest({
        url: 'http://localhost:3000/api/webhooks/payu',
        body,
        headers: { authorization: 'Bearer test_webhook_secret' },
      });

      const response = await POST(request);

      // Should still return 200 despite CRM failure
      expect(response.status).toBe(200);
    });
  });
});
