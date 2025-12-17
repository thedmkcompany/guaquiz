# 🚀 Quick Start: Enable Quiz Welcome Messages

**Time Required:** 2-3 hours (+ 24-48 hours for WhatsApp approval)

---

## Current Status ✅

Your system is **90% ready**! Here's what you already have:

✅ Code is complete and tested
✅ AISensy account configured
✅ Wix CRM configured
✅ Environment variables set locally
✅ Campaign names defined

**What's missing:** WhatsApp templates + Vercel env vars

---

## Step-by-Step Guide

### Part A: AISensy WhatsApp (30 mins + approval wait)

#### 1. Create Templates
**Go to:** https://app.aisensy.com/templates

Create **5 templates** using these names:
- `quiz_results_circle_template`
- `quiz_results_transform_template`
- `quiz_results_essentials_template`
- `quiz_results_webinar_template`
- `quiz_results_strategy_template`

**Template Example (Circle):**
```
Category: Marketing
Language: English

Body:
Hi! 👋

Thank you for completing the DMK Quiz!

Based on your responses, we recommend *The Circle Community*.

*What's Next?*
• Check your email for details
• Join our supportive community
• Start your growth journey

Questions? Reply anytime!

- Team DMK
```

**Submit each template for WhatsApp approval** (wait 24-48 hours)

#### 2. Create Campaigns
**After approval, go to:** https://app.aisensy.com/campaigns

Create **5 API campaigns**:
- Campaign Name: `quiz_results_circle` → Template: `quiz_results_circle_template`
- Campaign Name: `quiz_results_transform` → Template: `quiz_results_transform_template`
- Campaign Name: `quiz_results_essentials` → Template: `quiz_results_essentials_template`
- Campaign Name: `quiz_results_webinar` → Template: `quiz_results_webinar_template`
- Campaign Name: `quiz_results_strategy` → Template: `quiz_results_strategy_template`

**Set all to LIVE status** ✅

---

### Part B: Wix Email Automation (20 mins)

#### 1. Access Automations
**Go to:** https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e/automations

#### 2. Create Automation
Click **"Create Automation"**

**Trigger:** When contact is created with "Lead" label
**Filter:** Has custom field `quizRecommendation`
**Action:** Send email

#### 3. Email Template (Simple Version)
```
Subject: Your DMK Quiz Results are Ready!

Hi {{contact.firstName}},

Thanks for taking the DMK Quiz!

Based on your answers, we recommend: {{contact.customField.quizRecommendation}}

Check your WhatsApp for next steps, or visit our website to learn more.

Best regards,
The DMK Team
```

**Set to Active** ✅

---

### Part C: Vercel Environment Variables (5 mins)

#### Option 1: Using Scripts (Easiest)

**Windows:**
```bash
cd e:\Cursor\dmk-quiz-updated
scripts\setup-vercel-env.bat
```

**Linux/Mac:**
```bash
cd e:\Cursor\dmk-quiz-updated
chmod +x scripts/setup-vercel-env.sh
./scripts/setup-vercel-env.sh
```

#### Option 2: Manual

**Go to:** https://vercel.com/team_0pMdgIeCJDof8w0szAXp4xQq/dmk-quiz/settings/environment-variables

**Add these 5 variables:**
```
AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE=quiz_results_circle
AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM=quiz_results_transform
AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS=quiz_results_essentials
AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR=quiz_results_webinar
AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY=quiz_results_strategy
```

**Redeploy:**
```bash
vercel --prod
```

---

### Part D: Testing (30 mins)

Use your test phone number and email:

1. **Submit quiz with Circle result**
   - Check WhatsApp (should receive within 1-2 mins)
   - Check Email (should receive within 5 mins)

2. **Verify in dashboards:**
   - Supabase: Lead stored with `sync_status: "synced"`
   - Wix: Contact created with "Lead" label
   - AISensy: Contact tagged with `quiz_lead` and `circle`

3. **Repeat for each program** (Transform, Essentials, Webinar, Strategy)

**Use:** [QUIZ-TESTING-CHECKLIST.md](QUIZ-TESTING-CHECKLIST.md) for detailed testing

---

## Verification Checklist

Before going live, verify:

**AISensy:**
- [ ] 5 templates approved by WhatsApp ✅
- [ ] 5 campaigns created and LIVE ✅
- [ ] Campaign names match exactly (case-sensitive!)

**Wix:**
- [ ] Automation created and active ✅
- [ ] Email template configured
- [ ] Test email received

**Vercel:**
- [ ] 5 environment variables added
- [ ] Application redeployed
- [ ] No deployment errors

**Testing:**
- [ ] All 5 quiz results tested
- [ ] WhatsApp messages received
- [ ] Emails received
- [ ] No errors in logs

---

## Troubleshooting

### WhatsApp not received?
1. Check campaign is LIVE in AISensy
2. Verify campaign name matches env var exactly
3. Check phone format: +91XXXXXXXXXX
4. View Vercel logs: `vercel logs --follow`

### Email not received?
1. Check spam/junk folder
2. Verify Wix automation is active
3. Check Wix automation run history
4. Test automation manually in Wix

### "Campaign not configured" error?
1. Verify Vercel env vars are set
2. Redeploy application: `vercel --prod`
3. Check campaign exists and is LIVE in AISensy

---

## Support Resources

**Documentation:**
- Full Setup Guide: [QUIZ-EMAIL-WHATSAPP-SETUP.md](QUIZ-EMAIL-WHATSAPP-SETUP.md)
- Testing Guide: [QUIZ-TESTING-CHECKLIST.md](QUIZ-TESTING-CHECKLIST.md)
- Original Guide: [QUIZ-WELCOME-SETUP.md](QUIZ-WELCOME-SETUP.md)

**Dashboards:**
- AISensy: https://app.aisensy.com
- Wix: https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e
- Vercel: https://vercel.com/team_0pMdgIeCJDof8w0szAXp4xQq/dmk-quiz
- Supabase: https://qxlefltkzroicjzlmabs.supabase.co

**Key Files:**
- Quiz submission: `src/app/api/quiz/submit/route.ts`
- AISensy logic: `src/lib/aisensy.ts`
- Wix logic: `src/lib/wix-crm.ts`

---

## Timeline

**Day 1: Setup (30 mins)**
- Create 5 WhatsApp templates in AISensy
- Submit for WhatsApp approval
- Create Wix email automation

**Day 2-3: Approval Wait** ⏰
- Wait for WhatsApp to approve templates
- Meanwhile, prepare email content
- Review documentation

**Day 4: Activation (30 mins)**
- Create 5 LIVE campaigns from approved templates
- Add Vercel environment variables
- Redeploy application

**Day 4: Testing (30 mins)**
- Test all 5 quiz results
- Verify WhatsApp + Email delivery
- Check all integrations

**Day 5: Launch** 🚀
- Monitor first real submissions
- Review delivery rates
- Adjust as needed

---

## Quick Commands

```bash
# Check Vercel logs
vercel logs --follow

# Redeploy to production
vercel --prod

# Add environment variable (single)
vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE production

# View Supabase data
# Login to: https://qxlefltkzroicjzlmabs.supabase.co
# Table: quiz_leads

# Test locally
npm run dev
# Then submit quiz at http://localhost:3000
```

---

## Summary

**Total Time:**
- Setup: 1 hour
- WhatsApp approval: 24-48 hours (passive)
- Deployment: 15 minutes
- Testing: 30 minutes

**What You Get:**
- Automated WhatsApp messages for all quiz completions
- Automated emails for all quiz leads
- Proper lead tracking in Supabase
- CRM integration with Wix
- Seamless user experience

**ROI:**
- Instant engagement with quiz leads
- Higher conversion rates
- Professional automated follow-up
- Better lead nurturing
- No manual work required

---

**Ready to start?** Begin with Part A (AISensy templates) above! 🚀
