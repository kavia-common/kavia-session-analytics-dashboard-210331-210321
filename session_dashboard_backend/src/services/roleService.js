// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-SERVICE-005
// User Story: Role management service
// GxP Impact: YES - Critical for RBAC
// Risk Level: HIGH
// ============================================================================

const { query } = require('../config/database');
const { createError } = require('../middleware/errorHandler');

// Available roles
const ROLES = ['Admin', 'Manager', 'Engineer', 'Viewer'];

// PUBLIC_INTERFACE
/**
 * Get all available roles
 * @returns {Promise<Array>} List of roles
 */
const getRoles = async () => {
  return ROLES;
};

// PUBLIC_INTERFACE
/**
 * Assign role to user
 * @param {number} userId - User ID
 * @param {string} role - Role to assign
 * @param {number} assignedBy - User ID of person assigning role
 */
const assignRole = async (userId, role, assignedBy) => {
  try {
    if (!ROLES.includes(role)) {
      throw createError('Invalid role', 400);
    }

    const sql = `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id
    `;
    
    const result = await query(sql, [role, userId]);

    if (result.rows.length === 0) {
      throw createError('User not found', 404);
    }

    // Log role assignment
    await logRoleChange(userId, role, assignedBy);
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Revoke role from user (set to Viewer)
 * @param {number} userId - User ID
 * @param {number} revokedBy - User ID of person revoking role
 */
const revokeRole = async (userId, revokedBy) => {
  try {
    await assignRole(userId, 'Viewer', revokedBy);
  } catch (error) {
    throw error;
  }
};

// Helper function to log role changes
const logRoleChange = async (userId, newRole, changedBy) => {
  try {
    const sql = `
      INSERT INTO role_change_log (
        user_id, new_role, changed_by, timestamp
      ) VALUES ($1, $2, $3, NOW())
    `;
    
    await query(sql, [userId, newRole, changedBy]);
  } catch (error) {
    // If table doesn't exist, just log to console
    if (error.code === '42P01') {
      console.log('Role change logged:', { userId, newRole, changedBy });
    } else {
      throw error;
    }
  }
};

module.exports = {
  getRoles,
  assignRole,
  revokeRole
};
