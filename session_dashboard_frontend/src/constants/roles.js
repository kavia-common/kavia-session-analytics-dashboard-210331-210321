// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-RBAC-001
// User Story: Define role-based access control constants for the application
// Acceptance Criteria: 
//   - Define all user roles with their permissions
//   - Provide role hierarchy for access checks
// GxP Impact: YES - RBAC is critical for audit trail and data access control
// Risk Level: HIGH
// ============================================================================

// PUBLIC_INTERFACE
/**
 * User roles definition for RBAC
 * @constant {Object} ROLES
 */
export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  ENGINEER: 'Engineer',
  VIEWER: 'Viewer'
};

// PUBLIC_INTERFACE
/**
 * Role hierarchy for permission checks
 * Higher index = more permissions
 * @constant {Array<string>}
 */
export const ROLE_HIERARCHY = [
  ROLES.VIEWER,
  ROLES.ENGINEER,
  ROLES.MANAGER,
  ROLES.ADMIN
];

// PUBLIC_INTERFACE
/**
 * Check if a user role has required permission level
 * @param {string} userRole - The user's role
 * @param {string} requiredRole - The required role for access
 * @returns {boolean} True if user has sufficient permissions
 */
export const hasPermission = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
};

// PUBLIC_INTERFACE
/**
 * Role-specific permissions mapping
 * @constant {Object}
 */
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageRoles: true,
    canViewAuditTrail: true,
    canManageUsers: true
  },
  [ROLES.MANAGER]: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageRoles: false,
    canViewAuditTrail: true,
    canManageUsers: false
  },
  [ROLES.ENGINEER]: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageRoles: false,
    canViewAuditTrail: false,
    canManageUsers: false
  },
  [ROLES.VIEWER]: {
    canViewDashboard: true,
    canViewAnalytics: true,
    canExportData: false,
    canManageRoles: false,
    canViewAuditTrail: false,
    canManageUsers: false
  }
};
