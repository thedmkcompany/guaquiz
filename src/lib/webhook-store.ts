// ============================================
// WEBHOOK EVENT STORE
// ============================================
// Prevents replay attacks by tracking processed webhook events
// Uses Redis for distributed deduplication across serverless instances
// ============================================

import { Redis } from '@upstash/redis';

interface WebhookEvent {
  processedAt: number;
  gateway: 'razorpay' | 'payu';
}

// Event retention: 24 hours
const EVENT_RETENTION_SECONDS = 24 * 60 * 60;

/**
 * Redis client for webhook event deduplication.
 * @internal
 */
let redis: Redis | null = null;

/**
 * Get or create Redis client instance.
 * @internal
 */
function getRedisClient(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('[Webhook Store] Redis credentials not configured. Event deduplication disabled.');
    return null;
  }

  try {
    redis = new Redis({ url, token });
    return redis;
  } catch (error) {
    console.error('[Webhook Store] Failed to initialize Redis:', error);
    return null;
  }
}

/**
 * Atomically check and mark a webhook event as processed
 * Returns true if this is the first time processing (should proceed)
 * Returns false if event was already processed (duplicate, should skip)
 *
 * Uses Redis SET NX (set if not exists) to prevent race conditions
 *
 * @param eventId - Unique event identifier from payment gateway
 * @param gateway - Payment gateway source
 * @returns true if first time processing, false if duplicate
 */
export async function tryMarkEventProcessed(
  eventId: string,
  gateway: 'razorpay' | 'payu'
): Promise<boolean> {
  const client = getRedisClient();

  // Fail-open: If Redis unavailable, allow processing (idempotent operations)
  if (!client) {
    return true;
  }

  try {
    const key = `webhook:${eventId}`;
    const data: WebhookEvent = {
      processedAt: Date.now(),
      gateway,
    };

    // Atomic: set only if key doesn't exist (NX = set if Not eXists)
    // Returns 'OK' if set succeeded (first time), null if key already existed
    const result = await client.set(
      key,
      JSON.stringify(data),
      { nx: true, ex: EVENT_RETENTION_SECONDS }
    );

    return result === 'OK';
  } catch (error) {
    console.error('[Webhook Store] Redis error, allowing processing:', error);
    // Fail-open: Allow processing since webhook handlers are idempotent
    return true;
  }
}

/**
 * @deprecated Use tryMarkEventProcessed instead for atomic check-and-set
 * Check if a webhook event has already been processed
 * @param eventId - Unique event identifier from payment gateway
 * @returns true if event was already processed (duplicate)
 */
export async function isEventProcessed(eventId: string): Promise<boolean> {
  const client = getRedisClient();

  // Fail-open: If Redis unavailable, allow processing (idempotent operations)
  if (!client) {
    return false;
  }

  try {
    const key = `webhook:${eventId}`;
    const exists = await client.get(key);
    return exists !== null;
  } catch (error) {
    console.error('[Webhook Store] Redis error checking event, allowing processing:', error);
    // Fail-open: Allow processing since webhook handlers are idempotent
    return false;
  }
}

/**
 * @deprecated Use tryMarkEventProcessed instead for atomic check-and-set
 * Mark a webhook event as processed
 * @param eventId - Unique event identifier
 * @param gateway - Payment gateway source
 */
export async function markEventProcessed(
  eventId: string,
  gateway: 'razorpay' | 'payu'
): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    return; // No-op if Redis unavailable
  }

  try {
    const key = `webhook:${eventId}`;
    const data: WebhookEvent = {
      processedAt: Date.now(),
      gateway,
    };

    // Store event with 24-hour expiry
    await client.set(key, JSON.stringify(data), { ex: EVENT_RETENTION_SECONDS });
  } catch (error) {
    console.error('[Webhook Store] Redis error marking event:', error);
    // Non-critical: Continue processing even if marking fails
  }
}

/**
 * Get processed event count (for monitoring)
 * Note: This is approximate due to Redis SCAN limitations
 */
export async function getProcessedEventCount(): Promise<number> {
  const client = getRedisClient();

  if (!client) {
    return 0;
  }

  try {
    // Use SCAN to count webhook keys (approximate)
    let cursor = 0;
    let count = 0;

    do {
      const result = await client.scan(cursor, { match: 'webhook:*', count: 100 });
      cursor = typeof result[0] === 'string' ? parseInt(result[0], 10) : result[0];
      count += result[1].length;
    } while (cursor !== 0);

    return count;
  } catch (error) {
    console.error('[Webhook Store] Redis error counting events:', error);
    return 0;
  }
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
