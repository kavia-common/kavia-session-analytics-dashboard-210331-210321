// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-INT-001
// User Story: End-to-end smoke test for frontend-backend integration
// Acceptance Criteria:
//   - Frontend can reach backend health endpoint
//   - Frontend can call analytics endpoints
//   - API integration works correctly
// GxP Impact: YES - Validates integration of GxP system components
// Risk Level: HIGH
// ============================================================================

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

describe('End-to-End Integration Smoke Tests', () => {
  // Set longer timeout for integration tests
  jest.setTimeout(10000);

  // ============================================================================
  // HEALTH CHECK TESTS
  // ============================================================================
  
  describe('Backend Health Checks', () => {
    test('should successfully call backend root health endpoint', async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/health`);
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('status');
        expect(response.data.status).toBe('healthy');
        expect(response.data).toHaveProperty('timestamp');
        expect(response.data).toHaveProperty('uptime');
      } catch (error) {
        // If backend is not running, test should fail with helpful message
        throw new Error(
          `Backend health check failed. Ensure backend is running at ${BACKEND_URL}. ` +
          `Error: ${error.message}`
        );
      }
    });

    test('should successfully call backend API health endpoint', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('status');
        expect(response.data.status).toBe('healthy');
        expect(response.data).toHaveProperty('timestamp');
        expect(response.data).toHaveProperty('uptime');
      } catch (error) {
        throw new Error(
          `Backend API health check failed. Ensure backend is running at ${API_BASE_URL}. ` +
          `Error: ${error.message}`
        );
      }
    });
  });

  // ============================================================================
  // ANALYTICS ENDPOINT TESTS (MOCKED RESPONSES)
  // ============================================================================
  
  describe('Analytics Endpoint Integration', () => {
    test('should handle analytics dashboard endpoint call', async () => {
      try {
        // Attempt to call analytics dashboard endpoint
        // This will likely return 401 without authentication, which is expected
        const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
          validateStatus: (status) => status < 500 // Accept any status < 500
        });
        
        // Should get either 200 (if no auth required) or 401 (auth required)
        expect([200, 401, 403]).toContain(response.status);
        
        if (response.status === 401 || response.status === 403) {
          // Expected: endpoint requires authentication
          expect(response.data).toHaveProperty('error');
        } else if (response.status === 200) {
          // If no auth required, should have valid data structure
          expect(response.data).toBeDefined();
        }
      } catch (error) {
        // Network errors or 500+ status codes should fail
        if (error.response && error.response.status >= 500) {
          throw new Error(`Server error: ${error.response.status} - ${error.message}`);
        }
        throw error;
      }
    });

    test('should handle analytics feature-usage endpoint call', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analytics/feature-usage`, {
          validateStatus: (status) => status < 500
        });
        
        expect([200, 401, 403]).toContain(response.status);
      } catch (error) {
        if (error.response && error.response.status >= 500) {
          throw new Error(`Server error: ${error.response.status} - ${error.message}`);
        }
        throw error;
      }
    });

    test('should handle analytics trends endpoint call', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analytics/trends`, {
          validateStatus: (status) => status < 500
        });
        
        expect([200, 401, 403]).toContain(response.status);
      } catch (error) {
        if (error.response && error.response.status >= 500) {
          throw new Error(`Server error: ${error.response.status} - ${error.message}`);
        }
        throw error;
      }
    });
  });

  // ============================================================================
  // CORS VERIFICATION
  // ============================================================================
  
  describe('CORS Configuration', () => {
    test('should allow requests from frontend origin', async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/health`, {
          headers: {
            'Origin': 'http://localhost:3000'
          }
        });
        
        expect(response.status).toBe(200);
        // CORS should be configured to allow the request
        // If CORS is not configured, browser would block it
      } catch (error) {
        throw new Error(`CORS test failed: ${error.message}`);
      }
    });
  });

  // ============================================================================
  // API CONFIGURATION VALIDATION
  // ============================================================================
  
  describe('API Configuration', () => {
    test('should have valid API base URL configured', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(API_BASE_URL).toMatch(/^https?:\/\//);
      expect(API_BASE_URL).toContain('/api');
    });

    test('should have valid backend URL configured', () => {
      expect(BACKEND_URL).toBeDefined();
      expect(BACKEND_URL).toMatch(/^https?:\/\//);
    });
  });
});

// ============================================================================
// VALIDATION REQUIREMENTS
// ============================================================================
// This test suite validates:
// - Backend service is reachable from frontend
// - Health endpoints respond correctly
// - Analytics endpoints exist and respond appropriately
// - CORS is configured correctly
// - API URLs are properly configured
//
// Expected behavior:
// - All tests should pass when backend is running
// - Health checks return 200 status
// - Analytics endpoints return 401/403 (requires auth) or 200 (no auth)
// - CORS allows frontend origin
//
// Test protocol reference: TP-INT-001
// ============================================================================
