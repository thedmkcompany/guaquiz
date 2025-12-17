# Wix MCP Verification Prompt

Use this prompt to verify contact creation and pricing plan assignment in Wix CRM.

---

## Copy This Prompt:

```
I need to verify that my DMK Quiz application is correctly:
1. Creating/updating contacts in Wix CRM
2. Assigning pricing plans after payment

Please help me check the following using the Wix MCP.

---

## TEST 1: Check if Contact Exists

Search for a contact by email: [ENTER_TEST_EMAIL]

Questions to answer:
- Does the contact exist in Wix CRM?
- What labels does the contact have? (Should have "Lead" if took quiz, "Customer" if paid)
- What are the values of these extended fields:
  - custom.quizRecommendation
  - custom.lastPaymentId
  - custom.lastProgramId
  - custom.lastProgramName
  - custom.isSubscriber

---

## TEST 2: Check Pricing Plan Assignment (MOST IMPORTANT)

This is the critical check. After payment, the system should:
1. Create a Wix Member from the contact
2. Assign a pricing plan via offline order

Please check:

### 2a. Does a Member exist for this contact?
- Query members by email: [ENTER_TEST_EMAIL]
- If member exists, note the memberId

### 2b. Check Pricing Plan Orders
- Query pricing plan orders for this member
- OR query all recent offline orders and filter by email

Look for an order with:
- planId matching one of these (check which program they purchased):
  - Essentials plan ID
  - Webinar plan ID
  - Circle plan ID
  - Transform Strategy plan ID
  - Transform plan ID

- Verify the order shows:
  - paid = true (or lastPaymentStatus = "PAID")
  - status = "ACTIVE"

---

## TEST 3: Verify Plan IDs are Correct

List all pricing plans in the Wix site and show me:
- Plan name
- Plan ID

I need to verify these match my environment variables:
- WIX_PLAN_ID_ESSENTIALS
- WIX_PLAN_ID_WEBINAR
- WIX_PLAN_ID_CIRCLE
- WIX_PLAN_ID_TRANSFORM_STRATEGY
- WIX_PLAN_ID_TRANSFORM

---

## TEST 4: Check for Missing Assignments

Query contacts that have:
- Label "Customer" (meaning they paid)
- BUT no pricing plan order assigned

This would indicate a failure in the plan assignment flow.

---

## EXPECTED FLOW SUMMARY

| User Action | Wix Contact | Wix Member | Pricing Plan |
|-------------|-------------|------------|--------------|
| Takes quiz only | Created with "Lead" label | NOT created | NOT assigned |
| Takes quiz + pays | Updated with "Customer" label | Created | Assigned + marked paid |
| Pays directly (no quiz) | Created with "Customer" label | Created | Assigned + marked paid |

---

## IF PRICING PLAN NOT ASSIGNED

If you find contacts with "Customer" label but no pricing plan, check:

1. Is the member created? (Member is required for plan assignment)
2. Are the WIX_PLAN_ID_* environment variables set correctly?
3. Does the plan exist in Wix Pricing Plans dashboard?

The API endpoint that assigns plans is:
POST /pricing-plans/v2/checkout/orders/offline

With payload:
{
  "planId": "<wix_plan_id>",
  "memberId": "<member_id>",
  "startDate": "<ISO_timestamp>",
  "paid": true
}
```

---

## What Each Touchpoint Does

### Touchpoint 1: Quiz Submit (`/api/quiz/submit`)

| System | Action |
|--------|--------|
| Supabase | INSERT into `quiz_leads` with `wix_sync_status = 'pending'` |
| Wix | Create/update contact with "Lead" label |
| Supabase | UPDATE `wix_sync_status = 'synced'`, store `wix_contact_id` |

### Touchpoint 2: Payment Webhook (`/api/webhooks/razorpay`)

| System | Action |
|--------|--------|
| Supabase | UPDATE `quiz_leads` with payment fields |
| Wix | Update contact with payment data |
| Wix | Add "Customer" + program labels |
| Wix | Create Member (if new contact) |
| Wix | **Assign Pricing Plan** via offline order |
| Wix | Trigger automation webhook (if configured) |

### Touchpoint 3: Direct Payment (no quiz)

| System | Action |
|--------|--------|
| Supabase | INSERT new record with payment data |
| Wix | Create contact with "Customer" label |
| Wix | Create Member |
| Wix | **Assign Pricing Plan** |

---

## Code Reference: Where Pricing Plan is Assigned

File: `src/lib/wix-crm.ts`

```typescript
// Function: syncToWixCRM (lines 672-724)
// Called from: /api/webhooks/razorpay after payment.captured

// Step 3: Assign pricing plan if configured
let orderId: string | null = null;
const planId = getPlanIdForProgram(data.programId);
if (planId && (memberId || contactId)) {
  orderId = await assignPricingPlan({
    memberId: memberId || contactId,
    planId,
    paid: true,  // <-- Marks as paid
  });
  console.log('Assigned pricing plan, order:', orderId);
}
```

The `assignPricingPlan` function (lines 580-617) calls:
```
POST /pricing-plans/v2/checkout/orders/offline
```

---

## Quick Verification Commands for Wix MCP

```
1. Find contact by email:
   → Query contacts where email = "test@example.com"

2. Check contact labels:
   → Get contact details, look at labelKeys

3. Find member by email:
   → Query members where loginEmail = "test@example.com"

4. Check pricing plan orders:
   → Query orders where memberId = "<member_id>"
   → OR list recent offline orders

5. List all pricing plans:
   → Query all plans to verify IDs match env vars
```
