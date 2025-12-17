import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, getResponseJson } from '../../helpers/test-utils';

// Set env vars before imports
process.env.ADMIN_USER = 'admin';
process.env.ADMIN_PASSWORD = 'secret123';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: vi.fn(() => true),
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        then: vi.fn((cb) =>
          cb({
            data: [
              { wix_sync_status: 'synced', payment_status: 'paid' },
              { wix_sync_status: 'pending', payment_status: null },
            ],
            error: null,
          })
        ),
        order: vi.fn(() => ({
          limit: vi.fn(() =>
            Promise.resolve({
              data: [],
              error: null,
            })
          ),
        })),
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() =>
                Promise.resolve({
                  data: [],
                  error: null,
                })
              ),
            })),
          })),
        })),
        gte: vi.fn(() => ({
          order: vi.fn(() =>
            Promise.resolve({
              data: [],
              error: null,
            })
          ),
        })),
      })),
    })),
  },
}));

describe('GET /api/admin/sync-status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should reject request without authorization header', async () => {
      const { GET } = await import('@/app/api/admin/sync-status/route');

      const request = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/sync-status',
      });

      const response = await GET(request);

      expect(response.status).toBe(401);
      expect(response.headers.get('WWW-Authenticate')).toBe('Basic realm="Admin Area"');
    });

    it('should reject request with invalid credentials', async () => {
      const { GET } = await import('@/app/api/admin/sync-status/route');

      const credentials = Buffer.from('admin:wrongpassword').toString('base64');
      const request = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/sync-status',
        headers: { authorization: `Basic ${credentials}` },
      });

      const response = await GET(request);
      expect(response.status).toBe(401);
    });

    it('should accept request with valid credentials', async () => {
      const { GET } = await import('@/app/api/admin/sync-status/route');

      const credentials = Buffer.from('admin:secret123').toString('base64');
      const request = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/sync-status',
        headers: { authorization: `Basic ${credentials}` },
      });

      const response = await GET(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Response', () => {
    it('should return sync status data', async () => {
      const { GET } = await import('@/app/api/admin/sync-status/route');

      const credentials = Buffer.from('admin:secret123').toString('base64');
      const request = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/sync-status',
        headers: { authorization: `Basic ${credentials}` },
      });

      const response = await GET(request);
      const data = await getResponseJson<{ success: boolean; stats: Record<string, number> }>(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.stats).toBeDefined();
    });
  });
});
