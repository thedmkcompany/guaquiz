import type { WixCustomerData } from '@/types/payment';

// ============================================
// WIX CRM SYNC
// ============================================

const WIX_API_KEY = process.env.WIX_API_KEY || '';
const WIX_SITE_ID = process.env.WIX_SITE_ID || '';
const WIX_API_BASE = 'https://www.wixapis.com';

/**
 * Check if Wix CRM is configured
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
        labelKeys: {
          items: ['custom.customer', `custom.program-${data.programId}`],
        },
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
 * Update an existing contact
 */
async function updateContact(contactId: string, data: WixCustomerData): Promise<void> {
  const response = await fetch(`${WIX_API_BASE}/contacts/v4/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getWixHeaders(),
    body: JSON.stringify({
      info: {
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
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Wix contact update failed:', error);
    throw new Error(`Failed to update Wix contact: ${error}`);
  }
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
 * Get Wix Plan ID for a program
 */
function getPlanIdForProgram(programId: string): string | null {
  const planMapping: Record<string, string | undefined> = {
    'program-1': process.env.WIX_PLAN_ID_PROGRAM_1,
    'program-2': process.env.WIX_PLAN_ID_PROGRAM_2,
    'program-3': process.env.WIX_PLAN_ID_PROGRAM_3,
    'program-4': process.env.WIX_PLAN_ID_PROGRAM_4,
  };

  return planMapping[programId] || process.env.WIX_PLAN_ID_DEFAULT || null;
}
