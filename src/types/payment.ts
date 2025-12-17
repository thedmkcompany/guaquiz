// ============================================
// RAZORPAY TYPES
// ============================================

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpaySubscriptionResponse {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: RazorpayPaymentEntity;
    };
    subscription?: {
      entity: RazorpaySubscriptionEntity;
    };
    order?: {
      entity: RazorpayOrder;
    };
  };
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description: string;
  email: string;
  contact: string;
  notes: Record<string, string>;
  created_at: number;
  captured: boolean;
}

export interface RazorpaySubscriptionEntity {
  id: string;
  entity: string;
  plan_id: string;
  status: string;
  current_start: number;
  current_end: number;
  ended_at: number | null;
  quantity: number;
  notes: Record<string, string>;
  charge_at: number;
  offer_id: string | null;
  short_url: string;
  has_scheduled_changes: boolean;
  change_scheduled_at: number | null;
  source: string;
  payment_method: string;
  customer_id: string;
  created_at: number;
}

// Razorpay Plan for Subscriptions
export interface RazorpayPlan {
  id: string;
  entity: string;
  interval: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  item: {
    id: string;
    active: boolean;
    amount: number;
    unit_amount: number;
    currency: string;
    name: string;
    description: string;
  };
  notes: Record<string, string>;
  created_at: number;
}

export interface CreateOrderRequest {
  amount: number;
  programId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  isSubscription?: boolean;
}

export interface CreateSubscriptionRequest {
  planId: string; // Razorpay Plan ID
  programId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  totalCount?: number; // Total billing cycles
}

// ============================================
// PAYU TYPES
// ============================================

export interface PayUPaymentParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  lastname?: string;
  udf1?: string; // programId
  udf2?: string; // subscriptionType
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PayUCallbackParams {
  mihpayid: string;
  status: 'success' | 'failure' | 'pending';
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  hash: string;
  error?: string;
  error_Message?: string;
  bank_ref_num?: string;
  bankcode?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}

export interface PayUWebhookPayload {
  mihpayid: string;
  status: string;
  txnid: string;
  amount: string;
  email: string;
  phone: string;
  productinfo: string;
  firstname: string;
  udf1?: string;
  udf2?: string;
}

// ============================================
// WIX CRM TYPES
// ============================================

export interface WixCustomerData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  programId: string;
  programName: string;
  paymentId: string;
  amount: number;
  isSubscription: boolean;
  subscriptionId?: string;
  programStartDate?: string;
  startDateOption?: string;
}

export interface WixContact {
  _id: string;
  info: {
    name: {
      first: string;
      last: string;
    };
    emails: {
      items: Array<{ email: string }>;
    };
    phones: {
      items: Array<{ phone: string }>;
    };
  };
}

// ============================================
// PAYMENT GATEWAY SELECTION
// ============================================

export type PaymentGateway = 'razorpay' | 'payu';

export interface PaymentConfig {
  gateway: PaymentGateway;
  isSubscription: boolean;
  amount: number;
  programId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}
