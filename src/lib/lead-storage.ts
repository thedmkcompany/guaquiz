/**
 * Lead Storage Utility
 *
 * Unified storage for lead data across the funnel.
 * Uses localStorage (persistent) with sessionStorage fallback.
 *
 * Storage Strategy:
 * - localStorage: Persists across browser sessions (primary)
 * - sessionStorage: Backup for private browsing / localStorage disabled
 *
 * This ensures:
 * 1. Data captured ONCE in quiz
 * 2. Persisted until checkout complete
 * 3. Auto-filled on Essentials page and Checkout
 * 4. Zero duplicate data entry
 */

// Storage keys
const STORAGE_KEYS = {
  QUIZ_RESPONSE: 'dmk_quiz_response',
  LEAD_DATA: 'dmk_lead_data',
  Q1_ANSWER: 'dmk_q1_answer',
} as const;

// Legacy keys (for migration from old sessionStorage)
const LEGACY_KEYS = {
  QUIZ_RESPONSE: 'quizResponse',
  QUIZ_RESULT: 'quizResult',
  Q1_ANSWER: 'dmk_q1_answer',
} as const;

export interface LeadData {
  name: string;
  email: string;
  whatsapp: string;
}

export interface QuizScores {
  essentials: number;
  circle: number;
  transform: number;
}

export interface StoredQuizResponse {
  startedAt: string;
  completedAt: string;
  answers: Record<string, string[]>;
  scores: QuizScores;
  recommendation: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  referralSource?: string;
  lead?: LeadData;
}

/**
 * Check if storage is available
 */
function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe storage write - writes to both localStorage and sessionStorage
 */
function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;

  // Try localStorage first (persistent)
  if (isStorageAvailable('localStorage')) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }
  }

  // Always also write to sessionStorage (backup)
  if (isStorageAvailable('sessionStorage')) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn('sessionStorage write failed:', e);
    }
  }
}

/**
 * Safe storage read - reads from localStorage first, then sessionStorage
 */
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;

  // Try localStorage first (persistent)
  if (isStorageAvailable('localStorage')) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }

  // Fallback to sessionStorage
  if (isStorageAvailable('sessionStorage')) {
    return sessionStorage.getItem(key);
  }

  return null;
}

/**
 * Safe storage remove - removes from both storages
 */
function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;

  if (isStorageAvailable('localStorage')) {
    localStorage.removeItem(key);
  }
  if (isStorageAvailable('sessionStorage')) {
    sessionStorage.removeItem(key);
  }
}

/**
 * Migrate data from legacy sessionStorage keys to new keys
 * Call this on app initialization
 */
export function migrateLegacyStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    // Check if we have new storage already
    const hasNewStorage = safeGetItem(STORAGE_KEYS.QUIZ_RESPONSE);
    if (hasNewStorage) return; // Already migrated

    // Try to migrate from legacy sessionStorage
    const legacyQuizResponse = sessionStorage.getItem(LEGACY_KEYS.QUIZ_RESPONSE);
    if (legacyQuizResponse) {
      safeSetItem(STORAGE_KEYS.QUIZ_RESPONSE, legacyQuizResponse);
      console.log('Migrated quiz response from legacy storage');
    }

    const legacyQ1 = sessionStorage.getItem(LEGACY_KEYS.Q1_ANSWER);
    if (legacyQ1) {
      safeSetItem(STORAGE_KEYS.Q1_ANSWER, legacyQ1);
    }
  } catch (e) {
    console.warn('Legacy storage migration failed:', e);
  }
}

// ============================================
// QUIZ RESPONSE STORAGE
// ============================================

/**
 * Store the complete quiz response
 */
export function storeQuizResponse(response: StoredQuizResponse): void {
  safeSetItem(STORAGE_KEYS.QUIZ_RESPONSE, JSON.stringify(response));

  // Also store Q1 answer separately for quick personalization access
  const q1Answer = response.answers?.q1?.[0];
  if (q1Answer) {
    safeSetItem(STORAGE_KEYS.Q1_ANSWER, q1Answer);
  }

  // Store lead data separately for easy access
  if (response.lead) {
    safeSetItem(STORAGE_KEYS.LEAD_DATA, JSON.stringify(response.lead));
  }
}

/**
 * Get the stored quiz response
 */
export function getQuizResponse(): StoredQuizResponse | null {
  const data = safeGetItem(STORAGE_KEYS.QUIZ_RESPONSE);
  if (!data) return null;

  try {
    return JSON.parse(data) as StoredQuizResponse;
  } catch {
    console.warn('Failed to parse stored quiz response');
    return null;
  }
}

/**
 * Check if quiz has been completed (has lead data)
 */
export function hasCompletedQuiz(): boolean {
  const response = getQuizResponse();
  return !!(response?.lead?.email);
}

// ============================================
// LEAD DATA STORAGE
// ============================================

/**
 * Store lead data (name, email, whatsapp)
 */
export function storeLeadData(lead: LeadData): void {
  safeSetItem(STORAGE_KEYS.LEAD_DATA, JSON.stringify(lead));

  // Also update the quiz response if it exists
  const quizResponse = getQuizResponse();
  if (quizResponse) {
    quizResponse.lead = lead;
    safeSetItem(STORAGE_KEYS.QUIZ_RESPONSE, JSON.stringify(quizResponse));
  }
}

/**
 * Get stored lead data
 * Tries dedicated lead storage first, then falls back to quiz response
 */
export function getLeadData(): LeadData | null {
  // Try dedicated lead storage first
  const leadData = safeGetItem(STORAGE_KEYS.LEAD_DATA);
  if (leadData) {
    try {
      return JSON.parse(leadData) as LeadData;
    } catch {
      // Fall through to quiz response
    }
  }

  // Fall back to quiz response
  const quizResponse = getQuizResponse();
  return quizResponse?.lead || null;
}

/**
 * Update lead data (partial update)
 */
export function updateLeadData(updates: Partial<LeadData>): void {
  const existing = getLeadData();
  const updated: LeadData = {
    name: updates.name ?? existing?.name ?? '',
    email: updates.email ?? existing?.email ?? '',
    whatsapp: updates.whatsapp ?? existing?.whatsapp ?? '',
  };
  storeLeadData(updated);
}

// ============================================
// QUIZ PERSONALIZATION
// ============================================

/**
 * Get Q1 answer for personalization
 */
export function getQ1Answer(): string | null {
  return safeGetItem(STORAGE_KEYS.Q1_ANSWER);
}

/**
 * Get quiz answers for full personalization
 */
export function getQuizAnswers(): Record<string, string> | null {
  const response = getQuizResponse();
  if (!response?.answers) return null;

  // Convert string[] to single string (first answer)
  const answers: Record<string, string> = {};
  Object.entries(response.answers).forEach(([qId, optionIds]) => {
    if (optionIds && optionIds.length > 0) {
      answers[qId] = optionIds[0];
    }
  });
  return answers;
}

/**
 * Get the recommended program
 */
export function getRecommendation(): string | null {
  const response = getQuizResponse();
  return response?.recommendation || null;
}

// ============================================
// CHECKOUT HELPERS
// ============================================

/**
 * Get pre-filled customer info for checkout
 * Returns cleaned data ready for payment forms
 */
export function getCheckoutPrefill(): {
  name: string;
  email: string;
  phone: string;
} | null {
  const lead = getLeadData();
  if (!lead) return null;

  return {
    name: lead.name?.trim() || '',
    email: lead.email?.trim() || '',
    phone: cleanPhoneNumber(lead.whatsapp),
  };
}

/**
 * Clean phone number to 10-digit format
 */
function cleanPhoneNumber(phone: string | undefined | null): string {
  if (!phone) return '';

  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // Handle various country code formats
  if (digits.startsWith('91') && digits.length === 12) {
    // +91 or 91 prefix with 10-digit number
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    // 0 prefix (trunk code)
    digits = digits.slice(1);
  }

  return digits;
}

/**
 * Validate if checkout prefill is complete
 */
export function isCheckoutPrefillComplete(): boolean {
  const prefill = getCheckoutPrefill();
  if (!prefill) return false;

  const hasValidName = prefill.name.length > 0;
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prefill.email);
  const hasValidPhone = /^[6-9]\d{9}$/.test(prefill.phone);

  return hasValidName && hasValidEmail && hasValidPhone;
}

// ============================================
// CLEANUP
// ============================================

/**
 * Clear all stored data (after successful purchase or explicit logout)
 */
export function clearAllStoredData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    safeRemoveItem(key);
  });

  // Also clear legacy keys
  Object.values(LEGACY_KEYS).forEach((key) => {
    safeRemoveItem(key);
  });
}

/**
 * Clear only quiz data (keep lead for re-purchase)
 */
export function clearQuizData(): void {
  safeRemoveItem(STORAGE_KEYS.QUIZ_RESPONSE);
  safeRemoveItem(STORAGE_KEYS.Q1_ANSWER);
}
