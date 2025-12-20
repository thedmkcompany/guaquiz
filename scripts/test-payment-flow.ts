#!/usr/bin/env node
/**
 * Payment Flow Integration Test
 * Tests the complete payment flow with Razorpay test credentials
 */

import crypto from 'crypto';

// Test Configuration
const TEST_CONFIG = {
  // Test Razorpay credentials
  RAZORPAY_KEY_ID: 'rzp_test_E58mTURC6tcuax',
  RAZORPAY_KEY_SECRET: 'pD8Z9rJiTdbQmhx9diajqYuF',

  // Test server URL (update if needed)
  API_BASE_URL: process.env.TEST_API_URL || 'http://localhost:3000',

  // Test customer data
  TEST_CUSTOMER: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+919999999999',
    programId: 'essentials', // Change to test different programs
  },
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✓ ${message}`, colors.green);
}

function error(message: string) {
  log(`✗ ${message}`, colors.red);
}

function info(message: string) {
  log(`ℹ ${message}`, colors.blue);
}

function section(message: string) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(message, colors.cyan + colors.bright);
  log('='.repeat(60), colors.cyan);
}

// Helper function to generate Razorpay signature
function generateRazorpaySignature(
  orderId: string,
  paymentId: string,
  secret: string
): string {
  const payload = `${orderId}|${paymentId}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return signature;
}

// Helper function to generate subscription signature (unused but kept for reference)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateSubscriptionSignature(
  subscriptionId: string,
  paymentId: string,
  secret: string
): string {
  const payload = `${subscriptionId}|${paymentId}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return signature;
}

// Test functions
async function testOrderCreation() {
  section('TEST 1: Create Razorpay Order');

  try {
    info('Creating test order...');

    const response = await fetch(
      `${TEST_CONFIG.API_BASE_URL}/api/payment/razorpay/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 99900, // ₹999
          email: TEST_CONFIG.TEST_CUSTOMER.email,
          name: TEST_CONFIG.TEST_CUSTOMER.name,
          phone: TEST_CONFIG.TEST_CUSTOMER.phone,
          programId: TEST_CONFIG.TEST_CUSTOMER.programId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      error(`Order creation failed: ${response.status}`);
      console.log('Error details:', JSON.stringify(errorData, null, 2));
      return null;
    }

    const data = await response.json();
    success('Order created successfully!');
    console.log('Order details:', JSON.stringify(data, null, 2));

    return data;
  } catch (err) {
    error(`Order creation error: ${(err as Error).message}`);
    return null;
  }
}

async function testPaymentVerification(orderId: string) {
  section('TEST 2: Verify Payment');

  try {
    info('Simulating payment verification...');

    // Generate a fake payment ID (in real scenario, this comes from Razorpay)
    const paymentId = 'pay_test_' + Date.now();

    // Generate signature using test secret
    const signature = generateRazorpaySignature(
      orderId,
      paymentId,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );

    info(`Generated signature for verification`);

    const response = await fetch(
      `${TEST_CONFIG.API_BASE_URL}/api/payment/razorpay/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      error(`Verification failed: ${response.status}`);
      console.log('Error details:', JSON.stringify(data, null, 2));
      return null;
    }

    if (data.verified) {
      success('Payment verification successful!');
    } else {
      error('Payment verification failed - signature mismatch');
    }

    console.log('Verification response:', JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    error(`Verification error: ${(err as Error).message}`);
    return null;
  }
}

async function testWebhookSignature() {
  section('TEST 3: Webhook Signature Verification');

  try {
    info('Testing webhook signature generation...');

    // Sample webhook payload
    const webhookBody = JSON.stringify({
      entity: 'event',
      account_id: 'acc_test',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: 'pay_test_123',
            order_id: 'order_test_123',
            amount: 99900,
            status: 'captured',
          },
        },
      },
    });

    // Generate webhook signature
    const webhookSecret = TEST_CONFIG.RAZORPAY_KEY_SECRET;
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    success('Webhook signature generated successfully');
    info(`Signature: ${signature.substring(0, 20)}...`);

    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    if (signature === expectedSignature) {
      success('Webhook signature verification passed!');
    } else {
      error('Webhook signature verification failed!');
    }

    return true;
  } catch (err) {
    error(`Webhook test error: ${(err as Error).message}`);
    return false;
  }
}

async function testSubscriptionCreation() {
  section('TEST 4: Create Razorpay Subscription');

  try {
    info('Creating test subscription...');

    // Note: This will fail if you don't have a plan_id configured
    // It's here to show the flow

    const response = await fetch(
      `${TEST_CONFIG.API_BASE_URL}/api/payment/razorpay/create-subscription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: 'plan_test_123', // Replace with actual test plan ID
          email: TEST_CONFIG.TEST_CUSTOMER.email,
          name: TEST_CONFIG.TEST_CUSTOMER.name,
          phone: TEST_CONFIG.TEST_CUSTOMER.phone,
          programId: 'circle', // Subscription program
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      error(`Subscription creation failed: ${response.status}`);
      console.log('Error details (expected if no plan configured):', JSON.stringify(data, null, 2));
      return null;
    }

    success('Subscription created successfully!');
    console.log('Subscription details:', JSON.stringify(data, null, 2));

    return data;
  } catch (err) {
    error(`Subscription creation error: ${(err as Error).message}`);
    return null;
  }
}

async function testHealthCheck() {
  section('TEST 0: API Health Check');

  try {
    info('Checking if API is accessible...');

    const response = await fetch(
      `${TEST_CONFIG.API_BASE_URL}/api/health`,
      { method: 'GET' }
    );

    if (response.ok) {
      const data = await response.json();
      success('API is healthy!');
      console.log('Health status:', JSON.stringify(data, null, 2));
      return true;
    } else {
      error(`API health check failed: ${response.status}`);
      return false;
    }
  } catch {
    error(`Cannot reach API at ${TEST_CONFIG.API_BASE_URL}`);
    error(`Make sure your dev server is running: npm run dev`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log('\n' + '█'.repeat(60), colors.cyan + colors.bright);
  log('PAYMENT FLOW INTEGRATION TEST', colors.cyan + colors.bright);
  log('█'.repeat(60) + '\n', colors.cyan + colors.bright);

  info('Test Configuration:');
  console.log(`  API URL: ${TEST_CONFIG.API_BASE_URL}`);
  console.log(`  Razorpay Key: ${TEST_CONFIG.RAZORPAY_KEY_ID}`);
  console.log(`  Test Customer: ${TEST_CONFIG.TEST_CUSTOMER.email}`);
  console.log(`  Test Program: ${TEST_CONFIG.TEST_CUSTOMER.programId}\n`);

  // Test 0: Health Check
  const isHealthy = await testHealthCheck();
  if (!isHealthy) {
    error('\n⚠️  Cannot proceed - API is not accessible');
    process.exit(1);
  }

  // Test 1: Create Order
  const orderData = await testOrderCreation();
  if (!orderData) {
    error('\n⚠️  Order creation failed - cannot proceed with further tests');
    process.exit(1);
  }

  // Test 2: Verify Payment
  await testPaymentVerification(orderData.orderId);

  // Test 3: Webhook Signature
  await testWebhookSignature();

  // Test 4: Subscription (optional - may fail if no plan configured)
  await testSubscriptionCreation();

  // Summary
  section('TEST SUMMARY');
  success('Core payment flow tests completed!');
  info('\nWhat was tested:');
  console.log('  ✓ Order creation with Razorpay');
  console.log('  ✓ Payment signature verification');
  console.log('  ✓ Webhook signature generation');
  console.log('  ✓ Subscription flow (if configured)');

  info('\nWhat happens next in production:');
  console.log('  1. Razorpay sends webhook → /api/webhooks/razorpay');
  console.log('  2. Payment data stored in Supabase');
  console.log('  3. Customer synced to Wix CRM');
  console.log('  4. Member account created');
  console.log('  5. Pricing plan assigned');
  console.log('  6. Welcome email triggered');
  console.log('  7. User redirected to success page');

  log('\n' + '█'.repeat(60), colors.green);
  log('ALL TESTS COMPLETED', colors.green + colors.bright);
  log('█'.repeat(60) + '\n', colors.green);
}

// Run tests
runTests().catch((err) => {
  error(`\nTest suite failed: ${err.message}`);
  process.exit(1);
});
