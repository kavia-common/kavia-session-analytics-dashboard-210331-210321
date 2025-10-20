// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-UI-003
// User Story: Toast notifications for user feedback
// GxP Impact: NO - UI feedback only
// Risk Level: LOW
// ============================================================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Custom hook to use toast notifications
 * @returns {Object} Toast context with showToast function
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
/**
 * ToastProvider component to wrap app and provide toast functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // PUBLIC_INTERFACE
  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (default 4000)
   */
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Toast component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    // Animation classes
    const timer = setTimeout(() => {
      onClose();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default ToastProvider;
