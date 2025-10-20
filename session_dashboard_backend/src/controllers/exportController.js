// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-EXPORT-001
// User Story: Data export controller with electronic signature
// GxP Impact: YES - Critical for GxP compliance (electronic signatures)
// Risk Level: HIGH
// ============================================================================

const exportService = require('../services/exportService');

// PUBLIC_INTERFACE
/**
 * Export data to CSV format
 * @route POST /api/export/csv
 */
const exportToCSV = async (req, res, next) => {
  try {
    const { startDate, endDate, filters } = req.body;
    
    const result = await exportService.exportToCSV({
      startDate,
      endDate,
      filters,
      userId: req.user.id,
      username: req.user.username
    });

    res.status(200).json({
      message: 'CSV export generated',
      downloadUrl: result.downloadUrl,
      filename: result.filename
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Export data to JSON format
 * @route POST /api/export/json
 */
const exportToJSON = async (req, res, next) => {
  try {
    const { startDate, endDate, filters } = req.body;
    
    const result = await exportService.exportToJSON({
      startDate,
      endDate,
      filters,
      userId: req.user.id,
      username: req.user.username
    });

    res.status(200).json({
      message: 'JSON export generated',
      downloadUrl: result.downloadUrl,
      filename: result.filename
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
/**
 * Export data with electronic signature (GxP compliant)
 * @route POST /api/export/signed
 */
const exportWithSignature = async (req, res, next) => {
  try {
    const { startDate, endDate, filters, signature, username } = req.body;

    // Verify signature matches username
    if (signature !== req.user.username) {
      return res.status(400).json({
        error: 'Signature Mismatch',
        message: 'Signature must match your username'
      });
    }

    const result = await exportService.exportWithSignature({
      startDate,
      endDate,
      filters,
      signature,
      userId: req.user.id,
      username: req.user.username
    });

    res.status(200).json({
      message: 'Signed export generated',
      downloadUrl: result.downloadUrl,
      filename: result.filename,
      signatureId: result.signatureId
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportToCSV,
  exportToJSON,
  exportWithSignature
};
