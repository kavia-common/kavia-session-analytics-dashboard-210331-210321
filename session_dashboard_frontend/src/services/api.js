// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-API-002
// User Story: Centralized API service with authentication and error handling
// Acceptance Criteria: 
//   - Axios instance with base URL configuration
//   - Request interceptor for authentication headers
//   - Response interceptor for token refresh and error handling
//   - Error normalization
// GxP Impact: YES - All data operations go through this service
// Risk Level: HIGH
// ============================================================================

import axios from 'axios';

// Get base URL from environment variable
// IMPORTANT: REACT_APP_API_BASE_URL must be set in .env file
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// PUBLIC_INTERFACE
/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for audit purposes (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Attempt token refresh
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { token } = response.data;
          localStorage.setItem('authToken', token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Normalize error response
    return Promise.reject(normalizeError(error));
  }
);

// PUBLIC_INTERFACE
/**
 * Normalize error response for consistent error handling
 * @param {Error} error - Axios error object
 * @returns {Object} Normalized error object
 */
const normalizeError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.message || error.response.statusText || 'Server error occurred',
      data: error.response.data,
      type: 'SERVER_ERROR'
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
      type: 'NETWORK_ERROR'
    };
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      type: 'CLIENT_ERROR'
    };
  }
};

// PUBLIC_INTERFACE
/**
 * Generic GET request
 * @param {string} url - Endpoint URL
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response data
 */
export const get = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Generic POST request
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export const post = async (url, data = {}) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Generic PUT request
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export const put = async (url, data = {}) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Generic DELETE request
 * @param {string} url - Endpoint URL
 * @returns {Promise<Object>} Response data
 */
export const del = async (url) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
