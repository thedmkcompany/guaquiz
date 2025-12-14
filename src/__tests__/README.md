# API Testing Suite

Comprehensive test suite for DMK Quiz payment APIs using Vitest.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once (CI mode)
npm run test:run

# Run with coverage report
npm run test:coverage

# Run with UI
npm run test:ui
```

## Test Structure

```
src/__tests__/
├── api/
│   ├── payment/
│   │   ├── razorpay/
│   │   │   ├── create-order.test.ts    # Order creation tests
│   │   │   └── verify.test.ts          # Payment verification tests
│   │   └── payu/
│   │       └── initiate.test.ts        # PayU payment initiation tests
│   └── webhooks/
│       └── razorpay.test.ts            # Webhook handler tests
├── mocks/
│   ├── razorpay.mock.ts                # Razorpay mock data
│   └── payment.fixtures.ts             # Test fixtures
├── utils/
│   └── test-helpers.ts                 # Reusable test utilities
├── setup.ts                            # Test setup (runs before all tests)
└── README.md                           # This file
```

## Test Coverage

### Razorpay Create Order (`/api/payment/razorpay/create-order`)

**Success Cases:**
- ✅ Create order with valid data
- ✅ Create order for trial program
- ✅ Handle missing optional fields (phone)
- ✅ Return correct response structure

**Validation:**
- ✅ Reject missing required fields (amount, programId, email, name)
- ✅ Reject invalid amounts (negative, zero, string)
- ✅ Reject invalid program IDs

**Security:**
- ✅ Prevent price manipulation
- ✅ Handle SQL injection attempts
- ✅ Handle XSS attempts
- ✅ Reject malformed JSON
- ✅ Don't leak sensitive error details

**Rate Limiting:**
- ✅ Enforce IP-based rate limits
- ✅ Enforce email-based rate limits

**Error Handling:**
- ✅ Handle Razorpay API failures
- ✅ Handle network timeouts

**Edge Cases:**
- ✅ Empty request body
- ✅ Null values
- ✅ Large amounts
- ✅ Special characters in email
- ✅ Unicode characters in name
- ✅ Concurrent requests
- ✅ Unique receipt IDs

### Razorpay Verify (`/api/payment/razorpay/verify`)

**Success Cases:**
- ✅ Verify valid one-time payment
- ✅ Verify valid subscription payment
- ✅ Return payment details

**Validation:**
- ✅ Reject missing payment_id
- ✅ Reject missing signature
- ✅ Reject missing order_id/subscription_id

**Security:**
- ✅ Reject invalid signatures
- ✅ Handle replay attacks
- ✅ Sanitize error messages
- ✅ Handle SQL injection attempts

**Rate Limiting:**
- ✅ Enforce verification rate limits

**Error Handling:**
- ✅ Handle fetchPayment failures
- ✅ Handle malformed JSON
- ✅ Handle verification errors

**Edge Cases:**
- ✅ Very long signature strings
- ✅ Special characters in IDs
- ✅ Null values
- ✅ Both order_id and subscription_id present
- ✅ Concurrent verifications

### PayU Initiate (`/api/payment/payu/initiate`)

**Success Cases:**
- ✅ Initiate payment successfully
- ✅ Return correct payment parameters
- ✅ Format amount correctly
- ✅ Parse names into firstname/lastname
- ✅ Store programId in udf1

**Validation:**
- ✅ Reject missing required fields
- ✅ Reject invalid amounts
- ✅ Reject invalid programs

**Security:**
- ✅ Prevent price manipulation
- ✅ Generate secure hash
- ✅ Handle SQL injection
- ✅ Handle XSS attempts
- ✅ Check PayU configuration

**Rate Limiting:**
- ✅ Enforce IP rate limits
- ✅ Enforce email rate limits

**Error Handling:**
- ✅ Handle hash generation errors
- ✅ Handle malformed JSON

**Edge Cases:**
- ✅ Missing phone number
- ✅ Name with extra spaces
- ✅ Unique transaction IDs
- ✅ Unicode characters
- ✅ Decimal amounts

**Callback URLs:**
- ✅ Correct success/failure URLs
- ✅ Use APP_URL from environment

### Razorpay Webhook (`/api/webhooks/razorpay`)

**Success Cases:**
- ✅ Process payment.captured event
- ✅ Sync to Wix CRM
- ✅ Handle payment.failed event
- ✅ Handle unhandled events

**Security:**
- ✅ Reject invalid signatures
- ✅ Reject missing signatures
- ✅ Prevent replay attacks
- ✅ Mark events as processed

**Error Handling:**
- ✅ Return 200 on CRM sync failure (prevent retries)
- ✅ Handle malformed JSON
- ✅ Handle missing payment entity

**Subscription Events:**
- ✅ subscription.activated
- ✅ subscription.charged
- ✅ subscription.halted
- ✅ subscription.cancelled

**Edge Cases:**
- ✅ Empty notes object
- ✅ Name parsing with single name
- ✅ Concurrent webhook deliveries

**Performance:**
- ✅ Respond quickly even with slow CRM

## Test Categories

### 1. Happy Paths
Tests that verify expected functionality with valid inputs.

### 2. Validation
Tests that ensure proper input validation and rejection of invalid data.

### 3. Security
Tests for security vulnerabilities:
- SQL Injection
- XSS (Cross-Site Scripting)
- Price manipulation
- Signature verification
- Replay attacks

### 4. Rate Limiting
Tests that verify rate limiting is enforced correctly.

### 5. Error Handling
Tests that verify graceful error handling:
- API failures
- Network timeouts
- Malformed requests
- Missing dependencies

### 6. Edge Cases
Tests for unusual but valid scenarios:
- Empty/null values
- Special characters
- Unicode
- Concurrent requests
- Very large values

## Writing New Tests

### Example Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/your-endpoint/route';
import { createMockRequest, getResponseJson } from '@/__tests__/utils/test-helpers';

describe('POST /api/your-endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should handle valid request', async () => {
      const request = createMockRequest({
        body: { /* your data */ },
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        // ... expected fields
      });
    });
  });

  describe('Validation', () => {
    it('should reject invalid input', async () => {
      const request = createMockRequest({
        body: { /* invalid data */ },
      });

      const response = await POST(request);
      const data = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(data.error).toBe('Expected error message');
    });
  });

  describe('Security', () => {
    it('should prevent SQL injection', async () => {
      const request = createMockRequest({
        body: {
          field: "'; DROP TABLE users; --",
        },
      });

      const response = await POST(request);
      expect(response.status).toBeLessThan(500);
    });
  });
});
```

## Mock Helpers

### createMockRequest
```typescript
const request = createMockRequest({
  method: 'POST',
  body: { /* data */ },
  headers: { 'Custom-Header': 'value' },
  url: 'http://localhost:3000/api/test',
  ip: '127.0.0.1',
});
```

### getResponseJson
```typescript
const response = await POST(request);
const data = await getResponseJson(response);
```

### Mocking Environment Variables
```typescript
beforeEach(() => {
  process.env.RAZORPAY_KEY_ID = 'test_key';
  process.env.RAZORPAY_KEY_SECRET = 'test_secret';
});
```

## Best Practices

1. **Arrange-Act-Assert Pattern**
   - Arrange: Set up test data
   - Act: Execute the function
   - Assert: Verify the results

2. **Clear Test Names**
   - Use descriptive names: `should reject request with missing email`
   - Not: `test1` or `works`

3. **Independent Tests**
   - Each test should run independently
   - Use `beforeEach` to reset state
   - Don't rely on test execution order

4. **Mock External Dependencies**
   - Mock Razorpay SDK
   - Mock database calls
   - Mock external APIs

5. **Test Edge Cases**
   - Empty values
   - Null values
   - Very large values
   - Special characters
   - Concurrent requests

6. **Security First**
   - Always test SQL injection
   - Always test XSS
   - Test rate limiting
   - Test signature verification
   - Test replay attacks

## Running Specific Tests

```bash
# Run tests for a specific file
npm test create-order.test.ts

# Run tests matching a pattern
npm test -- --grep "Security"

# Run a specific test suite
npm test -- --grep "POST /api/payment/razorpay/create-order"
```

## Coverage Reports

After running `npm run test:coverage`, view the HTML report:

```bash
# Open coverage report in browser
open coverage/index.html
```

Coverage targets:
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

## CI/CD Integration

Add to your CI pipeline:

```yaml
# GitHub Actions example
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## Troubleshooting

### Tests timing out
Increase timeout in `vitest.config.ts`:
```typescript
test: {
  testTimeout: 20000, // 20 seconds
}
```

### Mock not working
Ensure mocks are defined before imports:
```typescript
vi.mock('@/lib/razorpay', () => ({
  // mock implementation
}));
```

### Environment variables not set
Check `src/__tests__/setup.ts` for proper initialization.

## Additional Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [MSW (Mock Service Worker)](https://mswjs.io)
- [Razorpay API Docs](https://razorpay.com/docs/api)
- [PayU API Docs](https://devguide.payu.in)
