// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-AUTH-001
// User Story: JWT authentication middleware
// GxP Impact: YES - Critical for user attribution (ALCOA+)
// Risk Level: HIGH
// ============================================================================

const jwt = require('jsonwebtoken');

// PUBLIC_INTERFACE
/**
 * Authenticate JWT token from request headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

module.exports = { authenticate };
