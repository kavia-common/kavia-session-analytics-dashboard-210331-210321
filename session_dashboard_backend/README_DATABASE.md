# Database Documentation - Session Analytics Dashboard

## Overview

This document describes the PostgreSQL database schema, migrations, and data management for the Kavia Session Analytics Dashboard backend. The database is designed to be **GxP-compliant** with ALCOA+ principles for data integrity, audit trails, and electronic signatures.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Database Schema](#database-schema)
3. [Migrations](#migrations)
4. [Seed Data](#seed-data)
5. [Docker Compose Setup](#docker-compose-setup)
6. [Environment Variables](#environment-variables)
7. [GxP Compliance](#gxp-compliance)
8. [Maintenance](#maintenance)

---

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Start PostgreSQL with Docker Compose
cd session_dashboard_backend
docker-compose up -d postgres

# Wait for database to be ready
docker-compose ps

# Run migrations
npm run migrate

# Verify database
docker-compose exec postgres psql -U session_user -d session_analytics -c "\dt"
```

### Using Existing PostgreSQL

```bash
# Set DATABASE_URL in .env file
DATABASE_URL=postgresql://username:password@localhost:5432/session_analytics

# Run migrations
npm run migrate
```

---

## Database Schema

### Core Tables

#### 1. **users**
Stores user accounts for authentication and authorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | User ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| first_name | VARCHAR(100) | | First name |
| last_name | VARCHAR(100) | | Last name |
| role | VARCHAR(20) | NOT NULL, CHECK | Role: Admin, Manager, Engineer, Viewer |
| team_id | INTEGER | FK → teams | Associated team |
| is_active | BOOLEAN | NOT NULL | Account status |
| is_locked | BOOLEAN | NOT NULL | Locked status |
| failed_login_attempts | INTEGER | | Failed login counter |
| last_login | TIMESTAMP | | Last successful login |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:** username, email, role, team_id, is_active, created_at

---

#### 2. **teams**
Organizes users into teams for analytics and access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Team ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Team name |
| description | TEXT | | Team description |
| manager_id | INTEGER | FK → users | Team manager |
| is_active | BOOLEAN | NOT NULL | Team status |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:** name, manager_id, is_active

---

#### 3. **sessions**
Core analytics data storing Kavia session information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Session ID |
| session_id | VARCHAR(255) | UNIQUE, NOT NULL | Kavia session identifier |
| user_id | INTEGER | FK → users, NOT NULL | Session user |
| team_id | INTEGER | FK → teams | Session team |
| project_id | VARCHAR(255) | | Project identifier |
| project_name | VARCHAR(255) | | Project name |
| session_type | VARCHAR(50) | | Session type |
| start_time | TIMESTAMP | NOT NULL | Session start |
| end_time | TIMESTAMP | | Session end |
| duration_seconds | INTEGER | | Duration in seconds |
| agents_used | JSONB | | Array of agents used |
| features_used | JSONB | | Array of features used |
| token_usage_input | INTEGER | | Input tokens |
| token_usage_output | INTEGER | | Output tokens |
| token_usage_total | INTEGER | | Total tokens |
| outputs_generated | JSONB | | Generated outputs |
| status | VARCHAR(20) | CHECK | Status: active, completed, failed, abandoned |
| error_message | TEXT | | Error details if failed |
| metadata | JSONB | | Additional metadata |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:** session_id, user_id, team_id, project_id, session_type, start_time, end_time, status, created_at

**GIN Indexes (JSONB):** agents_used, features_used, outputs_generated, metadata

---

#### 4. **features**
Catalog of product features for usage tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Feature ID |
| feature_code | VARCHAR(100) | UNIQUE, NOT NULL | Feature code |
| feature_name | VARCHAR(255) | NOT NULL | Feature name |
| category | VARCHAR(100) | | Feature category |
| description | TEXT | | Feature description |
| is_active | BOOLEAN | NOT NULL | Active status |
| is_deprecated | BOOLEAN | NOT NULL | Deprecated status |
| deprecated_at | TIMESTAMP | | Deprecation date |
| replacement_feature_id | INTEGER | FK → features | Replacement feature |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:** feature_code, feature_name, category, is_active, is_deprecated

---

#### 5. **roles**
Role definitions for RBAC system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Role ID |
| role_name | VARCHAR(20) | UNIQUE, NOT NULL | Role name |
| role_description | TEXT | | Role description |
| permissions | JSONB | NOT NULL | Permissions JSON |
| hierarchy_level | INTEGER | NOT NULL, UNIQUE | Hierarchy (1=highest) |
| is_active | BOOLEAN | NOT NULL | Active status |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:** role_name, hierarchy_level, is_active, permissions (GIN)

---

### GxP Compliance Tables

#### 6. **audit_logs**
Comprehensive audit trail for all system operations (ALCOA+ compliant).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Audit log ID |
| timestamp | TIMESTAMP | NOT NULL | Action timestamp |
| user_id | INTEGER | FK → users | User who performed action |
| username | VARCHAR(50) | NOT NULL | Username (denormalized) |
| action_type | VARCHAR(50) | NOT NULL | Action type (CREATE, READ, UPDATE, DELETE) |
| resource_type | VARCHAR(100) | NOT NULL | Resource type |
| resource_id | VARCHAR(255) | | Resource identifier |
| action_description | TEXT | | Action description |
| http_method | VARCHAR(10) | | HTTP method |
| endpoint | VARCHAR(500) | | API endpoint |
| request_body | JSONB | | Request payload |
| response_status | INTEGER | | HTTP status code |
| old_values | JSONB | | Values before change |
| new_values | JSONB | | Values after change |
| reason_for_change | TEXT | | Documented reason |
| ip_address | VARCHAR(45) | | Client IP |
| user_agent | TEXT | | Client user agent |
| session_id | VARCHAR(255) | | Session identifier |
| duration_ms | INTEGER | | Request duration |
| is_success | BOOLEAN | | Success status |
| error_message | TEXT | | Error details |
| compliance_category | VARCHAR(50) | | GxP category |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes:** timestamp, user_id, username, action_type, resource_type, resource_id, session_id, is_success, compliance_category, created_at

**Composite Indexes:** (user_id, timestamp), (resource_type, resource_id, timestamp)

**GIN Indexes:** request_body, old_values, new_values

---

#### 7. **electronic_signatures**
Electronic signatures for GxP-compliant signed operations (21 CFR Part 11).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Signature ID |
| signature_id | VARCHAR(255) | UNIQUE, NOT NULL | Unique signature identifier |
| user_id | INTEGER | FK → users, NOT NULL | Signing user |
| username | VARCHAR(50) | NOT NULL | Username |
| full_name | VARCHAR(255) | NOT NULL | Full name |
| signature_meaning | VARCHAR(100) | NOT NULL | Signature meaning |
| signature_text | VARCHAR(500) | NOT NULL | Signature text |
| password_verified | BOOLEAN | NOT NULL | Password verification |
| action_type | VARCHAR(50) | NOT NULL | Action type |
| resource_type | VARCHAR(100) | NOT NULL | Resource type |
| resource_id | VARCHAR(255) | | Resource identifier |
| data_hash | VARCHAR(64) | NOT NULL | SHA256 hash of signed data |
| hash_algorithm | VARCHAR(20) | | Hash algorithm (default SHA256) |
| timestamp | TIMESTAMP | NOT NULL | Signature timestamp |
| ip_address | VARCHAR(45) | | Client IP |
| user_agent | TEXT | | Client user agent |
| reason | TEXT | | Reason for signing |
| audit_log_id | BIGINT | FK → audit_logs | Related audit log |
| export_log_id | INTEGER | FK → export_logs | Related export log |
| is_valid | BOOLEAN | NOT NULL | Signature validity |
| invalidated_at | TIMESTAMP | | Invalidation timestamp |
| invalidated_by | INTEGER | FK → users | User who invalidated |
| invalidation_reason | TEXT | | Invalidation reason |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes:** signature_id, user_id, timestamp, action_type, (resource_type, resource_id), is_valid, data_hash

---

#### 8. **export_logs**
Logs of all data exports for audit trail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Export log ID |
| export_id | VARCHAR(255) | UNIQUE, NOT NULL | Unique export identifier |
| user_id | INTEGER | FK → users, NOT NULL | User who exported |
| username | VARCHAR(50) | NOT NULL | Username |
| export_type | VARCHAR(20) | NOT NULL, CHECK | Export type (CSV, JSON, PDF, EXCEL) |
| export_format | VARCHAR(20) | NOT NULL | Export format |
| data_type | VARCHAR(50) | NOT NULL | Type of data exported |
| filters_applied | JSONB | | Filters used |
| record_count | INTEGER | | Number of records |
| file_size_bytes | BIGINT | | File size |
| file_path | VARCHAR(500) | | File path |
| file_hash | VARCHAR(64) | | SHA256 hash |
| is_signed | BOOLEAN | | Whether signed |
| signature_id | INTEGER | FK → electronic_signatures | Signature reference |
| signature_meaning | VARCHAR(100) | | Signature meaning |
| timestamp | TIMESTAMP | NOT NULL | Export timestamp |
| duration_ms | INTEGER | | Export duration |
| ip_address | VARCHAR(45) | | Client IP |
| user_agent | TEXT | | Client user agent |
| status | VARCHAR(20) | CHECK | Status: initiated, processing, completed, failed |
| error_message | TEXT | | Error details |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes:** export_id, user_id, timestamp, export_type, data_type, is_signed, signature_id, status, filters_applied (GIN)

---

#### 9. **role_change_logs**
Audit log of role changes for access control tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Log ID |
| user_id | INTEGER | FK → users, NOT NULL | User whose role changed |
| old_role | VARCHAR(20) | | Previous role |
| new_role | VARCHAR(20) | NOT NULL | New role |
| changed_by | INTEGER | FK → users, NOT NULL | User who made change |
| reason | TEXT | NOT NULL | Documented reason |
| effective_date | TIMESTAMP | NOT NULL | Effective date |
| expiry_date | TIMESTAMP | | Expiry date (optional) |
| approval_required | BOOLEAN | | Approval required flag |
| approved_by | INTEGER | FK → users | Approver |
| approved_at | TIMESTAMP | | Approval timestamp |
| timestamp | TIMESTAMP | NOT NULL | Change timestamp |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes:** user_id, timestamp, changed_by, new_role, effective_date

---

#### 10. **migrations**
Tracks applied database migrations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Migration ID |
| name | VARCHAR(255) | NOT NULL | Migration name |
| filename | VARCHAR(255) | | SQL filename |
| checksum | VARCHAR(64) | | SHA256 checksum |
| applied_at | TIMESTAMP | NOT NULL | Application timestamp |
| applied_by | VARCHAR(100) | | Database user |
| execution_time_ms | INTEGER | | Execution time |
| status | VARCHAR(20) | CHECK | Status: success, failed, rolled_back |

**Indexes:** applied_at, status

---

## Migrations

### Migration Files

All migration files are located in `sql/migrations/` directory:

```
sql/migrations/
├── 001_create_users_table.sql
├── 002_create_teams_table.sql
├── 003_create_sessions_table.sql
├── 004_create_features_table.sql
├── 005_create_roles_table.sql
├── 006_create_audit_logs_table.sql
├── 007_create_signatures_table.sql
├── 008_create_export_logs_table.sql
├── 009_create_role_change_logs_table.sql
└── 010_create_migrations_table.sql
```

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
docker-compose exec postgres psql -U session_user -d session_analytics -c "SELECT * FROM migrations ORDER BY id;"
```

### Migration Order

Migrations are applied in numerical order (001, 002, 003...). The migration runner:
1. Checks if each migration has been applied
2. Verifies checksums to detect changes
3. Executes pending migrations
4. Records results in `migrations` table

---

## Seed Data

### Default Seed Data

Located in `sql/seeds/seed_data.sql`, includes:

#### 1. **Default Roles**
- **Admin**: Full system access
- **Manager**: Analytics, audit trail, team management
- **Engineer**: Data export, analytics access
- **Viewer**: Read-only access

#### 2. **Default Admin User**
- Username: `admin`
- Email: `admin@kavia.ai`
- Password: `Admin123!` (⚠️ Change in production!)
- Role: Admin

#### 3. **Sample Features**
- CODE_GENERATION
- CODE_REVIEW
- TESTING
- DOCUMENTATION
- BUG_FIXING
- REFACTORING
- API_DESIGN
- DATABASE_DESIGN
- DEPLOYMENT
- MONITORING

#### 4. **Optional Test Data** (commented out for production)
- Sample teams (Engineering, QA, DevOps, Product)
- Test users (manager1, engineer1, viewer1)
- Sample sessions for testing

### Customizing Seed Data

To modify seed data:
1. Edit `sql/seeds/seed_data.sql`
2. Comment out test data sections for production
3. Re-run migrations: `npm run migrate`

---

## Docker Compose Setup

### Configuration

The `docker-compose.yml` file includes:

#### PostgreSQL Service
- Image: `postgres:15-alpine`
- Port: 5432 (configurable)
- Persistent volume: `postgres_data`
- Health checks enabled
- Auto-restart: unless-stopped

#### pgAdmin Service (Optional)
- Image: `dpage/pgadmin4:latest`
- Port: 5050 (configurable)
- Web-based database management
- Access: http://localhost:5050

### Commands

```bash
# Start all services
docker-compose up -d

# Start only PostgreSQL
docker-compose up -d postgres

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# View logs
docker-compose logs -f postgres

# Access PostgreSQL CLI
docker-compose exec postgres psql -U session_user -d session_analytics

# Backup database
docker-compose exec postgres pg_dump -U session_user session_analytics > backup.sql

# Restore database
docker-compose exec -T postgres psql -U session_user session_analytics < backup.sql
```

---

## Environment Variables

### Docker Compose Variables

Create a `.env` file in the backend directory:

```env
# PostgreSQL Configuration
POSTGRES_USER=session_user
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=session_analytics
POSTGRES_PORT=5432

# pgAdmin Configuration
PGADMIN_EMAIL=admin@kavia.ai
PGADMIN_PASSWORD=pgadmin_password_here
PGADMIN_PORT=5050
```

### Application Variables

In `.env` file for Node.js application:

```env
DATABASE_URL=postgresql://session_user:secure_password_here@localhost:5432/session_analytics
```

For Docker networking (when backend also runs in Docker):
```env
DATABASE_URL=postgresql://session_user:secure_password_here@postgres:5432/session_analytics
```

---

## GxP Compliance

### ALCOA+ Principles Implementation

| Principle | Implementation |
|-----------|----------------|
| **Attributable** | All actions logged with user_id and username in audit_logs |
| **Legible** | Structured data with clear column names and documentation |
| **Contemporaneous** | Timestamps automatically captured at action time (NOW()) |
| **Original** | Source data preserved; old_values stored before updates |
| **Accurate** | Input validation, constraints, and foreign keys enforce accuracy |
| **Complete** | Comprehensive logging of all metadata and context |
| **Consistent** | Database constraints and triggers ensure consistency |
| **Enduring** | Persistent storage with backups; ON DELETE RESTRICT for critical data |
| **Available** | Indexed queries for fast retrieval; RBAC for access control |

### Electronic Signatures (21 CFR Part 11)

The `electronic_signatures` table supports:
- Unique signature identifiers
- User authentication verification
- Data integrity hashing (SHA256)
- Signature meaning documentation
- Non-repudiation (signature cannot be deleted, only invalidated)
- Audit trail linkage

### Data Retention

Recommended retention policies:
- **Audit logs**: 7 years minimum (GxP requirement)
- **Electronic signatures**: Indefinite (regulatory requirement)
- **Sessions data**: 3-5 years (business requirement)
- **User data**: Active + 2 years post-termination

---

## Maintenance

### Regular Tasks

#### Daily
- Monitor database size and growth
- Check for slow queries in logs
- Verify backup completion

#### Weekly
- Review audit logs for anomalies
- Check failed login attempts
- Analyze session data growth

#### Monthly
- Update statistics: `ANALYZE;`
- Vacuum database: `VACUUM ANALYZE;`
- Review and archive old audit logs
- Test backup restore procedure

### Performance Tuning

```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Find slow queries
SELECT 
    pid,
    now() - query_start as duration,
    query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

### Backup Strategy

#### Automated Backups

```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * docker-compose exec -T postgres pg_dump -U session_user session_analytics | gzip > /backups/session_analytics_$(date +\%Y\%m\%d).sql.gz

# Keep last 30 days of backups
find /backups -name "session_analytics_*.sql.gz" -mtime +30 -delete
```

#### Manual Backup

```bash
# Full database backup
docker-compose exec postgres pg_dump -U session_user -F c -b -v -f /tmp/backup.dump session_analytics

# Copy backup from container
docker cp session_analytics_db:/tmp/backup.dump ./backup.dump

# Restore from backup
docker-compose exec -T postgres pg_restore -U session_user -d session_analytics -v backup.dump
```

---

## Troubleshooting

### Common Issues

#### Migration Fails

```bash
# Check database connection
docker-compose exec postgres psql -U session_user -d session_analytics -c "SELECT version();"

# Check migration status
npm run migrate

# Manually check migrations table
docker-compose exec postgres psql -U session_user -d session_analytics -c "SELECT * FROM migrations;"
```

#### Connection Refused

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify network connectivity
docker-compose exec postgres pg_isready -U session_user
```

#### Slow Queries

```sql
-- Enable query logging (in postgresql.conf or via Docker env)
-- log_min_duration_statement = 1000  # Log queries taking > 1 second

-- Check for missing indexes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

---

## Security Considerations

### Production Checklist

- [ ] Change default admin password
- [ ] Use strong PostgreSQL passwords
- [ ] Enable SSL for database connections
- [ ] Configure firewall rules (PostgreSQL port 5432)
- [ ] Disable pgAdmin in production or secure with HTTPS
- [ ] Use connection pooling (already configured)
- [ ] Enable PostgreSQL query logging for audit
- [ ] Set up automated backups
- [ ] Configure backup encryption
- [ ] Restrict database user permissions
- [ ] Enable row-level security (RLS) if needed
- [ ] Monitor failed login attempts
- [ ] Regular security updates for PostgreSQL

### SSL Configuration

For production, update `docker-compose.yml`:

```yaml
postgres:
  command: >
    postgres
    -c ssl=on
    -c ssl_cert_file=/var/lib/postgresql/server.crt
    -c ssl_key_file=/var/lib/postgresql/server.key
  volumes:
    - ./certs/server.crt:/var/lib/postgresql/server.crt:ro
    - ./certs/server.key:/var/lib/postgresql/server.key:ro
```

Update `DATABASE_URL`:
```
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

---

## References

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- GxP Compliance Guidelines: FDA 21 CFR Part 11
- ALCOA+ Principles: https://www.fda.gov/regulatory-information
- Docker Compose: https://docs.docker.com/compose/

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review PostgreSQL logs: `docker-compose logs postgres`
3. Verify migrations: `npm run migrate`
4. Contact Kavia DevOps team

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-20  
**Maintained By:** Kavia Backend Team
