// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-AUTH-001
// User Story: Authentication service for login, logout, and token management
// Acceptance Criteria: 
//   - Login with credentials
//   - Logout and clear tokens
//   - Verify token validity
//   - Store and retrieve user information
// GxP Impact: YES - Authentication is critical for audit trail (ALCOA+ Attributable)
// Risk Level: HIGH
// ============================================================================

import { post, get } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// PUBLIC_INTERFACE
/**
 * Login user with credentials
 * @param {string} username - Username or email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and tokens
 */
export const login = async (username, password) => {
  try {
    const response = await post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password
    });
    
    // Store tokens and user info
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Logout user and clear tokens
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    // Continue with local logout even if server logout fails
    console.error('Logout error:', error);
  } finally {
    // Clear all stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// PUBLIC_INTERFACE
/**
 * Verify if current token is valid
 * @returns {Promise<Object>} Verification result
 */
export const verifyToken = async () => {
  try {
    const response = await get(API_ENDPOINTS.AUTH.VERIFY);
    return response;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// PUBLIC_INTERFACE
/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// PUBLIC_INTERFACE
/**
 * Get authentication token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
