# 🧪 Quiz Email & WhatsApp Testing Checklist

Use this checklist to verify your quiz welcome messages are working correctly.

---

## Pre-Testing Setup Verification

### AISensy Configuration
- [ ] Logged into https://app.aisensy.com
- [ ] 5 WhatsApp templates created and approved ✅
- [ ] 5 API campaigns created from approved templates
- [ ] All campaigns status: **LIVE** ✅
- [ ] Campaign names match exactly:
  - [ ] `quiz_results_circle`
  - [ ] `quiz_results_transform`
  - [ ] `quiz_results_essentials`
  - [ ] `quiz_results_webinar`
  - [ ] `quiz_results_strategy`

### Wix Configuration
- [ ] Logged into https://manage.wix.com
- [ ] Automation created for quiz leads
- [ ] Automation status: **Active** ✅
- [ ] Email template configured
- [ ] Webhook URL in `.env.local` matches Wix automation trigger

### Vercel Configuration
- [ ] Environment variables added via CLI or dashboard
- [ ] All 5 `AISENSY_CAMPAIGN_QUIZ_RESULTS_*` variables present
- [ ] Application redeployed after adding variables
- [ ] Deployment successful (check https://vercel.com)

### Local Configuration
- [ ] `.env.local` has all quiz campaign variables
- [ ] `NEXT_PUBLIC_AISENSY_ENABLED=true`
- [ ] `AISENSY_API_KEY` is set

---

## Test 1: Circle Recommendation

### Setup
- **Test Email:** `test+circle@yourdomain.com` (or your test email)
- **Test Phone:** Your WhatsApp number (with +91 prefix)
- **Expected Result:** Circle program

### Steps
1. [ ] Go to your live website quiz
2. [ ] Complete quiz to get "Circle" recommendation
3. [ ] Submit quiz with test email and phone

### Verification

**Immediate (within 30 seconds):**
- [ ] Success message displayed on quiz results page
- [ ] No errors in browser console

**Within 1-2 minutes:**
- [ ] WhatsApp message received on test phone
- [ ] Message content matches Circle program
- [ ] Formatting looks good on mobile

**Within 5 minutes:**
- [ ] Email received in inbox (check spam if not)
- [ ] Email subject appropriate for Circle
- [ ] Email content mentions Circle program
- [ ] Dynamic fields populated (name, etc.)

**Backend Verification:**
- [ ] Check Supabase `quiz_leads` table:
  - New row with test email
  - `recommendation: "circle"`
  - `sync_status: "synced"`
  - `wix_contact_id` populated
- [ ] Check Wix Contacts:
  - Contact created with test email
  - Label: "Lead"
  - Custom field `quizRecommendation: "circle"`
- [ ] Check AISensy Contacts:
  - Contact created with test phone
  - Tags include: `quiz_lead`, `circle`
  - Attributes: `quiz_result: "circle"`, `lead_source: "quiz"`

### Screenshot/Notes
```
[Add screenshot of WhatsApp message]
[Add screenshot of email]
[Note any issues]
```

---

## Test 2: Transform Recommendation

### Setup
- **Test Email:** `test+transform@yourdomain.com`
- **Test Phone:** Your WhatsApp number
- **Expected Result:** Transform program

### Steps
1. [ ] Complete quiz to get "Transform" recommendation
2. [ ] Submit quiz with test email and phone

### Verification

**WhatsApp:**
- [ ] Message received
- [ ] Content matches Transform program
- [ ] Formatting correct

**Email:**
- [ ] Email received
- [ ] Subject appropriate for Transform
- [ ] Content mentions Transform program

**Backend:**
- [ ] Supabase: `recommendation: "transform"`, status synced
- [ ] Wix: Contact created, `quizRecommendation: "transform"`
- [ ] AISensy: Tags include `transform`, attributes correct

### Screenshot/Notes
```
[Add screenshots]
[Note any issues]
```

---

## Test 3: Essentials Recommendation

### Setup
- **Test Email:** `test+essentials@yourdomain.com`
- **Test Phone:** Your WhatsApp number
- **Expected Result:** Essentials program

### Steps
1. [ ] Complete quiz to get "Essentials" recommendation
2. [ ] Submit quiz with test email and phone

### Verification

**WhatsApp:**
- [ ] Message received
- [ ] Content matches Essentials program

**Email:**
- [ ] Email received
- [ ] Content mentions Essentials program

**Backend:**
- [ ] Supabase: `recommendation: "essentials"`
- [ ] Wix: `quizRecommendation: "essentials"`
- [ ] AISensy: Tags include `essentials`

### Screenshot/Notes
```
[Add screenshots]
[Note any issues]
```

---

## Test 4: Webinar Recommendation

### Setup
- **Test Email:** `test+webinar@yourdomain.com`
- **Test Phone:** Your WhatsApp number
- **Expected Result:** Webinar

### Steps
1. [ ] Complete quiz to get "Webinar" recommendation
2. [ ] Submit quiz with test email and phone

### Verification

**WhatsApp:**
- [ ] Message received
- [ ] Content matches Webinar

**Email:**
- [ ] Email received
- [ ] Content mentions Webinar

**Backend:**
- [ ] Supabase: `recommendation: "webinar"`
- [ ] Wix: `quizRecommendation: "webinar"`
- [ ] AISensy: Tags include `webinar`

### Screenshot/Notes
```
[Add screenshots]
[Note any issues]
```

---

## Test 5: Strategy Recommendation

### Setup
- **Test Email:** `test+strategy@yourdomain.com`
- **Test Phone:** Your WhatsApp number
- **Expected Result:** Transform Strategy

### Steps
1. [ ] Complete quiz to get "Strategy" recommendation
2. [ ] Submit quiz with test email and phone

### Verification

**WhatsApp:**
- [ ] Message received
- [ ] Content matches Strategy session

**Email:**
- [ ] Email received
- [ ] Content mentions Strategy call

**Backend:**
- [ ] Supabase: `recommendation: "strategy"` or `"transform-strategy"`
- [ ] Wix: `quizRecommendation` matches
- [ ] AISensy: Tags include `strategy` or `transform-strategy`

### Screenshot/Notes
```
[Add screenshots]
[Note any issues]
```

---

## Edge Case Testing

### Test 6: Duplicate Submission
**Goal:** Verify system handles duplicate email gracefully

1. [ ] Submit quiz with same email as Test 1
2. [ ] Verify WhatsApp message still sent
3. [ ] Check Supabase: Lead updated, not duplicated
4. [ ] Check Wix: Contact updated, not duplicated
5. [ ] Check AISensy: Contact updated, not duplicated

### Test 7: Invalid Phone Number
**Goal:** Verify system handles invalid phone gracefully

1. [ ] Submit quiz with invalid phone (e.g., "123")
2. [ ] Verify quiz still completes
3. [ ] Check logs for graceful error handling
4. [ ] Verify Supabase still stores lead
5. [ ] Email should still be sent (Wix)

### Test 8: Missing Phone Number
**Goal:** Verify system handles missing phone

1. [ ] Submit quiz with empty phone field
2. [ ] Verify quiz completes (if validation allows)
3. [ ] Email sent, WhatsApp skipped
4. [ ] Supabase stores lead

### Test 9: Special Characters in Name
**Goal:** Verify name handling

1. [ ] Submit quiz with name: "Test O'Neil"
2. [ ] Verify WhatsApp message displays name correctly
3. [ ] Verify email displays name correctly
4. [ ] No errors in logs

### Test 10: Long Delay Test
**Goal:** Verify fire-and-forget works

1. [ ] Temporarily disable AISensy (set `NEXT_PUBLIC_AISENSY_ENABLED=false`)
2. [ ] Submit quiz
3. [ ] Verify quiz completes successfully
4. [ ] User sees success message immediately
5. [ ] Check logs: AISensy skipped, no errors blocking

---

## Performance Testing

### Test 11: Load Test (Optional)
**Goal:** Verify system handles multiple submissions

1. [ ] Submit 10 quizzes rapidly (use different emails)
2. [ ] Verify all 10 stored in Supabase
3. [ ] Verify all 10 receive WhatsApp messages
4. [ ] Verify all 10 receive emails
5. [ ] Check for any rate limiting issues

---

## Monitoring & Logging

### Vercel Logs
```bash
# View real-time logs during testing
vercel logs --follow
```

**Look for:**
- `[AISensy] Using quiz welcome campaign: quiz_results_circle for result: circle`
- Success indicators
- Any error messages

### AISensy Dashboard
1. [ ] Go to Reports → Campaign Reports
2. [ ] Select `quiz_results_circle` campaign
3. [ ] Verify delivery status: "Delivered" ✅
4. [ ] Check delivery time (should be < 2 minutes)
5. [ ] Repeat for all 5 campaigns

### Wix Automation Analytics
1. [ ] Go to Automations in Wix dashboard
2. [ ] Click on quiz lead automation
3. [ ] Check "Analytics" tab
4. [ ] Verify emails sent count matches tests
5. [ ] Check success rate (should be 100%)

### Supabase Database
```sql
-- Check all quiz leads
SELECT
  email,
  recommendation,
  sync_status,
  wix_contact_id,
  created_at
FROM quiz_leads
ORDER BY created_at DESC
LIMIT 10;

-- Check sync success rate
SELECT
  sync_status,
  COUNT(*) as count
FROM quiz_leads
GROUP BY sync_status;
```

---

## Troubleshooting

### Issue: WhatsApp Not Received

**Check:**
1. [ ] Campaign is LIVE in AISensy
2. [ ] Campaign name matches environment variable exactly
3. [ ] Phone number format correct (+91XXXXXXXXXX)
4. [ ] AISensy API key valid
5. [ ] Vercel environment variable set
6. [ ] Application redeployed after adding env vars

**Debug:**
```bash
# Check Vercel logs
vercel logs --follow

# Look for AISensy errors
grep -i "aisensy" logs.txt
```

### Issue: Email Not Received

**Check:**
1. [ ] Wix automation is active
2. [ ] Webhook URL correct in `.env.local`
3. [ ] Email in spam/junk folder
4. [ ] Wix sender email verified
5. [ ] Contact created in Wix with "Lead" label

**Debug:**
- Check Wix automation run history
- Verify webhook was triggered
- Test automation manually in Wix dashboard

### Issue: Database Not Updated

**Check:**
1. [ ] Supabase credentials correct
2. [ ] `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set
3. [ ] Network connectivity to Supabase

**Debug:**
```bash
# Check Supabase connection
curl https://qxlefltkzroicjzlmabs.supabase.co/rest/v1/quiz_leads \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

---

## Success Criteria

All tests pass when:
- ✅ All 5 quiz results trigger appropriate WhatsApp messages
- ✅ All 5 quiz results trigger appropriate emails
- ✅ Messages delivered within 2 minutes
- ✅ Emails delivered within 5 minutes
- ✅ All leads stored in Supabase with `sync_status: "synced"`
- ✅ All contacts created in Wix with correct labels and fields
- ✅ All contacts created in AISensy with correct tags and attributes
- ✅ Edge cases handled gracefully (duplicates, invalid data)
- ✅ No errors in production logs
- ✅ System performs well under load

---

## Post-Testing Cleanup

After successful testing:

1. [ ] Delete test contacts from Wix CRM
2. [ ] Delete test contacts from AISensy
3. [ ] Delete test leads from Supabase (optional)
4. [ ] Document any issues found and resolutions
5. [ ] Update this checklist with any new scenarios discovered

---

## Sign-Off

**Tested by:** ___________________________
**Date:** ___________________________
**Result:** ✅ Pass / ❌ Fail
**Notes:**
```
[Any additional notes, observations, or recommendations]
```

---

## Next Steps After Testing

Once all tests pass:
1. Monitor production for first few real quiz submissions
2. Set up alerts for failures (optional: use Sentry, LogRocket)
3. Review delivery rates after 1 week
4. Gather user feedback on message quality
5. A/B test different message templates (optional)
6. Optimize based on engagement metrics

---

**Ready to test!** 🧪✅
