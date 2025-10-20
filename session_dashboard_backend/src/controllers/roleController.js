// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROLE-001
// User Story: Role management controller for RBAC
// GxP Impact: YES - Critical for access control
// Risk Level: HIGH
// ============================================================================

const roleService = require('../services/roleService');

// PUBLIC_INTERFACE
/**
 * Get all available roles
 * @route GET /api/roles
 */
const getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getRoles();

    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Assign role to user
 * @route POST /api/roles/assign
 */
const assignRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    
    await roleService.assignRole(userId, role, req.user.id);

    res.status(200).json({
      message: 'Role assigned successfully'
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Revoke role from user
 * @route POST /api/roles/revoke
 */
const revokeRole = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    await roleService.revokeRole(userId, req.user.id);

    res.status(200).json({
      message: 'Role revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
  assignRole,
  revokeRole
};
