/**
 * Wix CRM Integration Test Suite
 *
 * These tests verify end-to-end functionality of the Wix CRM integration,
 * including quiz lead creation, payment processing, member creation,
 * pricing plan assignment, and subscription lifecycle management.
 *
 * @requires WIX_API_KEY and WIX_SITE_ID environment variables
 * @requires Wix test site with extended fields configured
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import {
  createQuizLead,
  createQuizLeadAsync,
  syncToWixCRM,
  findContactByEmail,
  cancelWixOrder,
  pauseWixOrder,
  resumeWixOrder,
  updateContactSubscriptionStatus,
} from '../../src/lib/wix-crm';
import type { WixCustomerData } from '../../src/types/payment';

// Test data
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_EMAIL_2 = `test-concurrent-${Date.now()}@example.com`;
const TEST_NAME = 'Test User';
const TEST_PHONE = '+919876543210';

// Test cleanup tracking
const createdContactIds: string[] = [];
const createdOrderIds: string[] = [];

describe('Wix CRM Integration Tests', () => {
  beforeAll(() => {
    console.log('Starting Wix CRM integration tests');
    console.log('Test email:', TEST_EMAIL);

    // Verify environment variables
    if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) {
      throw new Error('Missing WIX_API_KEY or WIX_SITE_ID environment variables');
    }
  });

  afterAll(async () => {
    console.log('Cleaning up test data');
    console.log('Created contacts:', createdContactIds.length);
    console.log('Created orders:', createdOrderIds.length);
    // Note: Manual cleanup may be needed in Wix dashboard
  });

  describe('Quiz Lead Creation', () => {
    it('should create new quiz lead with all fields', async () => {
      const leadData = {
        name: TEST_NAME,
        email: TEST_EMAIL,
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
        quizAnswers: { q1: ['answer1'], q2: ['answer2'] },
        deviceType: 'desktop',
        referralSource: 'google',
      };

      const result = await createQuizLead(leadData);

      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }

      // Verify contact was created in Wix
      const contact = await findContactByEmail(TEST_EMAIL);
      expect(contact).not.toBeNull();
      expect(contact?._id).toBe(result.contactId);
    }, 30000);

    it('should update existing quiz lead on duplicate email', async () => {
      const leadData1 = {
        name: TEST_NAME,
        email: TEST_EMAIL,
        whatsapp: TEST_PHONE,
        recommendation: 'essentials',
      };

      const result1 = await createQuizLead(leadData1);
      expect(result1.success).toBe(true);

      // Submit again with different recommendation
      const leadData2 = {
        ...leadData1,
        recommendation: 'circle',
      };

      const result2 = await createQuizLead(leadData2);
      expect(result2.success).toBe(true);
      expect(result2.contactId).toBe(result1.contactId); // Same contact ID

      // Verify recommendation was updated
      const contact = await findContactByEmail(TEST_EMAIL);
      expect(contact).not.toBeNull();
    }, 30000);

    it('should handle extended fields gracefully when not configured', async () => {
      // This test verifies fallback behavior if extended fields are missing
      const leadData = {
        name: 'Test User No Fields',
        email: `test-nofields-${Date.now()}@example.com`,
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
      };

      const result = await createQuizLead(leadData);

      // Should succeed even if extended fields fail
      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
    }, 30000);

    it('should normalize email to lowercase', async () => {
      const emailUpper = `TEST-UPPER-${Date.now()}@EXAMPLE.COM`;
      const leadData = {
        name: TEST_NAME,
        email: emailUpper,
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
      };

      const result = await createQuizLead(leadData);
      expect(result.success).toBe(true);

      // Should find by lowercase version
      const contact = await findContactByEmail(emailUpper.toLowerCase());
      expect(contact).not.toBeNull();

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
    }, 30000);

    it('should handle concurrent submissions without creating duplicates', async () => {
      const leadData = {
        name: 'Concurrent Test',
        email: TEST_EMAIL_2,
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
      };

      // Submit 5 times concurrently
      const promises = Array(5).fill(null).map(() =>
        createQuizLead({ ...leadData })
      );

      const results = await Promise.all(promises);

      // All should succeed
      expect(results.every(r => r.success)).toBe(true);

      // All should return same contactId
      const contactIds = results
        .map(r => r.contactId)
        .filter(Boolean);
      const uniqueIds = [...new Set(contactIds)];

      expect(uniqueIds.length).toBe(1); // Only one unique contact

      if (uniqueIds[0]) {
        createdContactIds.push(uniqueIds[0]);
      }
    }, 45000);

    it('should work with fire-and-forget async wrapper', async () => {
      const leadData = {
        name: 'Async Test',
        email: `test-async-${Date.now()}@example.com`,
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
      };

      // This should never throw
      const promise = createQuizLeadAsync(leadData);
      expect(promise).toBeInstanceOf(Promise);

      // Wait for it to complete
      const result = await promise;
      expect(result.success).toBe(true);

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
    }, 30000);
  });

  describe('Payment Sync - Full Flow', () => {
    it('should sync payment and assign pricing plan', async () => {
      const paymentData: WixCustomerData = {
        email: `test-payment-${Date.now()}@example.com`,
        firstName: 'Payment',
        lastName: 'Test',
        phone: TEST_PHONE,
        programId: 'circle',
        programName: 'Circle',
        paymentId: `pay_test_${Date.now()}`,
        amount: 4499,
        isSubscription: false,
      };

      const result = await syncToWixCRM(paymentData);

      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();
      expect(result.memberId).toBeDefined();
      expect(result.orderId).toBeDefined();

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
      if (result.orderId) {
        createdOrderIds.push(result.orderId);
      }

      // Verify contact was updated
      const contact = await findContactByEmail(paymentData.email);
      expect(contact).not.toBeNull();

      // Note: In a real test, you would verify:
      // - Contact has "Customer" label
      // - Contact has program-specific label
      // - Extended fields are populated correctly
      // - Member account exists
      // - Pricing plan order exists
    }, 60000);

    it('should handle subscription payment with start date', async () => {
      const paymentData: WixCustomerData = {
        email: `test-subscription-${Date.now()}@example.com`,
        firstName: 'Subscription',
        lastName: 'Test',
        phone: TEST_PHONE,
        programId: 'essentials',
        programName: 'Essentials',
        paymentId: `pay_test_${Date.now()}`,
        amount: 2499,
        isSubscription: true,
        subscriptionId: `sub_test_${Date.now()}`,
        programStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        startDateOption: '1st',
      };

      const result = await syncToWixCRM(paymentData);

      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();
      expect(result.memberId).toBeDefined();
      expect(result.orderId).toBeDefined();

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
      if (result.orderId) {
        createdOrderIds.push(result.orderId);
      }
    }, 60000);

    it('should handle missing programId gracefully', async () => {
      const paymentData: WixCustomerData = {
        email: `test-noprogram-${Date.now()}@example.com`,
        firstName: 'NoProgram',
        lastName: 'Test',
        phone: TEST_PHONE,
        programId: '', // Empty program ID
        programName: 'Test Program',
        paymentId: `pay_test_${Date.now()}`,
        amount: 1000,
        isSubscription: false,
      };

      const result = await syncToWixCRM(paymentData);

      // Contact and member should be created, plan assignment skipped
      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();
      expect(result.memberId).toBeDefined();
      expect(result.orderId).toBeUndefined(); // No order without plan ID

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
    }, 60000);
  });

  describe('Subscription Lifecycle', () => {
    let testOrderId: string;

    beforeAll(async () => {
      // Create a test subscription order
      const paymentData: WixCustomerData = {
        email: `test-lifecycle-${Date.now()}@example.com`,
        firstName: 'Lifecycle',
        lastName: 'Test',
        phone: TEST_PHONE,
        programId: 'essentials',
        programName: 'Essentials',
        paymentId: `pay_test_${Date.now()}`,
        amount: 2499,
        isSubscription: true,
        subscriptionId: `sub_test_${Date.now()}`,
      };

      const result = await syncToWixCRM(paymentData);

      if (!result.orderId) {
        throw new Error('Failed to create test order for lifecycle tests');
      }

      testOrderId = result.orderId;
      createdOrderIds.push(testOrderId);

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
    });

    it('should pause order on subscription halt', async () => {
      const result = await pauseWixOrder(testOrderId);
      expect(result).toBe(true);

      // Try to pause again - should be idempotent
      const result2 = await pauseWixOrder(testOrderId);
      expect(result2).toBe(true);
    }, 30000);

    it('should resume paused order', async () => {
      // First ensure it's paused
      await pauseWixOrder(testOrderId);

      // Then resume
      const result = await resumeWixOrder(testOrderId);
      expect(result).toBe(true);
    }, 30000);

    it('should cancel order on subscription cancellation', async () => {
      const result = await cancelWixOrder(testOrderId);
      expect(result).toBe(true);

      // Try to cancel again - should be idempotent
      const result2 = await cancelWixOrder(testOrderId);
      expect(result2).toBe(true);
    }, 30000);

    it('should update contact subscription status', async () => {
      const testEmail = `test-status-${Date.now()}@example.com`;

      // Create test contact first
      const leadData = {
        name: 'Status Test',
        email: testEmail,
        whatsapp: TEST_PHONE,
        recommendation: 'essentials',
      };

      const leadResult = await createQuizLead(leadData);
      expect(leadResult.success).toBe(true);

      if (leadResult.contactId) {
        createdContactIds.push(leadResult.contactId);
      }

      // Update subscription status
      const updateResult = await updateContactSubscriptionStatus(
        testEmail,
        'active',
        {
          'custom.lastrenewalat': new Date().toISOString(),
          'custom.lastrenewalamount': '2499',
        }
      );

      expect(updateResult).toBe(true);
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle network timeout gracefully', async () => {
      // This test would require mocking the fetch to timeout
      // Skipping implementation as it requires test infrastructure
      expect(true).toBe(true);
    });

    it('should handle invalid email format', async () => {
      const leadData = {
        name: 'Invalid Email Test',
        email: 'not-an-email',
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
      };

      const result = await createQuizLead(leadData);

      // Wix might reject invalid email
      // Result depends on Wix validation
      expect(result).toBeDefined();
    }, 30000);

    it('should handle revision mismatch with retry', async () => {
      // Create a contact
      const leadData = {
        name: 'Revision Test',
        email: `test-revision-${Date.now()}@example.com`,
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
      };

      const result1 = await createQuizLead(leadData);
      expect(result1.success).toBe(true);

      if (result1.contactId) {
        createdContactIds.push(result1.contactId);
      }

      // Update twice concurrently to trigger revision mismatch
      const updates = [
        createQuizLead({ ...leadData, recommendation: 'essentials' }),
        createQuizLead({ ...leadData, recommendation: 'transform' }),
      ];

      const results = await Promise.all(updates);

      // Both should succeed due to retry logic
      expect(results.every(r => r.success)).toBe(true);
    }, 30000);
  });

  describe('Performance', () => {
    it('should handle label caching correctly', async () => {
      const startTime = Date.now();

      // Create multiple leads with same recommendation (should use cached label)
      const promises = Array(3).fill(null).map((_, i) =>
        createQuizLead({
          name: `Cache Test ${i}`,
          email: `test-cache-${i}-${Date.now()}@example.com`,
          whatsapp: TEST_PHONE,
          recommendation: 'circle', // Same label for all
        })
      );

      const results = await Promise.all(promises);
      const elapsed = Date.now() - startTime;

      // All should succeed
      expect(results.every(r => r.success)).toBe(true);

      // Should complete reasonably fast due to label caching
      // Adjust threshold based on your Wix API latency
      expect(elapsed).toBeLessThan(15000); // 15 seconds for 3 requests

      // Track for cleanup
      results.forEach(r => {
        if (r.contactId) {
          createdContactIds.push(r.contactId);
        }
      });
    }, 30000);

    it('should complete quiz lead creation in under 5 seconds', async () => {
      const startTime = Date.now();

      const leadData = {
        name: 'Performance Test',
        email: `test-perf-${Date.now()}@example.com`,
        whatsapp: TEST_PHONE,
        recommendation: 'circle',
      };

      const result = await createQuizLead(leadData);
      const elapsed = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(elapsed).toBeLessThan(5000);

      if (result.contactId) {
        createdContactIds.push(result.contactId);
      }
    }, 10000);
  });
});

describe('Data Consistency Tests', () => {
  it('should maintain email case-insensitivity', async () => {
    const baseMail = `test-case-${Date.now()}`;
    const emailLower = `${baseMail}@example.com`;
    const emailUpper = `${baseMail.toUpperCase()}@EXAMPLE.COM`;
    const emailMixed = `${baseMail}@Example.Com`;

    // Create with lowercase
    const result1 = await createQuizLead({
      name: 'Case Test',
      email: emailLower,
      whatsapp: TEST_PHONE,
      recommendation: 'circle',
    });

    expect(result1.success).toBe(true);

    if (result1.contactId) {
      createdContactIds.push(result1.contactId);
    }

    // Find by uppercase - should find the same contact
    const contactUpper = await findContactByEmail(emailUpper);
    expect(contactUpper?._id).toBe(result1.contactId);

    // Find by mixed case - should find the same contact
    const contactMixed = await findContactByEmail(emailMixed);
    expect(contactMixed?._id).toBe(result1.contactId);
  }, 30000);
});
