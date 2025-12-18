/**
 * AISensy WhatsApp Integration Service
 *
 * Handles automated WhatsApp messaging via AISensy API for:
 * - Welcome messages after quiz completion
 * - Payment confirmations after successful payment
 * - Program start reminders
 *
 * Features:
 * - Automatic contact creation/update when sending campaigns
 * - Tag-based segmentation (program name, tier, payment type)
 * - Custom attributes for personalization
 * - Phone number validation and E.164 formatting
 * - PII masking in logs for security
 * - Non-blocking execution (never fails webhooks)
 *
 * Official API Documentation:
 * https://wiki.aisensy.com/en/articles/11501889-api-reference-docs
 *
 * @module aisensy
 */

import { maskPhone } from './validation';
import type { Program } from '@/types';

// ============================================
// CONFIGURATION
// ============================================

const AISENSY_API_KEY = process.env.AISENSY_API_KEY || '';
const AISENSY_BASE_URL = process.env.AISENSY_BASE_URL || 'https://backend.aisensy.com';
const AISENSY_ENABLED = process.env.NEXT_PUBLIC_AISENSY_ENABLED === 'true';

// Campaign names (must match LIVE campaigns in AISensy dashboard)
// Program-specific campaigns for better personalization
const CAMPAIGNS = {
  // Payment confirmation campaigns
  WEBINAR: process.env.AISENSY_CAMPAIGN_WEBINAR || '',
  TRANSFORM: process.env.AISENSY_CAMPAIGN_TRANSFORM || '',
  CIRCLE: process.env.AISENSY_CAMPAIGN_CIRCLE || '',
  ESSENTIALS_15TH: process.env.AISENSY_CAMPAIGN_ESSENTIALS_15TH || '',
  ESSENTIALS_1ST: process.env.AISENSY_CAMPAIGN_ESSENTIALS_1ST || '',
  STRATEGY: process.env.AISENSY_CAMPAIGN_STRATEGY || '',

  // Quiz welcome campaigns (program-specific, sent after quiz completion)
  QUIZ_RESULTS_CIRCLE: process.env.AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE || '',
  QUIZ_RESULTS_TRANSFORM: process.env.AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM || '',
  QUIZ_RESULTS_ESSENTIALS: process.env.AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS || '',
  QUIZ_RESULTS_WEBINAR: process.env.AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR || '',
  QUIZ_RESULTS_STRATEGY: process.env.AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY || '',

  // Other campaigns
  PROGRAM_START: process.env.AISENSY_CAMPAIGN_PROGRAM_START || '',
} as const;

// ============================================
// TYPES
// ============================================

export interface AISensyContact {
  phone: string; // WhatsApp number with country code
  name: string; // Full name
  email: string; // Email address
  tags?: string[]; // Segmentation tags
  attributes?: Record<string, string>; // Custom attributes
}

export interface AISensyCampaignPayload {
  apiKey: string;
  campaignName: string;
  destination: string; // Phone number
  userName: string; // Contact name
  source?: string; // Source tracking
  templateParams?: string[]; // Dynamic template parameters
  tags?: string[];
  attributes?: Record<string, string>;
}

export interface AISensyResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================
// VALIDATION & FORMATTING
// ============================================

/**
 * Validate phone number format
 * Accepts: +919876543210, 919876543210, 9876543210
 *
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;

  // Remove whitespace and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Must be 10-15 digits (with or without +)
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Format phone number to E.164 standard (+91XXXXXXXXXX)
 * Assumes Indian numbers by default (+91)
 *
 * @param phone - Phone number to format
 * @returns Formatted phone number with country code
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

  // Remove whitespace and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // If already has country code with +, return as-is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // If starts with country code without +, add +
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    return `+${cleaned}`;
  }

  // Assume Indian number, add +91
  return `+91${cleaned}`;
}

// ============================================
// TAG GENERATION
// ============================================

/**
 * Build tags for contact segmentation
 *
 * Simple Tag Strategy:
 * - Quiz leads: "quiz_essentials", "quiz_circle", "quiz_webinar", "quiz_strategy"
 * - Paid customers: "paid_essentials", "paid_circle", "paid_webinar", "paid_strategy"
 *
 * NOTE: Transform is excluded - users pay for strategy call instead.
 * NOTE: Tags must be pre-created in AISensy dashboard. Unknown tags are silently ignored.
 *
 * @param params - Tag parameters
 * @returns Array of tags
 */
export function buildTags(params: {
  programId?: string; // e.g., "essentials", "circle", "webinar", "strategy"
  isPaid?: boolean;
  isQuizLead?: boolean;
}): string[] {
  const tags: string[] = [];

  // Normalize program ID
  const program = (params.programId || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Skip if no program or if transform (users pay for strategy instead)
  if (!program || program === 'transform') return tags;

  // One tag per contact based on their current state
  if (params.isPaid) {
    tags.push(`paid_${program}`); // e.g., "paid_essentials", "paid_webinar"
  } else if (params.isQuizLead) {
    tags.push(`quiz_${program}`); // e.g., "quiz_essentials", "quiz_webinar"
  }

  return tags;
}

// ============================================
// CAMPAIGN SELECTION
// ============================================

/**
 * Get the appropriate campaign name for a program (payment confirmations)
 * Maps program IDs to their specific payment confirmation campaigns
 *
 * @param programId - Program ID (webinar, essentials, circle, etc.)
 * @param startDateOption - For Essentials: '1st' or '15th'
 * @returns Campaign name or empty string if not found
 */
export function getCampaignForProgram(
  programId: string,
  startDateOption?: string
): string {
  // Normalize program ID to lowercase for matching
  const normalizedId = programId.toLowerCase();

  // Map program IDs to campaigns
  switch (normalizedId) {
    case 'webinar':
      return CAMPAIGNS.WEBINAR;

    case 'transform':
      return CAMPAIGNS.TRANSFORM;

    case 'circle':
      return CAMPAIGNS.CIRCLE;

    case 'essentials':
      // For Essentials, select campaign based on start date
      if (startDateOption === '15th' || startDateOption === '15') {
        return CAMPAIGNS.ESSENTIALS_15TH;
      } else if (startDateOption === '1st' || startDateOption === '1') {
        return CAMPAIGNS.ESSENTIALS_1ST;
      }
      // Default to 1st if no option specified
      return CAMPAIGNS.ESSENTIALS_1ST;

    case 'transform-strategy':
    case 'strategy':
      return CAMPAIGNS.STRATEGY;

    default:
      console.warn(`[AISensy] No campaign configured for program: ${programId}`);
      return '';
  }
}

/**
 * Get the appropriate quiz welcome campaign for a quiz result
 * Maps quiz results to their specific welcome campaigns
 *
 * Naming convention: quiz_results_<programname>
 * Example: quiz_results_circle, quiz_results_transform
 *
 * @param quizResult - Quiz result/program recommendation
 * @returns Campaign name or empty string if not found
 */
export function getQuizWelcomeCampaign(quizResult: string): string {
  // Normalize quiz result to lowercase for matching
  const normalizedResult = quizResult.toLowerCase();

  // Map quiz results to welcome campaigns
  switch (normalizedResult) {
    case 'circle':
      return CAMPAIGNS.QUIZ_RESULTS_CIRCLE;

    case 'transform':
      return CAMPAIGNS.QUIZ_RESULTS_TRANSFORM;

    case 'essentials':
      return CAMPAIGNS.QUIZ_RESULTS_ESSENTIALS;

    case 'webinar':
      return CAMPAIGNS.QUIZ_RESULTS_WEBINAR;

    case 'transform-strategy':
    case 'strategy':
      return CAMPAIGNS.QUIZ_RESULTS_STRATEGY;

    default:
      console.warn(`[AISensy] No quiz welcome campaign configured for result: ${quizResult}`);
      return '';
  }
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Check if AISensy is configured and enabled
 *
 * @returns true if configured, false otherwise
 */
export function isAISensyConfigured(): boolean {
  return !!(AISENSY_ENABLED && AISENSY_API_KEY);
}

/**
 * Send campaign message via AISensy API
 *
 * This is the core API method that sends a WhatsApp message.
 * Sending a campaign message AUTOMATICALLY creates/updates the contact.
 *
 * @param contact - Contact details with phone, name, email
 * @param campaignName - Name of LIVE campaign in AISensy dashboard
 * @param templateParams - Dynamic parameters for template (optional)
 * @returns Promise resolving to success status
 */
export async function sendCampaignMessage(
  contact: AISensyContact,
  campaignName: string,
  templateParams?: string[]
): Promise<AISensyResponse> {
  // Check if configured
  if (!isAISensyConfigured()) {
    console.log('[AISensy] Not configured or disabled, skipping message');
    return { success: false, error: 'AISensy not configured' };
  }

  // Check if campaign name is provided
  if (!campaignName) {
    console.error('[AISensy] Campaign name not provided');
    return { success: false, error: 'Campaign name required' };
  }

  // Validate phone number
  if (!isValidPhoneNumber(contact.phone)) {
    console.error('[AISensy] Invalid phone number:', maskPhone(contact.phone));
    return { success: false, error: 'Invalid phone number' };
  }

  // Format phone number
  const formattedPhone = formatPhoneNumber(contact.phone);

  // Build payload
  const payload: AISensyCampaignPayload = {
    apiKey: AISENSY_API_KEY,
    campaignName,
    destination: formattedPhone,
    userName: contact.name,
    source: 'dmk-quiz-website',
  };

  // Add optional fields
  if (contact.tags && contact.tags.length > 0) {
    payload.tags = contact.tags;
  }

  if (contact.attributes) {
    payload.attributes = contact.attributes;
  }

  // Only add template params if provided (templates may not have dynamic fields)
  // If template has no {{1}}, {{2}} placeholders, don't send templateParams
  if (templateParams && templateParams.length > 0) {
    payload.templateParams = templateParams;
  }

  try {
    console.log('[AISensy] Sending campaign:', {
      campaign: campaignName,
      phone: maskPhone(formattedPhone),
      name: contact.name,
      tags: contact.tags,
    });

    const response = await fetch(`${AISENSY_BASE_URL}/campaign/t1/api/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // AISensy returns 200 on success
    if (response.status === 200) {
      console.log('[AISensy] Message sent successfully:', {
        phone: maskPhone(formattedPhone),
        campaign: campaignName,
      });

      return {
        success: true,
        messageId: `msg_${Date.now()}`, // AISensy doesn't return messageId in docs
      };
    }

    // Handle errors
    const errorText = await response.text();
    console.error('[AISensy] API error:', {
      status: response.status,
      response: errorText,
      phone: maskPhone(formattedPhone),
    });

    return {
      success: false,
      error: errorText || `HTTP ${response.status}`,
    };
  } catch (error) {
    console.error('[AISensy] Request failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      phone: maskPhone(formattedPhone),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// HELPER FUNCTIONS (Business Logic)
// ============================================

/**
 * Send payment confirmation message
 * Called after successful payment verification in webhooks
 * Automatically selects the appropriate campaign based on program
 *
 * @param params - Payment details
 * @returns Promise resolving to success status
 */
export async function sendPaymentConfirmation(params: {
  phone: string;
  name: string;
  email: string;
  programName: string;
  programId: string; // Used to select campaign
  programTier: Program['tier'];
  amount: number;
  paymentId: string;
  isSubscription: boolean;
  startDateOption?: string; // For Essentials: '1st' or '15th'
}): Promise<AISensyResponse> {
  // Auto-select campaign based on program
  const campaignName = getCampaignForProgram(params.programId, params.startDateOption);

  if (!campaignName) {
    console.warn(`[AISensy] No campaign configured for program: ${params.programId}`);
    return {
      success: false,
      error: `No campaign configured for program: ${params.programId}`,
    };
  }

  const tags = buildTags({
    programId: params.programId, // e.g., "essentials", "circle" → creates "paid_essentials", "paid_circle"
    isPaid: true,
  });

  const attributes = {
    program: params.programName,
    amount: params.amount.toString(),
    payment_id: params.paymentId,
    payment_status: 'paid',
    payment_date: new Date().toISOString(),
  };

  // Note: Template params removed since templates have no dynamic fields ({{1}}, {{2}})
  // If you later add dynamic fields to your templates, uncomment below:
  // const templateParams = [
  //   params.name,
  //   `₹${params.amount.toLocaleString('en-IN')}`,
  //   params.programName,
  // ];

  console.log(`[AISensy] Using campaign: ${campaignName} for program: ${params.programId}`);

  return sendCampaignMessage(
    {
      phone: params.phone,
      name: params.name,
      email: params.email,
      tags,
      attributes,
    },
    campaignName
    // templateParams // Removed - templates have no dynamic fields
  );
}

/**
 * Send quiz welcome message
 * Called after quiz submission and Wix CRM sync
 * Automatically selects campaign based on quiz result
 *
 * Campaign naming: quiz_results_<programname>
 * Example: quiz_results_circle, quiz_results_transform
 *
 * @param params - Quiz completion details
 * @returns Promise resolving to success status
 */
export async function sendQuizWelcome(params: {
  phone: string;
  name: string;
  email: string;
  quizResult: string; // Program recommendation
}): Promise<AISensyResponse> {
  // Auto-select quiz welcome campaign based on result
  const campaignName = getQuizWelcomeCampaign(params.quizResult);

  if (!campaignName) {
    const envVarName = `AISENSY_CAMPAIGN_QUIZ_RESULTS_${params.quizResult.toUpperCase()}`;
    console.error(`[AISensy] Quiz welcome message failed for program: ${params.quizResult}`);
    console.error(`[AISensy] Environment variable not set: ${envVarName}`);
    console.error(`[AISensy] Action required:`);
    console.error(`[AISensy]   1. Create campaign in AISensy dashboard`);
    console.error(`[AISensy]   2. Set ${envVarName} in Vercel environment variables`);
    console.error(`[AISensy]   3. Redeploy application`);
    return {
      success: false,
      error: `Missing campaign configuration: ${envVarName}`,
    };
  }

  const tags = buildTags({
    programId: params.quizResult, // e.g., "essentials", "circle" → creates "quiz_essentials", "quiz_circle"
    isQuizLead: true,
  });

  const attributes = {
    quiz_result: params.quizResult,
    lead_source: 'quiz',
    payment_status: 'pending',
    quiz_date: new Date().toISOString(),
  };

  console.log(`[AISensy] Using quiz welcome campaign: ${campaignName} for result: ${params.quizResult}`);

  // No template params - templates have no dynamic fields
  return sendCampaignMessage(
    {
      phone: params.phone,
      name: params.name,
      email: params.email,
      tags,
      attributes,
    },
    campaignName
  );
}

/**
 * Send program start reminder
 * Can be triggered by cron job or webhook before program start date
 *
 * @param params - Program start details
 * @returns Promise resolving to success status
 */
export async function sendProgramStartReminder(params: {
  phone: string;
  name: string;
  email: string;
  programName: string;
  programId?: string;
  startDate: string;
}): Promise<AISensyResponse> {
  const tags = buildTags({
    programId: params.programId || params.programName, // e.g., "essentials" → creates "paid_essentials"
    isPaid: true,
  });

  const attributes = {
    program: params.programName,
    start_date: params.startDate,
  };

  // Optional: Add dynamic parameters
  // Example template: "Hi {{1}}, your {{2}} program starts on {{3}}!"
  const templateParams = [params.name, params.programName, params.startDate];

  return sendCampaignMessage(
    {
      phone: params.phone,
      name: params.name,
      email: params.email,
      tags,
      attributes,
    },
    CAMPAIGNS.PROGRAM_START,
    templateParams
  );
}
