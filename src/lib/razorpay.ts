import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// ============================================
// ONE-TIME PAYMENTS
// ============================================

/**
 * Create a Razorpay order for one-time payment
 */
export async function createOrder(
  amount: number, // Amount in rupees
  receipt: string,
  notes?: Record<string, string>
) {
  const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt,
    notes: notes || {},
  });

  return order;
}

/**
 * Fetch order details
 */
export async function fetchOrder(orderId: string) {
  const razorpay = getRazorpayInstance();
  return razorpay.orders.fetch(orderId);
}

/**
 * Fetch payment details
 */
export async function fetchPayment(paymentId: string) {
  const razorpay = getRazorpayInstance();
  return razorpay.payments.fetch(paymentId);
}

// ============================================
// SUBSCRIPTIONS (RECURRING PAYMENTS)
// ============================================

/**
 * Create a Razorpay Plan for subscriptions
 * Plans are templates for subscriptions
 */
export async function createPlan(params: {
  name: string;
  description: string;
  amount: number; // Amount in rupees
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // e.g., 1 for every month, 3 for every 3 months
  notes?: Record<string, string>;
}) {
  const razorpay = getRazorpayInstance();

  const plan = await razorpay.plans.create({
    period: params.period,
    interval: params.interval,
    item: {
      name: params.name,
      description: params.description,
      amount: Math.round(params.amount * 100), // Convert to paise
      currency: 'INR',
    },
    notes: params.notes || {},
  });

  return plan;
}

/**
 * Fetch all plans
 */
export async function fetchPlans() {
  const razorpay = getRazorpayInstance();
  return razorpay.plans.all();
}

/**
 * Create a subscription for a customer
 */
export async function createSubscription(params: {
  planId: string;
  totalCount?: number; // Total billing cycles (e.g., 12 for 12 months)
  customerNotify?: boolean;
  notes?: Record<string, string>;
}) {
  const razorpay = getRazorpayInstance();

  const subscription = await razorpay.subscriptions.create({
    plan_id: params.planId,
    total_count: params.totalCount || 12, // Default 12 billing cycles
    customer_notify: params.customerNotify !== false ? 1 : 0,
    notes: params.notes || {},
  });

  return subscription;
}

/**
 * Create subscription registration link for UPI AutoPay or Card subscriptions
 * This allows customers to set up recurring mandate before subscription starts
 */
export async function createSubscriptionRegistrationLink(params: {
  planId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod?: 'upi' | 'card' | 'emandate'; // Optional - let customer choose if not specified
  maxAmount?: number; // For UPI: max ₹15,000, for cards: first payment amount
  totalCount?: number;
  notes?: Record<string, string>;
  expireBy?: number; // Unix timestamp
}) {
  const razorpay = getRazorpayInstance();

  // Base registration link config
  const registrationConfig: any = {
    customer: {
      name: params.customerName,
      email: params.customerEmail,
      contact: params.customerPhone,
    },
    type: 'link',
    amount: params.maxAmount || 0, // 0 for registration, actual charge on first cycle
    currency: 'INR',
    description: `Subscription registration for ${params.planId}`,
    subscription_registration: {
      method: params.paymentMethod || 'emandate', // emandate allows multiple payment methods
      max_amount: params.maxAmount || 50000, // Default ₹500 for safety
      expire_at: params.expireBy || Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
    },
    receipt: `reg_${Date.now()}`,
    email_notify: true,
    sms_notify: true,
    expire_by: params.expireBy || Math.floor(Date.now() / 1000) + 86400 * 30,
    notes: {
      plan_id: params.planId,
      total_count: String(params.totalCount || 12),
      ...(params.notes || {}),
    },
  };

  // UPI-specific config
  if (params.paymentMethod === 'upi') {
    registrationConfig.subscription_registration.method = 'upi';
    registrationConfig.subscription_registration.max_amount = Math.min(
      params.maxAmount || 15000,
      15000
    ); // UPI limit
  }

  const registrationLink = await razorpay.subscriptions.createRegistrationLink(
    registrationConfig
  );

  return registrationLink;
}

/**
 * Fetch subscription details
 */
export async function fetchSubscription(subscriptionId: string) {
  const razorpay = getRazorpayInstance();
  return razorpay.subscriptions.fetch(subscriptionId);
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtCycleEnd: boolean = true
) {
  const razorpay = getRazorpayInstance();
  return razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
}

/**
 * Pause a subscription
 */
export async function pauseSubscription(subscriptionId: string) {
  const razorpay = getRazorpayInstance();
  return razorpay.subscriptions.pause(subscriptionId);
}

/**
 * Resume a paused subscription
 */
export async function resumeSubscription(subscriptionId: string) {
  const razorpay = getRazorpayInstance();
  return razorpay.subscriptions.resume(subscriptionId);
}

// ============================================
// SIGNATURE VERIFICATION
// ============================================

/**
 * Verify payment signature (for one-time payments)
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const body = orderId + '|' + paymentId;

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

/**
 * Verify subscription signature
 */
export function verifySubscriptionSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const body = paymentId + '|' + subscriptionId;

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate unique receipt/transaction ID
 */
export function generateReceiptId(): string {
  return `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get Razorpay public key (safe for client-side)
 */
export function getPublicKey(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
}

/**
 * Format amount from paise to rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Format amount from rupees to paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
