// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-SERVICE-007
// User Story: Filter data service
// GxP Impact: NO - Reference data only
// Risk Level: LOW
// ============================================================================

const { query } = require('../config/database');

// PUBLIC_INTERFACE
/**
 * Get teams for filter dropdown
 * @returns {Promise<Array>} List of teams
 */
const getTeams = async () => {
  try {
    // Mock data - replace with actual query
    return [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Product' },
      { id: 3, name: 'QA' },
      { id: 4, name: 'DevOps' },
      { id: 5, name: 'Design' }
    ];
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Get users for filter dropdown
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} List of users
 */
const getFilterUsers = async (filters = {}) => {
  try {
    const { teamId } = filters;

    // Mock data
    const users = [
      { id: 1, username: 'john.doe', email: 'john@kavia.ai', teamId: 1 },
      { id: 2, username: 'jane.smith', email: 'jane@kavia.ai', teamId: 1 },
      { id: 3, username: 'bob.wilson', email: 'bob@kavia.ai', teamId: 2 },
      { id: 4, username: 'alice.brown', email: 'alice@kavia.ai', teamId: 3 }
    ];

    if (teamId) {
      return users.filter(u => u.teamId === parseInt(teamId));
    }

    return users;
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Get features for filter dropdown
 * @returns {Promise<Array>} List of features
 */
const getFeatures = async () => {
  try {
    // Mock data
    return [
      { id: 1, name: 'Code Generation' },
      { id: 2, name: 'Testing' },
      { id: 3, name: 'Documentation' },
      { id: 4, name: 'Refactoring' },
      { id: 5, name: 'Bug Fixing' },
      { id: 6, name: 'Code Review' }
    ];
  } catch (error) {
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Get projects for filter dropdown
 * @returns {Promise<Array>} List of projects
 */
const getProjects = async () => {
  try {
    // Mock data
    return [
      { id: 1, name: 'Project Alpha' },
      { id: 2, name: 'Project Beta' },
      { id: 3, name: 'Project Gamma' }
    ];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTeams,
  getFilterUsers,
  getFeatures,
  getProjects
};
