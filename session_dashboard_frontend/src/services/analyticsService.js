// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ANALYTICS-001
// User Story: Analytics service for fetching dashboard and usage data
// Acceptance Criteria: 
//   - Fetch dashboard summary data
//   - Fetch feature usage analytics
//   - Fetch trend analysis data
//   - Fetch team and user usage data
//   - Support filters and date ranges
// GxP Impact: YES - Analytics data used for compliance reporting
// Risk Level: MEDIUM
// ============================================================================

import { get, post } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// PUBLIC_INTERFACE
/**
 * Fetch dashboard summary data
 * @param {Object} filters - Filter parameters (dateRange, team, etc.)
 * @returns {Promise<Object>} Dashboard summary data
 */
export const getDashboardSummary = async (filters = {}) => {
  try {
    const response = await get(API_ENDPOINTS.ANALYTICS.DASHBOARD, filters);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch feature usage analytics
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Feature usage data
 */
export const getFeatureUsage = async (filters = {}) => {
  try {
    const response = await get(API_ENDPOINTS.ANALYTICS.FEATURE_USAGE, filters);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch trend analysis data
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Trend analysis data
 */
export const getTrendAnalysis = async (filters = {}) => {
  try {
    const response = await get(API_ENDPOINTS.ANALYTICS.TRENDS, filters);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch team usage analytics
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Team usage data
 */
export const getTeamUsage = async (filters = {}) => {
  try {
    const response = await get(API_ENDPOINTS.ANALYTICS.TEAM_USAGE, filters);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch user analysis data
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} User analysis data
 */
export const getUserAnalysis = async (filters = {}) => {
  try {
    const response = await get(API_ENDPOINTS.ANALYTICS.USER_ANALYSIS, filters);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Export data to CSV
 * @param {Object} exportRequest - Export request with filters and options
 * @returns {Promise<Object>} Export response
 */
export const exportToCSV = async (exportRequest) => {
  try {
    const response = await post(API_ENDPOINTS.EXPORT.CSV, exportRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Export data to JSON
 * @param {Object} exportRequest - Export request with filters and options
 * @returns {Promise<Object>} Export response
 */
export const exportToJSON = async (exportRequest) => {
  try {
    const response = await post(API_ENDPOINTS.EXPORT.JSON, exportRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Export data with electronic signature
 * @param {Object} exportRequest - Export request with signature
 * @returns {Promise<Object>} Export response
 */
export const exportWithSignature = async (exportRequest) => {
  try {
    const response = await post(API_ENDPOINTS.EXPORT.SIGNED, exportRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch filter options for teams
 * @returns {Promise<Array>} List of teams
 */
export const getTeams = async () => {
  try {
    const response = await get(API_ENDPOINTS.FILTERS.TEAMS);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch filter options for users
 * @param {string} teamId - Optional team ID to filter users
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async (teamId = null) => {
  try {
    const params = teamId ? { teamId } : {};
    const response = await get(API_ENDPOINTS.FILTERS.USERS, params);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch filter options for features
 * @returns {Promise<Array>} List of features
 */
export const getFeatures = async () => {
  try {
    const response = await get(API_ENDPOINTS.FILTERS.FEATURES);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch audit trail data
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Audit trail data
 */
export const getAuditTrail = async (filters = {}) => {
  try {
    const response = await get(API_ENDPOINTS.AUDIT.LIST, filters);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch user roles list
 * @returns {Promise<Array>} List of roles
 */
export const getRoles = async () => {
  try {
    const response = await get(API_ENDPOINTS.ROLES.LIST);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Assign role to user
 * @param {string} userId - User ID
 * @param {string} role - Role to assign
 * @returns {Promise<Object>} Assignment result
 */
export const assignRole = async (userId, role) => {
  try {
    const response = await post(API_ENDPOINTS.ROLES.ASSIGN, { userId, role });
    return response;
  } catch (error) {
    throw error;
  }
};
