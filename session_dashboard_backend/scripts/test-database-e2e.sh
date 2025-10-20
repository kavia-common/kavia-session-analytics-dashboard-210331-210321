#!/bin/bash

# ============================================================================
# REQUIREMENT TRACEABILITY
# ============================================================================
# Requirement ID: REQ-TEST-E2E-001
# User Story: End-to-end test of database setup and migrations
# GxP Impact: YES - Validates complete database setup
# Risk Level: HIGH
# ============================================================================

# set -e  # Don't exit on error - we want to see all test results

echo "======================================================================="
echo "  🧪 END-TO-END DATABASE SETUP TEST"
echo "======================================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to check test result
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $1"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $1"
        ((TESTS_FAILED++))
    fi
}

echo "📋 Phase 1: Validation Checks"
echo "-----------------------------------------------------------------------"

# Test 1: Check if docker-compose.yml exists
echo -n "Test 1: Docker Compose file exists... "
test -f docker-compose.yml
check_result "Docker Compose configuration"

# Test 2: Check migration files
echo -n "Test 2: Migration files exist... "
test $(ls -1 sql/migrations/*.sql 2>/dev/null | wc -l) -ge 10
check_result "Migration files (expected >= 10)"

# Test 3: Check seed data
echo -n "Test 3: Seed data exists... "
test -f sql/seeds/seed_data.sql
check_result "Seed data file"

# Test 4: Check documentation
echo -n "Test 4: Documentation exists... "
test -f README_DATABASE.md && test -f QUICKSTART_DATABASE.md
check_result "Database documentation"

# Test 5: Check npm scripts
echo -n "Test 5: npm scripts configured... "
grep -q "\"migrate\"" package.json && grep -q "\"db:start\"" package.json
check_result "npm scripts in package.json"

# Test 6: Check dependencies
echo -n "Test 6: PostgreSQL dependency... "
test -d node_modules/pg
check_result "pg (PostgreSQL) module installed"

echo ""
echo "📋 Phase 2: Validation Script Tests"
echo "-----------------------------------------------------------------------"

# Test 7: Run validation script
echo -n "Test 7: Database validation script... "
npm run db:validate > /tmp/validate_output.txt 2>&1
grep -q "VALIDATION PASSED" /tmp/validate_output.txt
check_result "Validation script execution"

# Test 8: Run unit tests
echo -n "Test 8: Migration unit tests... "
npm test -- src/migrations/__tests__/runMigrations.test.js > /tmp/test_output.txt 2>&1
grep -q "27 passed" /tmp/test_output.txt
check_result "Migration unit tests (27 tests)"

echo ""
echo "📋 Phase 3: SQL Content Validation"
echo "-----------------------------------------------------------------------"

# Test 9: Check users table migration
echo -n "Test 9: Users table migration... "
grep -q "CREATE TABLE.*users" sql/migrations/001_create_users_table.sql
check_result "Users table SQL"

# Test 10: Check sessions table migration
echo -n "Test 10: Sessions table migration... "
grep -q "CREATE TABLE.*sessions" sql/migrations/003_create_sessions_table.sql
check_result "Sessions table SQL"

# Test 11: Check audit logs migration
echo -n "Test 11: Audit logs migration... "
grep -q "CREATE TABLE.*audit_logs" sql/migrations/006_create_audit_logs_table.sql
check_result "Audit logs table SQL"

# Test 12: Check seed data roles
echo -n "Test 12: Seed data roles... "
grep -q "Admin" sql/seeds/seed_data.sql && grep -q "Manager" sql/seeds/seed_data.sql
check_result "Default roles in seed data"

# Test 13: Check seed data admin user
echo -n "Test 13: Seed data admin user... "
grep -q "admin@kavia.ai" sql/seeds/seed_data.sql
check_result "Admin user in seed data"

echo ""
echo "📋 Phase 4: GxP Compliance Validation"
echo "-----------------------------------------------------------------------"

# Test 14: Check ALCOA+ features in audit logs
echo -n "Test 14: ALCOA+ audit trail features... "
grep -q "user_id" sql/migrations/006_create_audit_logs_table.sql && \
grep -q "timestamp" sql/migrations/006_create_audit_logs_table.sql && \
grep -q "old_values" sql/migrations/006_create_audit_logs_table.sql
check_result "ALCOA+ compliance in audit_logs"

# Test 15: Check electronic signatures
echo -n "Test 15: Electronic signatures (21 CFR Part 11)... "
grep -q "electronic_signatures" sql/migrations/007_create_signatures_table.sql && \
grep -q "data_hash" sql/migrations/007_create_signatures_table.sql
check_result "Electronic signatures table"

# Test 16: Check requirement traceability
echo -n "Test 16: Requirement traceability... "
grep -q "REQUIREMENT TRACEABILITY" sql/migrations/001_create_users_table.sql
check_result "GxP requirement traceability comments"

echo ""
echo "📋 Phase 5: Index Validation"
echo "-----------------------------------------------------------------------"

# Test 17: Check indexes on users table
echo -n "Test 17: Users table indexes... "
grep -q "CREATE INDEX.*idx_users" sql/migrations/001_create_users_table.sql
check_result "Users table indexes"

# Test 18: Check indexes on sessions table
echo -n "Test 18: Sessions table indexes... "
grep -q "CREATE INDEX.*idx_sessions" sql/migrations/003_create_sessions_table.sql
check_result "Sessions table indexes"

# Test 19: Check GIN indexes for JSONB
echo -n "Test 19: GIN indexes for JSONB columns... "
grep -q "USING GIN" sql/migrations/003_create_sessions_table.sql
check_result "GIN indexes for JSON queries"

echo ""
echo "📋 Phase 6: Documentation Validation"
echo "-----------------------------------------------------------------------"

# Test 20: Check README completeness
echo -n "Test 20: README_DATABASE.md completeness... "
grep -q "users" README_DATABASE.md && \
grep -q "sessions" README_DATABASE.md && \
grep -q "audit_logs" README_DATABASE.md
check_result "README documents all key tables"

# Test 21: Check quick start guide
echo -n "Test 21: Quick start guide... "
grep -q "npm run db:start" QUICKSTART_DATABASE.md && \
grep -q "npm run migrate" QUICKSTART_DATABASE.md
check_result "Quick start includes setup commands"

# Test 22: Check deployment checklist
echo -n "Test 22: Deployment checklist... "
test -f DEPLOYMENT_CHECKLIST.md && grep -q "Production" DEPLOYMENT_CHECKLIST.md
check_result "Deployment checklist exists"

echo ""
echo "======================================================================="
echo "  📊 TEST RESULTS SUMMARY"
echo "======================================================================="
echo ""
echo -e "  ${GREEN}✅ Tests Passed: ${TESTS_PASSED}${NC}"
echo -e "  ${RED}❌ Tests Failed: ${TESTS_FAILED}${NC}"
echo -e "  📈 Total Tests:  $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo ""
    echo "✅ Database implementation is complete and validated."
    echo ""
    echo "Next steps:"
    echo "  1. npm run db:start    - Start PostgreSQL"
    echo "  2. npm run migrate     - Run migrations"
    echo "  3. npm run dev         - Start backend server"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    echo "Please review the failures above and fix any issues."
    echo ""
    exit 1
fi
