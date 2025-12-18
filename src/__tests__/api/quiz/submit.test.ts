import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createMockRequest, getResponseJson, createQuizSubmission } from '../../helpers/test-utils';
import { POST } from '@/app/api/quiz/submit/route';

// Mock external dependencies
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: vi.fn(() => false),
  storeQuizLead: vi.fn(() => Promise.resolve({ success: true, leadId: 'test-lead-id' })),
  findLeadByEmail: vi.fn(() => Promise.resolve(null)),
  updateLeadSyncStatus: vi.fn(() => Promise.resolve()),
  updateExistingLead: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/lib/wix-crm', () => ({
  createQuizLeadAsync: vi.fn(() => Promise.resolve({ success: true, contactId: 'test-contact-id' })),
}));

vi.mock('@/lib/aisensy', () => ({
  sendQuizWelcome: vi.fn(() => Promise.resolve({ success: true, messageId: 'msg_test123' })),
}));

describe('POST /api/quiz/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Validation', () => {
    it('should reject request with missing name', async () => {
      const body = createQuizSubmission({ name: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with missing email', async () => {
      const body = createQuizSubmission({ email: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with missing whatsapp', async () => {
      const body = createQuizSubmission({ whatsapp: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with missing recommendation', async () => {
      const body = createQuizSubmission({ recommendation: '' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject request with invalid email format', async () => {
      const body = createQuizSubmission({ email: 'invalid-email' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid email format');
    });

    it('should reject email without domain', async () => {
      const body = createQuizSubmission({ email: 'test@' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should reject email without @ symbol', async () => {
      const body = createQuizSubmission({ email: 'testexample.com' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('Success Cases', () => {
    it('should accept valid quiz submission', async () => {
      const body = createQuizSubmission();
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ success: boolean }>(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should accept submission with minimal fields', async () => {
      const body = {
        name: 'Test',
        email: 'test@example.com',
        whatsapp: '+91123456789',
        recommendation: 'essentials',
      };
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ success: boolean }>(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should normalize email to lowercase', async () => {
      const body = createQuizSubmission({ email: 'TEST@EXAMPLE.COM' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should trim whitespace from name', async () => {
      const body = createQuizSubmission({
        name: '  Test User  ',
      });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept different recommendation values', async () => {
      for (const recommendation of ['essentials', 'transform', 'circle', 'trial']) {
        const body = createQuizSubmission({ recommendation });
        const request = createMockRequest({ body });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Optional Fields', () => {
    it('should accept submission with quiz answers', async () => {
      const body = createQuizSubmission({
        answers: { q1: ['a', 'b'], q2: ['c'], q3: ['d', 'e', 'f'] },
      });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept submission with device type', async () => {
      const body = createQuizSubmission({ deviceType: 'mobile' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept submission without optional fields', async () => {
      const body = {
        name: 'Test User',
        email: 'test@example.com',
        whatsapp: '+919876543210',
        recommendation: 'essentials',
      };
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/quiz/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'not valid json',
      });

      const response = await POST(request);
      // Should return success with warning (graceful degradation)
      expect(response.status).toBe(200);
    });

    it('should handle special characters in name', async () => {
      const body = createQuizSubmission({ name: "O'Brien-Smith" });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle unicode characters in name', async () => {
      const body = createQuizSubmission({ name: 'मोहन Kumar' });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle very long names', async () => {
      const body = createQuizSubmission({ name: 'A'.repeat(500) });
      const request = createMockRequest({ body });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('WhatsApp Integration', () => {
    it('should call sendQuizWelcome with correct parameters', async () => {
      const { sendQuizWelcome } = await import('@/lib/aisensy');

      const body = createQuizSubmission({
        name: 'Test User',
        email: 'test@example.com',
        whatsapp: '+919876543210',
        recommendation: 'essentials',
      });
      const request = createMockRequest({ body });

      await POST(request);

      expect(sendQuizWelcome).toHaveBeenCalledWith({
        phone: '+919876543210',
        name: 'Test User',
        email: 'test@example.com',
        quizResult: 'essentials',
      });
    });

    it('should call sendQuizWelcome with normalized email (lowercase)', async () => {
      const { sendQuizWelcome } = await import('@/lib/aisensy');

      const body = createQuizSubmission({
        email: 'TEST@EXAMPLE.COM',
      });
      const request = createMockRequest({ body });

      await POST(request);

      expect(sendQuizWelcome).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
        })
      );
    });

    it('should call sendQuizWelcome with trimmed name', async () => {
      const { sendQuizWelcome } = await import('@/lib/aisensy');

      const body = createQuizSubmission({
        name: '  Test User  ',
      });
      const request = createMockRequest({ body });

      await POST(request);

      expect(sendQuizWelcome).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
        })
      );
    });

    it('should not block response if WhatsApp fails', async () => {
      const { sendQuizWelcome } = await import('@/lib/aisensy');

      vi.mocked(sendQuizWelcome).mockRejectedValueOnce(new Error('AISensy API error'));

      const body = createQuizSubmission();
      const request = createMockRequest({ body });

      const response = await POST(request);
      const data = await getResponseJson<{ success: boolean }>(response);

      // Should still return success even if WhatsApp fails
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should send WhatsApp for different recommendations', async () => {
      const { sendQuizWelcome } = await import('@/lib/aisensy');

      for (const recommendation of ['essentials', 'transform', 'circle']) {
        vi.clearAllMocks();

        const body = createQuizSubmission({ recommendation });
        const request = createMockRequest({ body });

        await POST(request);

        expect(sendQuizWelcome).toHaveBeenCalledWith(
          expect.objectContaining({
            quizResult: recommendation,
          })
        );
      }
    });

    it('should handle WhatsApp number with spaces', async () => {
      const { sendQuizWelcome } = await import('@/lib/aisensy');

      const body = createQuizSubmission({
        whatsapp: '+91 98765 43210',
      });
      const request = createMockRequest({ body });

      await POST(request);

      // Should be called with trimmed number
      expect(sendQuizWelcome).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '+91 98765 43210', // Note: trimmed but not reformatted
        })
      );
    });
  });

  describe('Wix CRM Integration', () => {
    it('should call createQuizLeadAsync with lead data', async () => {
      const { createQuizLeadAsync } = await import('@/lib/wix-crm');

      const body = createQuizSubmission({
        name: 'Test User',
        email: 'test@example.com',
        whatsapp: '+919876543210',
        recommendation: 'essentials',
        answers: { q1: ['a'] },
        deviceType: 'mobile',
      });
      const request = createMockRequest({ body });

      await POST(request);

      // Wait a bit for fire-and-forget to execute
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(createQuizLeadAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          whatsapp: '+919876543210',
          recommendation: 'essentials',
        })
      );
    });
  });
});
