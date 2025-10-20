# Session Analytics Dashboard Backend

Backend API for Kavia Session Analytics Dashboard with GxP compliance.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Admin, Manager, Engineer, Viewer roles
- **Audit Trail**: ALCOA+ compliant audit logging for all operations
- **Electronic Signatures**: Support for signed data exports
- **Input Validation**: Joi-based request validation
- **Security Hardening**: Helmet, CORS, rate limiting
- **PostgreSQL Database**: Robust data storage with migrations

## Prerequisites

- Node.js >= 16.0.0
- PostgreSQL >= 12
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
# IMPORTANT: Set DATABASE_URL and JWT_SECRET

# Run database migrations
npm run migrate
```

## Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `CORS_ORIGIN`: Allowed CORS origin (frontend URL)

## Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or PORT from .env).

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token validity

### Analytics
- `GET /api/analytics/dashboard` - Dashboard summary
- `GET /api/analytics/feature-usage` - Feature usage data
- `GET /api/analytics/trends` - Trend analysis
- `GET /api/analytics/team-usage` - Team usage statistics
- `GET /api/analytics/user-analysis` - User analysis

### Exports (Engineer+ role required)
- `POST /api/export/csv` - Export to CSV
- `POST /api/export/json` - Export to JSON
- `POST /api/export/signed` - Export with electronic signature

### Users (Admin role required)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roles (Admin role required)
- `GET /api/roles` - List available roles
- `POST /api/roles/assign` - Assign role to user
- `POST /api/roles/revoke` - Revoke user role

### Audit Trail (Manager+ role required)
- `GET /api/audit/trail` - Get audit trail entries
- `GET /api/audit/search` - Search audit trail
- `POST /api/audit/export` - Export audit trail

### Filters
- `GET /api/filters/teams` - Get teams for filters
- `GET /api/filters/users` - Get users for filters
- `GET /api/filters/features` - Get features for filters
- `GET /api/filters/projects` - Get projects for filters

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Database Migrations

Database migrations are located in `src/migrations/`. To run migrations:

```bash
npm run migrate
```

## Default Credentials

After running migrations, a default admin account is created:
- Username: `admin`
- Email: `admin@kavia.ai`
- Password: `Admin123!` (change immediately in production)

## GxP Compliance

This backend implements GxP-critical features:

1. **Audit Trail**: All API requests are logged with user, timestamp, action, and details
2. **Electronic Signatures**: Support for signed exports with user verification
3. **Access Control**: RBAC ensures proper authorization for sensitive operations
4. **Data Integrity**: Input validation and database constraints
5. **Security**: Helmet, CORS, rate limiting, and JWT authentication

## Architecture

```
src/
├── app.js                 # Express app configuration
├── config/
│   └── database.js        # Database connection
├── middleware/
│   ├── authenticate.js    # JWT authentication
│   ├── authorize.js       # RBAC authorization
│   ├── auditLogger.js     # Audit trail logging
│   ├── validateRequest.js # Request validation
│   └── errorHandler.js    # Error handling
├── controllers/           # Request handlers
├── routes/                # Route definitions
├── services/              # Business logic
├── models/                # Database models (future)
└── migrations/            # Database migrations
```

## Security Considerations

1. Never commit `.env` file with real credentials
2. Use strong JWT_SECRET in production
3. Enable SSL for database connections in production
4. Regularly rotate JWT secrets
5. Review and update dependencies for security patches
6. Enable HTTPS for production deployment
7. Configure proper CORS origins

## License

ISC
