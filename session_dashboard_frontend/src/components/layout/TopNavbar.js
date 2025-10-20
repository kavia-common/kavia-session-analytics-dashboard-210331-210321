// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-LAYOUT-001
// User Story: Top navigation bar with authentication and user info
// Acceptance Criteria: 
//   - Display app branding
//   - Show authenticated user info
//   - Provide theme toggle
//   - Logout functionality
// GxP Impact: YES - User identification for audit trail
// Risk Level: MEDIUM
// ============================================================================

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './TopNavbar.css';

// PUBLIC_INTERFACE
/**
 * TopNavbar component for app header with user info
 * @returns {JSX.Element} TopNavbar component
 */
const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-brand">
        <h1 className="navbar-title">Kavia Analytics</h1>
      </div>
      
      <div className="navbar-actions">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {user && (
          <div className="user-info">
            <span className="user-name">{user.username || user.email}</span>
            <span className="user-role">{user.role}</span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
