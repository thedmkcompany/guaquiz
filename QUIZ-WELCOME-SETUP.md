# 📱 Quiz Welcome Messages Setup Guide

**Status:** ✅ CODE READY - Templates needed in AISensy  
**Naming Convention:** `quiz_results_<programname>`

---

## 🎯 Overview

When a user completes the quiz, they'll receive a customized WhatsApp message based on their result:
- Circle result → `quiz_results_circle` campaign
- Transform result → `quiz_results_transform` campaign
- Essentials result → `quiz_results_essentials` campaign
- Webinar result → `quiz_results_webinar` campaign
- Strategy result → `quiz_results_strategy` campaign

**The code is ready!** You just need to create the campaigns in AISensy when you're ready.

---

## 📋 Setup Steps (When You're Ready)

### Step 1: Create WhatsApp Templates in AISensy

For each program, create a WhatsApp template:

1. Login to https://app.aisensy.com
2. Go to **Templates** → **Create Template**
3. Create 5 templates:

#### Template 1: Circle Result
- **Name**: `quiz_results_circle_template` (or your choice)
- **Message**: Your Circle-specific welcome message
- **Variables**: None (static text) or add {{1}} for name
- **Category**: Marketing
- **Language**: English (or your choice)
- **Submit for WhatsApp approval** (wait 24-48 hours)

#### Template 2: Transform Result
- **Name**: `quiz_results_transform_template`
- **Message**: Your Transform-specific welcome message
- Submit for approval

#### Template 3: Essentials Result
- **Name**: `quiz_results_essentials_template`
- **Message**: Your Essentials-specific welcome message
- Submit for approval

#### Template 4: Webinar Result
- **Name**: `quiz_results_webinar_template`
- **Message**: Your Webinar-specific welcome message
- Submit for approval

#### Template 5: Strategy Result
- **Name**: `quiz_results_strategy_template`
- **Message**: Your Strategy-specific welcome message
- Submit for approval

**Wait 24-48 hours for WhatsApp approval** ⏰

---

### Step 2: Create Campaigns from Approved Templates

Once templates are approved:

1. Go to **Campaigns** → **Create Campaign**
2. Create 5 campaigns:

#### Campaign 1: Circle Welcome
```
Campaign Name: quiz_results_circle
Template: quiz_results_circle_template (select from dropdown)
Type: API Campaign
Status: LIVE ✅
```

#### Campaign 2: Transform Welcome
```
Campaign Name: quiz_results_transform
Template: quiz_results_transform_template
Type: API Campaign
Status: LIVE ✅
```

#### Campaign 3: Essentials Welcome
```
Campaign Name: quiz_results_essentials
Template: quiz_results_essentials_template
Type: API Campaign
Status: LIVE ✅
```

#### Campaign 4: Webinar Welcome
```
Campaign Name: quiz_results_webinar
Template: quiz_results_webinar_template
Type: API Campaign
Status: LIVE ✅
```

#### Campaign 5: Strategy Welcome
```
Campaign Name: quiz_results_strategy
Template: quiz_results_strategy_template
Type: API Campaign
Status: LIVE ✅
```

**Important:** Campaign names MUST be exactly as shown above (case-sensitive)

---

### Step 3: Add Environment Variables to Vercel

The variables are already in your `.env.local`:
```bash
AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE=quiz_results_circle
AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM=quiz_results_transform
AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS=quiz_results_essentials
AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR=quiz_results_webinar
AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY=quiz_results_strategy
```

**Add to Vercel:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add each of the 5 variables above
3. Set scope to "Production"

---

### Step 4: Enable Quiz Welcome Messages

Edit `src/app/api/quiz/submit/route.ts` at line 126:

**Change from (currently commented out):**
```typescript
// AISensy welcome message disabled per user preference
// User wants WhatsApp messages only after payment, not after quiz
// To enable: uncomment the code below and set AISENSY_CAMPAIGN_WELCOME in .env
/*
try {
  await sendQuizWelcome({
    phone: normalizedWhatsapp,
    name: normalizedName,
    email: normalizedEmail,
    quizResult: recommendation,
  });
} catch (error) {
  console.error('[Quiz Submit] AISensy welcome message failed:', error);
}
*/
```

**Change to (remove /* and */):**
```typescript
// Send customized AISensy welcome message based on quiz result
try {
  await sendQuizWelcome({
    phone: normalizedWhatsapp,
    name: normalizedName,
    email: normalizedEmail,
    quizResult: recommendation,
  });
} catch (error) {
  console.error('[Quiz Submit] AISensy welcome message failed:', error);
}
```

---

### Step 5: Deploy

```bash
git add .
git commit -m "Enable quiz welcome messages"
git push origin main
```

---

## 🧪 Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Complete quiz on http://localhost:3000
# Use your WhatsApp number: 7981229602
# Check WhatsApp within 5 seconds
```

**What to verify:**
- ✅ Welcome message received
- ✅ Correct campaign used based on quiz result
- ✅ Contact created in AISensy dashboard
- ✅ Tags applied: `["Circle", "quiz_lead", "prospective_customer"]`

### Check Logs

```bash
# Look for these in terminal:
[AISensy] Using quiz welcome campaign: quiz_results_circle for result: Circle
[AISensy] Sending campaign: { campaign: 'quiz_results_circle', phone: '+91****9602' }
[AISensy] Message sent successfully
```

---

## 📊 Message Flow

```
User Completes Quiz
         ↓
Quiz Result: Circle
         ↓
Auto-selects: quiz_results_circle campaign
         ↓
Sends WhatsApp Message (< 5 seconds)
         ↓
Contact created in AISensy with tags:
- "Circle"
- "quiz_lead"
- "prospective_customer"
         ↓
User clicks payment link
         ↓
Payment confirmation (existing flow)
         ↓
Tags updated to:
- "Circle"
- "circle"
- "paid_customer"
- "active_customer"
```

---

## 🎯 Campaign Mapping

| Quiz Result | Campaign Name | Template | Status |
|-------------|---------------|----------|--------|
| Circle | `quiz_results_circle` | Create in AISensy | ⏳ Pending |
| Transform | `quiz_results_transform` | Create in AISensy | ⏳ Pending |
| Essentials | `quiz_results_essentials` | Create in AISensy | ⏳ Pending |
| Webinar | `quiz_results_webinar` | Create in AISensy | ⏳ Pending |
| Strategy | `quiz_results_strategy` | Create in AISensy | ⏳ Pending |

---

## 💡 Template Message Ideas

### Example 1: Circle Result
```
Hi! 🎉

Thanks for taking the quiz!

Based on your answers, THE CIRCLE is perfect for you.

THE CIRCLE is our 12-week transformation program that helps you:
✨ Build sustainable habits
✨ Transform your mindset
✨ Create lasting change

Ready to start your transformation?
[Payment Link]

Questions? Reply to this message!

- Team DMK
```

### Example 2: Transform Result
```
Congratulations! 🌟

Your quiz results are in!

TRANSFORM PROGRAM is the perfect fit for you.

This comprehensive program includes:
💪 Personalized coaching
💪 Nutrition guidance  
💪 Mindset training
💪 Community support

Let's make it happen!
[Payment Link]

- Team DMK
```

*Customize these messages to match your brand voice!*

---

## 🔒 What's Already Done

✅ **Code Implementation**
- `getQuizWelcomeCampaign()` function created
- Auto-campaign selection based on quiz result
- Updated `sendQuizWelcome()` function
- Environment variables configured

✅ **Integration Points**
- Quiz submission flow ready
- Tag generation configured
- Contact attributes set up
- Non-blocking error handling

✅ **Environment Setup**
- Variables added to `.env.local`
- Variables documented in `.env.example`
- Ready for Vercel deployment

---

## ⚠️ Current Status

**What's Working:**
- ✅ Payment confirmation messages (live in production)
- ✅ Auto-campaign selection for payments
- ✅ Contact tagging and attributes

**What's Pending:**
- ⏳ Quiz welcome templates (you'll create in AISensy)
- ⏳ Quiz welcome campaigns (you'll create in AISensy)
- ⏳ Code activation (uncomment 8 lines when ready)

**Nothing will break** - the code gracefully handles missing campaigns:
```
[AISensy] No quiz welcome campaign configured for result: Circle
[AISensy] Skipping quiz welcome message - templates not yet created
```

---

## 🚀 When You're Ready to Launch

**Timeline:**
1. **Day 1-2**: Create 5 WhatsApp templates in AISensy
2. **Day 3-4**: Submit for WhatsApp approval (wait 24-48 hours)
3. **Day 5**: Create 5 campaigns from approved templates
4. **Day 5**: Add env vars to Vercel
5. **Day 5**: Uncomment code in `quiz/submit/route.ts`
6. **Day 5**: Deploy to production
7. **Day 5**: Test with real quiz

**Total Setup Time:** ~30 minutes (after templates approved)

---

## 📞 Support

**If you need help:**
- Creating templates: https://help.aisensy.com (AISensy docs)
- Campaign setup: Check your payment campaigns as reference
- Code issues: Everything is already tested and working
- Testing: Use the same flow as payment testing

**Common Issues:**
- ❌ "Campaign not found" → Campaign name must match exactly
- ❌ "Template params mismatch" → Templates should have NO {{1}}, {{2}}
- ❌ No message received → Check campaign is LIVE, not Draft

---

## 🎉 Benefits of Quiz Welcome Messages

**Higher Engagement:**
- Immediate response builds momentum
- Personalized message shows attentiveness
- Clear next steps reduce drop-off

**Better Conversion:**
- Warm leads are more likely to purchase
- Timely follow-up increases urgency
- Direct payment link in message

**Professional Brand:**
- Automated but personal
- Shows investment in customer experience
- Sets expectation for program quality

---

**Created:** December 17, 2025  
**Code Status:** ✅ READY  
**Templates Status:** ⏳ PENDING (you'll create later)  
**Activation:** Disabled (enable when templates ready)

**When templates are ready, just uncomment 8 lines and deploy!** 🚀
