# Wix CRM Setup Guide

## Prerequisites

- A Wix account (free to create)
- A Wix site (can be a basic site, doesn't need to be published)

---

## Step 1: Create a Wix Account & Site

1. Go to [wix.com](https://www.wix.com) and sign up
2. Create a new site (choose any template, we only need the backend)
3. You don't need to publish the site - we just need access to Wix's backend services

---

## Step 2: Generate API Keys

### 2.1 Access API Keys Manager

1. Go to [Wix API Keys Manager](https://manage.wix.com/account/api-keys)
2. Or navigate: Wix Dashboard → Settings → API Keys

### 2.2 Create a New API Key

1. Click **"Generate API Key"**
2. Give it a descriptive name (e.g., "DMK Quiz Integration")
3. Select the following permissions:

#### Required Permissions

| Permission | Purpose |
|------------|---------|
| **Manage Contacts** | Create and update CRM contacts |
| **Manage Members** | Create member accounts |
| **Manage Pricing Plan Orders** | Assign programs to members |
| **Triggered Emails** | Send custom emails (optional) |

### 2.3 Save Your Credentials

After creating the API key, you'll receive:

```
API Key: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**IMPORTANT**:
- Copy and save this immediately - you won't see it again!
- Never expose this key in client-side code
- Store it in environment variables only

### 2.4 Get Your Site ID

1. Go to your Wix site dashboard
2. Look at the URL: `https://manage.wix.com/dashboard/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/...`
3. The ID after `/dashboard/` is your **Site ID**

Alternatively:
1. Go to API Keys Manager
2. Your Site ID is displayed there

---

## Step 3: Create Pricing Plans (Programs)

### 3.1 Access Pricing Plans

1. Go to your Wix Dashboard
2. Navigate to: **Business Tools** → **Pricing Plans**
3. Or search for "Pricing Plans" in the dashboard search

### 3.2 Create a Plan

1. Click **"+ Create Plan"**
2. Fill in the details:

```
Plan Name: [Your Program Name]
Tagline: [Short description]
Price: ₹0 (we handle payment externally)
Duration: Unlimited (or set as needed)
```

### 3.3 Configure Plan Settings

- **What's included**: List the benefits/features
- **Visibility**: Can be hidden from Wix site (we assign via API)
- **Member access**: Configure what members get access to

### 3.4 Get the Plan ID

After creating the plan:

1. Click on the plan to edit it
2. Look at the URL: `.../pricing-plans/plan/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. Copy the Plan ID

**Or via API** (after setup):
```bash
curl -X GET "https://www.wixapis.com/pricing-plans/v2/plans" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "wix-site-id: YOUR_SITE_ID"
```

---

## Step 4: Set Up Email Automations

### 4.1 Access Automations

1. Go to Wix Dashboard
2. Navigate to: **Marketing** → **Automations**
3. Click **"+ Create Automation"**

### 4.2 Create Welcome Email Automation

**Option A: Trigger on Member Created**
1. Trigger: "Member signs up"
2. Action: "Send an email"
3. Configure email template

**Option B: Trigger on External Webhook (Recommended)**
1. Trigger: "Webhook received"
2. Copy the webhook URL (you'll need this later)
3. Action: "Send an email"
4. Configure email template with dynamic variables

### 4.3 Configure Webhook Trigger

If using webhook trigger:

1. Select **"Webhook received"** as trigger
2. Click **"Copy URL"** - save this as `WIX_AUTOMATION_WEBHOOK_URL`
3. Set up sample payload:

```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "programName": "Your Program Name",
  "paymentId": "pay_xxxxx",
  "amount": 9999
}
```

4. Map variables to email template fields

### 4.4 Email Template Variables

In your email template, use these merge tags:
- `{{email}}` - Customer email
- `{{firstName}}` - First name
- `{{lastName}}` - Last name
- `{{programName}}` - Purchased program
- `{{amount}}` - Payment amount

---

## Step 5: Configure Member Settings

### 5.1 Member Signup Settings

1. Go to: **Settings** → **Member Signup**
2. Configure:
   - **Signup method**: Members created via API don't need approval
   - **Login method**: Email + Password

### 5.2 Password Setup Flow

When we create a member via API, we can trigger a "Set Password" email:

```javascript
// After creating member, trigger password setup
await wixClient.auth.sendSetPasswordEmail(memberEmail);
```

---

## Step 6: Test Your Setup

### 6.1 Test API Connection

Create a test file `test-wix-connection.js`:

```javascript
const https = require('https');

const API_KEY = 'your-api-key';
const SITE_ID = 'your-site-id';

const options = {
  hostname: 'www.wixapis.com',
  path: '/contacts/v4/contacts?paging.limit=1',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'wix-site-id': SITE_ID,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(data));
  });
});

req.on('error', (e) => console.error('Error:', e));
req.end();
```

Run it:
```bash
node test-wix-connection.js
```

Expected output: Status 200 with contacts array (empty is fine)

### 6.2 Test Create Contact

```javascript
const testContact = {
  info: {
    name: { first: 'Test', last: 'User' },
    emails: { items: [{ email: 'test@example.com' }] },
    phones: { items: [{ phone: '+919876543210' }] }
  }
};

// POST to /contacts/v4/contacts with this body
```

---

## Wix API Reference

### Base URL
```
https://www.wixapis.com
```

### Required Headers
```
Authorization: Bearer YOUR_API_KEY
wix-site-id: YOUR_SITE_ID
Content-Type: application/json
```

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/contacts/v4/contacts` | POST | Create contact |
| `/contacts/v4/contacts/{id}` | PATCH | Update contact |
| `/members/v1/members` | POST | Create member |
| `/members/v1/members/{id}` | GET | Get member |
| `/pricing-plans/v2/plans` | GET | List plans |
| `/pricing-plans/v2/orders` | POST | Create order (assign plan) |

---

## Troubleshooting

### Error: 401 Unauthorized
- Check API key is correct
- Ensure API key has required permissions
- Verify Site ID matches the key's associated site

### Error: 403 Forbidden
- API key doesn't have permission for this operation
- Regenerate key with correct permissions

### Error: 404 Not Found
- Check endpoint URL is correct
- Verify Site ID is valid

### Contact/Member Already Exists
- Use `allowDuplicates: true` when creating contacts
- Query existing contact/member first, then update

---

## Security Best Practices

1. **Never expose API key in client-side code**
2. **Store API key in environment variables**
3. **Use HTTPS for all API calls**
4. **Implement rate limiting** (Wix has limits)
5. **Log API errors for debugging**
6. **Rotate API keys periodically**

---

## Environment Variables Summary

After completing Wix setup, you should have:

```env
# Wix Configuration
WIX_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WIX_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WIX_AUTOMATION_WEBHOOK_URL=https://automations.wix.com/...

# Plan IDs (add for each program)
WIX_PLAN_ID_PROGRAM_1=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WIX_PLAN_ID_PROGRAM_2=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
