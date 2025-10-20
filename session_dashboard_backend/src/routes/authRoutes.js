// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROUTE-001
// User Story: Authentication routes
// GxP Impact: YES - Authentication endpoints
// Risk Level: HIGH
// ============================================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');
const { validateRequest } = require('../middleware/validateRequest');
const Joi = require('joi');

// Validation schemas
const loginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
};

const refreshSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required()
  })
};

// Routes
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshSchema), authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/verify', authenticate, authController.verify);

module.exports = router;
