# ✅ Wix Email Automation - Quick Setup Checklist

**Your Wix Dashboard:** https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e/automations

---

## Pre-Setup Checklist

- [ ] Logged into Wix dashboard
- [ ] Have access to Automations section
- [ ] Email templates ready (see WIX-AUTOMATION-SETUP-GUIDE.md)
- [ ] Sender email decided (e.g., hello@yourdomain.com)

---

## Step 1: Verify Sender Email (5 mins)

- [ ] Go to **Settings** → **Email Marketing**
- [ ] Click **"Add Email Address"**
- [ ] Enter your business email
- [ ] Check email inbox for verification link
- [ ] Click verification link
- [ ] Status shows **"Verified" ✅**

**Recommended emails:**
- info@yourdomain.com
- hello@yourdomain.com
- team@yourdomain.com

---

## Step 2: Create Automation (15 mins)

### 2.1 Access Automations
- [ ] Click **Marketing & CRM** in left sidebar
- [ ] Click **Automations**
- [ ] Click **"Create Automation"** button

### 2.2 Set Up Trigger
- [ ] Select **"Contact Created"** or **"Blank Automation"**
- [ ] Name automation: **"Quiz Lead Welcome Email"**
- [ ] Trigger: **Contact is created or updated**

### 2.3 Add Filter (Important!)
- [ ] Click **"Add Filter"**
- [ ] Condition 1: **Contact Label** → **contains** → **"Lead"**
- [ ] Click **"And"**
- [ ] Condition 2: **Custom Field** → **quizRecommendation** → **is not empty**

This ensures only quiz leads trigger the email!

### 2.4 Add Email Action
- [ ] Click **"+ Add Action"**
- [ ] Select **"Send Email"**

---

## Step 3: Configure Email (10 mins)

### 3.1 Email Settings
- [ ] **To:** Contact's email address *(should be default)*
- [ ] **From:** Your verified email *(select from dropdown)*
- [ ] **Reply-to:** Your support email
- [ ] **Subject:** Enter subject line *(see templates below)*

### 3.2 Subject Line Options

**Option 1 - Simple:**
```
Your DMK Quiz Results - {{contact.firstName}}
```

**Option 2 - With Result:**
```
{{contact.firstName}}, {{contact.customField.quizRecommendation}} is Perfect for You!
```

**Option 3 - Benefit-focused:**
```
Your Perfect Growth Program: {{contact.customField.quizRecommendation}}
```

- [ ] Subject line entered

### 3.3 Email Body

**Choose one:**

- [ ] **Option A:** Copy full HTML template from WIX-AUTOMATION-SETUP-GUIDE.md
- [ ] **Option B:** Use simple text template from WIX-AUTOMATION-SETUP-GUIDE.md
- [ ] **Option C:** Create custom using Wix email designer

### 3.4 Required Elements
- [ ] Greeting with {{contact.firstName}}
- [ ] Mentions {{contact.customField.quizRecommendation}}
- [ ] Has conditional content for all 5 results (Circle, Transform, Essentials, Webinar, Strategy)
- [ ] Clear call-to-action button/link
- [ ] Next steps outlined
- [ ] Business contact info
- [ ] Unsubscribe link *(Wix adds automatically)*

---

## Step 4: Test Email (5 mins)

### 4.1 Preview
- [ ] Click **"Preview"** in email editor
- [ ] Check how it looks

### 4.2 Send Test
- [ ] Click **"Send Test Email"**
- [ ] Enter your email address
- [ ] Click **Send**
- [ ] Check your inbox (including spam)

### 4.3 Verify Test Email
- [ ] Email received
- [ ] Subject line looks good
- [ ] Body formatting correct
- [ ] Links work
- [ ] Images load (if any)
- [ ] Mobile-friendly (check on phone)

---

## Step 5: Activate Automation (1 min)

- [ ] Review automation flow one more time
- [ ] Click **"Save"** or **"Save & Activate"**
- [ ] Toggle status to **"Active"** ✅
- [ ] Confirm activation in popup
- [ ] Status indicator shows green/active

---

## Step 6: End-to-End Test (10 mins)

### 6.1 Submit Test Quiz
- [ ] Go to your live quiz website
- [ ] Complete quiz with a test email (e.g., yourname+test@gmail.com)
- [ ] Use a result type (e.g., Circle)
- [ ] Submit quiz

### 6.2 Verify Backend
**Supabase (within 30 seconds):**
- [ ] Go to https://qxlefltkzroicjzlmabs.supabase.co
- [ ] Open `quiz_leads` table
- [ ] Find your test submission
- [ ] Check: `sync_status: "synced"`
- [ ] Check: `wix_contact_id` is populated

**Wix CRM (within 1-2 minutes):**
- [ ] Go to Wix Dashboard → **Contacts**
- [ ] Search for test email
- [ ] Contact exists
- [ ] Label: **"Lead"**
- [ ] Custom field `quizRecommendation` populated correctly

**Email Automation (within 2-5 minutes):**
- [ ] Go to Automations → Your automation
- [ ] Check **"History"** or **"Activity"** tab
- [ ] Shows as triggered
- [ ] Email sent successfully

### 6.3 Verify Email Delivery
- [ ] Check inbox for test email
- [ ] Email arrived (check spam if not)
- [ ] Subject line correct
- [ ] Your name populated correctly
- [ ] Quiz recommendation shown correctly
- [ ] Content matches the quiz result
- [ ] CTA button/link works

---

## Step 7: Test All Quiz Results (20 mins)

Repeat test for each program:

- [ ] **Circle** - Submit quiz, get Circle result, verify email
- [ ] **Transform** - Submit quiz, get Transform result, verify email
- [ ] **Essentials** - Submit quiz, get Essentials result, verify email
- [ ] **Webinar** - Submit quiz, get Webinar result, verify email
- [ ] **Strategy** - Submit quiz, get Strategy result, verify email

**Pro tip:** Use email aliases (yourname+circle@gmail.com, yourname+transform@gmail.com, etc.)

---

## Post-Setup Monitoring

### Week 1
- [ ] Check automation analytics daily
- [ ] Verify all emails delivering successfully
- [ ] Monitor open rates (target: 25-35%)
- [ ] Monitor click rates (target: 5-15%)
- [ ] Check for any errors in automation logs

### Week 2-4
- [ ] Review overall performance
- [ ] Identify which quiz result gets best engagement
- [ ] A/B test different subject lines (optional)
- [ ] Consider adding follow-up emails (optional)

---

## Troubleshooting Checklist

### Email Not Received

**Check these in order:**

1. **Is automation active?**
   - [ ] Go to Automations → Check status is green/active

2. **Did automation trigger?**
   - [ ] Go to Automations → History/Activity
   - [ ] Look for your test contact
   - [ ] Check if it shows as triggered

3. **Was email sent?**
   - [ ] In automation history, check email action status
   - [ ] Look for "Sent" vs "Failed" or "Skipped"

4. **Spam folder?**
   - [ ] Check spam/junk folder
   - [ ] If there, mark as "Not Spam"

5. **Contact meets filter criteria?**
   - [ ] Go to Contacts → Find test contact
   - [ ] Check has "Lead" label
   - [ ] Check `quizRecommendation` field has value

6. **Sender email verified?**
   - [ ] Go to Settings → Email Marketing
   - [ ] Check sender email shows "Verified"

### Email Sent But Blank Content

- [ ] Check dynamic fields syntax: `{{contact.firstName}}`
- [ ] Verify custom field name: `{{contact.customField.quizRecommendation}}`
- [ ] Test in Preview mode with sample data

### Wrong Content Showing

- [ ] Check conditional logic ({% if %} statements)
- [ ] Verify quiz result value matches condition exactly
- [ ] Check for typos in recommendation values

---

## Success Criteria ✅

Your Wix automation is successful when:

- ✅ Automation shows as "Active"
- ✅ All 5 quiz results tested
- ✅ Emails delivered within 5 minutes
- ✅ Dynamic fields populate correctly
- ✅ Content matches quiz recommendation
- ✅ Links work
- ✅ Mobile-friendly
- ✅ No errors in automation logs

---

## Quick Reference

**Your Wix URLs:**
- Dashboard: https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e
- Automations: https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e/automations
- Contacts: https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e/contacts
- Settings: https://manage.wix.com/dashboard/a4feebe0-b74c-4805-8c40-592f657acb8e/settings

**Dynamic Fields:**
- First name: `{{contact.firstName}}`
- Email: `{{contact.email}}`
- Quiz result: `{{contact.customField.quizRecommendation}}`
- Unsubscribe: `{{unsubscribe}}`

**Quiz Result Values:**
- circle
- transform
- essentials
- webinar
- strategy (or transform-strategy)

---

## Timeline

**Total Time: ~50 minutes**

- ⏱️ 5 mins - Verify sender email
- ⏱️ 15 mins - Create automation
- ⏱️ 10 mins - Configure email
- ⏱️ 5 mins - Test email
- ⏱️ 1 min - Activate
- ⏱️ 10 mins - End-to-end test
- ⏱️ 20 mins - Test all 5 quiz results (optional but recommended)

---

## Done! 🎉

Once complete:
- Every quiz submission automatically gets a personalized email
- No manual work required
- Lead engaged within minutes
- Professional automated follow-up

**Next:** Use [QUIZ-TESTING-CHECKLIST.md](QUIZ-TESTING-CHECKLIST.md) for comprehensive testing

**Need detailed instructions?** See [WIX-AUTOMATION-SETUP-GUIDE.md](WIX-AUTOMATION-SETUP-GUIDE.md)
