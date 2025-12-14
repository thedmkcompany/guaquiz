import type { WixCustomerData } from '@/types/payment';
import { getProgramById } from './programs';

// ============================================
// WIX CRM SYNC
// ============================================

const WIX_API_KEY = process.env.WIX_API_KEY || '';
const WIX_SITE_ID = process.env.WIX_SITE_ID || '';
const WIX_API_BASE = 'https://www.wixapis.com';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 10000; // 10 seconds

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

      // Don't retry on abort (timeout) or if it's the last attempt
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`${operationName} timed out on attempt ${attempt}`);
      } else {
        console.error(`${operationName} failed on attempt ${attempt}:`, error);
      }

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
 *
 * @param displayName - Human-readable label name (e.g., "Lead", "Essentials")
 * @returns The label key (e.g., "custom.lead") or null on failure
 */
export async function findOrCreateLabel(displayName: string): Promise<string | null> {
  try {
    const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/labels`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({ displayName }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Wix findOrCreateLabel failed:', error);
      return null;
    }

    const data = await response.json();
    const labelKey = data.label?.key;

    if (data.newLabel) {
      console.log(`Created new Wix label: ${displayName} -> ${labelKey}`);
    }

    return labelKey;
  } catch (error) {
    console.error('Error in findOrCreateLabel:', error);
    return null;
  }
}

/**
 * Ensure multiple labels exist in Wix CRM
 * Creates any missing labels before returning their keys
 */
async function ensureLabelsExist(labelDisplayNames: string[]): Promise<string[]> {
  const labelKeys: string[] = [];

  for (const displayName of labelDisplayNames) {
    const key = await findOrCreateLabel(displayName);
    if (key) {
      labelKeys.push(key);
    }
  }

  return labelKeys;
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
    await updateContact(existingContact._id, data);
    return { contactId: existingContact._id, isNew: false };
  }

  // Create new contact
  const newContact = await createContact(data);
  return { contactId: newContact._id, isNew: true };
}

/**
 * Find contact by email
 */
export async function findContactByEmail(email: string): Promise<{ _id: string } | null> {
  try {
    const response = await fetch(`${WIX_API_BASE}/contacts/v4/contacts/query`, {
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
    return data.contacts?.[0] || null;
  } catch (error) {
    console.error('Error finding Wix contact:', error);
    return null;
  }
}

/**
 * Create a new contact
 */
async function createContact(data: WixCustomerData): Promise<{ _id: string }> {
  // Ensure labels exist before creating contact
  const labelDisplayNames = ['Customer', data.programName || data.programId];
  const labelKeys = await ensureLabelsExist(labelDisplayNames);

  const response = await fetch(`${WIX_API_BASE}/contacts/v4/contacts`, {
    method: 'POST',
    headers: getWixHeaders(),
    body: JSON.stringify({
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
            'custom.lastPaymentId': data.paymentId,
            'custom.lastPaymentAmount': data.amount.toString(),
            'custom.lastProgramId': data.programId,
            'custom.lastProgramName': data.programName,
            'custom.isSubscriber': data.isSubscription ? 'Yes' : 'No',
            ...(data.subscriptionId && {
              'custom.subscriptionId': data.subscriptionId,
            }),
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
async function updateContact(contactId: string, data: WixCustomerData): Promise<void> {
  // Add Customer and program labels to the existing contact
  const labelDisplayNames = ['Customer', data.programName || data.programId];
  const labelKeys = await ensureLabelsExist(labelDisplayNames);
  if (labelKeys.length > 0) {
    await addLabelsToContact(contactId, labelKeys);
  }

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
          'custom.lastPaymentId': data.paymentId,
          'custom.lastPaymentAmount': data.amount.toString(),
          'custom.lastProgramId': data.programId,
          'custom.lastProgramName': data.programName,
          'custom.isSubscriber': data.isSubscription ? 'Yes' : 'No',
          'custom.lastPaymentAt': new Date().toISOString(),
          ...(data.subscriptionId && {
            'custom.subscriptionId': data.subscriptionId,
          }),
        },
      },
    },
  };

  // Update phone if provided (in case it wasn't captured during quiz)
  if (data.phone) {
    updatePayload.info.phones = { items: [{ phone: data.phone }] };
  }

  const response = await fetch(`${WIX_API_BASE}/contacts/v4/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getWixHeaders(),
    body: JSON.stringify(updatePayload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Wix contact update failed:', error);
    throw new Error(`Failed to update Wix contact: ${error}`);
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
      // Member might already exist
      if (error.includes('already exists') || error.includes('ALREADY_EXISTS')) {
        console.log('Member already exists for contact:', contactId);
        return contactId; // Return contact ID as fallback
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
 * Send password setup email to new member
 */
async function sendPasswordSetupEmail(email: string): Promise<void> {
  try {
    await fetch(`${WIX_API_BASE}/members/v1/auth/send-set-password-email`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({ email }),
    });
    console.log('Sent password setup email to:', email);
  } catch (error) {
    console.error('Failed to send password email:', error);
  }
}

// ============================================
// PRICING PLANS (PROGRAM ASSIGNMENT)
// ============================================

/**
 * Assign a pricing plan to a member (create offline order)
 */
export async function assignPricingPlan(params: {
  memberId: string;
  planId: string;
  paid?: boolean;
}): Promise<string | null> {
  try {
    const response = await fetch(`${WIX_API_BASE}/pricing-plans/v2/orders`, {
      method: 'POST',
      headers: getWixHeaders(),
      body: JSON.stringify({
        planId: params.planId,
        memberId: params.memberId,
        startDate: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Wix pricing plan assignment failed:', error);
      return null;
    }

    const data = await response.json();
    const orderId = data.order?._id;

    // Mark as paid if requested
    if (orderId && params.paid !== false) {
      await markOrderAsPaid(orderId);
    }

    return orderId;
  } catch (error) {
    console.error('Error assigning pricing plan:', error);
    return null;
  }
}

/**
 * Mark a pricing plan order as paid
 */
async function markOrderAsPaid(orderId: string): Promise<void> {
  try {
    await fetch(`${WIX_API_BASE}/pricing-plans/v2/orders/${orderId}/markAsPaid`, {
      method: 'POST',
      headers: getWixHeaders(),
    });
    console.log('Marked order as paid:', orderId);
  } catch (error) {
    console.error('Failed to mark order as paid:', error);
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

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    });

    if (response.ok) {
      console.log('Triggered Wix automation webhook');
    } else {
      console.error('Wix automation webhook failed:', response.status);
    }
  } catch (error) {
    console.error('Failed to trigger Wix automation:', error);
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
}> {
  if (!isWixConfigured()) {
    console.log('Wix CRM not configured, skipping sync');
    return { success: false, error: 'Wix not configured' };
  }

  try {
    // Step 1: Create or update contact
    const { contactId, isNew } = await createOrUpdateContact(data);
    console.log(`${isNew ? 'Created' : 'Updated'} contact:`, contactId);

    // Step 2: Create member if new contact
    let memberId: string | null = null;
    if (isNew) {
      memberId = await createMember(contactId, data.email);
      console.log('Created member:', memberId);
    }

    // Step 3: Assign pricing plan if configured
    let orderId: string | null = null;
    const planId = getPlanIdForProgram(data.programId);
    if (planId && (memberId || contactId)) {
      orderId = await assignPricingPlan({
        memberId: memberId || contactId,
        planId,
        paid: true,
      });
      console.log('Assigned pricing plan, order:', orderId);
    }

    // Step 4: Trigger automation for welcome email
    await triggerWixAutomation(data);

    return {
      success: true,
      contactId,
      memberId: memberId || undefined,
      orderId: orderId || undefined,
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

  // Parse name into first/last
  const nameParts = data.name.trim().split(' ');
  const firstName = nameParts[0] || data.name;
  const lastName = nameParts.slice(1).join(' ') || '';

  // Get the program display name for the label (e.g., "Essentials", "Trial")
  const programDisplayName = data.recommendation.charAt(0).toUpperCase() + data.recommendation.slice(1);

  try {
    // Ensure labels exist before creating/updating contact
    const labelKeys = await ensureLabelsExist(['Lead', programDisplayName]);

    // Check for existing contact with retry
    const existingContact = await withRetry(
      () => findContactByEmail(data.email),
      'findContactByEmail'
    ).catch(() => null); // Gracefully handle if lookup fails

    if (existingContact) {
      // Update existing contact with quiz data and add labels
      await withRetry(
        () => updateQuizLead(existingContact._id, data, labelKeys),
        'updateQuizLead'
      );
      return { success: true, contactId: existingContact._id };
    }

    // Create new contact with Lead label and program label (with retry)
    const result = await withRetry(async () => {
      const response = await fetchWithTimeout(`${WIX_API_BASE}/contacts/v4/contacts`, {
        method: 'POST',
        headers: getWixHeaders(),
        body: JSON.stringify({
          info: {
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
            extendedFields: {
              items: {
                'custom.quizRecommendation': data.recommendation,
                'custom.quizCompletedAt': new Date().toISOString(),
                'custom.deviceType': data.deviceType || 'unknown',
                ...(data.referralSource && {
                  'custom.referralSource': data.referralSource,
                }),
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
        throw new Error(`Wix API error: ${error}`);
      }

      return response.json();
    }, 'createQuizLead');

    console.log('Created quiz lead:', result.contact._id, 'with labels:', labelKeys);
    return { success: true, contactId: result.contact._id };
  } catch (error) {
    console.error('Error creating quiz lead after retries:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update existing contact with quiz lead data
 */
async function updateQuizLead(contactId: string, data: QuizLeadData, labelKeys: string[]): Promise<void> {
  // Add labels to existing contact (labels already ensured to exist)
  if (labelKeys.length > 0) {
    await addLabelsToContact(contactId, labelKeys);
  }

  // Then update extended fields
  const response = await fetch(`${WIX_API_BASE}/contacts/v4/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getWixHeaders(),
    body: JSON.stringify({
      info: {
        extendedFields: {
          items: {
            'custom.quizRecommendation': data.recommendation,
            'custom.quizCompletedAt': new Date().toISOString(),
            'custom.deviceType': data.deviceType || 'unknown',
            ...(data.referralSource && {
              'custom.referralSource': data.referralSource,
            }),
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Wix quiz lead update failed:', error);
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
