// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-AUTH-002
// User Story: Authentication context for managing user state across app
// Acceptance Criteria: 
//   - Provide authentication state to all components
//   - Handle login/logout actions
//   - Persist user session
//   - Provide user role information for RBAC
// GxP Impact: YES - Central authentication state for audit trail
// Risk Level: HIGH
// ============================================================================

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
/**
 * AuthProvider component to wrap app and provide authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Login user with credentials
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginService(username, password);
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Logout user and clear session
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setLoading(true);
      await logoutService();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Update user information in context
   * @param {Object} updatedUser - Updated user data
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
