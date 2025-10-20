// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-AUDIT-001
// User Story: Audit trail logging middleware for GxP compliance
// GxP Impact: YES - Critical for ALCOA+ compliance
// Risk Level: HIGH
// ============================================================================

const { query } = require('../config/database');

// PUBLIC_INTERFACE
/**
 * Audit logger middleware - captures all API requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const auditLogger = async (req, res, next) => {
  const startTime = Date.now();

  // Capture response
  const originalSend = res.send;
  let responseBody;

  res.send = function (data) {
    responseBody = data;
    originalSend.call(this, data);
  };

  // Wait for response to complete
  res.on('finish', async () => {
    try {
      const duration = Date.now() - startTime;

      // Skip audit for health checks and static resources
      if (req.path === '/health' || req.path.startsWith('/static')) {
        return;
      }

      const auditEntry = {
        timestamp: new Date().toISOString(),
        userId: req.user?.id || null,
        username: req.user?.username || 'anonymous',
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        requestBody: sanitizeData(req.body),
        responseStatus: res.statusCode,
        actionType: determineActionType(req.method, req.path)
      };

      // Log to database (async, don't block response)
      await logAuditEntry(auditEntry);

    } catch (error) {
      console.error('Audit logging error:', error);
      // Don't fail the request if audit logging fails
    }
  });

  next();
};

// Helper function to determine action type
const determineActionType = (method, path) => {
  if (method === 'GET') return 'READ';
  if (method === 'POST' && path.includes('login')) return 'LOGIN';
  if (method === 'POST' && path.includes('logout')) return 'LOGOUT';
  if (method === 'POST') return 'CREATE';
  if (method === 'PUT' || method === 'PATCH') return 'UPDATE';
  if (method === 'DELETE') return 'DELETE';
  return 'OTHER';
};

// Helper function to sanitize sensitive data
const sanitizeData = (data) => {
  if (!data) return null;
  
  const sanitized = { ...data };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Helper function to log audit entry to database
const logAuditEntry = async (entry) => {
  try {
    const sql = `
      INSERT INTO audit_trail (
        timestamp, user_id, username, action_type, 
        resource, details, ip_address, user_agent,
        status_code, duration_ms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    
    const values = [
      entry.timestamp,
      entry.userId,
      entry.username,
      entry.actionType,
      `${entry.method} ${entry.path}`,
      JSON.stringify({ requestBody: entry.requestBody }),
      entry.ipAddress,
      entry.userAgent,
      entry.statusCode,
      entry.duration
    ];

    await query(sql, values);
  } catch (error) {
    // If audit_trail table doesn't exist yet, just log to console
    if (error.code === '42P01') {
      console.log('Audit trail table not yet created. Entry:', entry);
    } else {
      console.error('Failed to log audit entry:', error);
    }
  }
};

module.exports = { auditLogger };
