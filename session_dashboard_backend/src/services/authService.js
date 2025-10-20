// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-SERVICE-001
// User Story: Authentication service with JWT
// GxP Impact: YES - User authentication for audit trail
// Risk Level: HIGH
// ============================================================================

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { createError } = require('../middleware/errorHandler');

// PUBLIC_INTERFACE
/**
 * Login user and generate JWT tokens
 * @param {string} username - Username or email
 * @param {string} password - User password
 * @returns {Promise<Object>} Token and user data
 */
const login = async (username, password) => {
  try {
    // Find user by username or email
    const sql = `
      SELECT id, username, email, password_hash, role, team_id
      FROM users
      WHERE username = $1 OR email = $1
      AND is_active = true
    `;
    
    const result = await query(sql, [username]);
    
    if (result.rows.length === 0) {
      throw createError('Invalid username or password', 401);
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw createError('Invalid username or password', 401);
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamId: user.team_id
      }
    };
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Refresh JWT token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New access token
 */
const refreshToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user
    const sql = 'SELECT id, username, email, role, team_id FROM users WHERE id = $1 AND is_active = true';
    const result = await query(sql, [decoded.userId]);
    
    if (result.rows.length === 0) {
      throw createError('User not found or inactive', 401);
    }

    const user = result.rows[0];

    // Generate new access token
    const token = generateToken(user);

    return { token };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError('Invalid or expired refresh token', 401);
    }
    throw error;
  }
};

// Helper function to generate access token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '1h' }
  );
};

// Helper function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  login,
  refreshToken
};
