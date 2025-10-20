// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-USER-001
// User Story: User management controller
// GxP Impact: YES - User management for audit trail
// Risk Level: HIGH
// ============================================================================

const userService = require('../services/userService');

// PUBLIC_INTERFACE
/**
 * Get all users
 * @route GET /api/users
 */
const getUsers = async (req, res, next) => {
  try {
    const { teamId } = req.query;
    
    const users = await userService.getUsers({ teamId });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get user by ID
 * @route GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Create new user
 * @route POST /api/users
 */
const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    
    const user = await userService.createUser(userData);

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Update user
 * @route PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const user = await userService.updateUser(id, userData);

    res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Delete user
 * @route DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await userService.deleteUser(id);

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
