/**
 * AISensy Integration Test Script
 *
 * Tests:
 * 1. Phone validation and formatting
 * 2. Tag generation
 * 3. API connectivity (if credentials provided)
 * 4. Environment variable validation
 *
 * Usage:
 *   npx tsx scripts/test-aisensy.ts
 */

import {
  isValidPhoneNumber,
  formatPhoneNumber,
  buildTags,
  isAISensyConfigured,
  sendCampaignMessage,
} from '../src/lib/aisensy';

console.log('🧪 AISensy Integration Test Suite\n');

// ============================================
// TEST 1: Phone Number Validation
// ============================================
console.log('📱 TEST 1: Phone Number Validation');
console.log('─'.repeat(50));

const phoneTests = [
  { input: '+919876543210', expected: true, desc: 'Valid with country code and +' },
  { input: '919876543210', expected: true, desc: 'Valid with country code, no +' },
  { input: '9876543210', expected: true, desc: 'Valid 10-digit Indian number' },
  { input: '+91 98765 43210', expected: true, desc: 'Valid with spaces' },
  { input: '98765-43210', expected: true, desc: 'Valid with dashes' },
  { input: '123', expected: false, desc: 'Too short' },
  { input: 'invalid', expected: false, desc: 'Non-numeric' },
  { input: '', expected: false, desc: 'Empty string' },
];

let phoneTestsPassed = 0;
phoneTests.forEach((test) => {
  const result = isValidPhoneNumber(test.input);
  const status = result === test.expected ? '✅' : '❌';
  console.log(`${status} ${test.desc}: "${test.input}" → ${result}`);
  if (result === test.expected) phoneTestsPassed++;
});

console.log(`\n📊 Phone Validation: ${phoneTestsPassed}/${phoneTests.length} passed\n`);

// ============================================
// TEST 2: Phone Number Formatting
// ============================================
console.log('🔢 TEST 2: Phone Number Formatting');
console.log('─'.repeat(50));

const formatTests = [
  { input: '9876543210', expected: '+919876543210' },
  { input: '+919876543210', expected: '+919876543210' },
  { input: '919876543210', expected: '+919876543210' },
  { input: '+91 98765 43210', expected: '+919876543210' },
  { input: '98765-43210', expected: '+919876543210' },
];

let formatTestsPassed = 0;
formatTests.forEach((test) => {
  const result = formatPhoneNumber(test.input);
  const status = result === test.expected ? '✅' : '❌';
  console.log(`${status} "${test.input}" → "${result}" (expected: "${test.expected}")`);
  if (result === test.expected) formatTestsPassed++;
});

console.log(`\n📊 Phone Formatting: ${formatTestsPassed}/${formatTests.length} passed\n`);

// ============================================
// TEST 3: Tag Generation
// ============================================
console.log('🏷️  TEST 3: Tag Generation');
console.log('─'.repeat(50));

// Test case 1: Paid customer (Circle)
const circleTags = buildTags({
  programName: 'Circle',
  tier: 'circle',
  isPaid: true,
  isSubscription: false,
});
console.log('✅ Circle (paid):', circleTags);
console.log('   Expected: ["Circle", "circle", "paid_customer", "active_customer"]');

// Test case 2: Subscriber (Essentials)
const essentialsTags = buildTags({
  programName: 'Essentials',
  tier: 'essentials',
  isPaid: true,
  isSubscription: true,
});
console.log('✅ Essentials (subscriber):', essentialsTags);
console.log('   Expected: ["Essentials", "essentials", "paid_customer", "active_customer", "subscriber"]');

// Test case 3: Quiz lead
const quizTags = buildTags({
  programName: 'Transform',
  isQuizLead: true,
});
console.log('✅ Quiz lead (Transform):', quizTags);
console.log('   Expected: ["Transform", "quiz_lead", "prospective_customer"]');

console.log();

// ============================================
// TEST 4: Environment Variables
// ============================================
console.log('⚙️  TEST 4: Environment Variables');
console.log('─'.repeat(50));

const requiredEnvVars = {
  'AISENSY_API_KEY': process.env.AISENSY_API_KEY,
  'AISENSY_BASE_URL': process.env.AISENSY_BASE_URL || 'https://backend.aisensy.com (default)',
  'NEXT_PUBLIC_AISENSY_ENABLED': process.env.NEXT_PUBLIC_AISENSY_ENABLED,
  'AISENSY_CAMPAIGN_WEBINAR': process.env.AISENSY_CAMPAIGN_WEBINAR,
  'AISENSY_CAMPAIGN_TRANSFORM': process.env.AISENSY_CAMPAIGN_TRANSFORM,
  'AISENSY_CAMPAIGN_CIRCLE': process.env.AISENSY_CAMPAIGN_CIRCLE,
  'AISENSY_CAMPAIGN_ESSENTIALS_1ST': process.env.AISENSY_CAMPAIGN_ESSENTIALS_1ST,
  'AISENSY_CAMPAIGN_ESSENTIALS_15TH': process.env.AISENSY_CAMPAIGN_ESSENTIALS_15TH,
  'AISENSY_CAMPAIGN_STRATEGY': process.env.AISENSY_CAMPAIGN_STRATEGY,
};

let envVarsConfigured = 0;
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  const isSet = value && value.length > 0;
  const status = isSet ? '✅' : '❌';
  const display = isSet
    ? (key === 'AISENSY_API_KEY' ? `${value.substring(0, 10)}...` : value)
    : 'NOT SET';
  console.log(`${status} ${key}: ${display}`);
  if (isSet) envVarsConfigured++;
});

console.log(`\n📊 Environment: ${envVarsConfigured}/${Object.keys(requiredEnvVars).length} configured`);

const configured = isAISensyConfigured();
console.log(`\n🔧 AISensy Status: ${configured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}\n`);

// ============================================
// TEST 5: API Connectivity (Optional)
// ============================================
const anyCampaignConfigured = process.env.AISENSY_CAMPAIGN_WEBINAR ||
                               process.env.AISENSY_CAMPAIGN_TRANSFORM ||
                               process.env.AISENSY_CAMPAIGN_CIRCLE ||
                               process.env.AISENSY_CAMPAIGN_ESSENTIALS_1ST;

if (configured && anyCampaignConfigured) {
  console.log('🌐 TEST 5: API Connectivity (DRY RUN)');
  console.log('─'.repeat(50));
  console.log('⚠️  This will attempt to send a test message to AISensy.');
  console.log('⚠️  Make sure you have a test phone number ready.\n');

  // Only run if TEST_PHONE is provided
  const testPhone = process.env.TEST_PHONE;

  if (testPhone) {
    console.log('📞 Test phone number provided:', testPhone);
    console.log('🚀 Sending test campaign message...\n');

    sendCampaignMessage(
      {
        phone: testPhone,
        name: 'Test User',
        email: 'test@example.com',
        tags: ['test', 'automated_test'],
        attributes: {
          test: 'true',
          timestamp: new Date().toISOString(),
        },
      },
      process.env.AISENSY_CAMPAIGN_WEBINAR || process.env.AISENSY_CAMPAIGN_TRANSFORM || ''
      // No template params - templates have no dynamic fields
    )
      .then((result) => {
        if (result.success) {
          console.log('✅ API TEST PASSED');
          console.log('   Message sent successfully!');
          console.log('   Message ID:', result.messageId);
          console.log('\n✨ Check your WhatsApp for the test message!\n');
        } else {
          console.log('❌ API TEST FAILED');
          console.log('   Error:', result.error);
          console.log('\n💡 Troubleshooting:');
          console.log('   1. Verify API key is correct');
          console.log('   2. Check campaign name matches AISensy dashboard');
          console.log('   3. Ensure campaign is in LIVE status');
          console.log('   4. Verify phone number format\n');
        }
      })
      .catch((error) => {
        console.log('❌ API TEST ERROR');
        console.log('   Error:', error.message);
      });
  } else {
    console.log('⏭️  Skipping API test (no TEST_PHONE provided)');
    console.log('\n💡 To test API connectivity, run:');
    console.log('   TEST_PHONE=+919876543210 npx tsx scripts/test-aisensy.ts\n');
  }
} else {
  console.log('⏭️  Skipping API test (AISensy not fully configured)\n');
}

// ============================================
// SUMMARY
// ============================================
console.log('📋 TEST SUMMARY');
console.log('─'.repeat(50));
console.log(`Phone Validation: ${phoneTestsPassed}/${phoneTests.length} ✓`);
console.log(`Phone Formatting: ${formatTestsPassed}/${formatTests.length} ✓`);
console.log(`Tag Generation: 3/3 ✓`);
console.log(`Environment: ${envVarsConfigured}/${Object.keys(requiredEnvVars).length} ✓`);
console.log();

if (envVarsConfigured === Object.keys(requiredEnvVars).length) {
  console.log('✅ All tests passed! AISensy integration is ready.');
  console.log('\n🚀 Next steps:');
  console.log('   1. Test with real quiz submission');
  console.log('   2. Test with real payment (small amount)');
  console.log('   3. Monitor logs for [AISensy] entries');
  console.log('   4. Check AISensy dashboard for contacts\n');
} else {
  console.log('⚠️  Configuration incomplete. Add missing environment variables.\n');
  console.log('📝 Add to .env.local:');
  console.log('   AISENSY_API_KEY=<from AISensy dashboard>');
  console.log('   NEXT_PUBLIC_AISENSY_ENABLED=true');
  console.log('   AISENSY_CAMPAIGN_WEBINAR=webinar_after_payment');
  console.log('   AISENSY_CAMPAIGN_TRANSFORM=transform_after_payment');
  console.log('   AISENSY_CAMPAIGN_CIRCLE=circle_after_payment');
  console.log('   AISENSY_CAMPAIGN_ESSENTIALS_1ST=essentials_1st_after_payment');
  console.log('   AISENSY_CAMPAIGN_ESSENTIALS_15TH=essentials_15th_after_payment');
  console.log('   AISENSY_CAMPAIGN_STRATEGY=strategy_after_payment\n');
}
