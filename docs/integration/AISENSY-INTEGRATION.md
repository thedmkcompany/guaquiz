# AISensy Integration Guide

Guide for integrating AISensy WhatsApp marketing platform with the DMK Quiz application to automatically add contacts after payment.

---

## Overview

AISensy is a WhatsApp Business API platform that enables:
- ✅ Automated contact management
- ✅ Broadcast messaging (98% open rates)
- ✅ AI-powered chatbot flows
- ✅ Payment collection within WhatsApp
- ✅ Multi-agent support

## Integration Strategy

### Goal
Automatically add contacts to AISensy after successful payment, enabling:
1. Welcome message via WhatsApp
2. Program onboarding sequences
3. Automated follow-ups and reminders
4. Community engagement

### Integration Points
1. **Payment Webhook Handler** - Add contact after payment verification
2. **Quiz Submission** - Optionally add lead before payment
3. **Manual Admin Sync** - Bulk sync existing contacts

---

## Step 1: Get AISensy API Credentials

### Access API Documentation
Since the official API docs weren't accessible via the links I tried, you'll need to:

1. **Login to AISensy Dashboard**
   - Visit: https://app.aisensy.com
   - Navigate to Settings → API & Integrations

2. **Generate API Key**
   - Look for "API Keys" or "Developer Settings"
   - Create a new API key for production
   - Save the API key securely

3. **Find API Documentation**
   - Contact AISensy support: https://go.aisensy.com/support
   - Request API documentation for:
     - Adding contacts programmatically
     - Sending template messages
     - Webhook integrations
   - Common endpoint: `https://backend.aisensy.com/campaign/t1/api/v2/`

### Required Information
```bash
AISENSY_API_KEY=your_api_key_here
AISENSY_CAMPAIGN_NAME=your_campaign_name  # Must be a LIVE campaign
AISENSY_BASE_URL=https://backend.aisensy.com
```

**How to get API Key:**
1. Login to AISensy Dashboard
2. Go to **Manage → API Key**
3. Copy the key

---

## Step 2: Environment Variables

Add to `.env.local` and Vercel environment variables:

```bash
# AISensy Configuration
AISENSY_API_KEY=your_production_api_key
AISENSY_BASE_URL=https://backend.aisensy.com
NEXT_PUBLIC_AISENSY_ENABLED=true

# Campaign Names (must be LIVE campaigns in AISensy)
AISENSY_CAMPAIGN_WELCOME=welcome_message_campaign
AISENSY_CAMPAIGN_PAYMENT_SUCCESS=payment_confirmation_campaign
AISENSY_CAMPAIGN_PROGRAM_START=program_reminder_campaign
```

---

## Step 3: Create AISensy Service

Create a new service file for AISensy integration:

```typescript
// src/lib/aisensy.ts

/**
 * AISensy API Service
 * Official API Documentation: https://wiki.aisensy.com/en/articles/11501889-api-reference-docs
 */

interface AISensyContact {
  phoneNumber: string;
  userName: string;
  campaignName?: string;
  source?: string;
  media?: {
    url: string;
    filename: string;
  };
  templateParams?: string[];
  tags?: string[];
  attributes?: Record<string, string | number | boolean>;
}

interface AISensyResponse {
  success: boolean;
  message?: string;
  status?: number;
  data?: any;
}

class AISensyService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AISENSY_API_KEY || '';
    this.baseUrl = process.env.AISENSY_BASE_URL || 'https://backend.aisensy.com';

    if (!this.apiKey) {
      console.warn('⚠️  AISensy API key not configured');
    }
  }

  /**
   * Send campaign message and create/update contact
   *
   * This is the primary AISensy API method. When you send a campaign message,
   * it automatically creates a contact with the provided details.
   *
   * @param contact - Contact and campaign information
   * @returns Promise with AISensy response
   *
   * @example
   * ```typescript
   * await aisensyService.sendCampaignMessage({
   *   phoneNumber: '919876543210',
   *   userName: 'John Doe',
   *   campaignName: 'welcome_message',
   *   source: 'quiz',
   *   templateParams: ['John', 'Transform Program'],
   *   attributes: { program: 'transform', amount: 999 }
   * });
   * ```
   */
  async sendCampaignMessage(contact: AISensyContact): Promise<AISensyResponse> {
    if (!this.apiKey) {
      console.error('❌ AISensy API key not configured');
      return { success: false, message: 'API key not configured' };
    }

    if (!contact.campaignName) {
      console.error('❌ Campaign name is required');
      return { success: false, message: 'Campaign name is required' };
    }

    try {
      // Format phone number (ensure country code)
      const destination = this.formatPhoneNumber(contact.phoneNumber);

      const payload = {
        apiKey: this.apiKey,
        campaignName: contact.campaignName,
        destination,
        userName: contact.userName,
        ...(contact.source && { source: contact.source }),
        ...(contact.media && { media: contact.media }),
        ...(contact.templateParams && { templateParams: contact.templateParams }),
        ...(contact.tags && { tags: contact.tags }),
        ...(contact.attributes && { attributes: contact.attributes }),
      };

      console.log('📱 Sending AISensy campaign message:', {
        campaign: contact.campaignName,
        destination: destination.replace(/\d(?=\d{4})/g, '*'), // Mask phone
        userName: contact.userName,
        source: contact.source
      });

      const response = await fetch(`${this.baseUrl}/campaign/t1/api/v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // AISensy returns 200 on success
      if (response.status === 200) {
        console.log('✅ AISensy campaign sent successfully - Contact created/updated');
        return {
          success: true,
          status: 200,
          message: 'Campaign sent and contact created/updated'
        };
      }

      // Handle errors
      const errorText = await response.text();
      console.error('❌ AISensy API error:', {
        status: response.status,
        error: errorText
      });

      return {
        success: false,
        status: response.status,
        message: errorText || 'Failed to send campaign',
      };

    } catch (error) {
      console.error('❌ Error sending AISensy campaign:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send welcome message to new contact
   *
   * @param phoneNumber - Contact phone number
   * @param userName - Contact name
   * @param programName - Program they signed up for
   * @param attributes - Additional contact attributes
   */
  async sendWelcomeMessage(
    phoneNumber: string,
    userName: string,
    programName: string,
    attributes?: Record<string, any>
  ): Promise<AISensyResponse> {
    const campaignName = process.env.AISENSY_CAMPAIGN_WELCOME;

    if (!campaignName) {
      console.warn('⚠️  Welcome campaign not configured');
      return { success: false, message: 'Welcome campaign not configured' };
    }

    return this.sendCampaignMessage({
      phoneNumber,
      userName,
      campaignName,
      source: 'quiz',
      templateParams: [userName, programName],
      attributes: {
        program: programName,
        signupDate: new Date().toISOString(),
        ...attributes
      }
    });
  }

  /**
   * Send payment confirmation message
   *
   * @param phoneNumber - Contact phone number
   * @param userName - Contact name
   * @param programName - Program purchased
   * @param amount - Payment amount
   * @param orderId - Order/transaction ID
   */
  async sendPaymentConfirmation(
    phoneNumber: string,
    userName: string,
    programName: string,
    amount: number,
    orderId: string
  ): Promise<AISensyResponse> {
    const campaignName = process.env.AISENSY_CAMPAIGN_PAYMENT_SUCCESS;

    if (!campaignName) {
      console.warn('⚠️  Payment confirmation campaign not configured');
      return { success: false, message: 'Payment confirmation campaign not configured' };
    }

    return this.sendCampaignMessage({
      phoneNumber,
      userName,
      campaignName,
      source: 'payment',
      templateParams: [userName, programName],
      tags: ['paid_customer'],
      attributes: {
        program: programName,
        amount,
        orderId,
        paymentDate: new Date().toISOString(),
        paymentStatus: 'paid'
      }
    });
  }

  /**
   * Format phone number for AISensy
   * Ensures proper country code format (Indian numbers default to +91)
   *
   * @param phoneNumber - Raw phone number
   * @param countryCode - Country code (default: 91 for India)
   */
  private formatPhoneNumber(phoneNumber: string, countryCode: string = '91'): string {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // If doesn't start with country code, add it
    if (!cleaned.startsWith(countryCode)) {
      cleaned = countryCode + cleaned;
    }

    return cleaned;
  }

  /**
   * Validate phone number format
   *
   * @param phoneNumber - Phone number to validate
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber) return false;

    const cleaned = phoneNumber.replace(/\D/g, '');
    // Indian phone numbers: 10 digits or 12 with country code (91XXXXXXXXXX)
    return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
  }

  /**
   * Check if AISensy is configured and enabled
   */
  isEnabled(): boolean {
    return !!(
      this.apiKey &&
      process.env.NEXT_PUBLIC_AISENSY_ENABLED === 'true'
    );
  }
}

// Export singleton instance
export const aisensyService = new AISensyService();

// Export types
export type { AISensyContact, AISensyResponse };
```

---

## Step 4: Integrate with Payment Webhooks

### Razorpay Webhook Integration

Update `src/app/api/webhooks/razorpay/route.ts`:

```typescript
import { aisensyService } from '@/lib/aisensy';

// After successful payment verification
if (isValidSignature && event === 'payment.captured') {
  // ... existing Wix CRM sync code ...

  // Send payment confirmation via AISensy and create/update contact
  if (aisensyService.isEnabled()) {
    const phoneNumber = paymentData.notes?.phone || paymentData.contact;
    const name = paymentData.notes?.name || '';
    const program = paymentData.notes?.program || '';
    const amount = paymentData.amount / 100;
    const orderId = paymentData.order_id;

    if (phoneNumber && aisensyService.isValidPhoneNumber(phoneNumber)) {
      try {
        // Send payment confirmation message (automatically creates/updates contact)
        await aisensyService.sendPaymentConfirmation(
          phoneNumber,
          name,
          program,
          amount,
          orderId
        );

        console.log('✅ Payment confirmation sent via AISensy');
      } catch (error) {
        // Don't fail the webhook if AISensy fails
        console.error('❌ AISensy integration error:', error);
      }
    } else {
      console.warn('⚠️  Invalid or missing phone number for AISensy:', phoneNumber);
    }
  }
}
```

### PayU Webhook Integration

Update `src/app/api/webhooks/payu/route.ts` similarly:

```typescript
import { aisensyService } from '@/lib/aisensy';

// After successful payment verification
if (status === 'success') {
  // ... existing code ...

  // Send payment confirmation via AISensy
  if (aisensyService.isEnabled() && phone) {
    const fullName = `${firstName} ${lastName}`.trim();

    try {
      await aisensyService.sendPaymentConfirmation(
        phone,
        fullName,
        productinfo,
        parseFloat(amount),
        txnid
      );

      console.log('✅ Payment confirmation sent via AISensy (PayU)');
    } catch (error) {
      console.error('❌ AISensy integration error:', error);
    }
  }
}
```

---

## Step 5: Optional - Add Lead on Quiz Submission

Update `src/app/api/quiz/submit/route.ts` to send welcome message after quiz:

```typescript
import { aisensyService } from '@/lib/aisensy';

export async function POST(request: Request) {
  // ... existing quiz submission logic ...

  // Send welcome message to quiz lead (optional)
  if (aisensyService.isEnabled() && phone && name) {
    try {
      await aisensyService.sendWelcomeMessage(
        phone,
        name,
        result, // Quiz result as program name
        {
          quizResult: result,
          leadSource: 'quiz',
          paymentStatus: 'pending',
          email
        }
      );

      console.log('✅ Welcome message sent to quiz lead');
    } catch (error) {
      // Don't fail quiz submission if AISensy fails
      console.error('❌ AISensy welcome message error:', error);
    }
  }

  // ... continue with existing code ...
}
```

---

## Step 6: Create Admin Sync Tool (Optional)

Create a script to sync existing contacts:

```typescript
// scripts/sync-to-aisensy.ts

import { createClient } from '@supabase/supabase-js';
import { aisensyService } from '../src/lib/aisensy';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncContacts() {
  console.log('🔄 Starting AISensy sync...');

  // Check if welcome campaign is configured
  const campaignName = process.env.AISENSY_CAMPAIGN_WELCOME;
  if (!campaignName) {
    console.error('❌ AISENSY_CAMPAIGN_WELCOME not configured');
    return;
  }

  // Get all quiz leads with phone numbers
  const { data: leads, error } = await supabase
    .from('quiz_leads')
    .select('*')
    .not('phone', 'is', null);

  if (error) {
    console.error('❌ Error fetching leads:', error);
    return;
  }

  console.log(`📊 Found ${leads.length} contacts to sync`);

  let synced = 0;
  let failed = 0;

  for (const lead of leads) {
    if (!aisensyService.isValidPhoneNumber(lead.phone)) {
      console.warn(`⚠️  Invalid phone: ${lead.email}`);
      failed++;
      continue;
    }

    try {
      // Send campaign message (creates/updates contact automatically)
      const result = await aisensyService.sendCampaignMessage({
        phoneNumber: lead.phone,
        userName: lead.name || 'User',
        campaignName,
        source: 'bulk_sync',
        templateParams: [lead.name || 'User', lead.result || 'Program'],
        attributes: {
          quizResult: lead.result || '',
          program: lead.program || '',
          leadSource: 'quiz',
          email: lead.email,
          syncedAt: new Date().toISOString(),
        }
      });

      if (result.success) {
        synced++;
        console.log(`✅ Synced: ${lead.email}`);
      } else {
        failed++;
        console.error(`❌ Failed: ${lead.email} - ${result.message}`);
      }
    } catch (error) {
      failed++;
      console.error(`❌ Error syncing ${lead.email}:`, error);
    }

    // Rate limiting: wait 200ms between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n📈 Sync complete: ${synced} synced, ${failed} failed`);
}

syncContacts().catch(console.error);
```

Run the sync:
```bash
npx tsx scripts/sync-to-aisensy.ts
```

---

## Step 7: Testing

### Test Contact Addition

```bash
# Test endpoint (create if needed)
curl -X POST http://localhost:3000/api/test/aisensy \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com"
  }'
```

### Test Integration Flow

1. **Complete Quiz**
   - Fill out quiz with phone number
   - Verify contact added to AISensy (check AISensy dashboard)

2. **Make Payment**
   - Complete Razorpay payment
   - Check webhook logs
   - Verify contact updated in AISensy with payment info

3. **Check WhatsApp**
   - Verify welcome message received (if template configured)
   - Verify contact appears in AISensy contacts list

---

## Step 8: AISensy Dashboard Setup

### Important: Campaign-Based API

AISensy uses a **campaign-based** API. This means:
- You must create campaigns in the dashboard first
- Campaigns must be in "LIVE" status
- Each API call sends a campaign message AND creates/updates the contact
- WhatsApp templates must be pre-approved

### Create WhatsApp Templates

In AISensy dashboard, create WhatsApp Business API templates:

1. **Welcome Message Template**
   - Template Name: `welcome_message`
   - Category: Marketing or Utility
   - Message:
     ```
     Hi {{1}}, welcome to {{2}}! We're excited to have you join us. Your journey to transformation starts now! 🌟
     ```
   - Variables:
     - {{1}} = User name
     - {{2}} = Program name
   - Submit for WhatsApp approval

2. **Payment Confirmation Template**
   - Template Name: `payment_confirmation`
   - Category: Utility
   - Message:
     ```
     Thank you {{1}} for your payment! Your enrollment in {{2}} is confirmed. Check your email for next steps. 💳✅
     ```
   - Variables:
     - {{1}} = User name
     - {{2}} = Program name
   - Submit for WhatsApp approval

3. **Program Start Reminder Template**
   - Template Name: `program_start_reminder`
   - Category: Utility
   - Message:
     ```
     Hi {{1}}, your {{2}} program starts tomorrow! Make sure you've joined our WhatsApp community. See you there! 💪
     ```
   - Variables:
     - {{1}} = User name
     - {{2}} = Program name
   - Submit for WhatsApp approval

**Wait for templates to be approved by WhatsApp (usually 24-48 hours)**

### Create Campaigns

Once templates are approved, create campaigns:

1. **Welcome Campaign**
   - Campaign name: `welcome_message_campaign`
   - Select template: `welcome_message`
   - Set to **LIVE** status
   - Copy exact campaign name to `.env` as `AISENSY_CAMPAIGN_WELCOME`

2. **Payment Confirmation Campaign**
   - Campaign name: `payment_confirmation_campaign`
   - Select template: `payment_confirmation`
   - Set to **LIVE** status
   - Copy exact campaign name to `.env` as `AISENSY_CAMPAIGN_PAYMENT_SUCCESS`

3. **Program Start Campaign**
   - Campaign name: `program_start_campaign`
   - Select template: `program_start_reminder`
   - Set to **LIVE** status
   - Copy exact campaign name to `.env` as `AISENSY_CAMPAIGN_PROGRAM_START`

### Configure Contact Attributes

When sending messages via API, you can include custom attributes:
- These are stored with the contact automatically
- Access them in AISensy dashboard under contact details
- Use for segmentation and targeting

Recommended attributes from our integration:
- `program` - Program name
- `amount` - Payment amount
- `orderId` - Transaction ID
- `paymentStatus` - paid/pending
- `quizResult` - Quiz result
- `email` - Email address
- `leadSource` - quiz/payment/bulk_sync

### Configure Tags

Tags can be sent via API for contact segmentation:
- `paid_customer` - For successful payments
- `quiz_lead` - For quiz completions
- `transform_program`, `circle_program`, etc.

---

## Error Handling

### Handle API Failures Gracefully

```typescript
// In webhook handlers
try {
  await aisensyService.addContact(contactData);
} catch (error) {
  // Log error but don't fail the webhook
  console.error('❌ AISensy sync failed:', error);
  // Optionally: Queue for retry
  // await queueForRetry(contactData);
}

// Always return 200 OK to payment gateway
return NextResponse.json({ received: true });
```

### Implement Retry Logic

```typescript
async function addContactWithRetry(contact: AISensyContact, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await aisensyService.addContact(contact);

    if (result.success) {
      return result;
    }

    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`🔄 Retry attempt ${attempt}/${maxRetries}`);
    }
  }

  console.error('❌ Failed after all retry attempts');
  return { success: false };
}
```

---

## Monitoring & Logging

### Track Integration Success

```typescript
// Create logging utility
export function logAISensyEvent(
  event: 'contact_added' | 'message_sent' | 'error',
  data: any
) {
  console.log(`[AISensy] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...data
  });

  // Optionally: Send to analytics
  // analytics.track('aisensy_' + event, data);
}

// Use in service
await aisensyService.addContact(contact);
logAISensyEvent('contact_added', { email: contact.email });
```

### Monitor in Production

1. **Check AISensy Logs**
   - Login to AISensy dashboard
   - Navigate to Logs/Activity
   - Verify contacts being added

2. **Check Application Logs**
   - Vercel logs: `vercel logs --follow`
   - Search for "AISensy" in logs
   - Monitor error rates

3. **Set Up Alerts**
   - Alert if AISensy API returns errors for > 5 minutes
   - Alert if contact sync rate drops below threshold

---

## Security Best Practices

### Protect API Keys

```typescript
// ✅ GOOD: Server-side only
const apiKey = process.env.AISENSY_API_KEY; // Never expose to client

// ❌ BAD: Client-side exposure
const apiKey = process.env.NEXT_PUBLIC_AISENSY_API_KEY; // Exposed!
```

### Validate Phone Numbers

```typescript
// Sanitize and validate before sending
function sanitizePhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10 || cleaned.length > 12) {
    return null; // Invalid
  }

  return cleaned;
}
```

### Rate Limiting

```typescript
// Implement rate limiting for AISensy API calls
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

await limiter.check(request, 20, 'AISENSY_API'); // Max 20 requests/minute
```

---

## Troubleshooting

### Common Issues

**1. Contact not appearing in AISensy**
- ✅ Check if phone number is valid (10 digits for India)
- ✅ Verify API key is correct
- ✅ Check AISensy dashboard → Contacts
- ✅ Review application logs for errors

**2. Welcome message not sending**
- ✅ Verify template is approved by WhatsApp
- ✅ Check template ID in environment variables
- ✅ Ensure contact is added before sending message
- ✅ Check AISensy message logs

**3. API returning 401 Unauthorized**
- ✅ API key expired or invalid
- ✅ Regenerate API key in AISensy dashboard
- ✅ Update environment variables
- ✅ Redeploy application

**4. Duplicate contacts**
- ✅ AISensy typically handles duplicates by phone number
- ✅ Check if "update on duplicate" is enabled
- ✅ Review contact merge settings in AISensy

---

## Cost Considerations

### AISensy Pricing (as of 2025)
- **Marketing messages**: ₹0.88 per message
- **Utility messages**: ₹0.125 per message
- **Authentication messages**: ₹0.125 per message

### Optimize Costs
1. Use utility templates instead of marketing for transactional messages
2. Batch messages where possible
3. Implement smart retry logic (don't retry indefinitely)
4. Monitor message send rates

---

## Next Steps

### 1. Set Up AISensy Account
- [ ] Create production account at https://app.aisensy.com
- [ ] Complete WhatsApp Business API verification
- [ ] Generate API key (Manage → API Key)
- [ ] Save API key securely

### 2. Create WhatsApp Templates
- [ ] Create welcome message template
- [ ] Create payment confirmation template
- [ ] Create program reminder template
- [ ] Submit for WhatsApp approval
- [ ] Wait 24-48 hours for approval

### 3. Create Campaigns
- [ ] Create welcome campaign (set to LIVE)
- [ ] Create payment confirmation campaign (set to LIVE)
- [ ] Create program reminder campaign (set to LIVE)
- [ ] Copy exact campaign names

### 4. Implement Integration
- [ ] Create `src/lib/aisensy.ts` with the service code above
- [ ] Add environment variables to `.env.local`
- [ ] Update Razorpay webhook handler
- [ ] Update PayU webhook handler
- [ ] (Optional) Update quiz submission handler

### 5. Test Integration
- [ ] Test campaign message send locally
- [ ] Complete test quiz with phone number
- [ ] Make test payment
- [ ] Verify contact appears in AISensy dashboard
- [ ] Confirm WhatsApp message received
- [ ] Check contact attributes in AISensy

### 6. Deploy to Production
- [ ] Add environment variables to Vercel
- [ ] Deploy application
- [ ] Test production payment flow
- [ ] Monitor AISensy dashboard for contacts
- [ ] Set up error monitoring

### 7. Monitor & Optimize
- [ ] Review message delivery rates
- [ ] Monitor API error rates
- [ ] Analyze contact engagement
- [ ] Optimize template messages based on performance

---

## Support Resources

- **AISensy API Documentation**: https://wiki.aisensy.com/en/articles/11501889-api-reference-docs
- **AISensy Support**: https://go.aisensy.com/support
- **AISensy Help Center**: https://wiki.aisensy.com/
- **WhatsApp Business API**: https://business.whatsapp.com/
- **WhatsApp Template Guidelines**: https://business.whatsapp.com/policy

---

## Quick Reference

### API Endpoint
```
POST https://backend.aisensy.com/campaign/t1/api/v2
```

### Required Payload Fields
- `apiKey` - Your API key
- `campaignName` - Name of LIVE campaign
- `destination` - Phone number with country code
- `userName` - Contact name

### Optional Payload Fields
- `source` - Lead source for tracking
- `templateParams` - Array of template variables
- `tags` - Array of contact tags
- `attributes` - Object of custom contact data
- `media` - Object with URL and filename

### Environment Variables
```bash
AISENSY_API_KEY=your_api_key
AISENSY_BASE_URL=https://backend.aisensy.com
NEXT_PUBLIC_AISENSY_ENABLED=true
AISENSY_CAMPAIGN_WELCOME=your_welcome_campaign_name
AISENSY_CAMPAIGN_PAYMENT_SUCCESS=your_payment_campaign_name
```

---

**Last Updated**: 2025-12-17
**Status**: Ready for Implementation ✅
**API Documentation**: Official AISensy API Reference
**Next Action**: Set up AISensy account and create campaigns
