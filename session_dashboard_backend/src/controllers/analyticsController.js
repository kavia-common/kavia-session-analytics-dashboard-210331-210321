// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ANALYTICS-001
// User Story: Analytics controller for session data
// GxP Impact: YES - Displays GxP-critical data
// Risk Level: MEDIUM
// ============================================================================

const analyticsService = require('../services/analyticsService');

// PUBLIC_INTERFACE
/**
 * Get dashboard summary data
 * @route GET /api/analytics/dashboard
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const data = await analyticsService.getDashboardSummary({
      startDate,
      endDate,
      userId: req.user.id,
      role: req.user.role
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get feature usage analytics
 * @route GET /api/analytics/feature-usage
 */
const getFeatureUsage = async (req, res, next) => {
  try {
    const { startDate, endDate, teamId, featureId } = req.query;
    
    const data = await analyticsService.getFeatureUsage({
      startDate,
      endDate,
      teamId,
      featureId,
      userId: req.user.id,
      role: req.user.role
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get trend analysis
 * @route GET /api/analytics/trends
 */
const getTrendAnalysis = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const data = await analyticsService.getTrendAnalysis({
      startDate,
      endDate,
      userId: req.user.id,
      role: req.user.role
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get team usage analytics
 * @route GET /api/analytics/team-usage
 */
const getTeamUsage = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const data = await analyticsService.getTeamUsage({
      startDate,
      endDate,
      userId: req.user.id,
      role: req.user.role
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Get user analysis
 * @route GET /api/analytics/user-analysis
 */
const getUserAnalysis = async (req, res, next) => {
  try {
    const { startDate, endDate, teamId, userId } = req.query;
    
    const data = await analyticsService.getUserAnalysis({
      startDate,
      endDate,
      teamId,
      targetUserId: userId,
      requestUserId: req.user.id,
      role: req.user.role
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getFeatureUsage,
  getTrendAnalysis,
  getTeamUsage,
  getUserAnalysis
};
