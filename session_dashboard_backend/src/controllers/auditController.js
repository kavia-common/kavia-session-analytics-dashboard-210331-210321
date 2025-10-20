// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-AUDIT-002
// User Story: Audit trail query controller
// GxP Impact: YES - Critical for GxP compliance
// Risk Level: HIGH
// ============================================================================

const auditService = require('../services/auditService');

// PUBLIC_INTERFACE
/**
 * Get audit trail entries
 * @route GET /api/audit/trail
 */
const getAuditTrail = async (req, res, next) => {
  try {
    const { startDate, endDate, userId, actionType, page, limit } = req.query;
    
    const result = await auditService.getAuditTrail({
      startDate,
      endDate,
      userId,
      actionType,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Search audit trail
 * @route GET /api/audit/search
 */
const searchAuditTrail = async (req, res, next) => {
  try {
    const { searchTerm, startDate, endDate } = req.query;
    
    const result = await auditService.searchAuditTrail({
      searchTerm,
      startDate,
      endDate
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Export audit trail
 * @route POST /api/audit/export
 */
const exportAuditTrail = async (req, res, next) => {
  try {
    const { startDate, endDate, format } = req.body;
    
    const result = await auditService.exportAuditTrail({
      startDate,
      endDate,
      format,
      userId: req.user.id,
      username: req.user.username
    });

    res.status(200).json({
      message: 'Audit trail exported',
      downloadUrl: result.downloadUrl,
      filename: result.filename
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditTrail,
  searchAuditTrail,
  exportAuditTrail
};
