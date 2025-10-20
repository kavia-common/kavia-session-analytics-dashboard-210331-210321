// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROUTE-002
// User Story: Analytics routes
// GxP Impact: YES - Analytics data endpoints
// Risk Level: MEDIUM
// ============================================================================

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/authenticate');
const { validateRequest } = require('../middleware/validateRequest');
const Joi = require('joi');

// Validation schema for date range queries
const dateRangeSchema = {
  query: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    teamId: Joi.number().integer().positive().optional(),
    featureId: Joi.number().integer().positive().optional(),
    userId: Joi.number().integer().positive().optional()
  })
};

// All analytics routes require authentication
router.use(authenticate);

// Routes
router.get('/dashboard', validateRequest(dateRangeSchema), analyticsController.getDashboardSummary);
router.get('/feature-usage', validateRequest(dateRangeSchema), analyticsController.getFeatureUsage);
router.get('/trends', validateRequest(dateRangeSchema), analyticsController.getTrendAnalysis);
router.get('/team-usage', validateRequest(dateRangeSchema), analyticsController.getTeamUsage);
router.get('/user-analysis', validateRequest(dateRangeSchema), analyticsController.getUserAnalysis);

module.exports = router;
