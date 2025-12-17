import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockRequest, getResponseJson, mockEnv } from '../../helpers/test-utils';
import { GET } from '@/app/api/health/route';

// Mock external dependencies
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: vi.fn(),
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}));

vi.mock('@/lib/wix-crm', () => ({
  isWixConfigured: vi.fn(),
}));

// Mock fetch for Wix API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GET /api/health', () => {
  let restoreEnv: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    restoreEnv = mockEnv({
      WIX_API_KEY: 'test-api-key',
      WIX_SITE_ID: 'test-site-id',
      RAZORPAY_KEY_ID: 'test-razorpay-key',
      RAZORPAY_KEY_SECRET: 'test-razorpay-secret',
      PAYU_MERCHANT_KEY: 'test-payu-key',
      PAYU_SALT: 'test-payu-salt',
    });
  });

  afterEach(() => {
    restoreEnv();
  });

  it('should return health status with all services configured', async () => {
    const { isSupabaseConfigured } = await import('@/lib/supabase');
    const { isWixConfigured } = await import('@/lib/wix-crm');

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);
    vi.mocked(isWixConfigured).mockReturnValue(true);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ labels: [] }),
    });

    const request = createMockRequest({ method: 'GET', url: 'http://localhost:3000/api/health' });
    const response = await GET(request);
    const data = await getResponseJson(response);

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('supabase');
    expect(data).toHaveProperty('wix');
    expect(data).toHaveProperty('environment');
  });

  it('should return degraded status when Supabase is not configured', async () => {
    const { isSupabaseConfigured } = await import('@/lib/supabase');
    const { isWixConfigured } = await import('@/lib/wix-crm');

    vi.mocked(isSupabaseConfigured).mockReturnValue(false);
    vi.mocked(isWixConfigured).mockReturnValue(true);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ labels: [] }),
    });

    const request = createMockRequest({ method: 'GET', url: 'http://localhost:3000/api/health' });
    const response = await GET(request);
    const data = await getResponseJson<{ status: string }>(response);

    expect(data.status).toBe('degraded');
  });

  it('should return degraded status when Wix is not configured', async () => {
    const { isSupabaseConfigured } = await import('@/lib/supabase');
    const { isWixConfigured } = await import('@/lib/wix-crm');

    vi.mocked(isSupabaseConfigured).mockReturnValue(true);
    vi.mocked(isWixConfigured).mockReturnValue(false);

    const request = createMockRequest({ method: 'GET', url: 'http://localhost:3000/api/health' });
    const response = await GET(request);
    const data = await getResponseJson<{ status: string }>(response);

    expect(data.status).toBe('degraded');
  });

  it('should include environment information', async () => {
    const { isSupabaseConfigured } = await import('@/lib/supabase');
    const { isWixConfigured } = await import('@/lib/wix-crm');

    vi.mocked(isSupabaseConfigured).mockReturnValue(false);
    vi.mocked(isWixConfigured).mockReturnValue(false);

    const request = createMockRequest({ method: 'GET', url: 'http://localhost:3000/api/health' });
    const response = await GET(request);
    const data = await getResponseJson<{ environment: { hasRazorpay: boolean; hasPayU: boolean } }>(response);

    expect(data.environment).toHaveProperty('hasRazorpay');
    expect(data.environment).toHaveProperty('hasPayU');
    expect(data.environment.hasRazorpay).toBe(true);
    expect(data.environment.hasPayU).toBe(true);
  });
});
