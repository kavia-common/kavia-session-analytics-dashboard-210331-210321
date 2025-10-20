// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-004
// User Story: Health check endpoint test
// GxP Impact: NO - Infrastructure only
// Risk Level: LOW
// ============================================================================

const request = require('supertest');
const app = require('../app');

describe('Health Check Endpoint', () => {
  test('GET /health should return 200 and healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  test('Health check should return valid timestamp', async () => {
    const response = await request(app).get('/health');

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });

  test('Health check should return numeric uptime', async () => {
    const response = await request(app).get('/health');

    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });
});
