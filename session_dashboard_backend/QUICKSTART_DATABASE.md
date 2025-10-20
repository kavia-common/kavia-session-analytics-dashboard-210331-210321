# Quick Start Guide - Database Setup

This guide will get your database up and running in under 5 minutes.

## Prerequisites

- Docker and Docker Compose installed
- Node.js >= 16.0.0
- npm

## Option 1: Docker Compose (Recommended for Development)

### Step 1: Start PostgreSQL

```bash
cd session_dashboard_backend

# Start PostgreSQL container
npm run db:start

# Wait 10 seconds for PostgreSQL to initialize
# Check status
docker-compose ps
```

### Step 2: Run Migrations

```bash
# Run all database migrations
npm run migrate
```

Expected output:
```
🔄 Starting database migrations...
✅ Migration 1 completed
✅ Migration 2 completed
...
✅ All migrations completed successfully
```

### Step 3: Verify Database

```bash
# Access PostgreSQL shell
npm run db:shell

# List all tables
\dt

# Check users table
SELECT username, email, role FROM users;

# Exit
\q
```

### Step 4: Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Optional: Start pgAdmin

```bash
# Start pgAdmin web UI
npm run pgadmin:start

# Access at http://localhost:5050
# Login: admin@kavia.ai / admin123

# Add server connection:
# - Host: postgres
# - Port: 5432
# - Database: session_analytics
# - Username: session_user
# - Password: session_password
```

---

## Option 2: Existing PostgreSQL

### Step 1: Create Database

```bash
# Connect to your PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE session_analytics;
CREATE USER session_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE session_analytics TO session_user;

\q
```

### Step 2: Configure Environment

```bash
# Edit .env file
DATABASE_URL=postgresql://session_user:your_password@localhost:5432/session_analytics
```

### Step 3: Run Migrations

```bash
npm run migrate
```

### Step 4: Start Backend

```bash
npm run dev
```

---

## Default Credentials

After running migrations, you can login with:

- **Username:** `admin`
- **Email:** `admin@kavia.ai`
- **Password:** `Admin123!`
- **Role:** Admin

⚠️ **IMPORTANT:** Change this password immediately in production!

---

## Common Commands

```bash
# Database Management
npm run db:start          # Start PostgreSQL
npm run db:stop           # Stop PostgreSQL
npm run db:restart        # Restart PostgreSQL
npm run db:logs           # View PostgreSQL logs
npm run db:shell          # Open PostgreSQL shell
npm run db:backup         # Backup database
npm run db:reset          # Reset database (WARNING: deletes all data)

# Migrations
npm run migrate           # Run pending migrations

# pgAdmin
npm run pgadmin:start     # Start pgAdmin UI
npm run pgadmin:stop      # Stop pgAdmin UI

# Application
npm run dev              # Start backend (development)
npm start                # Start backend (production)
npm test                 # Run tests
```

---

## Verification Checklist

After setup, verify:

- [ ] PostgreSQL is running: `docker-compose ps`
- [ ] Migrations completed: `npm run migrate`
- [ ] Can connect to database: `npm run db:shell`
- [ ] Tables exist: `\dt` in psql
- [ ] Default admin user exists: `SELECT * FROM users;`
- [ ] Backend server starts: `npm run dev`
- [ ] API health check: `curl http://localhost:5000/health`

---

## Troubleshooting

### PostgreSQL won't start

```bash
# Check logs
npm run db:logs

# Check port 5432 is not in use
lsof -i :5432

# If port is busy, stop other PostgreSQL
sudo service postgresql stop
```

### Migration fails

```bash
# Check database connection
npm run db:shell

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Check migrations table
npm run db:shell
SELECT * FROM migrations;
```

### Cannot connect to database

```bash
# Check PostgreSQL is running
docker-compose ps

# Verify network
docker-compose exec postgres pg_isready -U session_user

# Check .env configuration
cat .env
```

### Reset everything

```bash
# WARNING: This deletes all data
npm run db:reset
```

---

## Next Steps

1. ✅ Database setup complete
2. 📖 Read [README_DATABASE.md](./README_DATABASE.md) for detailed schema documentation
3. 🔐 Change default admin password
4. 📊 Test API endpoints (see main [README.md](./README.md))
5. 🧪 Run tests: `npm test`

---

## Support

For detailed documentation, see:
- [README_DATABASE.md](./README_DATABASE.md) - Complete database documentation
- [README.md](./README.md) - Backend API documentation
- [docker-compose.yml](./docker-compose.yml) - Docker configuration

For issues:
```bash
# View all logs
docker-compose logs

# View PostgreSQL logs only
npm run db:logs
```
