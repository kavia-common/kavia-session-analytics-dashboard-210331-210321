// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-BACKEND-001
// User Story: Backend server entry point with Express setup
// GxP Impact: YES - Main server initialization for GxP system
// Risk Level: HIGH
// ============================================================================

const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Initialize server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('⚠️  SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('⚠️  SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
