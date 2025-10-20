// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-AUTH-002
// User Story: Authentication controller for login/logout/refresh
// GxP Impact: YES - User authentication for audit trail
// Risk Level: HIGH
// ============================================================================

const authService = require('../services/authService');

// PUBLIC_INTERFACE
/**
 * Login user and generate JWT tokens
 * @route POST /api/auth/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      refreshToken: result.refreshToken,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Refresh JWT token
 * @route POST /api/auth/refresh
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      message: 'Token refreshed',
      token: result.token
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Logout user
 * @route POST /api/auth/logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = async (req, res, next) => {
  try {
    // Token blacklisting would go here in production
    res.status(200).json({
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Verify current user token
 * @route GET /api/auth/verify
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verify = async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Token valid',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refresh,
  logout,
  verify
};
