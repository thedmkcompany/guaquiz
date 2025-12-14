/**
 * Test Utilities and Helpers
 * Reusable utilities for API testing
 */

import { NextRequest } from 'next/server';

// ============================================
// COMMON RESPONSE TYPES
// ============================================

export interface APISuccessResponse {
  success?: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  receipt?: string;
  keyId?: string;
  verified?: boolean;
  paymentId?: string;
  subscriptionId?: string;
  status?: string;
  paymentUrl?: string;
  params?: Record<string, string>;
  received?: boolean;
  duplicate?: boolean;
  [key: string]: unknown;
}

export interface APIErrorResponse {
  error: string;
  code?: string;
  verified?: boolean;
  [key: string]: unknown;
}

/**
 * Create a mock NextRequest for testing
 */
export function createMockRequest(options: {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  url?: string;
  ip?: string;
}): NextRequest {
  const {
    method = 'POST',
    body = {},
    headers = {},
    url = 'http://localhost:3000/api/test',
    ip = '127.0.0.1',
  } = options;

  const request = new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  // Mock IP address
  Object.defineProperty(request, 'ip', { value: ip });

  return request;
}

/** Common API response type */
export type APIResponse = APISuccessResponse & APIErrorResponse;

/**
 * Extract JSON response from NextResponse
 */
export async function getResponseJson<T = APIResponse>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

/**
 * Mock environment variables for testing
 */
export function mockEnv(vars: Record<string, string>) {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    Object.assign(process.env, vars);
  });

  afterEach(() => {
    process.env = originalEnv;
  });
}

/**
 * Sleep utility for async tests
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate random email for testing
 */
export function randomEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

/**
 * Generate random phone number
 */
export function randomPhone(): string {
  return `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}
