# Testing & Launch Checklist

## Pre-Development Checklist

### Accounts Setup

- [ ] **Wix Account**
  - [ ] Account created
  - [ ] Site created (even if basic)
  - [ ] API key generated with correct permissions
  - [ ] Site ID obtained

- [ ] **Razorpay Account** (if using)
  - [ ] Account created
  - [ ] Test mode API keys generated
  - [ ] Dashboard accessible

- [ ] **PayUMoney Account** (if using)
  - [ ] Account created
  - [ ] Test credentials obtained
  - [ ] Dashboard accessible

---

## Development Testing

### Environment Setup

- [ ] All environment variables set in `.env.local`
- [ ] Test credentials used (not production)
- [ ] `NEXT_PUBLIC_APP_URL` set to `http://localhost:3000`

### Wix Integration Tests

- [ ] **API Connection**
  - [ ] GET `/api/wix/test` returns success
  - [ ] Pricing plans can be listed
  - [ ] Contact query works

- [ ] **Contact Creation**
  - [ ] New contact created successfully
  - [ ] Duplicate contact handled gracefully
  - [ ] Extended fields populated correctly

- [ ] **Member Operations** (if applicable)
  - [ ] Member created from contact
  - [ ] Password setup email sent

### Razorpay Tests

- [ ] **Order Creation**
  - [ ] POST `/api/payment/create-order` returns order ID
  - [ ] Order visible in Razorpay test dashboard
  - [ ] Correct amount (in paise)

- [ ] **Checkout Flow**
  - [ ] Razorpay checkout modal opens
  - [ ] Pre-filled customer details correct
  - [ ] Theme/branding applied

- [ ] **Test Payments**
  - [ ] Success with card `4111 1111 1111 1111`
  - [ ] Failure with card `4111 1111 1111 1234`
  - [ ] UPI test with `success@razorpay`

- [ ] **Verification**
  - [ ] POST `/api/payment/verify` returns `verified: true`
  - [ ] Invalid signature returns `verified: false`

- [ ] **Webhooks** (use ngrok for local testing)
  - [ ] `payment.captured` event received
  - [ ] Signature verification passes
  - [ ] Wix CRM sync triggered
  - [ ] Response returned within 5 seconds

### PayUMoney Tests (if using)

- [ ] **Payment Initiation**
  - [ ] POST `/api/payment/payu/initiate` returns params
  - [ ] Hash generated correctly

- [ ] **Checkout Flow**
  - [ ] Redirect to PayU test page works
  - [ ] Test card payment completes
  - [ ] Success callback received
  - [ ] Failure callback received

- [ ] **Hash Verification**
  - [ ] Callback hash verification passes
  - [ ] Invalid hash detected

### End-to-End Flow

- [ ] **Happy Path**
  1. [ ] User fills checkout form
  2. [ ] User proceeds to payment
  3. [ ] Payment completes successfully
  4. [ ] Verification passes
  5. [ ] Success page displayed
  6. [ ] Webhook received
  7. [ ] Contact created in Wix CRM
  8. [ ] Pricing plan assigned (if applicable)
  9. [ ] Automation triggered (if configured)

- [ ] **Error Handling**
  - [ ] Payment cancellation handled
  - [ ] Payment failure shows error page
  - [ ] Network errors show user-friendly message
  - [ ] Invalid input rejected with clear message

---

## Staging/Preview Testing

### Deployment

- [ ] App deployed to staging environment
- [ ] Environment variables configured on hosting
- [ ] HTTPS working correctly
- [ ] No console errors on pages

### Webhook Configuration

- [ ] Razorpay webhook URL updated to staging domain
- [ ] PayU webhook URL updated (if using)
- [ ] Test webhook delivery in dashboard

### Full Flow Testing

- [ ] Complete payment flow with test credentials
- [ ] Verify Wix CRM sync working
- [ ] Check webhook logs in payment gateway dashboard
- [ ] Verify success/failure redirects work

---

## Production Launch Checklist

### Pre-Launch

- [ ] **Credentials**
  - [ ] Razorpay KYC completed and approved
  - [ ] Live API keys generated
  - [ ] Environment variables updated to production
  - [ ] Test keys removed from production

- [ ] **Wix Setup**
  - [ ] Pricing plans created and configured
  - [ ] Email templates/automations set up
  - [ ] Extended fields created (if needed)

- [ ] **Webhooks**
  - [ ] Production webhook URL configured
  - [ ] Webhook secret set
  - [ ] Alert email configured

### Security Audit

- [ ] No API keys exposed in client-side code
- [ ] HTTPS enforced on all pages
- [ ] Signature verification enabled for all webhooks
- [ ] Rate limiting considered
- [ ] CORS configured correctly
- [ ] No sensitive data in URL parameters
- [ ] Error messages don't leak sensitive info

### Monitoring Setup

- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Payment success/failure logging
- [ ] Webhook delivery monitoring
- [ ] Wix sync failure alerts

### Documentation

- [ ] API documentation complete
- [ ] Runbook for common issues
- [ ] Contact info for support

---

## Post-Launch Verification

### Immediate (First Hour)

- [ ] Make a real ₹1 test payment
- [ ] Verify payment appears in Razorpay dashboard
- [ ] Verify contact created in Wix CRM
- [ ] Verify pricing plan assigned
- [ ] Verify welcome email received (if configured)
- [ ] Refund the test payment

### First Day

- [ ] Monitor webhook success rate
- [ ] Check for any error logs
- [ ] Verify first real customer payments
- [ ] Confirm CRM sync for all payments

### First Week

- [ ] Review payment success rate
- [ ] Identify and fix any edge cases
- [ ] Gather user feedback
- [ ] Optimize based on data

---

## Troubleshooting Quick Reference

### Payment Not Created

1. Check API keys are correct
2. Verify amount is positive number
3. Check Razorpay dashboard for errors
4. Look at browser console for errors

### Webhook Not Received

1. Check webhook URL is correct
2. Verify HTTPS is working
3. Check Razorpay webhook logs
4. Test with ngrok locally

### Wix Sync Failed

1. Check API key has required permissions
2. Verify Site ID is correct
3. Check Wix dashboard for errors
4. Look at server logs

### Payment Succeeded but CRM Not Updated

1. Check webhook was received
2. Verify webhook processing completed
3. Look for errors in server logs
4. Check Wix API response

---

## Test Data Reference

### Razorpay Test Cards

| Scenario | Card Number | CVV | Expiry |
|----------|-------------|-----|--------|
| Success | 4111 1111 1111 1111 | Any | Any future |
| Failure | 4111 1111 1111 1234 | Any | Any future |

### Razorpay Test UPI

| Scenario | VPA |
|----------|-----|
| Success | success@razorpay |
| Failure | failure@razorpay |

### PayU Test Card

| Scenario | Card Number | CVV | Expiry | OTP |
|----------|-------------|-----|--------|-----|
| Success | 5123456789012346 | 123 | Any future | 123456 |

---

## Performance Benchmarks

| Metric | Target | Critical |
|--------|--------|----------|
| Order creation | < 500ms | < 2s |
| Payment verification | < 200ms | < 1s |
| Webhook processing | < 2s | < 5s |
| Wix CRM sync | < 3s | < 10s |
| Page load (checkout) | < 2s | < 4s |

---

## Emergency Contacts

| Issue | Contact |
|-------|---------|
| Razorpay | support@razorpay.com |
| PayU | merchantcare@payu.in |
| Wix | Through dashboard support |
| Hosting (Vercel) | support@vercel.com |
