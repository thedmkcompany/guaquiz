/**
 * Shared Validation Utilities
 * Centralized validation logic for payment APIs
 */

import { NextResponse } from 'next/server';
import { getProgramById } from './programs';

// ============================================
// TYPES
// ============================================

export interface PaymentRequestBody {
  amount: number;
  programId: string;
  programName?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: NextResponse;
  data?: PaymentRequestBody;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate required fields for payment request
 */
export function validateRequiredFields(body: Partial<PaymentRequestBody>): ValidationResult {
  const { amount, programId, customerEmail, customerName } = body;

  if (!amount || !programId || !customerEmail || !customerName) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      ),
    };
  }

  return { valid: true };
}

/**
 * Validate amount is a positive number
 */
export function validateAmount(amount: unknown): ValidationResult {
  if (typeof amount !== 'number' || amount <= 0) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      ),
    };
  }

  return { valid: true };
}

/**
 * Validate program exists and amount matches program price
 */
export function validateProgramAndPrice(
  programId: string,
  amount: number,
  context?: { ip?: string; email?: string }
): ValidationResult {
  const program = getProgramById(programId);

  if (!program) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Invalid program' },
        { status: 400 }
      ),
    };
  }

  if (amount !== program.price) {
    console.error('[SECURITY] Price manipulation attempt:', {
      programId,
      expectedPrice: program.price,
      receivedAmount: amount,
      ip: context?.ip ? maskIP(context.ip) : 'unknown',
      email: context?.email ? maskEmail(context.email) : 'unknown',
    });

    return {
      valid: false,
      error: NextResponse.json(
        { error: 'Invalid amount for selected program' },
        { status: 400 }
      ),
    };
  }

  return { valid: true };
}

/**
 * Full payment request validation
 */
export function validatePaymentRequest(
  body: Partial<PaymentRequestBody>,
  context?: { ip?: string }
): ValidationResult {
  // Step 1: Check required fields
  const requiredCheck = validateRequiredFields(body);
  if (!requiredCheck.valid) return requiredCheck;

  // Step 2: Validate amount type
  const amountCheck = validateAmount(body.amount);
  if (!amountCheck.valid) return amountCheck;

  // Step 3: Validate program and price match
  const programCheck = validateProgramAndPrice(
    body.programId!,
    body.amount!,
    { ip: context?.ip, email: body.customerEmail }
  );
  if (!programCheck.valid) return programCheck;

  return {
    valid: true,
    data: body as PaymentRequestBody,
  };
}

// ============================================
// PRIVACY HELPERS (Mask PII in logs)
// ============================================

/**
 * Mask email for logging (test@example.com -> te***@example.com)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.substring(0, 2)}***@${domain}`;
}

/**
 * Mask IP for logging (192.168.1.100 -> 192.168.***.*)
 */
export function maskIP(ip: string): string {
  if (!ip) return '***';
  const parts = ip.split('.');
  if (parts.length !== 4) return ip.substring(0, 6) + '***';
  return `${parts[0]}.${parts[1]}.***.***`;
}

/**
 * Mask phone for logging (+919876543210 -> +91****3210)
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return '***';
  return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4);
}
