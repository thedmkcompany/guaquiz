# API Reference

Complete reference for all API endpoints in the DMK Quiz application.

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

Most endpoints are public. Admin and cron endpoints require authentication:

| Endpoint Type | Auth Method |
|--------------|-------------|
| Public | None |
| Admin | Basic Auth (`ADMIN_USER`, `ADMIN_PASSWORD`) |
| Cron | Header (`x-cron-secret: CRON_SECRET`) |

---

## Quiz Endpoints

### POST /api/quiz/submit

Submit quiz answers and capture lead data.

**Request Body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "whatsapp": "+919876543210",
  "recommendation": "circle",
  "answers": {
    "q1": ["q1-c"],
    "q2": ["q2-d"],
    "q3": ["q3-b"],
    "q4": ["q4-b"],
    "q5": ["q5-b"],
    "q6": ["q6-c"],
    "q7": ["q7-b"],
    "q8": ["q8-a"]
  },
  "deviceType": "mobile",
  "referralSource": "instagram"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "leadId": "lead_abc123"
}
```

**Response (400 Bad Request)**

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Invalid email address"]
  }
}
```

**Notes**
- Stores lead in Supabase immediately
- Syncs to Wix CRM asynchronously (fire-and-forget)
- Returns immediately without waiting for CRM sync

---

### POST /api/quiz/retry-sync

Retry failed Wix CRM syncs. Called by cron job.

**Headers**

```
x-cron-secret: your_cron_secret
```

**Response (200 OK)**

```json
{
  "synced": 3,
  "failed": 1,
  "total": 4
}
```

**Response (401 Unauthorized)**

```json
{
  "error": "Unauthorized"
}
```

---

## Payment Endpoints

### POST /api/payment/razorpay/create-order

Create a Razorpay order for one-time payment.

**Request Body**

```json
{
  "amount": 4499,
  "programId": "circle",
  "programName": "Circle",
  "customerEmail": "jane@example.com",
  "customerName": "Jane Doe",
  "customerPhone": "+919876543210"
}
```

**Response (200 OK)**

```json
{
  "orderId": "order_ABC123",
  "key": "rzp_live_xxx",
  "amount": 449900,
  "currency": "INR",
  "programId": "circle",
  "programName": "Circle"
}
```

**Response (400 Bad Request - Price Mismatch)**

```json
{
  "error": "Invalid amount for selected program",
  "code": "PRICE_MISMATCH"
}
```

**Response (429 Too Many Requests)**

```json
{
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMITED",
  "retryAfter": 300
}
```

**Rate Limits**
- 10 requests per 15 minutes per IP
- 5 requests per hour per email

---

### POST /api/payment/razorpay/create-subscription

Create a Razorpay subscription for recurring payments.

**Request Body**

```json
{
  "planId": "plan_ABC123",
  "programId": "circle",
  "programName": "Circle",
  "customerEmail": "jane@example.com",
  "customerName": "Jane Doe",
  "customerPhone": "+919876543210",
  "totalCount": 12
}
```

**Response (200 OK)**

```json
{
  "subscriptionId": "sub_ABC123",
  "key": "rzp_live_xxx",
  "programId": "circle",
  "programName": "Circle"
}
```

---

### POST /api/payment/razorpay/verify

Verify Razorpay payment signature after successful payment.

**Request Body (Order Payment)**

```json
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_payment_id": "pay_ABC123",
  "razorpay_signature": "abc123signature..."
}
```

**Request Body (Subscription Payment)**

```json
{
  "razorpay_subscription_id": "sub_ABC123",
  "razorpay_payment_id": "pay_ABC123",
  "razorpay_signature": "abc123signature..."
}
```

**Response (200 OK)**

```json
{
  "verified": true,
  "paymentId": "pay_ABC123",
  "status": "captured"
}
```

**Response (400 Bad Request)**

```json
{
  "error": "Invalid payment signature",
  "code": "INVALID_SIGNATURE"
}
```

---

### POST /api/payment/payu/initiate

Initiate PayU payment (fallback gateway).

**Request Body**

```json
{
  "amount": 4499,
  "programId": "circle",
  "programName": "Circle",
  "customerEmail": "jane@example.com",
  "customerName": "Jane Doe",
  "customerPhone": "+919876543210"
}
```

**Response (200 OK)**

```json
{
  "key": "your_merchant_key",
  "txnid": "TXN_ABC123",
  "amount": "4499.00",
  "productinfo": "Circle",
  "firstname": "Jane",
  "email": "jane@example.com",
  "phone": "+919876543210",
  "surl": "https://your-domain.com/api/payment/payu/callback",
  "furl": "https://your-domain.com/api/payment/payu/callback",
  "hash": "computed_hash_value..."
}
```

---

### POST /api/payment/payu/callback

Handle PayU payment callback (redirect endpoint).

**Form Data**

```
status=success
txnid=TXN_ABC123
amount=4499.00
productinfo=Circle
firstname=Jane
email=jane@example.com
mihpayid=PAY_ABC123
hash=callback_hash...
```

**Response**

Redirects to:
- Success: `/checkout/success?txnid=TXN_ABC123`
- Failure: `/checkout/failed?reason=payment_failed`

---

## Webhook Endpoints

### POST /api/webhooks/razorpay

Handle Razorpay webhook events.

**Headers**

```
x-razorpay-signature: webhook_signature
Content-Type: application/json
```

**Supported Events**

| Event | Description |
|-------|-------------|
| `payment.captured` | Payment successfully captured |
| `payment.failed` | Payment failed |
| `subscription.activated` | Subscription started |
| `subscription.charged` | Recurring payment processed |
| `subscription.cancelled` | Subscription cancelled |

**Example Payload (payment.captured)**

```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_ABC123",
        "amount": 449900,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_ABC123",
        "email": "jane@example.com",
        "contact": "+919876543210"
      }
    }
  }
}
```

**Response (200 OK)**

```json
{
  "success": true
}
```

**Rate Limit**

100 requests per minute (from Razorpay IPs)

---

### POST /api/webhooks/payu

Handle PayU webhook callbacks.

**Form Data**

```
status=success
txnid=TXN_ABC123
mihpayid=PAY_ABC123
amount=4499.00
hash=webhook_hash...
```

**Response (200 OK)**

```json
{
  "success": true
}
```

---

## Admin Endpoints

### GET /api/admin/sync-status

View lead sync status dashboard.

**Authentication**

```
Authorization: Basic base64(ADMIN_USER:ADMIN_PASSWORD)
```

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `status` | string | Filter by sync status: `pending`, `synced`, `failed` |
| `email` | string | Search by email |

**Response (200 OK)**

```json
{
  "leads": [
    {
      "id": "lead_123",
      "email": "jane@example.com",
      "name": "Jane Doe",
      "recommendation": "circle",
      "wix_sync_status": "synced",
      "wix_contact_id": "contact_abc",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:05Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

**Response (401 Unauthorized)**

```json
{
  "error": "Unauthorized"
}
```

---

### GET /api/health

Health check endpoint.

**Response (200 OK)**

```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request body validation failed |
| `INVALID_PROGRAM` | Program ID not found |
| `PRICE_MISMATCH` | Amount doesn't match program price |
| `PLAN_MISMATCH` | Subscription plan ID mismatch |
| `NOT_CONFIGURED` | Required configuration missing |
| `INVALID_SIGNATURE` | Payment signature verification failed |
| `PROCESSING_ERROR` | Server-side processing error |
| `RATE_LIMITED` | Too many requests |

---

## Rate Limiting

| Endpoint | Limit | Window | Identifier |
|----------|-------|--------|------------|
| `/api/payment/*/create-*` | 10 | 15 min | IP |
| `/api/payment/*/verify` | 20 | 15 min | IP |
| Payment endpoints | 5 | 1 hour | Email |
| `/api/webhooks/*` | 100 | 1 min | IP |

**Rate Limit Response Headers**

```
Retry-After: 300
X-RateLimit-Remaining: 0
```

---

## Examples

### Complete Payment Flow

```bash
# 1. Create order
curl -X POST https://your-domain.com/api/payment/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 4499,
    "programId": "circle",
    "customerEmail": "jane@example.com",
    "customerName": "Jane Doe"
  }'

# Response: { "orderId": "order_ABC123", "key": "rzp_live_xxx", ... }

# 2. (Frontend) Open Razorpay checkout with orderId

# 3. Verify payment after Razorpay callback
curl -X POST https://your-domain.com/api/payment/razorpay/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_ABC123",
    "razorpay_payment_id": "pay_ABC123",
    "razorpay_signature": "abc123..."
  }'

# Response: { "verified": true, "paymentId": "pay_ABC123" }
```

### Quiz Submission

```bash
curl -X POST https://your-domain.com/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "whatsapp": "+919876543210",
    "recommendation": "circle",
    "answers": {
      "q1": ["q1-c"],
      "q2": ["q2-d"],
      "q3": ["q3-b"],
      "q4": ["q4-b"],
      "q5": ["q5-b"],
      "q6": ["q6-c"],
      "q7": ["q7-b"],
      "q8": ["q8-a"]
    },
    "deviceType": "desktop"
  }'
```

### Admin Dashboard

```bash
# Get sync status with basic auth
curl https://your-domain.com/api/admin/sync-status \
  -u "admin:your_password" \
  -G \
  -d "status=failed" \
  -d "page=1"
```
