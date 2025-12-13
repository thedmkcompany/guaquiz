# Environment Variables Guide

## Overview

This guide lists all environment variables needed for the payment and Wix CRM integration.

---

## Quick Setup

1. Copy `.env.example` to `.env.local`
2. Fill in all required values
3. Never commit `.env.local` to git

---

## Complete Variables List

### Wix Configuration (Required)

```env
# Wix API Key - Generate from https://manage.wix.com/account/api-keys
# Required permissions: Manage Contacts, Manage Members, Manage Pricing Plan Orders
WIX_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Wix Site ID - Found in dashboard URL or API Keys Manager
WIX_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Wix Automation Webhook URL (Optional - for email triggers)
# Get this from Wix Automations when setting up webhook trigger
WIX_AUTOMATION_WEBHOOK_URL=https://automations.wix.com/api/v1/hooks/xxxxxxxx
```

### Wix Plan IDs (Add Your Plans)

```env
# Map your program IDs to Wix Pricing Plan IDs
# Get Plan IDs from Wix Dashboard > Pricing Plans > Edit Plan > URL
WIX_PLAN_ID_DEFAULT=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WIX_PLAN_ID_BASIC=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WIX_PLAN_ID_PREMIUM=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
WIX_PLAN_ID_PRO=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Razorpay Configuration

```env
# Razorpay API Keys - Get from https://dashboard.razorpay.com/app/keys
# Use test keys for development, live keys for production

# Server-side only (never expose)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Webhook secret - Set when creating webhook in Razorpay dashboard
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Public key for client-side checkout
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### PayUMoney Configuration (Alternative to Razorpay)

```env
# PayU Merchant Credentials - Get from PayU Dashboard
# Use test credentials for development

# Server-side only
PAYU_MERCHANT_KEY=gtKFFx
PAYU_SALT=eCwWELxi

# Custom webhook authorization header
PAYU_WEBHOOK_SECRET=your_custom_webhook_secret
```

### Application Configuration

```env
# Your application URL (no trailing slash)
# Development: http://localhost:3000
# Production: https://your-domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

---

## Environment File Template

Create `.env.example` in your project root:

```env
# ==================================================
# ENVIRONMENT VARIABLES TEMPLATE
# ==================================================
# Copy this file to .env.local and fill in values
# Never commit .env.local to version control
# ==================================================

# --------------------------------------------------
# WIX CONFIGURATION
# --------------------------------------------------

# Wix API Key (from API Keys Manager)
WIX_API_KEY=

# Wix Site ID
WIX_SITE_ID=

# Wix Automation Webhook URL (optional)
WIX_AUTOMATION_WEBHOOK_URL=

# Wix Pricing Plan IDs (add your plans)
WIX_PLAN_ID_DEFAULT=
WIX_PLAN_ID_BASIC=
WIX_PLAN_ID_PREMIUM=
WIX_PLAN_ID_PRO=

# --------------------------------------------------
# RAZORPAY CONFIGURATION (Primary Payment Gateway)
# --------------------------------------------------

# Test Mode Keys (for development)
# RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=xxxxxxxxxxxx

# Live Mode Keys (for production)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Public key (safe for client-side)
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# --------------------------------------------------
# PAYUMONEY CONFIGURATION (Alternative Gateway)
# --------------------------------------------------

# Test credentials
# PAYU_MERCHANT_KEY=gtKFFx
# PAYU_SALT=eCwWELxi

PAYU_MERCHANT_KEY=
PAYU_SALT=
PAYU_WEBHOOK_SECRET=

# --------------------------------------------------
# APPLICATION SETTINGS
# --------------------------------------------------

# App URL (no trailing slash)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node environment (development/production)
NODE_ENV=development
```

---

## Test vs Production Values

### Razorpay

| Environment | Key ID Format | Key Secret |
|-------------|---------------|------------|
| Test | `rzp_test_*` | Provided with test key |
| Live | `rzp_live_*` | Provided with live key |

### PayUMoney

| Environment | Merchant Key | Salt | Payment URL |
|-------------|--------------|------|-------------|
| Test | `gtKFFx` | `eCwWELxi` | `test.payu.in` |
| Live | Your key | Your salt | `secure.payu.in` |

---

## Security Best Practices

### Do's

- Store secrets in environment variables only
- Use `.env.local` for local development
- Use hosting provider's secrets manager for production
- Rotate API keys periodically
- Use different keys for test and production

### Don'ts

- Never commit `.env.local` or any file with secrets
- Never expose `KEY_SECRET`, `SALT`, or `API_KEY` in client-side code
- Never log full API keys (mask them: `rzp_****xxxx`)
- Never share API keys via email or chat

---

## Vercel Deployment

Add environment variables in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select environments (Production, Preview, Development)

```bash
# Or use Vercel CLI
vercel env add WIX_API_KEY
vercel env add RAZORPAY_KEY_SECRET
# ... etc
```

---

## Validation Script

Create `scripts/validate-env.ts`:

```typescript
const requiredEnvVars = [
  'WIX_API_KEY',
  'WIX_SITE_ID',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  'NEXT_PUBLIC_APP_URL',
];

const optionalEnvVars = [
  'WIX_AUTOMATION_WEBHOOK_URL',
  'WIX_PLAN_ID_DEFAULT',
  'WIX_PLAN_ID_BASIC',
  'WIX_PLAN_ID_PREMIUM',
  'WIX_PLAN_ID_PRO',
  'PAYU_MERCHANT_KEY',
  'PAYU_SALT',
  'PAYU_WEBHOOK_SECRET',
];

function validateEnv() {
  console.log('Validating environment variables...\n');

  let hasErrors = false;

  // Check required variables
  console.log('Required variables:');
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      const masked = process.env[envVar]!.slice(0, 4) + '****';
      console.log(`  ✓ ${envVar}: ${masked}`);
    } else {
      console.log(`  ✗ ${envVar}: MISSING`);
      hasErrors = true;
    }
  }

  // Check optional variables
  console.log('\nOptional variables:');
  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      const masked = process.env[envVar]!.slice(0, 4) + '****';
      console.log(`  ✓ ${envVar}: ${masked}`);
    } else {
      console.log(`  - ${envVar}: Not set`);
    }
  }

  console.log('\n' + (hasErrors ? '❌ Validation failed!' : '✅ All required variables set!'));

  return !hasErrors;
}

validateEnv();
```

Run it:
```bash
npx tsx scripts/validate-env.ts
```

---

## Quick Reference Card

| Variable | Where to Get It |
|----------|-----------------|
| `WIX_API_KEY` | [Wix API Keys Manager](https://manage.wix.com/account/api-keys) |
| `WIX_SITE_ID` | Dashboard URL or API Keys Manager |
| `WIX_AUTOMATION_WEBHOOK_URL` | Wix Dashboard → Automations → Webhook trigger |
| `WIX_PLAN_ID_*` | Wix Dashboard → Pricing Plans → Edit → URL |
| `RAZORPAY_KEY_ID` | [Razorpay Dashboard](https://dashboard.razorpay.com) → API Keys |
| `RAZORPAY_KEY_SECRET` | [Razorpay Dashboard](https://dashboard.razorpay.com) → API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Webhooks → Create |
| `PAYU_MERCHANT_KEY` | [PayU Dashboard](https://dashboard.payu.in) → Settings |
| `PAYU_SALT` | PayU Dashboard → Settings → API Config |
