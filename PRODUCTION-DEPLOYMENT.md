# 🚀 AISensy Integration - Production Deployment Guide

## ✅ Testing Complete - Ready for Production

All tests passed successfully:
- ✅ Phone validation: 8/8
- ✅ Phone formatting: 5/5  
- ✅ Tag generation: 3/3
- ✅ Environment configuration: 9/9
- ✅ Live API test: Message delivered to WhatsApp
- ✅ Contact created in AISensy dashboard

---

## 📋 Pre-Deployment Checklist

### Local Verification
- [x] All automated tests passed
- [x] Live API test successful
- [x] WhatsApp message received
- [x] Contact visible in AISensy dashboard
- [x] All 6 campaigns created and LIVE
- [x] TypeScript compilation clean
- [x] ESLint validation clean

---

## 🌐 Step 1: Add Environment Variables to Vercel

### Login to Vercel
1. Go to: https://vercel.com
2. Navigate to your project
3. Click **Settings** → **Environment Variables**

### Add These 9 Variables

Set **Scope** to: **Production** (and optionally Preview/Development)

```bash
# Variable 1
Name:  AISENSY_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODNmYzc5MTkyNmRhMGY0M2RiMTU4ZiIsIm5hbWUiOiJUaGUgRE1LIENvbXBhbnkgT1BDIFRIRURNSyAoT1BDKSBQUklWQVRFIExJTUlURUQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjg4M2ZjNzkxOTI2ZGEwZjQzZGIxNThhIiwiYWN0aXZlUGxhbiI6IkZSRUVfRk9SRVZFUiIsImlhdCI6MTc1MzQ4MDMxM30.uPYGyAf302R0bNkloMwzHZSLmsLXynil60sX-uyox7o
Scope: Production

# Variable 2
Name:  AISENSY_BASE_URL
Value: https://backend.aisensy.com
Scope: Production

# Variable 3
Name:  NEXT_PUBLIC_AISENSY_ENABLED
Value: true
Scope: Production

# Variable 4
Name:  AISENSY_CAMPAIGN_WEBINAR
Value: webinar_after_payment
Scope: Production

# Variable 5
Name:  AISENSY_CAMPAIGN_TRANSFORM
Value: transform_after_payment
Scope: Production

# Variable 6
Name:  AISENSY_CAMPAIGN_CIRCLE
Value: circle_after_payment
Scope: Production

# Variable 7
Name:  AISENSY_CAMPAIGN_ESSENTIALS_1ST
Value: essentials_1st_after_payment
Scope: Production

# Variable 8
Name:  AISENSY_CAMPAIGN_ESSENTIALS_15TH
Value: essentials_15th_after_payment
Scope: Production

# Variable 9
Name:  AISENSY_CAMPAIGN_STRATEGY
Value: strategy_after_payment
Scope: Production
```

### Verify All Variables Added
After adding, you should see 9 AISensy variables in Vercel settings.

---

## 🔄 Step 2: Deploy to Production

### Option A: Push to Git (Recommended)

```bash
# Check what will be committed
git status

# Stage all changes
git add .

# Create commit
git commit -m "Add AISensy WhatsApp integration

- Auto-campaign selection based on program
- Payment confirmation messages
- Comprehensive contact tagging
- Phone validation and E.164 formatting
- Non-blocking webhook integration
- Security: PII masking in logs

Tested successfully with live API"

# Push to main branch (triggers Vercel deployment)
git push origin main
```

### Option B: Manual Deploy via Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy to production
vercel --prod
```

---

## 📊 Step 3: Monitor Deployment

### Watch Build Progress

1. **Vercel Dashboard**: 
   - Go to your project
   - Click on latest deployment
   - Watch build logs

2. **CLI Monitoring**:
   ```bash
   vercel logs --follow
   ```

### Verify Build Success

Look for:
- ✅ "Build Completed"
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Deployment URL provided

---

## 🧪 Step 4: Production Smoke Test

### Test 1: Small Real Payment (Recommended)

Make a **real payment** for the **smallest program** (Webinar ₹499 recommended):

1. Visit your production URL
2. Complete checkout for Webinar program
3. Make actual payment (₹499)
4. **Within 5 seconds**, check your WhatsApp
5. Verify you received payment confirmation

**What to verify:**
- ✅ WhatsApp message received
- ✅ Message content correct
- ✅ Contact in AISensy dashboard
- ✅ Tags applied: `["webinar", "paid_customer", "active_customer"]`
- ✅ Attributes populated: program, amount, payment_id

### Test 2: Check Logs

```bash
vercel logs --follow
```

**Look for:**
```
[AISensy] Using campaign: webinar_after_payment for program: webinar
[AISensy] Sending campaign: { campaign: 'webinar_after_payment', phone: '+91****XXXX' }
[AISensy] Message sent successfully
```

**Should NOT see:**
```
[AISensy] API error
[AISensy].*failed
```

### Test 3: Verify Webhook Performance

Check that webhooks still return quickly:
- Total webhook time should be < 6 seconds
- Payment gateway gets 200 OK response
- No timeout errors

---

## 🎯 Step 5: First 24 Hours Monitoring

### Success Metrics

**Expected Performance:**
- Message delivery rate: > 95%
- API response time: < 2 seconds
- Webhook total time: < 6 seconds
- Zero payment failures due to AISensy

### Monitor These

**In Vercel Logs:**
```bash
# Count successful messages
vercel logs | grep "\[AISensy\] Message sent successfully" | wc -l

# Count failures
vercel logs | grep "\[AISensy\].*failed" | wc -l
```

**In AISensy Dashboard:**
- New contacts appearing
- Tags correctly applied
- Attributes populated
- Message delivery status

**In Payment Gateway:**
- No increase in failed payments
- Webhook response times normal
- 100% webhook success rate

---

## 🔥 Rollback Plan (If Issues Occur)

### Level 1: Disable Without Code Changes

**In Vercel Environment Variables:**
```
Change: NEXT_PUBLIC_AISENSY_ENABLED = false
```

This immediately stops all AISensy calls without redeploying code.

### Level 2: Redeploy Previous Version

```bash
# Via Vercel Dashboard
1. Go to Deployments
2. Find previous deployment (before AISensy)
3. Click "..." → "Promote to Production"

# Via Git
git revert HEAD
git push origin main
```

---

## ✅ Post-Deployment Verification

### After First Real Payment

- [ ] WhatsApp message received within 5 seconds
- [ ] Correct campaign used based on program
- [ ] Contact created in AISensy dashboard
- [ ] Tags applied correctly
- [ ] Attributes populated with payment data
- [ ] Webhook returned 200 OK to payment gateway
- [ ] No errors in Vercel logs
- [ ] Payment recorded in Wix CRM (existing flow intact)

### After 10 Payments

- [ ] Message delivery rate > 95%
- [ ] All program campaigns working (test each)
- [ ] Essentials differentiation working (1st vs 15th)
- [ ] No duplicate messages
- [ ] Webhook performance stable (< 6s)

---

## 📈 Campaign-to-Program Mapping

Your automatic campaign selection:

| Program ID | Start Date | Campaign Used |
|------------|------------|---------------|
| webinar | - | webinar_after_payment |
| transform | - | transform_after_payment |
| circle | - | circle_after_payment |
| essentials | 1st | essentials_1st_after_payment |
| essentials | 15th | essentials_15th_after_payment |
| strategy | - | strategy_after_payment |

---

## 🎯 Tag Strategy

### Payment Confirmations
Every paid customer gets:
- Program name (e.g., "Circle")
- Program tier (e.g., "circle")
- "paid_customer"
- "active_customer"
- "subscriber" (only for recurring payments)

**Example for Circle:**
```json
["Circle", "circle", "paid_customer", "active_customer"]
```

**Example for Essentials (subscription):**
```json
["Essentials", "essentials", "paid_customer", "active_customer", "subscriber"]
```

---

## 🛠️ Troubleshooting Production Issues

### Issue: No WhatsApp messages being sent

**Check:**
1. Vercel logs: `vercel logs | grep AISensy`
2. Environment variable: `NEXT_PUBLIC_AISENSY_ENABLED=true`
3. Campaign status in AISensy: All must be LIVE
4. API key validity: Check AISensy dashboard

### Issue: Wrong campaign being used

**Check:**
1. Program ID being passed to webhook
2. Campaign mapping in `getCampaignForProgram()`
3. Logs: Look for "Using campaign: X for program: Y"

### Issue: Template params error

**Check:**
1. Templates have no dynamic fields ({{1}}, {{2}})
2. Code doesn't send templateParams (should be removed)
3. If you add dynamic fields later, update code to send params

---

## 📞 Support Resources

**Vercel Logs (Real-time):**
```bash
vercel logs --follow
```

**AISensy Dashboard:**
- Dashboard: https://app.aisensy.com
- Contacts: Check new contacts being created
- Campaigns: Verify all 6 are LIVE
- Support: https://go.aisensy.com/support

**Code Files:**
- Integration: `src/lib/aisensy.ts`
- Razorpay: `src/app/api/webhooks/razorpay/route.ts`
- PayU: `src/app/api/webhooks/payu/route.ts`
- Test Script: `scripts/run-aisensy-test.sh`

---

## 🎉 Success Criteria

Integration is successful when:

✅ **Functionality**
- Payment confirmations sent within 5 seconds
- Correct campaign auto-selected per program
- All contacts created in AISensy with proper tags

✅ **Performance**
- Message delivery rate > 95%
- Webhook response time < 6 seconds
- Zero impact on existing payment flows

✅ **Reliability**
- Webhooks return 200 OK even if AISensy fails
- No duplicate messages
- Errors logged but not thrown

✅ **Data Quality**
- Tags: program + tier + payment type
- Attributes: program, amount, payment_id
- Phone numbers properly formatted

---

## 📅 Next Steps After Deployment

### Week 1
- Monitor message delivery daily
- Check AISensy dashboard for contact growth
- Verify tag accuracy
- Confirm no payment flow disruptions

### Week 2
- Review engagement metrics
- Check message open rates in AISensy
- Analyze which campaigns perform best
- Consider A/B testing message content

### Month 1
- Calculate ROI on WhatsApp automation
- Measure conversion impact
- Review and optimize templates
- Plan additional automation (quiz messages, reminders, etc.)

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Production URL**: _______________

**Status**:
- [ ] ✅ DEPLOYED & VERIFIED
- [ ] ⚠️  DEPLOYED WITH ISSUES
- [ ] ❌ ROLLED BACK

**Notes**:
```
[Add deployment notes, issues encountered, or observations]
```

---

**Ready to deploy? Follow Step 1 above to add environment variables to Vercel!**
