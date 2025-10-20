// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-002
// User Story: Test setup configuration
// GxP Impact: YES - Test infrastructure
// Risk Level: LOW
// ============================================================================

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
