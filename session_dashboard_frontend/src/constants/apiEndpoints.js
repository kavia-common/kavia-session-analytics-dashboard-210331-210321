// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-API-001
// User Story: Define API endpoint constants for backend communication
// Acceptance Criteria: 
//   - Centralized API endpoint definitions
//   - Consistent naming convention
// GxP Impact: YES - API endpoints handle GxP-critical data operations
// Risk Level: MEDIUM
// ============================================================================

// PUBLIC_INTERFACE
/**
 * API endpoint constants
 * All endpoints are relative to REACT_APP_API_BASE_URL
 * @constant {Object}
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify'
  },
  
  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    FEATURE_USAGE: '/analytics/feature-usage',
    TRENDS: '/analytics/trends',
    TEAM_USAGE: '/analytics/team-usage',
    USER_ANALYSIS: '/analytics/user-analysis'
  },
  
  // Export endpoints
  EXPORT: {
    CSV: '/export/csv',
    JSON: '/export/json',
    SIGNED: '/export/signed'
  },
  
  // User management endpoints
  USERS: {
    LIST: '/users',
    GET: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    ROLES: '/users/roles'
  },
  
  // Role management endpoints
  ROLES: {
    LIST: '/roles',
    ASSIGN: '/roles/assign',
    REVOKE: '/roles/revoke'
  },
  
  // Audit trail endpoints
  AUDIT: {
    LIST: '/audit/trail',
    SEARCH: '/audit/search',
    EXPORT: '/audit/export'
  },
  
  // Filter data endpoints
  FILTERS: {
    TEAMS: '/filters/teams',
    USERS: '/filters/users',
    FEATURES: '/filters/features',
    PROJECTS: '/filters/projects'
  }
};

// PUBLIC_INTERFACE
/**
 * Replace URL parameters in endpoint path
 * @param {string} endpoint - The endpoint path with parameters
 * @param {Object} params - The parameters to replace
 * @returns {string} The endpoint with replaced parameters
 */
export const replaceParams = (endpoint, params) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};
