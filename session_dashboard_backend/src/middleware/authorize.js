// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-RBAC-001
// User Story: Role-based access control middleware
// GxP Impact: YES - Critical for access control and audit trail
// Risk Level: HIGH
// ============================================================================

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = ['Viewer', 'Engineer', 'Manager', 'Admin'];

// PUBLIC_INTERFACE
/**
 * Check if user has required role level
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role for access
 * @returns {boolean} True if user has sufficient permissions
 */
const hasPermission = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
};

// PUBLIC_INTERFACE
/**
 * Authorize user based on required role
 * @param {string} requiredRole - Minimum required role
 * @returns {Function} Express middleware function
 */
const authorize = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      // Check if user has required role
      if (!hasPermission(req.user.role, requiredRole)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: `Insufficient permissions. Required role: ${requiredRole}`,
          userRole: req.user.role
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authorization check failed'
      });
    }
  };
};

module.exports = { authorize, hasPermission };
