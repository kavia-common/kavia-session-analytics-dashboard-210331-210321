// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ROUTE-004
// User Story: User management routes
// GxP Impact: YES - User management for audit trail
// Risk Level: HIGH
// ============================================================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { validateRequest } = require('../middleware/validateRequest');
const Joi = require('joi');

// Validation schemas
const userSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('Admin', 'Manager', 'Engineer', 'Viewer').required(),
    teamId: Joi.number().integer().positive().optional()
  })
};

const updateUserSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('Admin', 'Manager', 'Engineer', 'Viewer').optional(),
    teamId: Joi.number().integer().positive().optional()
  })
};

// All user routes require authentication
router.use(authenticate);

// Routes
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', authorize('Admin'), validateRequest(userSchema), userController.createUser);
router.put('/:id', authorize('Admin'), validateRequest(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize('Admin'), userController.deleteUser);

module.exports = router;
