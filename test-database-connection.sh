#!/bin/bash

echo "========================================="
echo "TOS Database Connection Test"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if PostgreSQL is running
echo "Test 1: Checking PostgreSQL service..."
if sudo systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not running${NC}"
    echo "Starting PostgreSQL..."
    sudo systemctl start postgresql
fi
echo ""

# Test 2: Check if database exists
echo "Test 2: Checking if tos_db exists..."
DB_EXISTS=$(sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w tos_db | wc -l)
if [ $DB_EXISTS -eq 1 ]; then
    echo -e "${GREEN}✓ Database tos_db exists${NC}"
else
    echo -e "${RED}✗ Database tos_db does not exist${NC}"
    echo "Run ./setup-db.sh to create the database"
    exit 1
fi
echo ""

# Test 3: Check if tables exist
echo "Test 3: Checking if tables exist..."
TABLE_COUNT=$(sudo -u postgres psql -d tos_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
if [ $TABLE_COUNT -ge 14 ]; then
    echo -e "${GREEN}✓ Found $TABLE_COUNT tables (expected 14+)${NC}"
else
    echo -e "${RED}✗ Found only $TABLE_COUNT tables (expected 14+)${NC}"
    echo "Run ./setup-db.sh to create tables"
    exit 1
fi
echo ""

# Test 4: Check if test driver exists
echo "Test 4: Checking if test driver (+1234567891) exists..."
DRIVER_EXISTS=$(sudo -u postgres psql -d tos_db -t -c "SELECT COUNT(*) FROM users WHERE phone = '+1234567891';")
if [ $DRIVER_EXISTS -eq 1 ]; then
    echo -e "${GREEN}✓ Test driver +1234567891 exists${NC}"
    sudo -u postgres psql -d tos_db -c "SELECT u.id, u.name, u.phone, u.role FROM users u WHERE u.phone = '+1234567891';"
else
    echo -e "${RED}✗ Test driver +1234567891 not found${NC}"
    echo "Run ./setup-db.sh to load seed data"
    exit 1
fi
echo ""

# Test 5: Check driver's route assignment
echo "Test 5: Checking driver's route assignment..."
ROUTE_ASSIGNED=$(sudo -u postgres psql -d tos_db -t -c "SELECT COUNT(*) FROM route_driver_assignment rda JOIN users u ON u.id = rda.driver_id WHERE u.phone = '+1234567891' AND rda.active_to IS NULL;")
if [ $ROUTE_ASSIGNED -eq 1 ]; then
    echo -e "${GREEN}✓ Driver +1234567891 has an active route assignment${NC}"
    sudo -u postgres psql -d tos_db -c "SELECT u.name as driver_name, u.phone, r.name as route_name, r.id as route_id FROM users u JOIN route_driver_assignment rda ON rda.driver_id = u.id JOIN routes r ON r.id = rda.route_id WHERE u.phone = '+1234567891' AND rda.active_to IS NULL;"
else
    echo -e "${YELLOW}⚠ Driver +1234567891 has no active route assignment${NC}"
    echo "This is OK - you can assign a route from the admin portal"
fi
echo ""

# Test 6: Check students on the route
echo "Test 6: Checking students on driver's route..."
STUDENT_COUNT=$(sudo -u postgres psql -d tos_db -t -c "SELECT COUNT(*) FROM route_students rs JOIN route_driver_assignment rda ON rda.route_id = rs.route_id JOIN users u ON u.id = rda.driver_id WHERE u.phone = '+1234567891' AND rda.active_to IS NULL;")
echo -e "${GREEN}✓ Found $STUDENT_COUNT students on driver's route${NC}"
if [ $STUDENT_COUNT -gt 0 ]; then
    sudo -u postgres psql -d tos_db -c "SELECT s.name as student_name, s.grade, s.section FROM students s JOIN route_students rs ON rs.student_id = s.id JOIN route_driver_assignment rda ON rda.route_id = rs.route_id JOIN users u ON u.id = rda.driver_id WHERE u.phone = '+1234567891' AND rda.active_to IS NULL;"
fi
echo ""

# Test 7: Get driver details for mobile app
echo "Test 7: Driver details for mobile app login..."
echo -e "${YELLOW}Driver Login Credentials:${NC}"
sudo -u postgres psql -d tos_db -c "SELECT u.id as user_id, u.name, u.phone, u.email, d.vehicle_number FROM users u JOIN drivers d ON d.user_id = u.id WHERE u.phone = '+1234567891';"
echo ""

# Test 8: Get route details for mobile app
echo "Test 8: Route details for mobile app..."
echo -e "${YELLOW}Assigned Route:${NC}"
sudo -u postgres psql -d tos_db -c "SELECT r.id as route_id, r.name as route_name, r.status, COUNT(rs.student_id) as student_count FROM routes r LEFT JOIN route_students rs ON rs.route_id = r.id JOIN route_driver_assignment rda ON rda.route_id = r.id JOIN users u ON u.id = rda.driver_id WHERE u.phone = '+1234567891' AND rda.active_to IS NULL GROUP BY r.id, r.name, r.status;"
echo ""

echo "========================================="
echo -e "${GREEN}✓ Database Connection Test Complete!${NC}"
echo "========================================="
echo ""
echo "Summary:"
echo "  - PostgreSQL: Running"
echo "  - Database: tos_db exists"
echo "  - Tables: $TABLE_COUNT tables found"
echo "  - Test Driver: +1234567891 exists"
echo "  - Route Assignment: $ROUTE_ASSIGNED active assignment(s)"
echo "  - Students: $STUDENT_COUNT students on route"
echo ""
echo "Next Steps:"
echo "  1. Start backend: cd backend && mvn spring-boot:run"
echo "  2. Test API: curl http://localhost:8080/health"
echo "  3. Test driver route: curl http://localhost:8080/api/v1/routes/driver/{user_id}"
echo ""
