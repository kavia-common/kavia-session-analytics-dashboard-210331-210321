// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ERROR-001
// User Story: Centralized error handling middleware
// GxP Impact: YES - Error logging for audit trail
// Risk Level: MEDIUM
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging and audit
  console.error('Error caught by error handler:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    user: req.user?.username || 'anonymous',
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let error = err.name || 'Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error = 'Validation Error';
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error = 'Unauthorized';
    message = 'Invalid or expired token';
  } else if (err.code === '23505') {
    // PostgreSQL unique violation
    statusCode = 409;
    error = 'Conflict';
    message = 'Resource already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    statusCode = 400;
    error = 'Bad Request';
    message = 'Invalid reference to related resource';
  } else if (err.code === '22P02') {
    // PostgreSQL invalid text representation
    statusCode = 400;
    error = 'Bad Request';
    message = 'Invalid data format';
  }

  // Construct error response
  const errorResponse = {
    error,
    message,
    timestamp: new Date().toISOString(),
    path: req.path
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// PUBLIC_INTERFACE
/**
 * Create custom error with status code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} Custom error object
 */
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { errorHandler, createError };
