# 📧 Quiz Email & WhatsApp Setup Guide

**Current Status:**
- ✅ AISensy configured and enabled
- ✅ Quiz campaign names are set in `.env.local`
- ✅ Wix CRM configured with automation webhook
- 🔧 Need to create WhatsApp templates and campaigns
- 🔧 Need to verify/create Wix automation

---

## Part 1: Wix Email Automation Setup

### 🎯 Goal
Send automated welcome emails to quiz leads via Wix Automations

### 📋 Steps

#### Step 1: Access Wix Automations
1. Go to https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e/automations
2. Or navigate: Wix Dashboard → Marketing & CRM → Automations

#### Step 2: Create Quiz Lead Welcome Automation

Click **"Create Automation"** and set up:

**Trigger:**
- **Type:** Custom Webhook Trigger
- **Webhook URL:** Already configured in your env:
  ```
  https://manage.wix.com/_api/webhook-trigger/report/a4feebe0-b74c-4805-8c40-592f657acb8e/a1f9ad24-1782-4815-af49-4248096d6544
  ```
- **When:** Contact is created with "Lead" label

**Filter (Optional):**
- Contact has `quizRecommendation` field (ensures it's from quiz)

**Actions:**
1. **Send Email**
   - **To:** Contact's email
   - **From:** Your business email (verify sender in Wix)
   - **Subject:** Based on quiz result (use dynamic fields)
   - **Body:** Welcome message + quiz recommendation

#### Step 3: Email Template Ideas

Create 5 different email templates (one per program):

**For Circle Result:**
```
Subject: Your Quiz Result: The Circle Community is Perfect for You! 🎯

Hi {{contact.firstName}},

Thank you for taking the DMK Quiz!

Based on your answers, we recommend: THE CIRCLE

[Brief description of Circle program]
[Benefits]
[Next steps/CTA button]

Best regards,
The DMK Team
```

**For Transform Result:**
```
Subject: Your Quiz Result: Transform Program Awaits! 🚀

Hi {{contact.firstName}},

Your quiz results are in! The Transform program is ideal for you.

[Details about Transform]
[CTA]
```

*Repeat for Essentials, Webinar, and Strategy*

#### Step 4: Use Dynamic Content

In your email template, use Wix's dynamic fields:
- `{{contact.firstName}}` - First name
- `{{contact.customField.quizRecommendation}}` - Quiz result
- `{{contact.email}}` - Email address

**Advanced: Use Conditions**
```
{% if contact.customField.quizRecommendation == "circle" %}
  [Circle-specific content]
{% elseif contact.customField.quizRecommendation == "transform" %}
  [Transform-specific content]
{% endif %}
```

#### Step 5: Test the Automation

1. Set automation to **"Active"**
2. Submit test quiz from your website
3. Check if email arrives
4. Verify dynamic fields populate correctly

---

## Part 2: AISensy WhatsApp Setup

### 🎯 Goal
Send automated WhatsApp welcome messages based on quiz results

### 📋 Current Status

Your `.env.local` already has:
```env
✅ AISENSY_API_KEY=configured
✅ NEXT_PUBLIC_AISENSY_ENABLED=true
✅ Campaign names configured:
   - AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE=quiz_results_circle
   - AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM=quiz_results_transform
   - AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS=quiz_results_essentials
   - AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR=quiz_results_webinar
   - AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY=quiz_results_strategy
```

**What you need:** Create the actual campaigns in AISensy dashboard

---

### Step 1: Create WhatsApp Templates

1. **Login to AISensy**
   - Go to https://app.aisensy.com/login
   - Login with your account

2. **Navigate to Templates**
   - Dashboard → Templates → Create Template

3. **Create 5 Templates** (one for each quiz result)

#### Template 1: Circle Quiz Result
```
Name: quiz_results_circle_template
Category: Marketing
Language: English
Header: None (or add image/video)
Body:
---
Hi! 👋

Thank you for completing the DMK Quiz!

Based on your responses, we recommend *The Circle Community* - our supportive group program for sustainable growth.

*What's Next?*
• Access exclusive community resources
• Connect with like-minded entrepreneurs
• Get expert guidance weekly

Ready to join? Check your email for details!

Questions? Reply to this message anytime.

- Team DMK
---
Footer: (Optional) The DMK Company
Buttons: None or add CTA button
```

**Submit for WhatsApp Approval** (takes 24-48 hours)

#### Template 2: Transform Quiz Result
```
Name: quiz_results_transform_template
Category: Marketing
Language: English
Body:
---
Hi! 👋

Your DMK Quiz results are in!

We recommend *Transform* - our intensive program for rapid business growth and personal development.

*Transform includes:*
• 1-on-1 coaching sessions
• Advanced strategies
• Implementation support
• Private mastermind group

Check your email for the complete details!

Ready to transform your business? Let's talk!

- Team DMK
---
```

**Submit for approval**

#### Template 3: Essentials Quiz Result
```
Name: quiz_results_essentials_template
Category: Marketing
Language: English
Body:
---
Hi! 👋

Thanks for taking the DMK Quiz!

Perfect match: *Essentials* - our foundational program starting on either the 1st or 15th of each month.

*What you'll get:*
• Core business fundamentals
• Step-by-step guidance
• Practical templates
• Group support

Your email has all the details!

Questions? Just reply here!

- Team DMK
---
```

**Submit for approval**

#### Template 4: Webinar Quiz Result
```
Name: quiz_results_webinar_template
Category: Marketing
Language: English
Body:
---
Hi! 👋

Your quiz is complete!

We recommend starting with our *Free Webinar* to learn the DMK methodology.

*In this webinar:*
• Discover proven strategies
• Learn our framework
• See real results
• Q&A session

Check your email for the webinar link and schedule!

See you there! 🎯

- Team DMK
---
```

**Submit for approval**

#### Template 5: Strategy Quiz Result
```
Name: quiz_results_strategy_template
Category: Marketing
Language: English
Body:
---
Hi! 👋

Quiz complete! Great job!

Based on your responses, a *1-on-1 Strategy Session* would be most valuable for you right now.

*In your strategy call:*
• Personalized business assessment
• Custom action plan
• Direct expert guidance
• Implementation roadmap

Check your email to book your session!

Looking forward to speaking with you!

- Team DMK
---
```

**Submit for approval**

4. **Wait for WhatsApp Approval** ⏰
   - Usually takes 24-48 hours
   - You'll get email notification
   - Status changes to "Approved" in Templates section

---

### Step 2: Create API Campaigns

**After templates are approved:**

1. **Navigate to Campaigns**
   - Dashboard → Campaigns → Create Campaign

2. **Create Campaign 1: Circle**
   ```
   Campaign Name: quiz_results_circle
   Campaign Type: API Campaign
   Select Template: quiz_results_circle_template
   Status: Set to LIVE ✅
   ```

3. **Create Campaign 2: Transform**
   ```
   Campaign Name: quiz_results_transform
   Template: quiz_results_transform_template
   Type: API Campaign
   Status: LIVE ✅
   ```

4. **Create Campaign 3: Essentials**
   ```
   Campaign Name: quiz_results_essentials
   Template: quiz_results_essentials_template
   Type: API Campaign
   Status: LIVE ✅
   ```

5. **Create Campaign 4: Webinar**
   ```
   Campaign Name: quiz_results_webinar
   Template: quiz_results_webinar_template
   Type: API Campaign
   Status: LIVE ✅
   ```

6. **Create Campaign 5: Strategy**
   ```
   Campaign Name: quiz_results_strategy
   Template: quiz_results_strategy_template
   Type: API Campaign
   Status: LIVE ✅
   ```

**IMPORTANT:** Campaign names MUST match exactly what's in your `.env.local`:
- `quiz_results_circle`
- `quiz_results_transform`
- `quiz_results_essentials`
- `quiz_results_webinar`
- `quiz_results_strategy`

---

### Step 3: Update Vercel Environment Variables

Your local `.env.local` is configured, but you need to add the same to Vercel:

#### Option A: Using Vercel CLI (Recommended)

```bash
# Navigate to your project directory
cd e:\Cursor\dmk-quiz-updated

# Add quiz campaign environment variables
vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE production
# When prompted, enter: quiz_results_circle

vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM production
# Enter: quiz_results_transform

vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS production
# Enter: quiz_results_essentials

vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR production
# Enter: quiz_results_webinar

vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY production
# Enter: quiz_results_strategy

# Redeploy to apply changes
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/team_0pMdgIeCJDof8w0szAXp4xQq/dmk-quiz/settings/environment-variables
2. Click **"Add New"**
3. Add each variable:

| Key | Value | Environment |
|-----|-------|-------------|
| `AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE` | `quiz_results_circle` | Production |
| `AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM` | `quiz_results_transform` | Production |
| `AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS` | `quiz_results_essentials` | Production |
| `AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR` | `quiz_results_webinar` | Production |
| `AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY` | `quiz_results_strategy` | Production |

4. **Redeploy** your application to apply changes

---

### Step 4: Verify Configuration

After campaigns are created and environment variables are set:

1. **Check AISensy Dashboard**
   - All 5 campaigns should show status: **LIVE** ✅
   - Templates should be **Approved** by WhatsApp

2. **Check Vercel Environment Variables**
   - All 5 `AISENSY_CAMPAIGN_QUIZ_RESULTS_*` variables are set

3. **Check Code** (already done - no changes needed!)
   - `src/app/api/quiz/submit/route.ts` lines 126-136 ✅
   - `src/lib/aisensy.ts` has all campaign mappings ✅

---

## Part 3: Testing

### Test Quiz Submission Flow

1. **Submit Test Quiz**
   - Go to your live website quiz
   - Complete quiz with real phone number (your test number)
   - Use a unique email (e.g., `test+circle@yourdomain.com`)

2. **Verify WhatsApp Message**
   - Check your WhatsApp within 1-2 minutes
   - Should receive message matching quiz result
   - Verify formatting and content

3. **Verify Wix Email**
   - Check email inbox
   - Should receive welcome email from Wix automation
   - Verify dynamic fields populated correctly

4. **Check Supabase**
   ```bash
   # View recent quiz leads
   # Login to: https://qxlefltkzroicjzlmabs.supabase.co
   # Table: quiz_leads
   # Check: sync_status should be "synced"
   ```

5. **Check Wix CRM**
   - Login to Wix dashboard
   - Go to Contacts
   - Find test contact
   - Verify labels: "Lead"
   - Check custom field: `quizRecommendation`

6. **Check AISensy**
   - Go to AISensy Dashboard → Contacts
   - Find test contact by phone
   - Verify tags: `quiz_lead`, program name
   - Check attributes: `quiz_result`, `lead_source: quiz`

### Test Each Quiz Result

Run 5 tests (one for each result):
- [ ] Circle recommendation → Receives `quiz_results_circle` message
- [ ] Transform recommendation → Receives `quiz_results_transform` message
- [ ] Essentials recommendation → Receives `quiz_results_essentials` message
- [ ] Webinar recommendation → Receives `quiz_results_webinar` message
- [ ] Strategy recommendation → Receives `quiz_results_strategy` message

---

## Part 4: Monitoring & Troubleshooting

### Check Logs

**Vercel Logs:**
```bash
vercel logs --follow
```

Look for:
```
[AISensy] Using quiz welcome campaign: quiz_results_circle for result: circle
✅ Success log
```

Or errors:
```
[AISensy] No quiz welcome campaign configured for result: circle
[AISensy] Skipping quiz welcome message - templates not yet created
❌ Campaign not found
```

**AISensy Dashboard:**
- Go to Reports → Campaign Reports
- Check delivery status
- Check failed messages (if any)

### Common Issues

#### Issue 1: WhatsApp Not Received
**Possible causes:**
- Campaign not set to LIVE
- Campaign name mismatch (case-sensitive!)
- Phone number format issue (must include country code: +91XXXXXXXXXX)
- WhatsApp opt-out (user previously blocked)

**Fix:**
- Verify campaign status in AISensy
- Check environment variable names match exactly
- Test with different phone number

#### Issue 2: Email Not Received
**Possible causes:**
- Wix automation not active
- Webhook URL incorrect
- Contact not labeled "Lead"
- Spam folder

**Fix:**
- Check automation status in Wix dashboard
- Verify webhook URL matches `.env.local`
- Check spam/junk folder
- Whitelist sender email

#### Issue 3: "Campaign not configured" Error
**Possible causes:**
- Environment variables not set in Vercel
- Campaign not created in AISensy
- Typo in campaign name

**Fix:**
- Double-check Vercel environment variables
- Verify campaigns exist and are LIVE in AISensy
- Compare names character-by-character (no spaces, lowercase)

---

## Part 5: Success Checklist

### Pre-Launch Checklist

**Wix Email Setup:**
- [ ] Wix automation created and active
- [ ] Email templates created (5 variants or conditional)
- [ ] Webhook URL configured in `.env.local` and Vercel
- [ ] Test email sent and received
- [ ] Dynamic fields populate correctly

**AISensy WhatsApp Setup:**
- [ ] 5 WhatsApp templates created
- [ ] All templates submitted for approval
- [ ] All templates approved by WhatsApp ✅
- [ ] 5 API campaigns created from templates
- [ ] All campaigns set to LIVE status ✅
- [ ] Campaign names match environment variables exactly
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Test messages sent and received
- [ ] Formatting looks good on mobile

**Integration Testing:**
- [ ] Quiz submission stores in Supabase
- [ ] Quiz submission creates Wix contact
- [ ] Quiz submission sends WhatsApp message
- [ ] All 5 quiz results tested (Circle, Transform, Essentials, Webinar, Strategy)
- [ ] Phone number formatting works (+91 prefix)
- [ ] Tags applied correctly in AISensy
- [ ] Attributes stored in AISensy contact

**Monitoring:**
- [ ] Vercel logs accessible
- [ ] AISensy reports showing deliveries
- [ ] Wix automation analytics configured
- [ ] Error alerts set up (optional)

---

## Quick Reference

### Key Files
- Quiz submission: `src/app/api/quiz/submit/route.ts`
- AISensy logic: `src/lib/aisensy.ts`
- Wix CRM logic: `src/lib/wix-crm.ts`
- Environment config: `.env.local` (local), Vercel dashboard (production)

### Important URLs
- **AISensy Dashboard:** https://app.aisensy.com
- **Wix Dashboard:** https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e
- **Wix Automations:** https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e/automations
- **Vercel Project:** https://vercel.com/team_0pMdgIeCJDof8w0szAXp4xQq/dmk-quiz
- **Vercel Env Vars:** https://vercel.com/team_0pMdgIeCJDof8w0szAXp4xQq/dmk-quiz/settings/environment-variables
- **Supabase Dashboard:** https://qxlefltkzroicjzlmabs.supabase.co

### Campaign Name Reference
```env
Circle:     quiz_results_circle
Transform:  quiz_results_transform
Essentials: quiz_results_essentials
Webinar:    quiz_results_webinar
Strategy:   quiz_results_strategy
```

---

## Next Steps

1. **Start with WhatsApp Templates**
   - Create all 5 templates in AISensy
   - Submit for WhatsApp approval
   - Wait 24-48 hours

2. **While Waiting, Set Up Wix**
   - Create email automation
   - Design email templates
   - Test with dummy data

3. **After WhatsApp Approval**
   - Create 5 LIVE campaigns in AISensy
   - Add environment variables to Vercel
   - Redeploy application

4. **Test Everything**
   - Submit test quiz for each result type
   - Verify WhatsApp + Email delivery
   - Check all integrations working

5. **Monitor & Optimize**
   - Review delivery rates
   - Adjust messaging based on engagement
   - A/B test different templates (optional)

---

**Questions or issues?** Check the troubleshooting section above or review the detailed documentation in `QUIZ-WELCOME-SETUP.md`.

**Ready to launch!** 🚀
