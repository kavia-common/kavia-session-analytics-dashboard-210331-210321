// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-UI-001
// User Story: Loading spinner for async operations
// GxP Impact: NO - UI component only
// Risk Level: LOW
// ============================================================================

import React from 'react';
import './LoadingSpinner.css';

// PUBLIC_INTERFACE
/**
 * LoadingSpinner component to indicate loading state
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner: 'small', 'medium', 'large'
 * @param {string} props.message - Optional loading message
 */
const LoadingSpinner = ({ size = 'medium', message = '' }) => {
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner loading-spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
