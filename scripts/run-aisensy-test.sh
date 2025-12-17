#!/bin/bash
# Load environment variables from .env.local and run tests
set -a
source .env.local 2>/dev/null
set +a
npx tsx scripts/test-aisensy.ts
