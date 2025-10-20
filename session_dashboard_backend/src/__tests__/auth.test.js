// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-003
// User Story: Authentication integration tests
// GxP Impact: YES - Authentication is critical
// Risk Level: HIGH
// ============================================================================

const request = require('supertest');
const app = require('../app');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/login', () => {
    test('should return 400 when username is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'test123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });

    test('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });

    test('should accept valid login request format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!'
        });

      // Will fail auth but format is valid
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should return 400 when refreshToken is missing', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /api/auth/verify', () => {
    test('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/api/auth/verify');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    test('should return 401 when invalid token provided', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
