#!/usr/bin/env tsx

/**
 * Test script to verify Wix Automation webhook is working correctly
 *
 * Usage:
 *   npx tsx scripts/test-wix-webhook.ts
 *
 * This will send a test payload to your Wix automation webhook and show the response.
 */

import 'dotenv/config';

const WEBHOOK_URL = process.env.WIX_AUTOMATION_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error('❌ WIX_AUTOMATION_WEBHOOK_URL not set in .env.local');
  console.log('\nPlease add it to your .env.local file:');
  console.log('WIX_AUTOMATION_WEBHOOK_URL=https://manage.wix.com/_api/webhook-trigger/report/{trigger-id}/{site-id}');
  process.exit(1);
}

const testPayload = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phone: '+919876543210',
  programId: 'circle',
  programName: 'Circle - Premium Fitness Community',
  paymentId: 'test_pay_' + Date.now(),
  amount: 4499,
  isSubscription: true,
  subscriptionId: 'test_sub_' + Date.now(),
  timestamp: new Date().toISOString(),
};

console.log('🚀 Testing Wix Automation Webhook\n');
console.log('📍 Webhook URL:', WEBHOOK_URL);
console.log('\n📦 Test Payload:');
console.log(JSON.stringify(testPayload, null, 2));
console.log('\n⏳ Sending request...\n');

async function testWebhook() {
  try {
    const startTime = Date.now();

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    const duration = Date.now() - startTime;
    const responseText = await response.text();

    console.log('✅ Response received in ' + duration + 'ms\n');
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📄 Headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    console.log('\n📝 Response Body:');
    if (responseText) {
      try {
        const json = JSON.parse(responseText);
        console.log(JSON.stringify(json, null, 2));
      } catch {
        console.log(responseText);
      }
    } else {
      console.log('(empty response)');
    }

    if (response.ok) {
      console.log('\n✅ SUCCESS! Webhook is working correctly.');
      console.log('\n💡 Next steps:');
      console.log('1. Check your Wix Automations dashboard to verify the trigger fired');
      console.log('2. Check if the automation action executed (e.g., email sent)');
      console.log('3. Verify the payload fields are being received correctly in Wix');
    } else {
      console.log('\n⚠️  WARNING: Webhook returned non-200 status');
      console.log('This might indicate:');
      console.log('- Wrong webhook URL');
      console.log('- Trigger is not active in Wix');
      console.log('- Payload format mismatch with Wix automation schema');
      console.log('\nCheck your Wix Automations settings.');
    }

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        console.log('❌ ERROR: Request timed out after 15 seconds');
        console.log('This might indicate:');
        console.log('- Wix servers are slow or unavailable');
        console.log('- Network connectivity issue');
        console.log('- Wrong webhook URL');
      } else {
        console.log('❌ ERROR:', error.message);
        console.log('\nFull error:', error);
      }
    } else {
      console.log('❌ ERROR:', error);
    }

    console.log('\n💡 Troubleshooting:');
    console.log('1. Verify WIX_AUTOMATION_WEBHOOK_URL is correct');
    console.log('2. Check your internet connection');
    console.log('3. Verify the Wix automation is active and published');
    console.log('4. Check Wix service status at https://status.wix.com');

    process.exit(1);
  }
}

testWebhook();
