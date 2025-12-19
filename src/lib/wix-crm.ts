/**
 * @fileoverview Wix CRM Integration
 *
 * Handles synchronization of leads and customers to Wix CRM, including:
 * - Contact creation and updates
 * - Member account creation with password setup emails
 * - Pricing plan assignment
 * - Label management
 * - Automation webhook triggers
 *
 * @module wix-crm
 *
 * ## Architecture
 *
 * Uses a fire-and-forget pattern for quiz leads:
 * 1. Store in Supabase immediately (guaranteed)
 * 2. Async sync to Wix (background)
 * 3. Cron job retries failures
 *
 * ## Resilience Features
 *
 * - **Retry with Backoff**: 3 attempts with exponential delays (1s, 2s, 4s)
 * - **Timeout Protection**: 10-second request timeout
 * - **Label Caching**: 5-minute cache for label lookups
 * - **Duplicate Prevention**: Email-based contact deduplication
 *
 * ## Configuration
 *
 * Requires environment variables:
 * - `WIX_API_KEY`: Wix API key with contacts/members permissions
 * - `WIX_SITE_ID`: Wix site identifier
 *
 * @example
 * ```typescript
 * import { createQuizLeadAsync, syncToWixCRM } from '@/lib/wix-crm';
 *
 * // Fire-and-forget quiz lead (never throws)
 * createQuizLeadAsync({
 *   name: 'Jane Doe',
 *   email: 'jane@example.com',
 *   whatsapp: '+919876543210',
 *   recommendation: 'circle'
 * });
 *
 * // Full sync after payment
 * const result = await syncToWixCRM({
 *   email: 'jane@example.com',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   programId: 'circle',
 *   programName: 'Circle',
 *   paymentId: 'pay_123',
 *   amount: 4499,
 *   isSubscription: false
 * });
 * ```
 */

import type { WixCustomerData } from '@/types/payment';
import { getProgramById } from './programs';

/** Wix API key from environment */
const WIX_API_KEY = process.env.WIX_API_KEY || '';
/** Wix site identifier from environment */
const WIX_SITE_ID = process.env.WIX_SITE_ID || '';
/** Wix API base URL */
const WIX_API_BASE = 'https://www.wixapis.com';

// Validate environment variables at module load (warnings only, don't break)
if (typeof window === 'undefined') {
  if (!process.env.WIX_API_KEY) {
    console.warn('[Wix CRM] WIX_API_KEY not configured - CRM sync will be skipped');
  }
  if (!process.env.WIX_SITE_ID) {
    console.warn('[Wix CRM] WIX_SITE_ID not configured - CRM sync will be skipped');
  }
}

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Capitalize first letter of a string
 * Used for creating label names like "Quiz Circle" from "circle"
 */
function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================
// LABEL CACHE (Performance optimization)
// ============================================
// Labels rarely change, so we cache them to avoid repeated API calls
const LABEL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const LABEL_CACHE_CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
const labelCache = new Map<string, { key: string; expires: number }>();
let lastLabelCacheCleanup = Date.now();

/**
 * Remove expired entries from the label cache to prevent memory leaks.
 */
function cleanupLabelCache(): void {
  const now = Date.now();
  if (now - lastLabelCacheCleanup < LABEL_CACHE_CLEANUP_INTERVAL) return;

  lastLabelCacheCleanup = now;
  for (const [key, value] of labelCache.entries()) {
    if (value.expires < now) {
      labelCache.delete(key);
    }
  }
}

function getCachedLabel(displayName: string): string | null {
  cleanupLabelCache(); // Cleanup on access
  const cached = labelCache.get(displayName.toLowerCase());
  if (cached && cached.expires > Date.now()) {
    return cached.key;
  }
  // Remove expired entry if found
  if (cached) {
    labelCache.delete(displayName.toLowerCase());
  }
  return null;
}

function setCachedLabel(displayName: string, key: string): void {
  labelCache.set(displayName.toLowerCase(), {
    key,
    expires: Date.now() + LABEL_CACHE_TTL,
  });
}

/**
 * Fetch with timeout wrapper
 *
 * Wraps fetch() with an AbortController to enforce a timeout.
 * Prevents requests from hanging indefinitely.
 *
 * @param url - The URL to fetch
 * @param options - Fetch options (headers, method, body, etc.)
 * @param timeout - Timeout in milliseconds (default: 10000ms)
 * @returns Promise resolving to fetch Response
 * @throws {DOMException} When timeout is exceeded (AbortError)
 *
 * @example
 * ```typescript
 * const response = await fetchWithTimeout(
 *   'https://api.example.com/users',
 *   { method: 'POST', body: JSON.stringify(data) },
 *   5000 // 5 second timeout
 * );
 * ```
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Retry wrapper with exponential backoff
 *
 * Retries a failed async operation with increasing delays between attempts.
 * Uses exponential backoff: 1s, 2s, 4s for default 3 retries.
 *
 * @template T - Return type of the operation
 * @param operation - Async function to retry
 * @param operationName - Name for logging purposes
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns Promise resolving to operation result
 * @throws {Error} When all retry attempts are exhausted
 *
 * @example
 * ```typescript
 * const user = await withRetry(
 *   () => fetchUser('123'),
 *   'fetchUser',
 *   3
 * );
 * ```
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on abort (timeout) - throw immediately
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`${operationName} timed out on attempt ${attempt} - not retrying timeouts`);
        throw error;
      }

      console.error(`${operationName} failed on attempt ${attempt}:`, error);

      if (attempt < maxRetries) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`Retrying ${operationName} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`);
}

/**
 * Check if Wix CRM is configured
 *
 * Validates that required Wix environment variables are set.
 *
 * @returns true if WIX_API_KEY and WIX_SITE_ID are both defined
 *
 * @example
 * ```typescript
 * if (!isWixConfigured()) {
 *   console.log('Wix CRM not configured, skipping sync');
 *   return;
 * }
 * ```
 */
export function isWixConfigured(): boolean {
  return !!(WIX_API_KEY && WIX_SITE_ID);
}

/**
 * Get default headers for Wix API calls
 */
function getWixHeaders(): HeadersInit {
  return {
    'Authorization': `Bearer ${WIX_API_KEY}`,
    'wix-site-id': WIX_SITE_ID,
    'Content-Type': 'application/json',
  };
}

// ============================================
// LABELS
// ============================================

/**
 * Find or create a label in Wix CRM
 *
 * Wix requires labels to exist before they can be assigned to contacts.
 * This function ensures the label exists, creating it if necessary.
 * Uses caching to avoid repeated API calls (labels rarely change).
 *
 * @param displayName - Human-readable label name (e.g., "Lead", "Essentials")
 * @returns The label key (e.g., "custom.lead") or null on failure
 */
export async function findOrCreateLabel(displayName: string): Promise<string | null> {
  // Check cache first (fast path)
  const cached = getCachedLabel(displayName);
  if (cached) {
    return cached;
  }

  try {
    // First, try to find existing label by querying all labels
    const existingKey = await findLabelByName(displayName);
    if (existingKey) {
      setCachedLabel(displayName, existingKey);
      return existingKey;
    }

    // Label doesn't exist, create it
    const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/labels`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({ displayName }),
    });

    if (!response.ok) {
      const error = await response.text();
      // If label already exists (race condition), try to find it again
      const errorLower = error.toLowerCase();
      if (errorLower.includes('already exists') || errorLower.includes('duplicate')) {
        const retryKey = await findLabelByName(displayName);
        if (retryKey) {
          setCachedLabel(displayName, retryKey);
          return retryKey;
        }
      }
      console.error('Wix findOrCreateLabel failed:', error);
      return null;
    }

    const data = await response.json();
    const labelKey = data.label?.key;

    if (labelKey) {
      // Cache the label key for future requests
      setCachedLabel(displayName, labelKey);
    }

    return labelKey;
  } catch (error) {
    console.error('Error in findOrCreateLabel:', error);
    return null;
  }
}

/**
 * Find a label by its display name
 * Used to check if label exists before creating
 */
async function findLabelByName(displayName: string): Promise<string | null> {
  try {
    const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/labels`, {
      method: 'GET',
      headers: getWixHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const labels = data.labels || [];

    // Find label with matching display name (case-insensitive)
    const label = labels.find(
      (l: { displayName?: string }) =>
        l.displayName?.toLowerCase() === displayName.toLowerCase()
    );

    return label?.key || null;
  } catch (error) {
    console.error('Error finding label by name:', error);
    return null;
  }
}

/**
 * Ensure multiple labels exist in Wix CRM (PARALLEL execution)
 * Creates any missing labels before returning their keys.
 * Optimized to run all label lookups in parallel instead of sequentially.
 */
async function ensureLabelsExist(labelDisplayNames: string[]): Promise<string[]> {
  // Run all label lookups in parallel (major performance boost)
  const results = await Promise.all(
    labelDisplayNames.map((name) => findOrCreateLabel(name))
  );

  // Filter out nulls and return valid keys
  return results.filter((key): key is string => key !== null);
}

// ============================================
// CONTACTS
// ============================================

/**
 * Create or update a contact in Wix CRM
 */
export async function createOrUpdateContact(data: WixCustomerData): Promise<{
  contactId: string;
  isNew: boolean;
}> {
  // First, try to find existing contact by email
  const existingContact = await findContactByEmail(data.email);

  if (existingContact) {
    // Update existing contact
    await updateContact(existingContact._id, existingContact.revision, data);
    return { contactId: existingContact._id, isNew: false };
  }

  // Create new contact
  const newContact = await createContact(data);
  return { contactId: newContact._id, isNew: true };
}

/**
 * Find contact by email
 */
export async function findContactByEmail(
  email: string
): Promise<{ _id: string; revision?: string | number } | null> {
  try {
    const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/contacts/query`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({
        query: {
          filter: {
            'info.emails.items.email': { $eq: email },
          },
        },
      }),
    });

    if (!response.ok) {
      console.error('Wix contact query failed:', await response.text());
      return null;
    }

    const data = await response.json();
    const contact = data.contacts?.[0];
    if (!contact) return null;

    const id: string | undefined = contact._id ?? contact.id ?? contact.contactId;
    const revision: string | number | undefined = contact.revision ?? contact._revision ?? contact._rev;

    if (!id) {
      console.warn('Wix contact query returned contact without id. Keys:', Object.keys(contact));
      return null;
    }

    return { _id: id, revision };
  } catch (error) {
    console.error('Error finding Wix contact:', error);
    return null;
  }
}

/**
 * Create a new contact
 * Handles race condition: if contact was created by concurrent request, falls back to update
 */
async function createContact(data: WixCustomerData): Promise<{ _id: string }> {
  // Labels: "Customer", "{Program}", "Paid {Program}" (Paid Webinar, Paid Essentials, Paid Circle, Paid Strategy)
  const programName = data.programName || data.programId;
  const paidLabel = programName ? `Paid ${capitalizeFirst(programName)}` : null;
  const labelDisplayNames = ['Customer', programName, ...(paidLabel ? [paidLabel] : [])].filter(Boolean) as string[];
  const labelKeys = await ensureLabelsExist(labelDisplayNames);

  const response = await fetch(`${WIX_API_BASE}/contacts/v4/contacts`, {
    method: 'POST',
    headers: getWixHeaders(),
    body: JSON.stringify({
      // Prevent duplicate contacts - Wix will reject if email already exists
      allowDuplicates: false,
      info: {
        name: {
          first: data.firstName,
          last: data.lastName,
        },
        emails: {
          items: [{ email: data.email }],
        },
        phones: data.phone ? {
          items: [{ phone: data.phone }],
        } : undefined,
        extendedFields: {
          items: {
            // NOTE: Wix converts field keys to lowercase, so we must use lowercase here
            'custom.lastpaymentid': data.paymentId,
            'custom.lastpaymentamount': data.amount.toString(),
            'custom.lastprogramid': data.programId,
            'custom.lastprogramname': data.programName,
            'custom.issubscriber': data.isSubscription ? 'Yes' : 'No',
            ...(data.subscriptionId && {
              'custom.subscriptionid': data.subscriptionId,
            }),
            ...(data.programStartDate && {
              'custom.programstartdate': data.programStartDate,
            }),
            ...(data.startDateOption && {
              'custom.startdateoption': data.startDateOption,
            }),
            // Auto-subscribe to email campaigns
            'emailSubscriptions.subscriptionStatus': 'SUBSCRIBED',
            'emailSubscriptions.effectiveEmail': data.email,
            // Auto-subscribe to phone/SMS campaigns
            'custom.smsmarketingoptin': 'Yes',
          },
        },
        // Only include labelKeys if we have valid keys
        ...(labelKeys.length > 0 && {
          labelKeys: {
            items: labelKeys,
          },
        }),
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    // Handle race condition: contact was created by concurrent request
    // Fall back to finding and updating the existing contact
    const errorLower = error.toLowerCase();
    if (errorLower.includes('duplicate') || errorLower.includes('already exists')) {
      console.log('[Wix CRM] Contact already exists (race condition), falling back to update');

      // Find the contact that was just created by the other request
      const existingContact = await findContactByEmail(data.email);
      if (existingContact) {
        await updateContact(existingContact._id, existingContact.revision, data);
        return { _id: existingContact._id };
      }

      // If we still can't find it, something is wrong
      console.error('[Wix CRM] Contact exists but could not be found');
    }

    console.error('Wix contact creation failed:', error);
    throw new Error(`Failed to create Wix contact: ${error}`);
  }

  const result = await response.json();
  return { _id: result.contact._id };
}

/**
 * Update an existing contact with payment data
 * Also adds "Customer" and program labels to existing contacts
 */
async function updateContact(
  contactId: string,
  revision: string | number | undefined,
  data: WixCustomerData
): Promise<void> {
  // Build update payload - include phone if provided
  const updatePayload: {
    info: {
      phones?: { items: { phone: string }[] };
      extendedFields: {
        items: Record<string, string>;
      };
    };
  } = {
    info: {
      extendedFields: {
        items: {
          // NOTE: Wix converts field keys to lowercase, so we must use lowercase here
          'custom.lastpaymentid': data.paymentId,
          'custom.lastpaymentamount': data.amount.toString(),
          'custom.lastprogramid': data.programId,
          'custom.lastprogramname': data.programName,
          'custom.issubscriber': data.isSubscription ? 'Yes' : 'No',
          'custom.lastpaymentat': new Date().toISOString(),
          ...(data.subscriptionId && {
            'custom.subscriptionid': data.subscriptionId,
          }),
          ...(data.programStartDate && {
            'custom.programstartdate': data.programStartDate,
          }),
          ...(data.startDateOption && {
            'custom.startdateoption': data.startDateOption,
          }),
          // Auto-subscribe to email campaigns
          'emailSubscriptions.subscriptionStatus': 'SUBSCRIBED',
          'emailSubscriptions.effectiveEmail': data.email,
          // Auto-subscribe to phone/SMS campaigns
          'custom.smsmarketingoptin': 'Yes',
        },
      },
    },
  };

  // Update phone if provided (in case it wasn't captured during quiz)
  if (data.phone) {
    updatePayload.info.phones = { items: [{ phone: data.phone }] };
  }

  // Build request body with revision (Wix API requires revision in body, not URL)
  const requestBody: {
    info: typeof updatePayload.info;
    revision?: number;
  } = { ...updatePayload };

  if (revision !== undefined && revision !== null) {
    const parsedRevision = typeof revision === 'string' ? parseInt(revision, 10) : revision;
    if (!isNaN(parsedRevision)) {
      requestBody.revision = parsedRevision;
    }
  }

  const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getWixHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();

    // Retry once if revision mismatch (concurrent update scenario)
    if (error.toLowerCase().includes('revision')) {
      console.warn('[Wix CRM] Revision mismatch detected, retrying with fresh revision');
      const fresh = await findContactByEmail(data.email);
      if (fresh && fresh._id === contactId) {
        return updateContact(contactId, fresh.revision, data);
      }
    }

    console.error('Wix contact update failed:', error);
    throw new Error(`Failed to update Wix contact: ${error}`);
  }

  // Add Customer, program, and "Paid {Program}" labels to existing contact AFTER updating (avoids revision mismatch).
  const programName = data.programName || data.programId;
  const paidLabel = programName ? `Paid ${capitalizeFirst(programName)}` : null;
  const labelDisplayNames = ['Customer', programName, ...(paidLabel ? [paidLabel] : [])].filter(Boolean) as string[];
  const labelKeys = await ensureLabelsExist(labelDisplayNames);
  if (labelKeys.length > 0) {
    await addLabelsToContact(contactId, labelKeys);
  }

  console.log(`Updated contact ${contactId} with payment data and Customer label`);
}

// ============================================
// MEMBERS
// ============================================

/**
 * Create a member from contact (enables login)
 */
export async function createMember(contactId: string, email: string): Promise<string | null> {
  try {
    const response = await fetch(`${WIX_API_BASE}/members/v1/members`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({
        member: {
          contactId,
          loginEmail: email,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      // Member might already exist - get the actual memberId
      const errorLower = error.toLowerCase();
      if (errorLower.includes('already exists')) {
        console.log('Member already exists for contact:', contactId);
        // Query for the existing member to get correct memberId
        const existingMemberId = await findMemberByEmail(email);
        if (existingMemberId) {
          console.log('Found existing member:', existingMemberId);
          return existingMemberId;
        }
        // Fallback: try by contactId
        const memberByContact = await findMemberByContactId(contactId);
        if (memberByContact) {
          console.log('Found existing member by contactId:', memberByContact);
          return memberByContact;
        }
        console.warn('Could not find existing member, returning null');
        return null;
      }
      console.error('Wix member creation failed:', error);
      return null;
    }

    const data = await response.json();
    const memberId = data.member?.id;

    // Trigger password setup email
    if (memberId) {
      await sendPasswordSetupEmail(email);
    }

    return memberId;
  } catch (error) {
    console.error('Error creating Wix member:', error);
    return null;
  }
}

/**
 * Find member by email address
 * Returns memberId if found, null otherwise
 */
async function findMemberByEmail(email: string, retries = 2): Promise<string | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[Wix CRM] Retrying member lookup (attempt ${attempt + 1}/${retries + 1})`);
        // Small delay for eventual consistency
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }

      const response = await fetchWithTimeout(`${WIX_API_BASE}/members/v1/members/query`, {
        method: 'POST',
        headers: getWixHeaders(),
        body: JSON.stringify({
          query: {
            filter: {
              loginEmail: { $eq: email },
            },
          },
        }),
      });

      if (!response.ok) {
        if (attempt === retries) {
          console.error('[Wix CRM] Member lookup failed after retries:', await response.text());
        }
        continue; // Try again
      }

      const data = await response.json();
      const member = data.members?.[0];

      if (member?.id) {
        console.log(`[Wix CRM] ✓ Found member by email: ${member.id}`);
        return member.id;
      }

      // No member found but API call succeeded
      if (attempt === retries) {
        console.log('[Wix CRM] No member found for email (after retries):', email);
      }

    } catch (error) {
      console.error(`[Wix CRM] Error finding member by email (attempt ${attempt + 1}):`, error);
      if (attempt === retries) {
        return null;
      }
    }
  }

  return null;
}

/**
 * Find member by contactId
 * Returns memberId if found, null otherwise
 */
async function findMemberByContactId(contactId: string): Promise<string | null> {
  try {
    const response = await fetchWithTimeout(`${WIX_API_BASE}/members/v1/members/query`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({
        query: {
          filter: {
            contactId: { $eq: contactId },
          },
        },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const member = data.members?.[0];
    return member?.id || null;
  } catch (error) {
    console.error('Error finding member by contactId:', error);
    return null;
  }
}

/**
 * Send password setup email to new member
 * This enables the member to set their password and login to the Wix site/app
 * The password setup link is valid for 3 hours and can only be used once
 */
async function sendPasswordSetupEmail(email: string): Promise<void> {
  try {
    // Correct endpoint per Wix API docs for member password setup
    const response = await fetchWithTimeout(`${WIX_API_BASE}/wix-sm/api/v1/auth/v1/auth/members/send-set-password-email`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      console.log('Sent password setup email to:', email);
    } else {
      const error = await response.text();
      console.error('Failed to send password setup email:', error);
    }
  } catch (error) {
    console.error('Failed to send password email:', error);
  }
}

// ============================================
// PRICING PLANS (PROGRAM ASSIGNMENT)
// ============================================

/**
 * Assign a pricing plan to a member (create offline order)
 * Uses the Wix Pricing Plans V2 Checkout API for offline orders
 *
 * @throws {Error} If plan assignment fails (allows caller to handle/retry)
 */
export async function assignPricingPlan(params: {
  memberId: string;
  planId: string;
  paid?: boolean;
  startDate?: string;
}): Promise<string> {
  // Correct endpoint: /pricing-plans/v2/checkout/orders/offline (per Wix API docs)
  const response = await fetchWithTimeout(`${WIX_API_BASE}/pricing-plans/v2/checkout/orders/offline`, {
    method: 'POST',
    headers: getWixHeaders(),
    body: JSON.stringify({
      planId: params.planId,
      memberId: params.memberId,
      startDate: params.startDate || new Date().toISOString(),
      paid: params.paid ?? false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Wix pricing plan assignment failed:', {
      planId: params.planId,
      memberId: params.memberId,
      error: errorText,
    });
    throw new Error(`Failed to assign pricing plan: ${errorText}`);
  }

  const data = await response.json();
  const orderId = data.order?._id;

  if (!orderId) {
    throw new Error('Wix API returned success but no order ID');
  }

  return orderId;
}

// ============================================
// SUBSCRIPTION LIFECYCLE (Cancel/Pause Orders)
// ============================================

/**
 * Cancel a Wix pricing plan order
 * Called when Razorpay subscription is cancelled
 *
 * @param orderId - The Wix pricing plan order ID
 * @param effectiveAt - When to apply cancellation: 'IMMEDIATELY' or 'NEXT_PAYMENT_DATE'
 * @returns true if successfully cancelled
 */
export async function cancelWixOrder(
  orderId: string,
  effectiveAt: 'IMMEDIATELY' | 'NEXT_PAYMENT_DATE' = 'IMMEDIATELY'
): Promise<boolean> {
  if (!isWixConfigured()) {
    console.log('[Wix CRM] Not configured, cannot cancel order');
    return false;
  }

  try {
    const response = await fetchWithTimeout(
      `${WIX_API_BASE}/pricing-plans/v2/orders/${orderId}/cancel`,
      {
        method: 'POST',
        headers: getWixHeaders(),
        body: JSON.stringify({ effectiveAt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      // Check if already cancelled
      const errorLower = errorText.toLowerCase();
      if (errorLower.includes('already cancel')) {
        console.log(`[Wix CRM] Order ${orderId} already cancelled`);
        return true;
      }
      console.error('[Wix CRM] Failed to cancel order:', errorText);
      return false;
    }

    console.log(`[Wix CRM] Successfully cancelled order: ${orderId}`);
    return true;
  } catch (error) {
    console.error('[Wix CRM] Error cancelling order:', error);
    return false;
  }
}

/**
 * Pause a Wix pricing plan order (suspend)
 * Called when Razorpay subscription is halted due to payment failures
 *
 * @param orderId - The Wix pricing plan order ID
 * @returns true if successfully paused
 */
export async function pauseWixOrder(orderId: string): Promise<boolean> {
  if (!isWixConfigured()) {
    console.log('[Wix CRM] Not configured, cannot pause order');
    return false;
  }

  try {
    // Wix uses "suspend" endpoint to pause orders
    const response = await fetchWithTimeout(
      `${WIX_API_BASE}/pricing-plans/v2/orders/${orderId}/suspend`,
      {
        method: 'POST',
        headers: getWixHeaders(),
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      // Check if already suspended
      const errorLower = errorText.toLowerCase();
      if (errorLower.includes('already suspend')) {
        console.log(`[Wix CRM] Order ${orderId} already suspended`);
        return true;
      }
      console.error('[Wix CRM] Failed to pause order:', errorText);
      return false;
    }

    console.log(`[Wix CRM] Successfully paused order: ${orderId}`);
    return true;
  } catch (error) {
    console.error('[Wix CRM] Error pausing order:', error);
    return false;
  }
}

/**
 * Resume a paused Wix pricing plan order
 * Called when Razorpay subscription payment succeeds after being halted
 *
 * @param orderId - The Wix pricing plan order ID
 * @returns true if successfully resumed
 */
export async function resumeWixOrder(orderId: string): Promise<boolean> {
  if (!isWixConfigured()) {
    console.log('[Wix CRM] Not configured, cannot resume order');
    return false;
  }

  try {
    const response = await fetchWithTimeout(
      `${WIX_API_BASE}/pricing-plans/v2/orders/${orderId}/resume`,
      {
        method: 'POST',
        headers: getWixHeaders(),
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Wix CRM] Failed to resume order:', errorText);
      return false;
    }

    console.log(`[Wix CRM] Successfully resumed order: ${orderId}`);
    return true;
  } catch (error) {
    console.error('[Wix CRM] Error resuming order:', error);
    return false;
  }
}

/**
 * Get a Wix pricing plan order's details
 * Used to fetch current end date before extending
 *
 * @param orderId - The Wix pricing plan order ID
 * @returns Order details including endDate, or null on failure
 */
async function getWixOrder(orderId: string): Promise<{ endDate: string; status: string } | null> {
  if (!isWixConfigured()) {
    console.log('[Wix CRM] Not configured, cannot get order');
    return null;
  }

  try {
    const response = await fetchWithTimeout(
      `${WIX_API_BASE}/pricing-plans/v2/orders/${orderId}`,
      {
        method: 'GET',
        headers: getWixHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Wix CRM] Failed to get order:', errorText);
      return null;
    }

    const data = await response.json();
    const order = data.order;

    if (!order) {
      console.error('[Wix CRM] Order not found in response');
      return null;
    }

    return {
      endDate: order.endDate,
      status: order.status,
    };
  } catch (error) {
    console.error('[Wix CRM] Error getting order:', error);
    return null;
  }
}

/**
 * Extend a Wix pricing plan order's end date
 * Called when Razorpay subscription renewal payment succeeds
 *
 * @param orderId - The Wix pricing plan order ID
 * @param monthsToExtend - Number of months to extend (default: 1)
 * @returns true if successfully extended, false otherwise
 */
export async function postponeWixOrderEndDate(
  orderId: string,
  monthsToExtend: number = 1
): Promise<boolean> {
  if (!isWixConfigured()) {
    console.log('[Wix CRM] Not configured, cannot extend order');
    return false;
  }

  try {
    // Step 1: Get current order to find its endDate and status
    const order = await getWixOrder(orderId);
    if (!order) {
      console.error('[Wix CRM] Could not get current order details:', orderId);
      return false;
    }

    // Cannot extend paused orders - they need to be resumed first
    if (order.status === 'PAUSED') {
      console.warn('[Wix CRM] Cannot extend paused order - resume it first:', orderId);
      return false;
    }

    // Step 2: Calculate new end date (add months)
    const currentEndDate = new Date(order.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + monthsToExtend);

    console.log(`[Wix CRM] Extending order ${orderId}:`, {
      currentEndDate: currentEndDate.toISOString(),
      newEndDate: newEndDate.toISOString(),
      monthsToExtend,
    });

    // Step 3: Call PATCH endpoint to update end date
    const response = await fetchWithTimeout(
      `${WIX_API_BASE}/pricing-plans/v2/orders/${orderId}`,
      {
        method: 'PATCH',
        headers: getWixHeaders(),
        body: JSON.stringify({ endDate: newEndDate.toISOString() }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Wix CRM] Failed to extend order:', errorText);
      return false;
    }

    console.log(`[Wix CRM] Successfully extended order ${orderId} to ${newEndDate.toISOString()}`);
    return true;
  } catch (error) {
    console.error('[Wix CRM] Error extending order:', error);
    return false;
  }
}

/**
 * Update contact's subscription status extended field
 */
export async function updateContactSubscriptionStatus(
  email: string,
  status: 'active' | 'halted' | 'cancelled' | 'completed',
  additionalFields?: Record<string, string>
): Promise<boolean> {
  if (!isWixConfigured()) return false;

  try {
    const contact = await findContactByEmail(email);
    if (!contact) {
      console.warn('[Wix CRM] Contact not found for subscription status update:', email);
      return false;
    }

    const extendedFields: Record<string, string> = {
      'custom.subscriptionstatus': status,
      'custom.subscriptionupdatedat': new Date().toISOString(),
      ...additionalFields,
    };

    const requestBody: {
      info: { extendedFields: { items: Record<string, string> } };
      revision?: number;
    } = {
      info: {
        extendedFields: { items: extendedFields },
      },
    };

    if (contact.revision !== undefined) {
      const parsedRevision = typeof contact.revision === 'string'
        ? parseInt(contact.revision, 10)
        : contact.revision;
      if (!isNaN(parsedRevision)) {
        requestBody.revision = parsedRevision;
      }
    }

    const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/contacts/${contact._id}`, {
      method: 'PATCH',
      headers: getWixHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();

      // Retry once if revision mismatch
      if (error.toLowerCase().includes('revision')) {
        console.warn('[Wix CRM] Revision mismatch in subscription status update, retrying');
        const fresh = await findContactByEmail(email);
        if (fresh) {
          return updateContactSubscriptionStatus(email, status, additionalFields);
        }
      }

      console.error('[Wix CRM] Failed to update contact subscription status:', error);
      return false;
    }

    console.log(`[Wix CRM] Updated contact ${contact._id} subscription status to: ${status}`);
    return true;
  } catch (error) {
    console.error('[Wix CRM] Error updating contact subscription status:', error);
    return false;
  }
}

// ============================================
// AUTOMATIONS (EMAIL TRIGGERS)
// ============================================

/**
 * Trigger Wix automation webhook for email sending
 */
export async function triggerWixAutomation(data: WixCustomerData): Promise<void> {
  const webhookUrl = process.env.WIX_AUTOMATION_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('No Wix automation webhook URL configured');
    return;
  }

  const payload = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || '',
    programId: data.programId,
    programName: data.programName,
    paymentId: data.paymentId,
    amount: data.amount,
    isSubscription: data.isSubscription,
    subscriptionId: data.subscriptionId || '',
    timestamp: new Date().toISOString(),
  };

  try {
    console.log('[Wix Automation] Sending webhook payload:', {
      email: data.email,
      programId: data.programId,
      paymentId: data.paymentId,
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log('[Wix Automation] Webhook triggered successfully', {
        status: response.status,
        response: responseText,
      });
    } else {
      console.error('[Wix Automation] Webhook failed', {
        status: response.status,
        statusText: response.statusText,
        response: responseText,
        payload: payload,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.error('[Wix Automation] Webhook timeout after 10s', {
        error: error.message,
        payload: payload,
      });
    } else {
      console.error('[Wix Automation] Webhook error', {
        error: error instanceof Error ? error.message : String(error),
        payload: payload,
      });
    }
  }
}

// ============================================
// MAIN SYNC FUNCTION
// ============================================

/**
 * Complete Wix CRM sync after successful payment
 */
export async function syncToWixCRM(data: WixCustomerData): Promise<{
  success: boolean;
  contactId?: string;
  memberId?: string;
  orderId?: string;
  error?: string;
  planAssignmentFailed?: boolean;
}> {
  if (!isWixConfigured()) {
    console.log('Wix CRM not configured, skipping sync');
    return { success: false, error: 'Wix not configured' };
  }

  try {
    // Step 1: Create or update contact
    const { contactId, isNew } = await createOrUpdateContact(data);
    console.log(`${isNew ? 'Created' : 'Updated'} contact:`, contactId);

    // Step 2: Create member (required for pricing plan assignment)
    // Always attempt to create member when payment is made
    // createMember handles "already exists" case gracefully
    let memberId = await createMember(contactId, data.email);
    console.log(memberId ? `Member ready: ${memberId}` : 'Member creation skipped');

    // Step 3: Assign pricing plan if configured
    let orderId: string | null = null;
    const planId = getPlanIdForProgram(data.programId);

    if (!data.programId) {
      console.warn('[Wix CRM] No programId provided - skipping plan assignment');
    } else if (!planId) {
      console.warn(`[Wix CRM] No Wix Plan ID configured for program: ${data.programId}`);
      console.warn('[Wix CRM] Check WIX_PLAN_ID_* environment variables');
    } else if (!memberId) {
      console.warn('[Wix CRM] No memberId from createMember, attempting verification lookup');

      // Make one final attempt to find the member before giving up
      const verifiedMemberId = await findMemberByEmail(data.email);

      if (verifiedMemberId) {
        console.log('[Wix CRM] ✓ Found member on verification lookup:', verifiedMemberId);
        memberId = verifiedMemberId;
        // Continue to plan assignment below
      } else {
        console.error('[Wix CRM] ✗ CRITICAL: Cannot find or create member for pricing plan');
        console.error('[Wix CRM] Contact details:', {
          email: data.email,
          contactId,
          programId: data.programId,
          planId,
        });
        console.error('[Wix CRM] Troubleshooting:');
        console.error('[Wix CRM]   1. Check Wix Members app is installed');
        console.error('[Wix CRM]   2. Verify API key has "Manage Members" permission');
        console.error('[Wix CRM]   3. Check if contact email is valid');
        console.error('[Wix CRM]   4. Try manual member creation in Wix dashboard');
      }
    }

    // Only assign plan if we have a memberId (either from createMember or verification)
    let planAssignmentFailed = false;

    if (memberId && planId) {
      // All requirements met - assign the plan
      try {
        orderId = await assignPricingPlan({
          memberId,
          planId,
          paid: true,
          startDate: data.programStartDate || new Date().toISOString(),
        });
        console.log(`[Wix CRM] Pricing plan assigned successfully: ${orderId}`);
      } catch (planError) {
        planAssignmentFailed = true;
        console.error('[Wix CRM] ✗ Pricing plan assignment failed - FULL CONTEXT:');
        console.error('[Wix CRM] Error:', planError instanceof Error ? planError.message : planError);
        console.error('[Wix CRM] Member ID:', memberId);
        console.error('[Wix CRM] Contact ID:', contactId);
        console.error('[Wix CRM] Plan ID:', planId);
        console.error('[Wix CRM] Program:', data.programId, '-', data.programName);
        console.error('[Wix CRM] Email:', data.email);
        console.error('[Wix CRM] Is Existing Contact:', !isNew);
        console.error('[Wix CRM] Subscription ID:', data.subscriptionId);
        console.error('[Wix CRM] Timestamp:', new Date().toISOString());
        console.error('[Wix CRM] Troubleshooting:');
        console.error('[Wix CRM]   1. Check WIX_PLAN_ID_* env var is set correctly');
        console.error('[Wix CRM]   2. Verify plan exists in Wix Dashboard → Pricing Plans');
        console.error('[Wix CRM]   3. Check API key has "Manage Pricing Plan Orders" permission');
        console.error('[Wix CRM]   4. Verify member status is ACTIVE (not blocked)');
      }
    } else if (!memberId) {
      // No member ID means we can't assign a plan - this is a critical failure
      planAssignmentFailed = true;
      console.error('[Wix CRM] CRITICAL: No memberId available - cannot assign pricing plan');
    }

    // Step 4: Trigger automation for welcome email
    await triggerWixAutomation(data);

    return {
      success: !planAssignmentFailed,
      contactId,
      memberId: memberId || undefined,
      orderId: orderId || undefined,
      planAssignmentFailed,
    };
  } catch (error) {
    console.error('Wix CRM sync failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get Wix Plan ID for a program (reads from centralized program config)
 */
function getPlanIdForProgram(programId: string): string | null {
  const program = getProgramById(programId);
  if (program?.wixPlanId) {
    return program.wixPlanId;
  }
  // Fallback to default plan if configured
  return process.env.WIX_PLAN_ID_DEFAULT || null;
}

// ============================================
// QUIZ LEAD CAPTURE
// ============================================

export interface QuizLeadData {
  name: string;
  email: string;
  whatsapp: string;
  recommendation: string; // Program slug
  quizAnswers?: Record<string, string[]>;
  deviceType?: string;
  referralSource?: string;
}

function isExtendedFieldsNotFoundError(errorText: string): boolean {
  const lower = errorText.toLowerCase();
  return lower.includes('extended fields not found') || errorText.includes('EXTENDED_FIELD_NOT_FOUND');
}

function extractMissingExtendedFields(errorText: string): string[] {
  // Wix error payload usually contains a description like:
  // 'Extended fields not found: custom.a,custom.b,custom.c.'
  const marker = 'extended fields not found:';
  const lower = errorText.toLowerCase();
  const start = lower.indexOf(marker);
  if (start === -1) return [];

  const after = errorText.slice(start + marker.length);

  // The list typically ends at the end of the sentence in the description: '."'
  // Using '."' avoids being confused by dots inside field keys (custom.fooBar).
  let end = after.indexOf('."');
  if (end === -1) end = after.indexOf('",');
  if (end === -1) end = after.length;

  const listRaw = after.slice(0, end).trim();
  const cleaned = listRaw.replace(/\.$/, '').trim();

  return cleaned
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Create a quiz lead in Wix CRM with 'Lead' label
 * Includes retry logic with exponential backoff
 */
export async function createQuizLead(data: QuizLeadData): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  if (!isWixConfigured()) {
    console.log('Wix CRM not configured, skipping lead creation');
    return { success: false, error: 'Wix not configured' };
  }

  const findExistingByEmail = async (): Promise<{ _id: string; revision?: string | number } | null> => {
    // Wix query can be eventually-consistent right after a create, and callers can double-submit.
    // Do a few quick lookups before attempting another create to reduce duplicates.
    const delaysMs = [0, 250, 750];
    for (const delay of delaysMs) {
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      const existing = await findContactByEmail(data.email);
      if (existing?._id) return existing;
    }
    return null;
  };

  // Parse name into first/last
  const nameParts = data.name.trim().split(' ');
  const firstName = nameParts[0] || data.name;
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    // Labels: "Lead" + "Quiz {Program}" (Quiz Webinar, Quiz Essentials, Quiz Circle, Quiz Strategy)
    const quizLabel = data.recommendation ? `Quiz ${capitalizeFirst(data.recommendation)}` : null;
    const labelDisplayNames = ['Lead', ...(quizLabel ? [quizLabel] : [])];
    const labelKeys = await ensureLabelsExist(labelDisplayNames);

    // Check for existing contact with retry
    const existingContact = await withRetry(
      () => findContactByEmail(data.email),
      'findContactByEmail'
    ).catch(() => null); // Gracefully handle if lookup fails

    if (existingContact) {
      // Update existing contact with quiz data and add labels
      await withRetry(
        () => updateQuizLead(existingContact._id, data, labelKeys, existingContact.revision),
        'updateQuizLead'
      );
      return { success: true, contactId: existingContact._id };
    }

    // Before creating, do a couple fast re-checks to reduce duplicates
    // (common when user double-submits or Wix query lags right after creation).
    const existingAfterDelay = await findExistingByEmail();
    if (existingAfterDelay) {
      await withRetry(
        () => updateQuizLead(existingAfterDelay._id, data, labelKeys, existingAfterDelay.revision),
        'updateQuizLead'
      ).catch(() => undefined);
      return { success: true, contactId: existingAfterDelay._id };
    }

    // Create new contact with Lead label only (program label added after payment).
    // IMPORTANT: Do not wrap this POST in withRetry() because it is not idempotent and can create duplicates
    // if the request succeeds but the response is lost/times out.
    const baseInfo = {
      name: {
        first: firstName,
        last: lastName,
      },
      emails: {
        items: [{ email: data.email }],
      },
      phones: {
        items: [{ phone: data.whatsapp }],
      },
      // Only include labelKeys if we have valid keys
      ...(labelKeys.length > 0 && {
        labelKeys: {
          items: labelKeys,
        },
      }),
    };

    // NOTE: Wix converts field keys to lowercase, so we must use lowercase here
    const extendedFieldsItems: Record<string, string> = {
      'custom.quizrecommendation': data.recommendation,
      'custom.quizcompletedat': new Date().toISOString(),
      'custom.devicetype': data.deviceType || 'unknown',
      ...(data.referralSource && { 'custom.referralsource': data.referralSource }),
      // Auto-subscribe to email campaigns
      'emailSubscriptions.subscriptionStatus': 'SUBSCRIBED',
      'emailSubscriptions.effectiveEmail': data.email,
      // Auto-subscribe to phone/SMS campaigns
      'custom.smsmarketingoptin': 'Yes',
    };

    const createContact = async (includeExtendedFields: boolean) => {
      const payload = {
        // Prevent duplicate contacts - Wix will reject if email already exists
        allowDuplicates: false,
        info: {
          ...baseInfo,
          ...(includeExtendedFields && {
            extendedFields: {
              items: extendedFieldsItems,
            },
          }),
        },
      };

      const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/contacts`, {
        method: 'POST',
        headers: getWixHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Wix API error: ${errorText}`);
      }

      const result = await response.json();
      const createdContactId: string | undefined =
        result?.contact?._id ??
        result?.contact?.id ??
        result?.contactId ??
        result?.id ??
        result?._id;

      if (!createdContactId) {
        throw new Error('Wix API error: contact ID not returned from create contact response');
      }

      return { createdContactId, raw: result };
    };

    try {
      const { createdContactId } = await createContact(true);
      console.log('Created quiz lead:', createdContactId, 'with labels:', labelKeys);
      return { success: true, contactId: createdContactId };
    } catch (error) {
      // If the Wix site doesn't have these custom fields configured yet, retry ONCE without them.
      if (error instanceof Error && isExtendedFieldsNotFoundError(error.message)) {
        const missing = extractMissingExtendedFields(error.message);
        console.warn(
          'Wix extended fields missing for quiz lead; retrying contact creation without extendedFields.',
          missing.length ? { missing } : undefined
        );
        const { createdContactId } = await createContact(false);
        console.log('Created quiz lead:', createdContactId, 'with labels:', labelKeys);
        return { success: true, contactId: createdContactId };
      }

      // If we got a timeout/network-ish failure, the create may have actually succeeded.
      // Do a lookup by email and treat that as success to prevent duplicate creates.
      const maybeCreated = await findExistingByEmail();
      if (maybeCreated) {
        console.warn('Create contact failed but contact exists by email; treating as success:', maybeCreated._id);
        return { success: true, contactId: maybeCreated._id };
      }

      throw error;
    }
  } catch (error) {
    console.error('Error creating quiz lead after retries:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Async wrapper for createQuizLead (fire-and-forget pattern)
 *
 * This function never throws - it catches all errors internally.
 * Designed for background processing where we don't need to wait for results.
 *
 * Performance benefit: Allows API to return immediately while CRM sync
 * happens in background, reducing response time from 3-8s to ~50ms.
 *
 * @param data - Quiz lead data to create/update
 * @returns Promise that always resolves (never rejects)
 */
export async function createQuizLeadAsync(data: QuizLeadData): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  try {
    return await createQuizLead(data);
  } catch (error) {
    // Never throw - this is fire-and-forget
    console.error('createQuizLeadAsync error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update existing contact with quiz lead data
 */
async function updateQuizLead(
  contactId: string,
  data: QuizLeadData,
  labelKeys: string[],
  revision?: string | number
): Promise<void> {
  // Build request body with revision (Wix API requires revision in body, not URL)
  const requestBody: {
    info: {
      extendedFields: {
        items: Record<string, string>;
      };
    };
    revision?: number;
  } = {
    info: {
      extendedFields: {
        items: {
          // NOTE: Wix converts field keys to lowercase, so we must use lowercase here
          'custom.quizrecommendation': data.recommendation,
          'custom.quizcompletedat': new Date().toISOString(),
          'custom.devicetype': data.deviceType || 'unknown',
          ...(data.referralSource && {
            'custom.referralsource': data.referralSource,
          }),
          // Auto-subscribe to email campaigns
          'emailSubscriptions.subscriptionStatus': 'SUBSCRIBED',
          'emailSubscriptions.effectiveEmail': data.email,
          // Auto-subscribe to phone/SMS campaigns
          'custom.smsmarketingoptin': 'Yes',
        },
      },
    },
  };

  if (revision !== undefined && revision !== null) {
    const parsedRevision = typeof revision === 'string' ? parseInt(revision, 10) : revision;
    if (!isNaN(parsedRevision)) {
      requestBody.revision = parsedRevision;
    }
  }

  const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getWixHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();

    // Retry once if revision mismatch
    if (errorText.toLowerCase().includes('revision')) {
      console.warn('[Wix CRM] Revision mismatch in quiz lead update, retrying');
      const fresh = await findContactByEmail(data.email);
      if (fresh && fresh._id === contactId) {
        return updateQuizLead(contactId, data, labelKeys, fresh.revision);
      }
    }

    if (isExtendedFieldsNotFoundError(errorText)) {
      console.warn(
        'Wix extended fields missing for quiz lead; skipping extendedFields update for contact:',
        contactId
      );
      // Still try to add labels
    } else {
      console.error('Wix quiz lead update failed:', errorText);
    }
  }

  // Add labels to existing contact (labels already ensured to exist)
  if (labelKeys.length > 0) {
    await addLabelsToContact(contactId, labelKeys);
    }
}

/**
 * Add labels to an existing contact
 * Uses the Wix Label Contact API endpoint
 */
async function addLabelsToContact(contactId: string, labelKeys: string[]): Promise<void> {
  if (labelKeys.length === 0) return;

  try {
    const response = await fetchWithTimeout(
      `${WIX_API_BASE}/contacts/v4/contacts/${contactId}/labels`,
      {
        method: 'POST',
        headers: getWixHeaders(),
        body: JSON.stringify({ labelKeys }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      // Label might already be assigned, log but don't throw
      console.log(`Could not add labels to contact ${contactId}:`, error);
    }
  } catch (error) {
    console.log(`Error adding labels to contact ${contactId}:`, error);
  }
}
