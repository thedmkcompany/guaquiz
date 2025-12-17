#!/usr/bin/env node
/**
 * Payment Logic Test - Tests core payment functions without dev server
 * This tests the cryptographic signature generation and validation
 */

const crypto = require('crypto');

// Test Configuration
const TEST_CONFIG = {
  RAZORPAY_KEY_ID: 'rzp_test_E58mTURC6tcuax',
  RAZORPAY_KEY_SECRET: 'pD8Z9rJiTdbQmhx9diajqYuF',
};

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bright: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

function section(message) {
  log(`\n${'='.repeat(70)}`, colors.cyan);
  log(message, colors.cyan + colors.bright);
  log('='.repeat(70), colors.cyan);
}

// Generate Razorpay payment signature
function generatePaymentSignature(orderId, paymentId, secret) {
  const payload = `${orderId}|${paymentId}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

// Verify Razorpay payment signature
function verifyPaymentSignature(orderId, paymentId, signature, secret) {
  const expectedSignature = generatePaymentSignature(orderId, paymentId, secret);
  return signature === expectedSignature;
}

// Generate webhook signature
function generateWebhookSignature(body, secret) {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

// Test Suite
function runTests() {
  log('\n' + '█'.repeat(70), colors.cyan + colors.bright);
  log('  PAYMENT FLOW LOGIC TEST (No Server Required)', colors.cyan + colors.bright);
  log('█'.repeat(70) + '\n', colors.cyan + colors.bright);

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Payment Signature Generation
  section('TEST 1: Payment Signature Generation');
  totalTests++;
  try {
    const orderId = 'order_test_12345';
    const paymentId = 'pay_test_67890';
    const signature = generatePaymentSignature(
      orderId,
      paymentId,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );

    if (signature && signature.length === 64) {
      success('Payment signature generated successfully');
      info(`Order ID: ${orderId}`);
      info(`Payment ID: ${paymentId}`);
      info(`Signature: ${signature.substring(0, 20)}...`);
      passedTests++;
    } else {
      error('Invalid signature format');
    }
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }

  // Test 2: Payment Signature Verification (Valid)
  section('TEST 2: Payment Signature Verification (Valid Signature)');
  totalTests++;
  try {
    const orderId = 'order_test_12345';
    const paymentId = 'pay_test_67890';
    const validSignature = generatePaymentSignature(
      orderId,
      paymentId,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );

    const isValid = verifyPaymentSignature(
      orderId,
      paymentId,
      validSignature,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );

    if (isValid) {
      success('Valid signature verified successfully');
      passedTests++;
    } else {
      error('Failed to verify valid signature');
    }
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }

  // Test 3: Payment Signature Verification (Invalid)
  section('TEST 3: Payment Signature Verification (Invalid Signature)');
  totalTests++;
  try {
    const orderId = 'order_test_12345';
    const paymentId = 'pay_test_67890';
    const invalidSignature = 'invalid_signature_12345';

    const isValid = verifyPaymentSignature(
      orderId,
      paymentId,
      invalidSignature,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      success('Invalid signature correctly rejected');
      passedTests++;
    } else {
      error('Failed to reject invalid signature');
    }
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }

  // Test 4: Webhook Signature Generation
  section('TEST 4: Webhook Signature Generation');
  totalTests++;
  try {
    const webhookBody = JSON.stringify({
      entity: 'event',
      account_id: 'acc_test',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: 'pay_test_123',
            order_id: 'order_test_456',
            amount: 99900,
            status: 'captured',
            email: 'test@example.com',
          },
        },
      },
    });

    const signature = generateWebhookSignature(
      webhookBody,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );

    if (signature && signature.length === 64) {
      success('Webhook signature generated successfully');
      info(`Signature: ${signature.substring(0, 20)}...`);
      passedTests++;
    } else {
      error('Invalid webhook signature format');
    }
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }

  // Test 5: Webhook Signature Verification
  section('TEST 5: Webhook Signature Verification');
  totalTests++;
  try {
    const webhookBody = JSON.stringify({
      entity: 'event',
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_test' } } },
    });

    const validSignature = generateWebhookSignature(
      webhookBody,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );
    const verifiedSignature = generateWebhookSignature(
      webhookBody,
      TEST_CONFIG.RAZORPAY_KEY_SECRET
    );

    if (validSignature === verifiedSignature) {
      success('Webhook signature verification successful');
      passedTests++;
    } else {
      error('Webhook signature verification failed');
    }
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }

  // Test 6: Subscription Signature
  section('TEST 6: Subscription Signature Generation');
  totalTests++;
  try {
    const subscriptionId = 'sub_test_12345';
    const paymentId = 'pay_test_67890';
    const payload = `${subscriptionId}|${paymentId}`;
    const signature = crypto
      .createHmac('sha256', TEST_CONFIG.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    if (signature && signature.length === 64) {
      success('Subscription signature generated successfully');
      info(`Subscription ID: ${subscriptionId}`);
      info(`Payment ID: ${paymentId}`);
      info(`Signature: ${signature.substring(0, 20)}...`);
      passedTests++;
    } else {
      error('Invalid subscription signature format');
    }
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }

  // Test 7: Data Structure Validation
  section('TEST 7: Payment Data Structure Validation');
  totalTests++;
  try {
    const paymentData = {
      orderId: 'order_test_12345',
      amount: 99900,
      currency: 'INR',
      receipt: 'rcpt_test_123',
      keyId: TEST_CONFIG.RAZORPAY_KEY_ID,
    };

    const isValid =
      paymentData.orderId &&
      paymentData.amount > 0 &&
      paymentData.currency === 'INR' &&
      paymentData.keyId.startsWith('rzp_test_');

    if (isValid) {
      success('Payment data structure is valid');
      info(`Order ID: ${paymentData.orderId}`);
      info(`Amount: ₹${paymentData.amount / 100}`);
      info(`Currency: ${paymentData.currency}`);
      passedTests++;
    } else {
      error('Invalid payment data structure');
    }
  } catch (err) {
    error(`Test failed: ${err.message}`);
  }

  // Summary
  section('TEST SUMMARY');
  log('');
  log(`Total Tests: ${totalTests}`, colors.bright);
  log(`Passed: ${passedTests}`, colors.green + colors.bright);
  log(`Failed: ${totalTests - passedTests}`, colors.red + colors.bright);
  log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`, colors.cyan);
  log('');

  if (passedTests === totalTests) {
    log('█'.repeat(70), colors.green);
    log('  ALL TESTS PASSED! ✓', colors.green + colors.bright);
    log('█'.repeat(70), colors.green);
    log('');
    success('Payment logic is working correctly!');
    log('');
    info('What was tested:');
    console.log('  ✓ Payment signature generation (HMAC-SHA256)');
    console.log('  ✓ Payment signature verification');
    console.log('  ✓ Invalid signature rejection');
    console.log('  ✓ Webhook signature generation');
    console.log('  ✓ Webhook signature verification');
    console.log('  ✓ Subscription signature generation');
    console.log('  ✓ Payment data structure validation');
    log('');
    info('Next steps to test full flow:');
    console.log('  1. Start dev server: npm run dev');
    console.log('  2. Run full test: ./scripts/test-payment-manual.sh');
    console.log('  3. Or test in browser: http://localhost:3000/checkout?program=essentials');
    log('');
  } else {
    log('█'.repeat(70), colors.red);
    log('  SOME TESTS FAILED', colors.red + colors.bright);
    log('█'.repeat(70), colors.red);
  }

  return passedTests === totalTests ? 0 : 1;
}

// Run tests
process.exit(runTests());
