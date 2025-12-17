#!/bin/bash

# ============================================
# WIX CRM INTEGRATION TEST RUNNER
# ============================================
# This script runs integration tests against the real Wix API
#
# Usage:
#   ./scripts/test-wix-integration.sh
#
# Prerequisites:
#   1. Set your Wix credentials in .env.local or export them:
#      export WIX_API_KEY="your_api_key"
#      export WIX_SITE_ID="your_site_id"
#
#   2. (Optional) Set pricing plan IDs for plan assignment tests:
#      export WIX_PLAN_ID_ESSENTIALS="your_plan_id"
#      export WIX_PLAN_ID_TRIAL="your_plan_id"
#      export WIX_PLAN_ID_CIRCLE="your_plan_id"
#      export WIX_PLAN_ID_TRANSFORM="your_plan_id"
#
# ============================================

set -e

echo ""
echo "============================================"
echo "WIX CRM INTEGRATION TESTS"
echo "============================================"
echo ""

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
  echo "📁 Loading environment from .env.local..."
  export $(grep -v '^#' .env.local | xargs)
fi

# Check if Wix credentials are set
if [ -z "$WIX_API_KEY" ] || [ -z "$WIX_SITE_ID" ]; then
  echo "❌ ERROR: Wix credentials not configured!"
  echo ""
  echo "Please set these environment variables:"
  echo ""
  echo "  export WIX_API_KEY=\"your_wix_api_key\""
  echo "  export WIX_SITE_ID=\"your_wix_site_id\""
  echo ""
  echo "Or add them to .env.local:"
  echo ""
  echo "  WIX_API_KEY=your_wix_api_key"
  echo "  WIX_SITE_ID=your_wix_site_id"
  echo ""
  echo "Optional (for pricing plan tests):"
  echo "  WIX_PLAN_ID_ESSENTIALS=your_plan_id"
  echo "  WIX_PLAN_ID_TRIAL=your_plan_id"
  echo "  WIX_PLAN_ID_CIRCLE=your_plan_id"
  echo "  WIX_PLAN_ID_TRANSFORM=your_plan_id"
  echo ""
  exit 1
fi

echo "✅ Wix credentials configured"
echo "   API Key: ${WIX_API_KEY:0:10}..."
echo "   Site ID: ${WIX_SITE_ID:0:10}..."
echo ""

# Check for optional pricing plan IDs
PLAN_COUNT=0
[ -n "$WIX_PLAN_ID_ESSENTIALS" ] && PLAN_COUNT=$((PLAN_COUNT + 1))
[ -n "$WIX_PLAN_ID_TRIAL" ] && PLAN_COUNT=$((PLAN_COUNT + 1))
[ -n "$WIX_PLAN_ID_CIRCLE" ] && PLAN_COUNT=$((PLAN_COUNT + 1))
[ -n "$WIX_PLAN_ID_TRANSFORM" ] && PLAN_COUNT=$((PLAN_COUNT + 1))

if [ $PLAN_COUNT -gt 0 ]; then
  echo "✅ $PLAN_COUNT pricing plan IDs configured"
else
  echo "⚠️  No pricing plan IDs configured (plan assignment tests will be limited)"
fi
echo ""

echo "🚀 Running integration tests..."
echo ""

# Run the integration tests
npm test -- wix-crm.integration.test.ts --run

echo ""
echo "============================================"
echo "INTEGRATION TESTS COMPLETE"
echo "============================================"
