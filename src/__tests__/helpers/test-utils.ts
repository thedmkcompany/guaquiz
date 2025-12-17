import { NextRequest } from 'next/server';
import { vi } from 'vitest';

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  formData?: Record<string, string>;
}): NextRequest {
  const {
    method = 'POST',
    url = 'http://localhost:3000/api/test',
    body,
    headers = {},
    formData,
  } = options;

  const reqHeaders = new Headers({
    'content-type': body ? 'application/json' : formData ? 'application/x-www-form-urlencoded' : 'text/plain',
    'x-forwarded-for': '127.0.0.1',
    ...headers,
  });

  let reqBody: string | FormData | undefined;
  if (body) {
    reqBody = JSON.stringify(body);
  } else if (formData) {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
    reqBody = fd as unknown as string;
  }

  return new NextRequest(url, {
    method,
    headers: reqHeaders,
    body: reqBody,
  });
}

/**
 * Create a mock request with raw text body (for webhooks)
 */
export function createMockTextRequest(options: {
  method?: string;
  url?: string;
  body: string;
  headers?: Record<string, string>;
}): NextRequest {
  const { method = 'POST', url = 'http://localhost:3000/api/test', body, headers = {} } = options;

  return new NextRequest(url, {
    method,
    headers: new Headers({
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
      ...headers,
    }),
    body,
  });
}

/**
 * Parse JSON response from NextResponse
 */
export async function getResponseJson<T = Record<string, unknown>>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

/**
 * Mock environment variables for testing
 */
export function mockEnv(vars: Record<string, string | undefined>) {
  const originalEnv = { ...process.env };

  Object.entries(vars).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });

  return () => {
    Object.keys(vars).forEach((key) => {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    });
  };
}

/**
 * Reset all mocks
 */
export function resetAllMocks() {
  vi.resetAllMocks();
  vi.clearAllMocks();
}

/**
 * Common test data
 */
export const TEST_DATA = {
  validEmail: 'test@example.com',
  validPhone: '+919876543210',
  validName: 'Test User',
  validAmount: 4999,
  programs: {
    essentials: { id: 'essentials', name: 'Essentials Program', price: 4999 },
    transform: { id: 'transform', name: 'Transform Program', price: 49999 },
    circle: { id: 'circle', name: 'The Circle', price: 999 },
  },
};

/**
 * Create valid quiz submission data
 */
export function createQuizSubmission(overrides: Partial<{
  name: string;
  email: string;
  whatsapp: string;
  recommendation: string;
  answers: Record<string, string[]>;
  deviceType: string;
}> = {}) {
  return {
    name: TEST_DATA.validName,
    email: TEST_DATA.validEmail,
    whatsapp: TEST_DATA.validPhone,
    recommendation: 'essentials',
    answers: { q1: ['a'], q2: ['b'] },
    deviceType: 'desktop',
    ...overrides,
  };
}

/**
 * Create valid payment request data
 */
export function createPaymentRequest(overrides: Partial<{
  programId: string;
  programName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
}> = {}) {
  return {
    programId: 'essentials',
    programName: 'Essentials Program',
    amount: TEST_DATA.validAmount,
    customerEmail: TEST_DATA.validEmail,
    customerName: TEST_DATA.validName,
    customerPhone: TEST_DATA.validPhone,
    ...overrides,
  };
}
