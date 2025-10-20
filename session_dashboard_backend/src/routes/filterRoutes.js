// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROUTE-007
// User Story: Filter data routes
// GxP Impact: NO - Reference data only
// Risk Level: LOW
// ============================================================================

const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');
const { authenticate } = require('../middleware/authenticate');

// All filter routes require authentication
router.use(authenticate);

// Routes
router.get('/teams', filterController.getTeams);
router.get('/users', filterController.getFilterUsers);
router.get('/features', filterController.getFeatures);
router.get('/projects', filterController.getProjects);

module.exports = router;
