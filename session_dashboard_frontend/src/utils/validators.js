// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-UTIL-004
// User Story: Provide input validation utilities
// Acceptance Criteria: 
//   - Validate email format
//   - Validate required fields
//   - Validate password strength
//   - Validate form data
// GxP Impact: YES - Input validation is critical for data integrity (ALCOA+)
// Risk Level: HIGH
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true, error: null };
};

// PUBLIC_INTERFACE
/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  // Check for at least one uppercase, one lowercase, one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return { 
      isValid: false, 
      error: 'Password must contain uppercase, lowercase, and number' 
    };
  }
  
  return { isValid: true, error: null };
};

// PUBLIC_INTERFACE
/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {Object} Validation result with isValid and error message
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: null };
};

// PUBLIC_INTERFACE
/**
 * Validate form data
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    // Check required
    if (rules.required) {
      const result = validateRequired(value, rules.label || field);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        return;
      }
    }
    
    // Check email
    if (rules.email && value) {
      const result = validateEmail(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        return;
      }
    }
    
    // Check password
    if (rules.password && value) {
      const result = validatePassword(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        return;
      }
    }
    
    // Check min length
    if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = `Minimum length is ${rules.minLength} characters`;
      isValid = false;
      return;
    }
    
    // Check max length
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[field] = `Maximum length is ${rules.maxLength} characters`;
      isValid = false;
      return;
    }
    
    // Custom validator
    if (rules.validator && value) {
      const result = rules.validator(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
      }
    }
  });
  
  return { isValid, errors };
};

// PUBLIC_INTERFACE
/**
 * Validate signature input
 * @param {string} signature - Signature text
 * @param {string} username - Expected username
 * @returns {Object} Validation result
 */
export const validateSignature = (signature, username) => {
  if (!signature || signature.trim() === '') {
    return { isValid: false, error: 'Signature is required' };
  }
  
  if (signature.trim() !== username.trim()) {
    return { 
      isValid: false, 
      error: 'Signature must match your username exactly' 
    };
  }
  
  return { isValid: true, error: null };
};
