/**
 * Tests for Razorpay Webhook Handler
 * Tests: /api/webhooks/razorpay
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/webhooks/razorpay/route';
import { webhookPayloads } from '@/__tests__/mocks/payment.fixtures';

// Mock dependencies
vi.mock('@/lib/razorpay', () => ({
  verifyWebhookSignature: vi.fn((body, signature) => {
    return signature === 'valid_webhook_signature';
  }),
  paiseToRupees: vi.fn((paise) => paise / 100),
}));

vi.mock('@/lib/wix-crm', () => ({
  syncToWixCRM: vi.fn().mockResolvedValue({ success: true, contactId: 'contact_123' }),
}));

vi.mock('@/lib/webhook-store', () => ({
  isEventProcessed: vi.fn(() => false),
  markEventProcessed: vi.fn(),
}));

describe('POST /api/webhooks/razorpay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook_secret';
  });

  // ============================================
  // SUCCESS CASES
  // ============================================

  describe('Success Cases', () => {
    it('should process valid payment.captured webhook', async () => {
      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_123',
        },
        body: payload,
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });

    it('should sync to Wix CRM on payment captured', async () => {
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_123',
        },
        body: payload,
      });

      await POST(request as any);

      expect(syncToWixCRM).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          programId: 'essentials',
          isSubscription: false,
        })
      );
    });

    it('should handle payment.failed webhook', async () => {
      const payload = JSON.stringify(webhookPayloads.paymentFailed);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_failed_123',
        },
        body: payload,
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });

    it('should return 200 for unhandled events', async () => {
      const payload = JSON.stringify({
        ...webhookPayloads.paymentCaptured,
        event: 'order.created',
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_unhandled',
        },
        body: payload,
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });

  // ============================================
  // SECURITY TESTS
  // ============================================

  describe('Security', () => {
    it('should reject webhook with invalid signature', async () => {
      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'invalid_signature',
        },
        body: payload,
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid signature');
    });

    it('should reject webhook without signature', async () => {
      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid signature');
    });

    it('should prevent replay attacks', async () => {
      const { isEventProcessed } = await import('@/lib/webhook-store');

      vi.mocked(isEventProcessed).mockReturnValueOnce(true);

      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_duplicate',
        },
        body: payload,
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.duplicate).toBe(true);
    });

    it('should mark events as processed', async () => {
      const { markEventProcessed } = await import('@/lib/webhook-store');

      const payload = JSON.stringify(webhookPayloads.paymentCaptured);
      const eventId = 'evt_mark_processed';

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': eventId,
        },
        body: payload,
      });

      await POST(request as any);

      expect(markEventProcessed).toHaveBeenCalledWith(eventId, 'razorpay');
    });

    it('should handle webhook without event ID', async () => {
      const { markEventProcessed } = await import('@/lib/webhook-store');

      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: payload,
      });

      const response = await POST(request as any);

      expect(response.status).toBe(200);
      expect(markEventProcessed).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // ERROR HANDLING
  // ============================================

  describe('Error Handling', () => {
    it('should return 200 even on CRM sync failure', async () => {
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      vi.mocked(syncToWixCRM).mockRejectedValueOnce(new Error('CRM API error'));

      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_crm_fail',
        },
        body: payload,
      });

      const response = await POST(request as any);
      const data = await response.json();

      // Should still return 200 to prevent Razorpay retries
      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });

    it('should handle malformed JSON gracefully', async () => {
      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: 'invalid json{',
      });

      const response = await POST(request as any);
      const data = await response.json();

      // Should return 200 to prevent retries
      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(data.error).toBe('Processing error');
    });

    it('should handle missing payment entity', async () => {
      const payload = JSON.stringify({
        entity: 'event',
        event: 'payment.captured',
        payload: {}, // Missing payment entity
        created_at: Date.now(),
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: payload,
      });

      const response = await POST(request as any);

      // Should handle gracefully
      expect(response.status).toBe(200);
    });
  });

  // ============================================
  // SUBSCRIPTION EVENTS
  // ============================================

  describe('Subscription Events', () => {
    it('should handle subscription.activated event', async () => {
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      const payload = JSON.stringify({
        entity: 'event',
        event: 'subscription.activated',
        payload: {
          subscription: {
            entity: {
              id: 'sub_123',
              plan_id: 'plan_test',
              status: 'active',
              notes: {
                programId: 'circle',
                programName: 'Circle',
                customerEmail: 'sub@example.com',
                customerName: 'Sub User',
                customerPhone: '+919876543210',
              },
            },
          },
        },
        created_at: Date.now(),
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_sub_activated',
        },
        body: payload,
      });

      const response = await POST(request as any);

      expect(response.status).toBe(200);
      expect(syncToWixCRM).toHaveBeenCalledWith(
        expect.objectContaining({
          isSubscription: true,
          subscriptionId: 'sub_123',
        })
      );
    });

    it('should handle subscription.charged event', async () => {
      const payload = JSON.stringify({
        entity: 'event',
        event: 'subscription.charged',
        payload: {
          subscription: {
            entity: {
              id: 'sub_123',
              status: 'active',
            },
          },
          payment: {
            entity: {
              id: 'pay_recurring_123',
              amount: 449900,
            },
          },
        },
        created_at: Date.now(),
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: payload,
      });

      const response = await POST(request as any);
      expect(response.status).toBe(200);
    });

    it('should handle subscription.halted event', async () => {
      const payload = JSON.stringify({
        entity: 'event',
        event: 'subscription.halted',
        payload: {
          subscription: {
            entity: {
              id: 'sub_123',
              plan_id: 'plan_test',
              status: 'halted',
            },
          },
        },
        created_at: Date.now(),
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: payload,
      });

      const response = await POST(request as any);
      expect(response.status).toBe(200);
    });

    it('should handle subscription.cancelled event', async () => {
      const payload = JSON.stringify({
        entity: 'event',
        event: 'subscription.cancelled',
        payload: {
          subscription: {
            entity: {
              id: 'sub_123',
              plan_id: 'plan_test',
              status: 'cancelled',
              ended_at: Date.now(),
            },
          },
        },
        created_at: Date.now(),
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: payload,
      });

      const response = await POST(request as any);
      expect(response.status).toBe(200);
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty notes object', async () => {
      const payload = JSON.stringify({
        ...webhookPayloads.paymentCaptured,
        payload: {
          payment: {
            entity: {
              ...webhookPayloads.paymentCaptured.payload.payment.entity,
              notes: {},
            },
          },
        },
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: payload,
      });

      const response = await POST(request as any);
      expect(response.status).toBe(200);
    });

    it('should handle name parsing with single name', async () => {
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      const payload = JSON.stringify({
        ...webhookPayloads.paymentCaptured,
        payload: {
          payment: {
            entity: {
              ...webhookPayloads.paymentCaptured.payload.payment.entity,
              notes: {
                ...webhookPayloads.paymentCaptured.payload.payment.entity.notes,
                customerName: 'Singlename',
              },
            },
          },
        },
      });

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
        },
        body: payload,
      });

      await POST(request as any);

      expect(syncToWixCRM).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Singlename',
          lastName: '',
        })
      );
    });

    it('should handle concurrent webhook deliveries', async () => {
      const requests = Array(5)
        .fill(null)
        .map((_, i) => {
          const payload = JSON.stringify({
            ...webhookPayloads.paymentCaptured,
            payload: {
              payment: {
                entity: {
                  ...webhookPayloads.paymentCaptured.payload.payment.entity,
                  id: `pay_concurrent_${i}`,
                },
              },
            },
          });

          return new Request('http://localhost:3000/api/webhooks/razorpay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-razorpay-signature': 'valid_webhook_signature',
              'x-razorpay-event-id': `evt_concurrent_${i}`,
            },
            body: payload,
          });
        });

      const responses = await Promise.all(requests.map((req) => POST(req as any)));

      // All should succeed
      responses.forEach((res) => {
        expect(res.status).toBe(200);
      });
    });
  });

  // ============================================
  // PERFORMANCE
  // ============================================

  describe('Performance', () => {
    it('should respond quickly even with slow CRM sync', async () => {
      const { syncToWixCRM } = await import('@/lib/wix-crm');

      // Simulate slow CRM
      vi.mocked(syncToWixCRM).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );

      const payload = JSON.stringify(webhookPayloads.paymentCaptured);

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'valid_webhook_signature',
          'x-razorpay-event-id': 'evt_slow_crm',
        },
        body: payload,
      });

      const startTime = Date.now();
      const response = await POST(request as any);
      const duration = Date.now() - startTime;

      // Should respond quickly despite slow CRM
      expect(response.status).toBe(200);
      // Allow reasonable time for async operations
      expect(duration).toBeLessThan(200);
    });
  });
});
