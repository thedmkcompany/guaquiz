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
 * Use this to test your setup before going live.
 */
export async function GET(_request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    supabase: { configured: false, connected: false, error: null as string | null },
    wix: { configured: false, connected: false, error: null as string | null },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasRazorpay: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      hasPayU: !!(process.env.PAYU_MERCHANT_KEY && process.env.PAYU_SALT),
    },
  };

  // Test Supabase connection
  results.supabase.configured = isSupabaseConfigured();
  if (results.supabase.configured && supabase) {
    try {
      // Simple query to test connection
      const { error } = await supabase
        .from('quiz_leads')
        .select('id')
        .limit(1);

      if (error) {
        results.supabase.error = error.message;
      } else {
        results.supabase.connected = true;
      }
    } catch (err) {
      results.supabase.error = err instanceof Error ? err.message : 'Connection failed';
    }
  }

  // Test Wix CRM connection
  results.wix.configured = isWixConfigured();
  if (results.wix.configured) {
    try {
      // Query labels endpoint (lightweight check)
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
      } else {
        const errorText = await response.text();
        results.wix.error = `HTTP ${response.status}: ${errorText.slice(0, 200)}`;
      }
    } catch (err) {
      results.wix.error = err instanceof Error ? err.message : 'Connection failed';
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
