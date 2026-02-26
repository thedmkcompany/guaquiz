import crypto from 'crypto';

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || '';
const PAYU_SALT = process.env.PAYU_SALT || '';

// ============================================
// HASH GENERATION
// ============================================

/**
 * Generate hash for PayU payment request
 * Hash formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePaymentHash(params: {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
  } = params;

  const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`;

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Verify hash from PayU callback/webhook
 * Reverse hash formula: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPaymentHash(params: {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  status: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}): boolean {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    hash,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    additionalCharges = '',
  } = params;

  // Handle additional charges if present
  let hashString: string;
  if (additionalCharges) {
    hashString = `${PAYU_SALT}|${status}|${additionalCharges}|||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
  } else {
    hashString = `${PAYU_SALT}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
  }

  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash.toLowerCase()),
      Buffer.from(hash.toLowerCase())
    );
  } catch {
    return false;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate unique transaction ID
 */
export function generateTxnId(): string {
  return `TXN${Date.now()}${crypto.randomUUID().slice(0, 9).toUpperCase()}`;
}

/**
 * Get PayU payment URL based on environment
 */
export function getPayUUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment';
}

/**
 * Verify webhook authorization header (timing-safe)
 */
export function verifyWebhookAuth(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const webhookSecret = process.env.PAYU_WEBHOOK_SECRET;
  if (!webhookSecret) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(authHeader),
      Buffer.from(webhookSecret)
    );
  } catch {
    return false;
  }
}

/**
 * Get PayU merchant key (for payment params)
 */
export function getMerchantKey(): string {
  return PAYU_MERCHANT_KEY;
}

/**
 * Check if PayU is configured
 */
export function isPayUConfigured(): boolean {
  return !!(PAYU_MERCHANT_KEY && PAYU_SALT);
}

// ============================================
// RECURRING PAYMENTS (SI - Standing Instructions)
// ============================================

/**
 * Generate hash for PayU Standing Instruction (recurring payment)
 * Note: PayU SI requires additional parameters
 */
export function generateSIHash(params: {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  si: string; // '1' for SI transaction
  si_details: string; // JSON string with SI details
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    si,
    si_details,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
  } = params;

  // SI hash includes si and si_details
  const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|||||${si}|${si_details}|${PAYU_SALT}`;

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Create SI (Standing Instruction) details for recurring payments
 */
export function createSIDetails(params: {
  billingAmount: number; // Amount to be charged per cycle
  billingCurrency: string;
  billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ADHOC';
  billingInterval: number; // Interval between charges
  paymentStartDate: Date; // When recurring payments should start
  paymentEndDate: Date; // When recurring payments should end
  remarksOnDebit?: string;
}): string {
  const siDetails = {
    billingAmount: params.billingAmount.toString(),
    billingCurrency: params.billingCurrency,
    billingCycle: params.billingCycle,
    billingInterval: params.billingInterval.toString(),
    paymentStartDate: formatDate(params.paymentStartDate),
    paymentEndDate: formatDate(params.paymentEndDate),
    remarksOnDebit: params.remarksOnDebit || 'Subscription Payment',
  };

  return JSON.stringify(siDetails);
}

/**
 * Format date for PayU SI (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ============================================
// PAYMENT STATUS CHECK
// ============================================

/**
 * Check payment status via PayU API
 * Note: This requires additional API setup with PayU
 */
export async function checkPaymentStatus(txnid: string): Promise<{
  status: string;
  amount: string;
  transactionId: string;
} | null> {
  try {
    const command = 'verify_payment';
    const hashString = `${PAYU_MERCHANT_KEY}|${command}|${txnid}|${PAYU_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const formData = new URLSearchParams();
    formData.append('key', PAYU_MERCHANT_KEY);
    formData.append('command', command);
    formData.append('var1', txnid);
    formData.append('hash', hash);

    const apiUrl = process.env.NODE_ENV === 'production'
      ? 'https://info.payu.in/merchant/postservice?form=2'
      : 'https://test.payu.in/merchant/postservice?form=2';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.status === 1 && data.transaction_details) {
      const txnDetails = data.transaction_details[txnid];
      return {
        status: txnDetails.status,
        amount: txnDetails.amt,
        transactionId: txnDetails.mihpayid,
      };
    }

    return null;
  } catch (error) {
    console.error('PayU status check error:', error);
    return null;
  }
}
