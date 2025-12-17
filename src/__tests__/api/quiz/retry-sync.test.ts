import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, getResponseJson } from '../../helpers/test-utils';

// Set env vars BEFORE imports
process.env.CRON_SECRET = 'test-cron-secret';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: vi.fn(() => true),
  getPendingLeads: vi.fn(() => Promise.resolve([])),
  updateLeadSyncStatus: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/lib/wix-crm', () => ({
  createQuizLeadAsync: vi.fn(() => Promise.resolve({ success: true, contactId: 'test-id' })),
}));

describe('/api/quiz/retry-sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST - Authentication', () => {
    it('should reject request without authorization header', async () => {
      const { POST } = await import('@/app/api/quiz/retry-sync/route');

      const request = createMockRequest({
        url: 'http://localhost:3000/api/quiz/retry-sync',
      });

      const response = await POST(request);
      const data = await getResponseJson<{ error: string }>(response);

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject request with invalid bearer token', async () => {
      const { POST } = await import('@/app/api/quiz/retry-sync/route');

      const request = createMockRequest({
        url: 'http://localhost:3000/api/quiz/retry-sync',
        headers: { authorization: 'Bearer wrong-secret' },
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('should accept request with valid bearer token', async () => {
      const { POST } = await import('@/app/api/quiz/retry-sync/route');

      const request = createMockRequest({
        url: 'http://localhost:3000/api/quiz/retry-sync',
        headers: { authorization: 'Bearer test-cron-secret' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('GET - Authentication', () => {
    it('should reject unauthorized requests', async () => {
      const { GET } = await import('@/app/api/quiz/retry-sync/route');

      const request = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/quiz/retry-sync',
      });

      const response = await GET(request);
      expect(response.status).toBe(401);
    });
  });
});
