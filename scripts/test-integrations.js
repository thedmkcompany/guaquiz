#!/usr/bin/env node
/**
 * Integration Test Script
 * Run: node scripts/test-integrations.js
 *
 * Tests:
 * 1. Supabase connection & table
 * 2. Wix CRM connection
 * 3. Full quiz submission flow
 */

require('dotenv').config({ path: '.env.local' });

const TEST_EMAIL = `test-${Date.now()}@example.com`;

async function testSupabase() {
  console.log('\n📦 Testing Supabase...');

  const { createClient } = require('@supabase/supabase-js');

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.log('❌ Supabase not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
    return false;
  }

  const supabase = createClient(url, key);

  try {
    // Test connection
    const { error } = await supabase
      .from('quiz_leads')
      .select('id')
      .limit(1);

    if (error) {
      console.log('❌ Supabase Error:', error.message);
      return false;
    }

    console.log('✅ Supabase connected');
    console.log('   Table: quiz_leads exists');

    // Test insert
    const { data: inserted, error: insertError } = await supabase
      .from('quiz_leads')
      .insert({
        name: 'Test User',
        email: TEST_EMAIL,
        whatsapp: '+919876543210',
        recommendation: 'essentials',
        wix_sync_status: 'pending',
        wix_sync_attempts: 0,
      })
      .select('id')
      .single();

    if (insertError) {
      console.log('❌ Insert Error:', insertError.message);
      return false;
    }

    console.log('✅ Test lead created:', inserted.id);

    // Cleanup
    await supabase.from('quiz_leads').delete().eq('id', inserted.id);
    console.log('✅ Test lead cleaned up');

    return true;
  } catch (err) {
    console.log('❌ Error:', err.message);
    return false;
  }
}

async function testWix() {
  console.log('\n🔗 Testing Wix CRM...');

  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;

  if (!apiKey || !siteId) {
    console.log('❌ Wix not configured (missing WIX_API_KEY or WIX_SITE_ID)');
    return false;
  }

  try {
    // Test connection by querying labels
    const response = await fetch('https://www.wixapis.com/contacts/v4/labels/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'wix-site-id': siteId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: { paging: { limit: 5 } } }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ Wix API Error:', error.slice(0, 200));
      return false;
    }

    const data = await response.json();
    console.log('✅ Wix CRM connected');
    console.log('   Labels found:', data.labels?.length || 0);

    // Show label names
    if (data.labels?.length > 0) {
      const labelNames = data.labels.map(l => l.displayName).join(', ');
      console.log('   Labels:', labelNames);
    }

    return true;
  } catch (err) {
    console.log('❌ Error:', err.message);
    return false;
  }
}

async function testFullFlow() {
  console.log('\n🚀 Testing Full Quiz Submission Flow...');

  const { createClient } = require('@supabase/supabase-js');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const wixApiKey = process.env.WIX_API_KEY;
  const wixSiteId = process.env.WIX_SITE_ID;

  if (!supabaseUrl || !supabaseKey || !wixApiKey || !wixSiteId) {
    console.log('❌ Missing credentials for full flow test');
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const testEmail = `fulltest-${Date.now()}@example.com`;

  try {
    // Step 1: Create lead in Supabase
    console.log('   Step 1: Creating lead in Supabase...');
    const { data: lead, error: leadError } = await supabase
      .from('quiz_leads')
      .insert({
        name: 'Full Flow Test',
        email: testEmail,
        whatsapp: '+919876543210',
        recommendation: 'essentials',
        device_type: 'desktop',
        wix_sync_status: 'pending',
        wix_sync_attempts: 0,
      })
      .select('id')
      .single();

    if (leadError) {
      console.log('❌ Supabase insert failed:', leadError.message);
      return false;
    }
    console.log('   ✅ Lead stored in Supabase:', lead.id);

    // Step 2: Create contact in Wix
    console.log('   Step 2: Creating contact in Wix CRM...');
    const wixResponse = await fetch('https://www.wixapis.com/contacts/v4/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wixApiKey}`,
        'wix-site-id': wixSiteId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info: {
          name: { first: 'Full Flow', last: 'Test' },
          emails: { items: [{ email: testEmail }] },
          phones: { items: [{ phone: '+919876543210' }] },
        },
      }),
    });

    if (!wixResponse.ok) {
      const error = await wixResponse.text();
      console.log('❌ Wix create contact failed:', error.slice(0, 200));
      // Cleanup Supabase
      await supabase.from('quiz_leads').delete().eq('id', lead.id);
      return false;
    }

    const wixData = await wixResponse.json();
    const contactId = wixData.contact?._id;
    console.log('   ✅ Contact created in Wix:', contactId);

    // Step 3: Update Supabase with sync status
    console.log('   Step 3: Updating sync status...');
    await supabase
      .from('quiz_leads')
      .update({
        wix_sync_status: 'synced',
        wix_contact_id: contactId,
      })
      .eq('id', lead.id);
    console.log('   ✅ Sync status updated');

    // Cleanup
    console.log('   Step 4: Cleaning up test data...');

    // Delete from Wix
    await fetch(`https://www.wixapis.com/contacts/v4/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${wixApiKey}`,
        'wix-site-id': wixSiteId,
      },
    });

    // Delete from Supabase
    await supabase.from('quiz_leads').delete().eq('id', lead.id);

    console.log('   ✅ Test data cleaned up');
    console.log('\n✅ FULL FLOW TEST PASSED!');
    return true;
  } catch (err) {
    console.log('❌ Error:', err.message);
    return false;
  }
}

async function main() {
  console.log('🧪 Integration Tests');
  console.log('='.repeat(50));

  const supabaseOk = await testSupabase();
  const wixOk = await testWix();

  if (supabaseOk && wixOk) {
    await testFullFlow();
  } else {
    console.log('\n⚠️  Skipping full flow test (dependencies failed)');
  }

  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log(`  Supabase: ${supabaseOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`  Wix CRM:  ${wixOk ? '✅ OK' : '❌ FAILED'}`);
}

main().catch(console.error);
