import { NextRequest, NextResponse } from 'next/server';
import { isWixConfigured } from '@/lib/wix-crm';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const WIX_API_BASE = 'https://www.wixapis.com';
const WIX_API_KEY = process.env.WIX_API_KEY || '';
const WIX_SITE_ID = process.env.WIX_SITE_ID || '';

/**
 * GET /api/health
 *
 * Health check endpoint to verify all integrations are working.
 * Returns minimal info to avoid leaking internal configuration.
 */
export async function GET(_request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    supabase: { connected: false },
    wix: { connected: false },
  };

  // Test Supabase connection
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('quiz_leads')
        .select('id')
        .limit(1);

      if (!error) {
        results.supabase.connected = true;
      }
    } catch {
      // Connection failed - connected stays false
    }
  }

  // Test Wix CRM connection
  if (isWixConfigured()) {
    try {
      const response = await fetch(`${WIX_API_BASE}/contacts/v4/labels/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WIX_API_KEY}`,
          'wix-site-id': WIX_SITE_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: { paging: { limit: 1 } } }),
      });

      if (response.ok) {
        results.wix.connected = true;
      }
    } catch {
      // Connection failed - connected stays false
    }
  }

  // Determine overall status
  const allGood = results.supabase.connected && results.wix.connected;

  return NextResponse.json({
    status: allGood ? 'healthy' : 'degraded',
    ...results,
  }, {
    status: allGood ? 200 : 503,
  });
}
