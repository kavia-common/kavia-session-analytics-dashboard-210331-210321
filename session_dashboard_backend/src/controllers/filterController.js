// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FILTER-001
// User Story: Filter data controller for dropdowns
// GxP Impact: NO - Reference data only
// Risk Level: LOW
// ============================================================================

const filterService = require('../services/filterService');

// PUBLIC_INTERFACE
/**
 * Get teams for filter dropdown
 * @route GET /api/filters/teams
 */
const getTeams = async (req, res, next) => {
  try {
    const teams = await filterService.getTeams();

    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get users for filter dropdown
 * @route GET /api/filters/users
 */
const getFilterUsers = async (req, res, next) => {
  try {
    const { teamId } = req.query;
    
    const users = await filterService.getFilterUsers({ teamId });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get features for filter dropdown
 * @route GET /api/filters/features
 */
const getFeatures = async (req, res, next) => {
  try {
    const features = await filterService.getFeatures();

    res.status(200).json(features);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get projects for filter dropdown
 * @route GET /api/filters/projects
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await filterService.getProjects();

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeams,
  getFilterUsers,
  getFeatures,
  getProjects
};
