// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROUTE-003
// User Story: Export routes with signature support
// GxP Impact: YES - Critical for GxP exports
// Risk Level: HIGH
// ============================================================================

const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { validateRequest } = require('../middleware/validateRequest');
const Joi = require('joi');

// Validation schemas
const exportSchema = {
  body: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    filters: Joi.object().optional()
  })
};

const signedExportSchema = {
  body: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    filters: Joi.object().optional(),
    signature: Joi.string().required(),
    username: Joi.string().required()
  })
};

// All export routes require authentication and Engineer role minimum
router.use(authenticate);
router.use(authorize('Engineer'));

// Routes
router.post('/csv', validateRequest(exportSchema), exportController.exportToCSV);
router.post('/json', validateRequest(exportSchema), exportController.exportToJSON);
router.post('/signed', validateRequest(signedExportSchema), exportController.exportWithSignature);

module.exports = router;
