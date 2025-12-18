/**
 * Jest configuration for integration tests
 *
 * Run with: npm run test:integration
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/lib/wix-crm.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage/integration',
  testTimeout: 60000, // 60 second timeout for integration tests
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
};
