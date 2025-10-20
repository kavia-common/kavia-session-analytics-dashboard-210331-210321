// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-001
// User Story: Jest configuration for backend testing
// GxP Impact: YES - Testing is critical for GxP validation
// Risk Level: MEDIUM
// ============================================================================

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/migrations/**',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  verbose: true,
  testTimeout: 10000
};
