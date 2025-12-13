# Payment & Wix CRM Integration Guide

## Overview

This documentation covers the complete setup for integrating payment gateways (Razorpay/PayUMoney) with Wix CRM for automatic customer management and program assignment.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS LANDING PAGE                     │
├─────────────────────────────────────────────────────────────┤
│  • Quiz/Lead Capture Form                                   │
│  • Product/Service Selection                                │
│  • Checkout Page                                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 PAYMENT GATEWAY (Choose One)                │
├─────────────────────────────────────────────────────────────┤
│  Option A: Razorpay (Recommended)                          │
│  Option B: PayUMoney                                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Webhook (Payment Confirmed)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                       │
├─────────────────────────────────────────────────────────────┤
│  /api/payment/create-order    → Create payment order        │
│  /api/payment/verify          → Verify payment (client)     │
│  /api/webhooks/razorpay       → Handle Razorpay webhooks    │
│  /api/webhooks/payumoney      → Handle PayUMoney callbacks  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ On Payment Success
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      WIX PLATFORM                           │
├─────────────────────────────────────────────────────────────┤
│  1. Create/Update Contact (CRM)                            │
│  2. Create Member Account                                   │
│  3. Assign Pricing Plan/Program                            │
│  4. Trigger Welcome Email (Automations)                    │
└─────────────────────────────────────────────────────────────┘
```

## Documentation Index

| Guide | Description |
|-------|-------------|
| [01-WIX-SETUP.md](./01-WIX-SETUP.md) | Wix account, API keys, and pricing plans setup |
| [02-RAZORPAY-SETUP.md](./02-RAZORPAY-SETUP.md) | Razorpay account and integration setup |
| [03-PAYUMONEY-SETUP.md](./03-PAYUMONEY-SETUP.md) | PayUMoney account and integration setup |
| [04-NEXTJS-INTEGRATION.md](./04-NEXTJS-INTEGRATION.md) | Next.js code implementation |
| [05-ENVIRONMENT-VARIABLES.md](./05-ENVIRONMENT-VARIABLES.md) | All required environment variables |
| [06-TESTING-CHECKLIST.md](./06-TESTING-CHECKLIST.md) | Pre-launch testing checklist |

## Quick Start

### Step 1: Wix Setup (Do This First)
1. Create Wix account and site
2. Generate API keys with required permissions
3. Create pricing plans for your programs
4. Set up email automations

### Step 2: Payment Gateway Setup
Choose ONE payment gateway:
- **Razorpay** (Recommended) - Better docs, UPI support, lower fees
- **PayUMoney** - Alternative option

### Step 3: Environment Variables
Copy `.env.example` to `.env.local` and fill in all values.

### Step 4: Install Dependencies
```bash
npm install razorpay @wix/sdk @wix/crm @wix/pricing-plans
```

### Step 5: Deploy & Configure Webhooks
1. Deploy your Next.js app
2. Configure webhook URLs in payment gateway dashboard
3. Test end-to-end flow

## Cost Estimates

| Service | Cost |
|---------|------|
| Razorpay | 2% + GST per transaction |
| PayUMoney | 2% + GST per transaction |
| Wix Premium | Varies by plan |
| Next.js Hosting (Vercel) | Free tier available |

## Support & Resources

- [Wix Developer Docs](https://dev.wix.com/docs)
- [Razorpay Docs](https://razorpay.com/docs)
- [PayU Docs](https://docs.payu.in)
