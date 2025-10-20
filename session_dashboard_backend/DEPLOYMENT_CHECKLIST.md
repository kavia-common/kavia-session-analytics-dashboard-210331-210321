# Database Deployment Checklist

## Pre-Deployment Checklist

### Environment Setup

- [ ] Node.js >= 16.0.0 installed
- [ ] Docker and Docker Compose installed
- [ ] PostgreSQL client tools installed (optional, for debugging)
- [ ] Git repository cloned
- [ ] Backend dependencies installed (`npm install`)

### Configuration

- [ ] `.env` file created from `.env.example`
- [ ] `DATABASE_URL` configured correctly
- [ ] `JWT_SECRET` set to strong random value (32+ characters)
- [ ] `JWT_REFRESH_SECRET` set to strong random value
- [ ] `CORS_ORIGIN` set to frontend URL
- [ ] Docker Compose environment variables reviewed
- [ ] Database credentials changed from defaults

### Validation

- [ ] Run `npm run db:validate` - passes all checks
- [ ] Run `npm test -- src/migrations/__tests__/runMigrations.test.js` - all tests pass
- [ ] Review `README_DATABASE.md` documentation
- [ ] Review `QUICKSTART_DATABASE.md` for setup steps

---

## Deployment Steps

### 1. Database Setup

```bash
# Step 1: Start PostgreSQL
npm run db:start

# Step 2: Wait for PostgreSQL to be ready (10 seconds)
sleep 10

# Step 3: Verify PostgreSQL is running
docker-compose ps postgres

# Step 4: Run migrations
npm run migrate

# Expected output: "✅ All migrations completed successfully"
```

**Verification:**
- [ ] PostgreSQL container is running
- [ ] Migrations completed without errors
- [ ] 10 migrations applied successfully

### 2. Verify Database Schema

```bash
# Check tables created
npm run db:shell
\dt

# Should see 10 tables:
# - users
# - teams
# - sessions
# - features
# - roles
# - audit_logs
# - electronic_signatures
# - export_logs
# - role_change_logs
# - migrations

\q
```

**Verification:**
- [ ] All 10 tables exist
- [ ] No error messages in migration log

### 3. Verify Seed Data

```bash
# Check default roles
npm run db:shell
SELECT role_name FROM roles ORDER BY hierarchy_level;

# Expected output:
# Admin
# Manager
# Engineer
# Viewer

# Check admin user
SELECT username, email, role FROM users WHERE username='admin';

# Expected output:
# admin | admin@kavia.ai | Admin

\q
```

**Verification:**
- [ ] 4 roles created (Admin, Manager, Engineer, Viewer)
- [ ] Admin user created
- [ ] Features table populated

### 4. Change Default Credentials

```bash
# Change admin password
npm run db:shell

UPDATE users 
SET password_hash = '$2b$10$NEW_HASH_HERE' 
WHERE username='admin';

\q
```

**Verification:**
- [ ] Admin password changed from default
- [ ] New password tested and working

### 5. Test Backend Connection

```bash
# Start backend server
npm run dev

# Expected output:
# ✅ Database connected at: [timestamp]
# 🚀 Server running on port 5000
```

**Verification:**
- [ ] Backend starts without errors
- [ ] Database connection successful
- [ ] No connection warnings in logs

### 6. Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected: {"status":"healthy"}

# Test login with admin user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# Expected: {"token":"...", "user":{...}}
```

**Verification:**
- [ ] Health endpoint responds
- [ ] Login endpoint works
- [ ] JWT token returned successfully

---

## Post-Deployment Verification

### Database Health

- [ ] Run `npm run db:validate` - all checks pass
- [ ] Check database size: `docker stats session_analytics_db`
- [ ] Verify indexes created: See README_DATABASE.md
- [ ] Check for migration errors in logs

### Security

- [ ] Default admin password changed
- [ ] PostgreSQL password changed from default
- [ ] JWT secrets are unique and strong (32+ characters)
- [ ] .env file is not committed to git
- [ ] Database port (5432) is properly firewalled (production)
- [ ] CORS_ORIGIN is set to actual frontend URL

### Backup & Recovery

- [ ] Manual backup tested: `npm run db:backup`
- [ ] Backup file created successfully
- [ ] Restore procedure tested (on dev environment)
- [ ] Automated backup scheduled (cron job)
- [ ] Backup retention policy defined

### Monitoring

- [ ] Database logs accessible: `npm run db:logs`
- [ ] Slow query logging enabled (if needed)
- [ ] Disk space monitoring configured
- [ ] Alert thresholds defined

### Documentation

- [ ] Team trained on database operations
- [ ] Backup/restore procedures documented
- [ ] Emergency contacts defined
- [ ] Maintenance schedule established

---

## Production-Specific Checklist

### Security Hardening

- [ ] Enable SSL for database connections
- [ ] Configure PostgreSQL SSL certificates
- [ ] Update `DATABASE_URL` with `?sslmode=require`
- [ ] Enable database connection encryption
- [ ] Restrict database network access (firewall rules)
- [ ] Use database connection pooling (already configured)
- [ ] Enable PostgreSQL logging for audit
- [ ] Configure log retention policies

### Performance Optimization

- [ ] Review and adjust PostgreSQL configuration
  - [ ] shared_buffers (25% of RAM recommended)
  - [ ] effective_cache_size (50-75% of RAM)
  - [ ] work_mem (adjust based on concurrent connections)
- [ ] Enable query performance monitoring
- [ ] Configure connection pool size (adjust if needed)
- [ ] Set up read replicas (if high read load)

### High Availability

- [ ] Configure PostgreSQL replication (if required)
- [ ] Set up failover mechanism
- [ ] Test failover procedure
- [ ] Document recovery time objective (RTO)
- [ ] Document recovery point objective (RPO)

### Compliance

- [ ] GxP validation protocol executed
- [ ] Audit trail tested and verified
- [ ] Electronic signature functionality tested
- [ ] Data retention policies implemented
- [ ] User access controls validated
- [ ] Change control process established

---

## Rollback Plan

In case of deployment issues:

### 1. Stop Backend
```bash
# Stop backend server
npm stop
# or Ctrl+C if running in dev mode
```

### 2. Stop Database
```bash
npm run db:stop
```

### 3. Restore Previous State

**Option A: Rollback migrations (if available)**
```bash
# Create rollback migration SQL
# Run rollback commands manually in db:shell
```

**Option B: Restore from backup**
```bash
# Stop and remove current database
npm run db:reset

# Restore from backup
docker-compose exec -T postgres psql -U session_user session_analytics < backup.sql
```

### 4. Verify Rollback
```bash
# Check database state
npm run db:shell
SELECT * FROM migrations ORDER BY id;
\q

# Restart backend
npm run dev
```

---

## Troubleshooting

### Issue: Migrations fail

**Symptoms:**
- Migration script exits with error
- Database tables incomplete

**Solution:**
```bash
# Check error message in output
npm run migrate

# Check database connection
npm run db:shell

# Check migration status
SELECT * FROM migrations WHERE status='failed';

# Manual fix if needed, then retry
npm run migrate
```

### Issue: Cannot connect to database

**Symptoms:**
- Backend fails to start
- "Connection refused" errors

**Solution:**
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check logs
npm run db:logs

# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection manually
npm run db:shell
```

### Issue: Seed data not loaded

**Symptoms:**
- No default admin user
- Roles table empty

**Solution:**
```bash
# Manually load seed data
docker-compose exec -T postgres psql -U session_user session_analytics < sql/seeds/seed_data.sql

# Verify
npm run db:shell
SELECT COUNT(*) FROM roles;
SELECT COUNT(*) FROM users;
```

---

## Support Contacts

**Database Issues:**
- Check: README_DATABASE.md
- Run: `npm run db:validate`
- Logs: `npm run db:logs`

**Migration Issues:**
- Check: QUICKSTART_DATABASE.md
- Test: `npm test -- src/migrations/__tests__/runMigrations.test.js`

**Emergency:**
- Rollback procedure (see above)
- Contact: DevOps team
- Backup location: [define location]

---

## Sign-off

### Deployment Completed By:

**Name:** _________________  
**Date:** _________________  
**Signature:** _________________

### Verification Completed By:

**Name:** _________________  
**Date:** _________________  
**Signature:** _________________

### Approved By:

**Name:** _________________  
**Date:** _________________  
**Signature:** _________________

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-20  
**Next Review Date:** [30 days from deployment]
