// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-001
// User Story: Login page with authentication
// Acceptance Criteria: 
//   - Username/email and password inputs
//   - Form validation
//   - Error display
//   - Redirect after login
// GxP Impact: YES - Authentication for audit trail
// Risk Level: HIGH
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validateRequired } from '../utils/validators';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Login page component
 * @returns {JSX.Element} Login page
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const usernameValidation = validateRequired(formData.username, 'Username');
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }
    
    const passwordValidation = validateRequired(formData.password, 'Password');
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) {
      return;
    }
    
    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLoginError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="page-container login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Kavia Analytics</h1>
          <p className="login-subtitle">Sign in to access your dashboard</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {loginError && (
            <div className="alert alert-error">
              {loginError}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username or Email</label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input ${errors.username ? 'error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && (
              <span className="form-error">{errors.username}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-note">
            Note: REACT_APP_API_BASE_URL environment variable must be configured
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
