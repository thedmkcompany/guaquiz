/**
 * Razorpay Mock Data
 * Mock responses for Razorpay API
 */

import { createHmac } from 'crypto';
import type { RazorpayOrder, RazorpayPaymentEntity } from '@/types/payment';
import { vi } from 'vitest';

/**
 * Mock Razorpay Order
 */
export const mockRazorpayOrder: RazorpayOrder = {
  id: 'order_test123',
  entity: 'order',
  amount: 249900, // ₹2,499 in paise
  amount_paid: 0,
  amount_due: 249900,
  currency: 'INR',
  receipt: 'rcpt_test_123',
  status: 'created',
  created_at: Date.now(),
  notes: {
    programId: 'essentials',
    programName: 'Essentials',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
};

/**
 * Mock Razorpay Payment
 */
export const mockRazorpayPayment: RazorpayPaymentEntity = {
  id: 'pay_test123',
  entity: 'payment',
  amount: 249900,
  currency: 'INR',
  status: 'captured',
  order_id: 'order_test123',
  method: 'card',
  description: 'Payment for Essentials',
  email: 'test@example.com',
  contact: '+919876543210',
  notes: {
    programId: 'essentials',
    programName: 'Essentials',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
  },
  created_at: Date.now(),
  captured: true,
};

/**
 * Mock Razorpay SDK
 */
export const mockRazorpay = {
  orders: {
    create: vi.fn().mockResolvedValue(mockRazorpayOrder),
    fetch: vi.fn().mockResolvedValue(mockRazorpayOrder),
  },
  payments: {
    fetch: vi.fn().mockResolvedValue(mockRazorpayPayment),
  },
  subscriptions: {
    create: vi.fn(),
    fetch: vi.fn(),
    cancel: vi.fn(),
  },
  plans: {
    create: vi.fn(),
    all: vi.fn(),
  },
};

/**
 * Valid Razorpay payment signature
 */
export function generateValidSignature(orderId: string, paymentId: string): string {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
  const body = `${orderId}|${paymentId}`;
  return createHmac('sha256', secret).update(body).digest('hex');
}

/**
 * Valid webhook signature
 */
export function generateValidWebhookSignature(body: string): string {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
  return createHmac('sha256', secret).update(body).digest('hex');
}
