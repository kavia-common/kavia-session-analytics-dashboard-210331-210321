// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROUTE-005
// User Story: Role management routes
// GxP Impact: YES - Critical for RBAC
// Risk Level: HIGH
// ============================================================================

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { validateRequest } = require('../middleware/validateRequest');
const Joi = require('joi');

// Validation schemas
const assignRoleSchema = {
  body: Joi.object({
    userId: Joi.number().integer().positive().required(),
    role: Joi.string().valid('Admin', 'Manager', 'Engineer', 'Viewer').required()
  })
};

const revokeRoleSchema = {
  body: Joi.object({
    userId: Joi.number().integer().positive().required()
  })
};

// All role routes require authentication and Admin role
router.use(authenticate);
router.use(authorize('Admin'));

// Routes
router.get('/', roleController.getRoles);
router.post('/assign', validateRequest(assignRoleSchema), roleController.assignRole);
router.post('/revoke', validateRequest(revokeRoleSchema), roleController.revokeRole);

module.exports = router;
