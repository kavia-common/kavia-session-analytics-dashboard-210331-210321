// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-RBAC-002
// User Story: Protected route component for role-based access control
// Acceptance Criteria: 
//   - Check authentication
//   - Verify role permissions
//   - Redirect unauthorized users
// GxP Impact: YES - Critical for access control and audit trail
// Risk Level: HIGH
// ============================================================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../constants/roles';
import LoadingSpinner from '../common/LoadingSpinner';

// PUBLIC_INTERFACE
/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected content
 * @param {string} props.requiredRole - Minimum required role
 * @returns {JSX.Element} Protected content or redirect
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner size="large" message="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role permission if required
  if (requiredRole && !hasPermission(user?.role, requiredRole)) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: '20px'
      }}>
        <h1 style={{ color: 'var(--error)' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          You do not have permission to access this page.
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          Required role: <strong>{requiredRole}</strong> | Your role: <strong>{user?.role}</strong>
        </p>
      </div>
    );
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
