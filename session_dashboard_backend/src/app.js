// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-BACKEND-002
// User Story: Express app configuration with security and middleware
// GxP Impact: YES - Core application setup for GxP compliance
// Risk Level: HIGH
// ============================================================================

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const { auditLogger } = require('./middleware/auditLogger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const exportRoutes = require('./routes/exportRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const auditRoutes = require('./routes/auditRoutes');
const filterRoutes = require('./routes/filterRoutes');

const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// AUDIT TRAIL MIDDLEWARE
// ============================================================================
app.use(auditLogger);

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'session-analytics-backend'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'session-analytics-backend'
  });
});

// ============================================================================
// API ROUTES
// ============================================================================
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/filters', filterRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
