/**
 * Jest setup file for integration tests
 *
 * This file runs before each test file to set up the testing environment
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local for testing
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Verify required environment variables
const requiredEnvVars = [
  'WIX_API_KEY',
  'WIX_SITE_ID',
  'WIX_PLAN_ID_ESSENTIALS',
  'WIX_PLAN_ID_CIRCLE',
];

const missing = requiredEnvVars.filter(varName => !process.env[varName]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease configure these in your .env.local file');
  process.exit(1);
}

console.log('✓ Environment variables loaded successfully');

// Set longer timeout for all tests
jest.setTimeout(60000);

// Global test utilities
global.console = {
  ...console,
  // Keep console.log for debugging but suppress noise
  log: jest.fn(),
  debug: jest.fn(),
  // Keep errors and warnings visible
  error: console.error,
  warn: console.warn,
  info: console.info,
};
