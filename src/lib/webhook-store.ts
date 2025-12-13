// ============================================
// WEBHOOK EVENT STORE
// ============================================
// Prevents replay attacks by tracking processed webhook events
// For production with multiple instances, use Redis/Database
// ============================================

interface WebhookEvent {
  processedAt: number;
  gateway: 'razorpay' | 'payu';
}

// In-memory store for processed webhook events
// Events are kept for 24 hours to prevent replay attacks
const processedEvents = new Map<string, WebhookEvent>();

// Cleanup interval: 1 hour
const CLEANUP_INTERVAL = 60 * 60 * 1000;
// Event retention: 24 hours
const EVENT_RETENTION = 24 * 60 * 60 * 1000;

let lastCleanup = Date.now();

function cleanupOldEvents(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  const cutoff = now - EVENT_RETENTION;

  for (const [eventId, event] of processedEvents.entries()) {
    if (event.processedAt < cutoff) {
      processedEvents.delete(eventId);
    }
  }
}

/**
 * Check if a webhook event has already been processed
 * @param eventId - Unique event identifier from payment gateway
 * @returns true if event was already processed (duplicate)
 */
export function isEventProcessed(eventId: string): boolean {
  cleanupOldEvents();
  return processedEvents.has(eventId);
}

/**
 * Mark a webhook event as processed
 * @param eventId - Unique event identifier
 * @param gateway - Payment gateway source
 */
export function markEventProcessed(
  eventId: string,
  gateway: 'razorpay' | 'payu'
): void {
  processedEvents.set(eventId, {
    processedAt: Date.now(),
    gateway,
  });
}

/**
 * Get processed event count (for monitoring)
 */
export function getProcessedEventCount(): number {
  return processedEvents.size;
}

/**
 * Generate a unique event ID for PayU (which doesn't provide one)
 * Uses transaction ID + status + timestamp combination
 */
export function generatePayUEventId(
  txnid: string,
  status: string,
  mihpayid: string
): string {
  return `payu_${txnid}_${status}_${mihpayid}`;
}
