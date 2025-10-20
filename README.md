# Kavia Session Analytics Dashboard

A full-stack GxP-compliant session visualization dashboard for analyzing Kavia product usage. This dashboard provides visualizations for feature usage, trends, team and individual user analytics, with role-based access control and comprehensive audit trails.

## 🏗️ Architecture

The application consists of three main components:

- **Frontend**: React-based dashboard (Port 3000)
- **Backend**: Node.js/Express REST API (Port 5000)
- **Database**: PostgreSQL (Port 5432)

## 📋 Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 18+ and PostgreSQL 15+
- Git

## 🚀 Quick Start (Docker Compose)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kavia-session-analytics-dashboard-210331-210321
```

### 2. Configure Environment Variables

#### Root Configuration
Create a `.env` file in the project root:

```bash
# Database Configuration
POSTGRES_USER=session_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=session_analytics
POSTGRES_PORT=5432

# Backend Configuration
NODE_ENV=development
JWT_SECRET=your_jwt_secret_min_32_chars_here
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars_here
CORS_ORIGIN=http://localhost:3000

# Frontend Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_SITE_URL=http://localhost:3000
```

**🔒 IMPORTANT**: Generate strong secrets for production:
```bash
# Generate JWT secrets
openssl rand -base64 32
```

#### Backend Configuration
```bash
cd session_dashboard_backend
cp .env.example .env
# Edit .env with your values (DATABASE_URL, JWT_SECRET, etc.)
```

#### Frontend Configuration
```bash
cd session_dashboard_frontend
cp .env.example .env
# Edit .env with your values (REACT_APP_API_BASE_URL, etc.)
```

### 3. Start All Services

```bash
# From project root
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 5000
- Frontend application on port 3000

### 4. Run Database Migrations

```bash
cd session_dashboard_backend
npm run migrate
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api-docs (if enabled)

## 🛠️ Manual Setup (Without Docker)

### 1. Setup PostgreSQL Database

Install PostgreSQL 15+ and create the database:

```sql
CREATE DATABASE session_analytics;
CREATE USER session_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE session_analytics TO session_user;
```

### 2. Setup Backend

```bash
cd session_dashboard_backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and secrets

# Run migrations
npm run migrate

# Start development server
npm run dev
```

Backend will be available at http://localhost:5000

### 3. Setup Frontend

```bash
cd session_dashboard_frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with backend API URL

# Start development server
npm start
```

Frontend will be available at http://localhost:3000

## 🧪 Testing

### Backend Tests

```bash
cd session_dashboard_backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Validate database setup
npm run db:validate
```

### Frontend Tests

```bash
cd session_dashboard_frontend

# Run all tests
npm test

# Run tests in CI mode
npm run test:ci

# Run integration tests
npm run test:integration
```

### End-to-End Integration Tests

Run the smoke test that verifies frontend-backend-database integration:

```bash
cd session_dashboard_frontend
npm run test:integration
```

## 📦 Available Scripts

### Root Level (Docker Compose)

```bash
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose logs -f        # View logs
docker-compose ps             # Check service status
docker-compose restart        # Restart all services
```

### Backend Scripts

```bash
npm start                     # Start production server
npm run dev                   # Start development server with hot reload
npm test                      # Run tests with coverage
npm run migrate               # Run database migrations
npm run db:start              # Start PostgreSQL container
npm run db:stop               # Stop PostgreSQL container
npm run db:validate           # Validate database setup
npm run db:status             # Show database status
npm run docker:up             # Start all services via docker-compose
npm run docker:down           # Stop all services
```

### Frontend Scripts

```bash
npm start                     # Start development server
npm run build                 # Build for production
npm test                      # Run tests
npm run test:ci               # Run tests in CI mode
npm run test:integration      # Run integration tests
npm run docker:up             # Start all services via docker-compose
npm run docker:down           # Stop all services
```

## 🗂️ Project Structure

```
kavia-session-analytics-dashboard-210331-210321/
├── docker-compose.yml              # Root orchestration
├── README.md                       # This file
├── session_dashboard_frontend/     # React frontend
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API service layer
│   │   ├── contexts/              # React contexts
│   │   ├── constants/             # API endpoints & constants
│   │   └── utils/                 # Utility functions
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
└── session_dashboard_backend/      # Node.js backend
    ├── src/
    │   ├── routes/                # API routes
    │   ├── controllers/           # Request handlers
    │   ├── services/              # Business logic
    │   ├── middleware/            # Express middleware
    │   ├── migrations/            # Database migrations
    │   └── config/                # Configuration
    ├── sql/                       # SQL schemas & seeds
    ├── scripts/                   # Utility scripts
    ├── Dockerfile
    ├── package.json
    └── .env.example
```

## 🔐 Security & GxP Compliance

This application is built with GxP compliance in mind:

- **Audit Trails**: All data modifications are logged with user, timestamp, and change details
- **Role-Based Access Control**: Granular permissions for different user roles
- **Data Integrity**: ALCOA+ principles implemented throughout
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Input Validation**: All inputs validated and sanitized
- **Rate Limiting**: Protection against abuse
- **CORS Protection**: Configurable allowed origins

### Production Security Checklist

Before deploying to production:

- [ ] Change all default passwords and secrets
- [ ] Use strong JWT secrets (32+ characters, random)
- [ ] Enable SSL for database connections
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS_ORIGIN
- [ ] Enable HTTPS and secure cookies
- [ ] Set up database backups
- [ ] Configure monitoring and alerting
- [ ] Review and adjust rate limits
- [ ] Enable audit trail monitoring

## 🌐 API Documentation

### Health Check Endpoints

```
GET /health           # Basic health check
GET /api/health       # API health check
```

### Authentication Endpoints

```
POST /api/auth/login      # User login
POST /api/auth/logout     # User logout
POST /api/auth/refresh    # Refresh access token
GET  /api/auth/verify     # Verify token
```

### Analytics Endpoints

```
GET /api/analytics/dashboard      # Dashboard summary
GET /api/analytics/feature-usage  # Feature usage statistics
GET /api/analytics/trends         # Usage trends
GET /api/analytics/team-usage     # Team analytics
GET /api/analytics/user-analysis  # User analytics
```

For complete API documentation, see `session_dashboard_backend/README.md`

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Verify database connection
cd session_dashboard_backend
npm run db:validate
```

### Backend Won't Start

```bash
# Check environment variables
cat session_dashboard_backend/.env

# Check backend logs
docker-compose logs backend

# Verify all dependencies installed
cd session_dashboard_backend
npm install
```

### Frontend Won't Start

```bash
# Check environment variables
cat session_dashboard_frontend/.env

# Check frontend logs
docker-compose logs frontend

# Verify all dependencies installed
cd session_dashboard_frontend
npm install
```

### CORS Errors

Ensure `CORS_ORIGIN` in backend .env matches the frontend URL:
```bash
# In session_dashboard_backend/.env
CORS_ORIGIN=http://localhost:3000
```

## 📝 Environment Variables Reference

### Required Backend Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing (min 32 chars)
- `JWT_REFRESH_SECRET`: Secret for refresh tokens (min 32 chars)
- `CORS_ORIGIN`: Frontend URL for CORS

### Required Frontend Variables

- `REACT_APP_API_BASE_URL`: Backend API endpoint
- `REACT_APP_SITE_URL`: Frontend URL for redirects

See `.env.example` files in each directory for complete configuration options.

## 📄 License

Copyright © 2024 Kavia. All rights reserved.

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review backend logs: `docker-compose logs backend`
3. Review frontend logs: `docker-compose logs frontend`
4. Check database status: `npm run db:status`

## 🔄 Development Workflow

1. **Make changes** to frontend or backend code
2. **Hot reload** is enabled for both services in development mode
3. **Run tests** before committing: `npm test`
4. **Check logs** for any issues: `docker-compose logs -f`
5. **Validate database** after schema changes: `npm run db:validate`

## 🚢 Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong secrets and passwords
3. Enable SSL/TLS for all connections
4. Configure proper CORS origins
5. Set up monitoring and logging
6. Enable database backups
7. Review security checklist above

See individual README files in frontend and backend directories for detailed deployment instructions.
