// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROUTE-006
// User Story: Audit trail routes
// GxP Impact: YES - Critical for GxP compliance
// Risk Level: HIGH
// ============================================================================

const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { validateRequest } = require('../middleware/validateRequest');
const Joi = require('joi');

// Validation schemas
const auditQuerySchema = {
  query: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    userId: Joi.number().integer().positive().optional(),
    actionType: Joi.string().valid('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

const exportAuditSchema = {
  body: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    format: Joi.string().valid('csv', 'json').required()
  })
};

// All audit routes require authentication and Manager role minimum
router.use(authenticate);
router.use(authorize('Manager'));

// Routes
router.get('/trail', validateRequest(auditQuerySchema), auditController.getAuditTrail);
router.get('/search', auditController.searchAuditTrail);
router.post('/export', validateRequest(exportAuditSchema), auditController.exportAuditTrail);

module.exports = router;
