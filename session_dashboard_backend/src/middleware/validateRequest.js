// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-VALIDATION-001
// User Story: Request validation middleware with Joi
// GxP Impact: YES - Data integrity validation
// Risk Level: MEDIUM
// ============================================================================

const Joi = require('joi');

// PUBLIC_INTERFACE
/**
 * Validate request data against Joi schema
 * @param {Object} schema - Joi schema object with body, query, params
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    };

    const errors = {};

    // Validate body
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, validationOptions);
      if (error) {
        errors.body = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
      } else {
        req.body = value;
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, validationOptions);
      if (error) {
        errors.query = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
      } else {
        req.query = value;
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, validationOptions);
      if (error) {
        errors.params = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
      } else {
        req.params = value;
      }
    }

    // If validation errors exist, return 400
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Request validation failed',
        details: errors
      });
    }

    next();
  };
};

// Common validation schemas
const commonSchemas = {
  id: Joi.number().integer().positive(),
  email: Joi.string().email(),
  dateRange: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
  }),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

module.exports = { validateRequest, commonSchemas };
