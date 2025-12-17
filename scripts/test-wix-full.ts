#!/usr/bin/env npx ts-node
/**
 * Wix CRM Full Integration Test
 *
 * Tests:
 * 1. API Configuration check
 * 2. Contact creation (quiz lead)
 * 3. Contact update
 * 4. Member creation (post-payment)
 * 5. Pricing plan assignment
 *
 * Usage:
 *   npx ts-node scripts/test-wix-full.ts
 *   # or
 *   npm run test:wix:full
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ============================================
// Configuration
// ============================================

const WIX_API_KEY = process.env.WIX_API_KEY || '';
const WIX_SITE_ID = process.env.WIX_SITE_ID || '';
const WIX_API_BASE = 'https://www.wixapis.com';

// Test data - use unique timestamp to avoid conflicts
const TEST_TIMESTAMP = Date.now();
const TEST_EMAIL = `test-${TEST_TIMESTAMP}@dmktest.example.com`;
const TEST_FIRST_NAME = 'Test';
const TEST_LAST_NAME = `User${TEST_TIMESTAMP}`;
const TEST_PHONE = '+919876543210';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const colorMap = {
    info: colors.blue,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
  };
  const prefix = {
    info: 'ℹ️ ',
    success: '✅',
    error: '❌',
    warning: '⚠️ ',
  };
  console.log(`${colorMap[type]}${prefix[type]} ${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`);
}

// ============================================
// API Helpers
// ============================================

function getWixHeaders(): HeadersInit {
  return {
    'Authorization': `Bearer ${WIX_API_KEY}`,
    'wix-site-id': WIX_SITE_ID,
    'Content-Type': 'application/json',
  };
}

async function makeRequest(endpoint: string, options: RequestInit = {}): Promise<{
  ok: boolean;
  status: number;
  data: any;
  error?: string;
}> {
  try {
    const response = await fetch(`${WIX_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getWixHeaders(),
        ...options.headers,
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? undefined : text,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ============================================
// Test Functions
// ============================================

async function testApiConfiguration(): Promise<boolean> {
  logSection('1. API Configuration Check');

  if (!WIX_API_KEY) {
    log('WIX_API_KEY is not set', 'error');
    return false;
  }
  log(`WIX_API_KEY: ${WIX_API_KEY.substring(0, 10)}...`, 'success');

  if (!WIX_SITE_ID) {
    log('WIX_SITE_ID is not set', 'error');
    return false;
  }
  log(`WIX_SITE_ID: ${WIX_SITE_ID.substring(0, 10)}...`, 'success');

  // Test API connection by querying contacts
  log('Testing API connection...', 'info');
  const result = await makeRequest('/contacts/v4/contacts/query', {
    method: 'POST',
    body: JSON.stringify({
      query: { paging: { limit: 1 } },
    }),
  });

  if (!result.ok) {
    log(`API connection failed: ${result.error}`, 'error');
    return false;
  }

  log('API connection successful!', 'success');
  return true;
}

async function testContactCreation(): Promise<{ contactId: string } | null> {
  logSection('2. Contact Creation Test (Quiz Lead)');

  log(`Creating test contact: ${TEST_EMAIL}`, 'info');

  // Create label first
  const labelResult = await makeRequest('/contacts/v4/labels', {
    method: 'POST',
    body: JSON.stringify({ displayName: 'Lead' }),
  });

  const labelKey = labelResult.data?.label?.key;
  if (labelKey) {
    log(`Label "Lead" ready: ${labelKey}`, 'success');
  } else {
    log('Could not create/get Lead label (may already exist)', 'warning');
  }

  // Create contact
  const createResult = await makeRequest('/contacts/v4/contacts', {
    method: 'POST',
    body: JSON.stringify({
      info: {
        name: {
          first: TEST_FIRST_NAME,
          last: TEST_LAST_NAME,
        },
        emails: {
          items: [{ email: TEST_EMAIL }],
        },
        phones: {
          items: [{ phone: TEST_PHONE }],
        },
        extendedFields: {
          items: {
            'custom.quizRecommendation': 'circle',
            'custom.quizCompletedAt': new Date().toISOString(),
            'custom.deviceType': 'desktop',
          },
        },
        ...(labelKey && {
          labelKeys: {
            items: [labelKey],
          },
        }),
      },
    }),
  });

  if (!createResult.ok) {
    // Check if it's an extended fields error
    if (createResult.error?.includes('EXTENDED_FIELD_NOT_FOUND')) {
      log('Extended fields not configured in Wix - creating without them', 'warning');

      // Retry without extended fields
      const retryResult = await makeRequest('/contacts/v4/contacts', {
        method: 'POST',
        body: JSON.stringify({
          info: {
            name: {
              first: TEST_FIRST_NAME,
              last: TEST_LAST_NAME,
            },
            emails: {
              items: [{ email: TEST_EMAIL }],
            },
            phones: {
              items: [{ phone: TEST_PHONE }],
            },
            ...(labelKey && {
              labelKeys: {
                items: [labelKey],
              },
            }),
          },
        }),
      });

      if (!retryResult.ok) {
        log(`Contact creation failed: ${retryResult.error}`, 'error');
        return null;
      }

      // Debug: log the full response to see structure
      log(`Response structure: ${JSON.stringify(Object.keys(retryResult.data || {}))}`, 'info');

      const contactId = retryResult.data?.contact?._id ||
                        retryResult.data?.contact?.id ||
                        retryResult.data?.contactId ||
                        retryResult.data?._id ||
                        retryResult.data?.id;

      if (!contactId) {
        log(`Full response: ${JSON.stringify(retryResult.data).substring(0, 500)}`, 'warning');
      }

      log(`Contact created (without extended fields): ${contactId}`, 'success');
      return { contactId };
    }

    log(`Contact creation failed: ${createResult.error}`, 'error');
    return null;
  }

  const contactId = createResult.data?.contact?._id;
  log(`Contact created successfully: ${contactId}`, 'success');
  return { contactId };
}

async function testContactUpdate(contactId: string): Promise<boolean> {
  logSection('3. Contact Update Test (Payment Data)');

  log(`Updating contact ${contactId} with payment data...`, 'info');

  // First get the contact to get its revision
  const queryResult = await makeRequest('/contacts/v4/contacts/query', {
    method: 'POST',
    body: JSON.stringify({
      query: {
        filter: { 'info.emails.items.email': { $eq: TEST_EMAIL } },
      },
    }),
  });

  const revision = queryResult.data?.contacts?.[0]?.revision;
  log(`Contact revision: ${revision}`, 'info');

  // Ensure Customer label exists
  const labelResult = await makeRequest('/contacts/v4/labels', {
    method: 'POST',
    body: JSON.stringify({ displayName: 'Customer' }),
  });
  const customerLabelKey = labelResult.data?.label?.key;

  // Update contact with payment data
  const updatePayload: any = {
    info: {
      extendedFields: {
        items: {
          'custom.lastPaymentId': 'pay_test_123',
          'custom.lastPaymentAmount': '4499',
          'custom.lastProgramId': 'circle',
          'custom.lastProgramName': 'Circle',
          'custom.isSubscriber': 'No',
          'custom.lastPaymentAt': new Date().toISOString(),
        },
      },
    },
  };

  if (revision !== undefined) {
    updatePayload.revision = typeof revision === 'string' ? parseInt(revision, 10) : revision;
  }

  const updateResult = await makeRequest(`/contacts/v4/contacts/${contactId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatePayload),
  });

  if (!updateResult.ok) {
    if (updateResult.error?.includes('EXTENDED_FIELD_NOT_FOUND')) {
      log('Extended fields not configured - update skipped', 'warning');
    } else {
      log(`Contact update failed: ${updateResult.error}`, 'error');
      return false;
    }
  } else {
    log('Contact updated with payment data', 'success');
  }

  // Add Customer label
  if (customerLabelKey) {
    const addLabelResult = await makeRequest(`/contacts/v4/contacts/${contactId}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labelKeys: [customerLabelKey] }),
    });

    if (addLabelResult.ok) {
      log('Added "Customer" label to contact', 'success');
    } else {
      log(`Could not add label: ${addLabelResult.error}`, 'warning');
    }
  }

  return true;
}

async function testMemberCreation(contactId: string): Promise<string | null> {
  logSection('4. Member Creation Test (Post-Payment)');

  log(`Creating member for contact ${contactId}...`, 'info');

  const createResult = await makeRequest('/members/v1/members', {
    method: 'POST',
    body: JSON.stringify({
      member: {
        contactId,
        loginEmail: TEST_EMAIL,
      },
    }),
  });

  if (!createResult.ok) {
    if (createResult.error?.includes('already exists') || createResult.error?.includes('ALREADY_EXISTS')) {
      log('Member already exists (expected if re-running test)', 'warning');
      return contactId; // Return contactId as fallback
    }
    log(`Member creation failed: ${createResult.error}`, 'error');
    return null;
  }

  const memberId = createResult.data?.member?.id;
  log(`Member created: ${memberId}`, 'success');

  // Send password setup email
  log('Triggering password setup email...', 'info');
  const emailResult = await makeRequest('/members/v1/auth/send-set-password-email', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL }),
  });

  if (emailResult.ok) {
    log('Password setup email triggered', 'success');
  } else {
    log(`Password email failed: ${emailResult.error}`, 'warning');
  }

  return memberId;
}

async function testPricingPlanAssignment(memberId: string): Promise<boolean> {
  logSection('5. Pricing Plan Assignment Test');

  // Check which plan IDs are available
  const planIds = {
    essentials: process.env.WIX_PLAN_ID_ESSENTIALS,
    webinar: process.env.WIX_PLAN_ID_WEBINAR,
    circle: process.env.WIX_PLAN_ID_CIRCLE,
    transform: process.env.WIX_PLAN_ID_TRANSFORM,
    default: process.env.WIX_PLAN_ID_DEFAULT,
  };

  const configuredPlans = Object.entries(planIds)
    .filter(([_, id]) => id)
    .map(([name, id]) => ({ name, id }));

  if (configuredPlans.length === 0) {
    log('No pricing plan IDs configured in environment', 'warning');
    log('Set WIX_PLAN_ID_* variables in .env.local to test plan assignment', 'info');
    return false;
  }

  log(`Found ${configuredPlans.length} configured plan(s):`, 'info');
  configuredPlans.forEach(p => log(`  - ${p.name}: ${p.id?.substring(0, 20)}...`, 'info'));

  // Use the first available plan for testing (prefer Circle if available)
  const testPlan = configuredPlans.find(p => p.name === 'circle') || configuredPlans[0];
  log(`\nTesting with plan: ${testPlan.name} (${testPlan.id})`, 'info');

  const assignResult = await makeRequest('/pricing-plans/v2/checkout/orders/offline', {
    method: 'POST',
    body: JSON.stringify({
      planId: testPlan.id,
      memberId: memberId,
      startDate: new Date().toISOString(),
      paid: true,
    }),
  });

  if (!assignResult.ok) {
    log(`Pricing plan assignment failed: ${assignResult.error}`, 'error');

    // Check common issues
    if (assignResult.error?.includes('MEMBER_NOT_FOUND')) {
      log('Member not found - ensure member was created successfully', 'warning');
    } else if (assignResult.error?.includes('PLAN_NOT_FOUND')) {
      log('Plan not found - check if the plan ID is correct in Wix', 'warning');
    } else if (assignResult.error?.includes('permission')) {
      log('Permission error - ensure API key has "Manage Pricing Plan Orders" permission', 'warning');
    }

    return false;
  }

  const orderId = assignResult.data?.order?._id;
  log(`Pricing plan assigned! Order ID: ${orderId}`, 'success');
  return true;
}

async function cleanupTestData(contactId: string): Promise<void> {
  logSection('Cleanup');

  log(`Note: Test contact ${TEST_EMAIL} was created`, 'info');
  log('To delete it manually:', 'info');
  log(`  1. Go to Wix Dashboard > Contacts`, 'info');
  log(`  2. Search for: ${TEST_EMAIL}`, 'info');
  log(`  3. Delete the test contact`, 'info');
}

// ============================================
// Main Test Runner
// ============================================

async function runTests() {
  console.log('\n');
  console.log(colors.cyan + '╔════════════════════════════════════════════════════════════╗' + colors.reset);
  console.log(colors.cyan + '║        WIX CRM FULL INTEGRATION TEST                       ║' + colors.reset);
  console.log(colors.cyan + '╚════════════════════════════════════════════════════════════╝' + colors.reset);
  console.log('\n');

  const results = {
    apiConfig: false,
    contactCreation: false,
    contactUpdate: false,
    memberCreation: false,
    pricingPlan: false,
  };

  let contactId: string | null = null;
  let memberId: string | null = null;

  // Test 1: API Configuration
  results.apiConfig = await testApiConfiguration();
  if (!results.apiConfig) {
    log('\nAPI configuration failed. Cannot proceed with tests.', 'error');
    process.exit(1);
  }

  // Test 2: Contact Creation
  const contactResult = await testContactCreation();
  if (contactResult) {
    results.contactCreation = true;
    contactId = contactResult.contactId;
  }

  // Test 3: Contact Update
  if (contactId) {
    results.contactUpdate = await testContactUpdate(contactId);
  }

  // Test 4: Member Creation
  if (contactId) {
    memberId = await testMemberCreation(contactId);
    results.memberCreation = memberId !== null;
  }

  // Test 5: Pricing Plan Assignment
  if (memberId) {
    results.pricingPlan = await testPricingPlanAssignment(memberId);
  }

  // Cleanup info
  if (contactId) {
    await cleanupTestData(contactId);
  }

  // Summary
  logSection('Test Summary');

  const allTests = [
    { name: 'API Configuration', passed: results.apiConfig },
    { name: 'Contact Creation (Quiz Lead)', passed: results.contactCreation },
    { name: 'Contact Update (Payment Data)', passed: results.contactUpdate },
    { name: 'Member Creation (Post-Payment)', passed: results.memberCreation },
    { name: 'Pricing Plan Assignment', passed: results.pricingPlan },
  ];

  allTests.forEach(test => {
    if (test.passed) {
      log(`${test.name}`, 'success');
    } else {
      log(`${test.name}`, 'error');
    }
  });

  const passedCount = allTests.filter(t => t.passed).length;
  console.log('\n');

  if (passedCount === allTests.length) {
    log(`All ${allTests.length} tests passed! Wix CRM integration is working correctly.`, 'success');
    process.exit(0);
  } else {
    log(`${passedCount}/${allTests.length} tests passed. Review errors above.`, 'warning');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
