# Redis Implementation Security Audit Report
**Date**: 2025-12-16
**Auditor**: Claude Sonnet 4.5
**Scope**: Redis-based rate limiting and webhook deduplication

---

## Executive Summary

The Redis implementation was audited for security vulnerabilities, race conditions, and logical errors. **3 CRITICAL issues** and **6 MEDIUM issues** were identified. The most severe issues involve race conditions that could allow rate limit bypass and duplicate webhook processing.

### Risk Level: **HIGH** ⚠️
Immediate action required before production deployment.

---

## Critical Issues (Severity: 🔴 HIGH)

### 🔴 CRITICAL #1: Rate Limit Race Condition (TOCTOU Vulnerability)
**File**: `src/lib/rate-limit.ts:132-152`
**Severity**: HIGH - Allows rate limit bypass

**Issue**:
The rate limit check has a Time-of-Check-Time-of-Use (TOCTOU) vulnerability:

```typescript
// Step 1: Remove old entries
await client.zremrangebyscore(key, 0, windowStart);

// Step 2: Count current entries
const count = await client.zcount(key, windowStart, now);

// Step 3: Check if limit exceeded
if (count >= config.maxRequests) {
  return { allowed: false, ... };
}

// Step 4: Add current request (happens LATER!)
await client.zadd(key, { score: now, member: `${now}:${Math.random()}` });
```

**Attack Scenario**:
1. User A sends request → count = 9 (under limit of 10)
2. User B sends request → count = 9 (still under limit)
3. User A adds entry → count = 10
4. User B adds entry → count = 11 ❌ **LIMIT EXCEEDED**

**Impact**: Attackers can bypass rate limits by sending concurrent requests.

**Fix**: Use Redis Lua script to make operations atomic:

```typescript
// Use Lua script for atomic check-and-increment
const script = `
  local key = KEYS[1]
  local now = ARGV[1]
  local windowStart = ARGV[2]
  local maxRequests = tonumber(ARGV[3])
  local windowMs = tonumber(ARGV[4])

  -- Remove old entries
  redis.call('ZREMRANGEBYSCORE', key, 0, windowStart)

  -- Count current entries
  local count = redis.call('ZCOUNT', key, windowStart, now)

  if count >= maxRequests then
    -- Get oldest entry for resetIn calculation
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local resetIn = 0
    if #oldest > 0 then
      resetIn = math.max(0, oldest[2] + windowMs - now)
    end
    return {0, 0, resetIn} -- not allowed
  end

  -- Add new entry
  redis.call('ZADD', key, now, now .. ':' .. math.random())
  redis.call('EXPIRE', key, math.ceil((windowMs + 60000) / 1000))

  return {1, maxRequests - count - 1, windowMs} -- allowed
end
`;

const result = await client.eval(
  script,
  [key],
  [now, windowStart, config.maxRequests, config.windowMs]
) as [number, number, number];

return {
  allowed: result[0] === 1,
  remaining: result[1],
  resetIn: result[2],
};
```

---

### 🔴 CRITICAL #2: Webhook Deduplication Race Condition
**File**: `src/app/api/webhooks/razorpay/route.ts:54` and `src/app/api/webhooks/payu/route.ts:78`
**Severity**: HIGH - Allows duplicate webhook processing

**Issue**:
The check-then-act pattern allows race conditions:

```typescript
// Check
if (eventId && await isEventProcessed(eventId)) {
  return NextResponse.json({ received: true, duplicate: true });
}

// ... processing ...

// Mark (happens LATER!)
markEventProcessed(eventId, 'razorpay'); // ❌ NOT AWAITED!
```

**Attack Scenario**:
1. Webhook A arrives → `isEventProcessed()` returns false
2. Webhook B arrives (duplicate) → `isEventProcessed()` returns false (A hasn't marked yet)
3. Both webhooks process → **DUPLICATE ACTIONS** (double charge, double CRM entry)

**Impact**:
- Duplicate payments recorded
- Double CRM entries
- Double email notifications
- Accounting inconsistencies

**Fix**: Use Redis SET NX (set if not exists) for atomic check-and-set:

```typescript
// In webhook-store.ts
export async function tryMarkEventProcessed(
  eventId: string,
  gateway: 'razorpay' | 'payu'
): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    return true; // Fail-open: allow processing (handlers are idempotent)
  }

  try {
    const key = `webhook:${eventId}`;
    const data: WebhookEvent = {
      processedAt: Date.now(),
      gateway,
    };

    // Atomic: set only if key doesn't exist
    const result = await client.set(
      key,
      JSON.stringify(data),
      { nx: true, ex: EVENT_RETENTION_SECONDS }
    );

    // result is 'OK' if set succeeded (first time), null if key existed
    return result === 'OK';
  } catch (error) {
    console.error('[Webhook Store] Redis error, allowing processing:', error);
    return true; // Fail-open
  }
}

// In webhook routes
const isFirstProcessing = await tryMarkEventProcessed(eventId, 'razorpay');
if (!isFirstProcessing) {
  console.log(`[Razorpay Webhook] Duplicate event ignored: ${eventId}`);
  return NextResponse.json({ received: true, duplicate: true });
}

// Process webhook...
```

---

### 🔴 CRITICAL #3: Missing await on markEventProcessed
**File**: `src/app/api/webhooks/razorpay/route.ts:71` and `src/app/api/webhooks/payu/route.ts:93`
**Severity**: HIGH - Contributes to race condition

**Issue**:
```typescript
// This is not awaited!
markEventProcessed(eventId, 'razorpay');

return NextResponse.json({ received: true });
```

**Impact**:
- Function returns success before event is marked in Redis
- Allows concurrent duplicates to both pass the check
- Exacerbates CRITICAL #2

**Fix**:
```typescript
await markEventProcessed(eventId, 'razorpay');
return NextResponse.json({ received: true });
```

**Note**: If implementing CRITICAL #2 fix, this becomes moot as the new approach combines check+mark.

---

## Medium Issues (Severity: 🟡 MEDIUM)

### 🟡 MEDIUM #1: Incorrect Documentation
**File**: `src/lib/rate-limit.ts:85`
**Severity**: MEDIUM - Misleading documentation

**Issue**:
```typescript
/**
 * Implements a fixed-window rate limiting algorithm.  // ❌ INCORRECT
```

**Reality**: The implementation uses **sliding window** (which is better!), but docs say fixed-window.

**Fix**:
```typescript
/**
 * Implements a sliding-window rate limiting algorithm using Redis sorted sets.
```

---

### 🟡 MEDIUM #2: Weak Random Number Generation
**File**: `src/lib/rate-limit.ts:152`
**Severity**: MEDIUM - Low collision risk

**Issue**:
```typescript
member: `${now}:${Math.random()}`
```

`Math.random()` is not cryptographically secure and could collide if two requests arrive at the exact same millisecond.

**Impact**: Very low - Redis sorted sets handle duplicate members by overwriting, so this just means one request might not be counted. The probability is extremely low.

**Fix**: Use crypto for better uniqueness:
```typescript
import crypto from 'crypto';

member: `${now}:${crypto.randomUUID()}`
```

---

### 🟡 MEDIUM #3: Expiry Set After Entry Added
**File**: `src/lib/rate-limit.ts:152-155`
**Severity**: MEDIUM - Potential memory leak

**Issue**:
```typescript
await client.zadd(key, { score: now, member: `${now}:${Math.random()}` });
// If process crashes here, key never expires ↓
await client.expire(key, Math.ceil((config.windowMs + 60000) / 1000));
```

**Impact**: If serverless function crashes between lines 152-155, the Redis key will never expire, causing memory leak.

**Fix**: This is solved by the Lua script in CRITICAL #1, as all operations are atomic.

---

### 🟡 MEDIUM #4: Type Assertion Without Validation
**File**: `src/lib/rate-limit.ts:141`
**Severity**: LOW-MEDIUM - Could crash on API changes

**Issue**:
```typescript
const oldestTimestamp = oldest.length > 0 ? (oldest[0] as { score: number }).score : now;
```

If Upstash changes response format, this could throw runtime error.

**Fix**:
```typescript
const oldestTimestamp = oldest.length > 0 &&
  typeof oldest[0] === 'object' &&
  'score' in oldest[0] &&
  typeof oldest[0].score === 'number'
    ? oldest[0].score
    : now;
```

Or trust the client library (acceptable risk).

---

### 🟡 MEDIUM #5: SCAN Performance in getProcessedEventCount
**File**: `src/lib/webhook-store.ts:119-122`
**Severity**: LOW - Only affects monitoring

**Issue**:
```typescript
const result = await client.scan(cursor, { match: 'webhook:*', count: 100 });
```

SCAN with `count: 100` is inefficient. If there are 10,000 webhook keys, this requires 100 iterations.

**Impact**: Slow monitoring endpoint. Doesn't affect webhook processing.

**Fix**:
```typescript
const result = await client.scan(cursor, { match: 'webhook:*', count: 1000 });
```

Better: Don't use SCAN at all. Use a counter:
```typescript
// When marking event processed:
await client.incr('webhook:count');
await client.expire('webhook:count', EVENT_RETENTION_SECONDS);
```

---

### 🟡 MEDIUM #6: No Input Validation on Redis Keys
**File**: Multiple files
**Severity**: LOW - Upstash likely handles this

**Issue**: No validation that user-controlled input (IP addresses, emails, event IDs) don't contain Redis command injection characters.

**Example**:
```typescript
const key = `ratelimit:${identifier}`; // identifier could contain newlines, etc.
```

**Impact**: Likely none - Upstash REST API should handle encoding. But defense-in-depth suggests validating.

**Fix**:
```typescript
function sanitizeRedisKey(input: string): string {
  // Allow only alphanumeric, dots, dashes, underscores
  return input.replace(/[^a-zA-Z0-9._-]/g, '_');
}

const key = `ratelimit:${sanitizeRedisKey(identifier)}`;
```

---

## Low Issues (Severity: 🟢 LOW)

### 🟢 LOW #1: Fail-Open Strategy Trade-offs
**Severity**: INFO - By design, but worth noting

**Issue**: When Redis is unavailable, the system fails open (allows all requests).

**Pros**:
- App stays online during Redis outage
- Better user experience
- Webhook handlers are idempotent

**Cons**:
- No rate limiting during outage → vulnerable to abuse
- No deduplication during outage → possible duplicate webhooks

**Recommendation**: This is acceptable given:
1. Upstash has 99.99% uptime SLA
2. Webhook handlers are designed to be idempotent
3. Alternative (fail-closed) would mean total outage if Redis down

**Monitoring**: Add alerting for when Redis is unavailable so you can respond quickly.

---

## Security Best Practices ✅

### What's Done Well:

✅ **No hardcoded credentials** - All using environment variables
✅ **Credentials not logged** - Error messages don't expose tokens
✅ **`.env.local` gitignored** - No accidental commits
✅ **Fail-open strategy documented** - Clear trade-off decision
✅ **TTL on all keys** - No indefinite memory usage
✅ **Sanitized logging** - No PII in logs

---

## Recommended Action Plan

### Immediate (Before Production Deploy) 🔥

1. **Fix CRITICAL #1**: Implement Lua script for atomic rate limiting
2. **Fix CRITICAL #2**: Implement atomic check-and-set for webhooks
3. **Fix CRITICAL #3**: Add `await` to `markEventProcessed()` (if not using #2 fix)

### High Priority (This Week) ⚠️

4. **Fix MEDIUM #1**: Correct documentation
5. **Fix MEDIUM #2**: Use `crypto.randomUUID()`
6. **Test**: Load test with concurrent requests to verify race condition fixes

### Medium Priority (Next Sprint) 📋

7. **Fix MEDIUM #5**: Improve SCAN performance or use counter
8. **Fix MEDIUM #6**: Add input validation on Redis keys
9. **Monitoring**: Set up alerts for Redis unavailability

### Low Priority (Nice to Have) 💡

10. **Fix MEDIUM #4**: Add runtime type validation
11. **Documentation**: Add runbook for Redis outage scenarios

---

## Testing Recommendations

### Unit Tests Needed:

```typescript
describe('Rate Limit Race Condition', () => {
  it('should not allow concurrent requests to exceed limit', async () => {
    // Set limit to 10
    const promises = Array.from({ length: 20 }, (_, i) =>
      checkRateLimit('test-ip', { maxRequests: 10, windowMs: 60000 })
    );

    const results = await Promise.all(promises);
    const allowed = results.filter(r => r.allowed).length;

    expect(allowed).toBe(10); // Exactly 10 should be allowed
  });
});

describe('Webhook Deduplication Race Condition', () => {
  it('should not process duplicate webhooks sent concurrently', async () => {
    const eventId = 'test-event-123';

    // Send same webhook 10 times concurrently
    const promises = Array.from({ length: 10 }, () =>
      processWebhook(eventId)
    );

    const results = await Promise.all(promises);
    const processed = results.filter(r => r.processed).length;

    expect(processed).toBe(1); // Only 1 should process
  });
});
```

### Load Testing:

```bash
# Use Apache Bench or Artillery to test concurrent requests
ab -n 100 -c 50 https://your-app.vercel.app/api/payment/razorpay/create-order

# Monitor Redis to ensure counts don't exceed limits
```

---

## Conclusion

The Redis implementation has **3 critical race conditions** that must be fixed before production deployment. The recommended fixes are straightforward and well-tested patterns. After implementing the Lua script approach for both rate limiting and webhook deduplication, the system will be production-ready.

**Estimated Fix Time**: 2-3 hours
**Recommended Review**: Code review by senior engineer after fixes
