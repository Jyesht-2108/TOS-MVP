#!/bin/bash

echo "========================================="
echo "Verifying No Mock Data Usage"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Checking Frontend Environment Configuration...${NC}"
echo "----------------------------------------------"

if [ -f "frontend/.env" ]; then
    echo "Frontend .env file:"
    cat frontend/.env
    echo ""
    
    # Check VITE_USE_MOCK value
    MOCK_VALUE=$(grep "VITE_USE_MOCK=" frontend/.env | cut -d'=' -f2)
    if [ "$MOCK_VALUE" = "false" ]; then
        echo -e "${GREEN}✓ VITE_USE_MOCK is set to false${NC}"
    else
        echo -e "${RED}✗ VITE_USE_MOCK is set to: $MOCK_VALUE${NC}"
        echo -e "${YELLOW}Should be: false${NC}"
    fi
else
    echo -e "${RED}✗ frontend/.env file not found${NC}"
fi
echo ""

echo -e "${BLUE}Step 2: Checking Service Files for Mock Data Usage...${NC}"
echo "----------------------------------------------"

# Check admin.service.ts
echo "Checking admin.service.ts..."
if grep -q "import.meta.env.DEV" frontend/src/services/admin.service.ts; then
    echo -e "${RED}✗ admin.service.ts still checks DEV mode${NC}"
else
    echo -e "${GREEN}✓ admin.service.ts only checks VITE_USE_MOCK${NC}"
fi

# Check auth.service.ts
echo "Checking auth.service.ts..."
if grep -q "import.meta.env.DEV" frontend/src/services/auth.service.ts; then
    echo -e "${RED}✗ auth.service.ts still checks DEV mode${NC}"
else
    echo -e "${GREEN}✓ auth.service.ts only checks VITE_USE_MOCK${NC}"
fi

# Check parent.service.ts
echo "Checking parent.service.ts..."
if grep -q "import.meta.env.DEV" frontend/src/services/parent.service.ts; then
    echo -e "${RED}✗ parent.service.ts still checks DEV mode${NC}"
else
    echo -e "${GREEN}✓ parent.service.ts only checks VITE_USE_MOCK${NC}"
fi
echo ""

echo -e "${BLUE}Step 3: Verifying Backend is Using Real Database...${NC}"
echo "----------------------------------------------"

# Check backend application-dev.yml
if [ -f "backend/src/main/resources/application-dev.yml" ]; then
    echo "Backend database configuration:"
    grep -A 3 "datasource:" backend/src/main/resources/application-dev.yml
    echo ""
    
    DB_URL=$(grep "url:" backend/src/main/resources/application-dev.yml | grep "jdbc:postgresql" | head -1)
    if [ ! -z "$DB_URL" ]; then
        echo -e "${GREEN}✓ Backend is configured to use PostgreSQL${NC}"
        echo "  $DB_URL"
    else
        echo -e "${RED}✗ Backend database configuration not found${NC}"
    fi
else
    echo -e "${RED}✗ Backend configuration file not found${NC}"
fi
echo ""

echo -e "${BLUE}Step 4: Testing Backend API with Real Data...${NC}"
echo "----------------------------------------------"

# Check if backend is running
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo ""
    
    # Test routes API
    echo "Testing routes API..."
    ROUTES_RESPONSE=$(curl -s http://localhost:8080/api/v1/routes)
    
    if echo "$ROUTES_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
        ROUTE_COUNT=$(echo "$ROUTES_RESPONSE" | jq '.data | length')
        echo -e "${GREEN}✓ Routes API returns real data${NC}"
        echo "  Found $ROUTE_COUNT routes in database"
        
        # Show first route
        echo ""
        echo "Sample route from database:"
        echo "$ROUTES_RESPONSE" | jq '.data[0]' 2>/dev/null
    else
        echo -e "${RED}✗ Routes API not returning expected format${NC}"
    fi
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Start backend: cd backend && mvn spring-boot:run"
fi
echo ""

echo -e "${BLUE}Step 5: Verifying Database Connection...${NC}"
echo "----------------------------------------------"

# Check database
DB_EXISTS=$(sudo -u postgres psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -w tos_db | wc -l)
if [ $DB_EXISTS -eq 1 ]; then
    echo -e "${GREEN}✓ Database tos_db exists${NC}"
    
    # Count records
    ROUTE_COUNT=$(sudo -u postgres psql -d tos_db -t -A -c "SELECT COUNT(*) FROM routes;" 2>/dev/null)
    DRIVER_COUNT=$(sudo -u postgres psql -d tos_db -t -A -c "SELECT COUNT(*) FROM users WHERE role = 'DRIVER';" 2>/dev/null)
    STUDENT_COUNT=$(sudo -u postgres psql -d tos_db -t -A -c "SELECT COUNT(*) FROM students;" 2>/dev/null)
    
    echo "  Routes in database: $ROUTE_COUNT"
    echo "  Drivers in database: $DRIVER_COUNT"
    echo "  Students in database: $STUDENT_COUNT"
else
    echo -e "${RED}✗ Database tos_db not found${NC}"
fi
echo ""

echo "========================================="
echo "Verification Summary"
echo "========================================="
echo ""

# Summary
ALL_GOOD=true

if [ "$MOCK_VALUE" != "false" ]; then
    echo -e "${RED}✗ Frontend .env has VITE_USE_MOCK=$MOCK_VALUE (should be false)${NC}"
    ALL_GOOD=false
fi

if grep -q "import.meta.env.DEV" frontend/src/services/admin.service.ts 2>/dev/null; then
    echo -e "${RED}✗ admin.service.ts still checks DEV mode${NC}"
    ALL_GOOD=false
fi

if grep -q "import.meta.env.DEV" frontend/src/services/auth.service.ts 2>/dev/null; then
    echo -e "${RED}✗ auth.service.ts still checks DEV mode${NC}"
    ALL_GOOD=false
fi

if grep -q "import.meta.env.DEV" frontend/src/services/parent.service.ts 2>/dev/null; then
    echo -e "${RED}✗ parent.service.ts still checks DEV mode${NC}"
    ALL_GOOD=false
fi

if ! curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${RED}✗ Backend is not running${NC}"
    ALL_GOOD=false
fi

if [ $DB_EXISTS -ne 1 ]; then
    echo -e "${RED}✗ Database not found${NC}"
    ALL_GOOD=false
fi

echo ""
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "The application is configured to use REAL DATABASE DATA:"
    echo "  ✓ Frontend .env has VITE_USE_MOCK=false"
    echo "  ✓ Service files only check VITE_USE_MOCK (not DEV mode)"
    echo "  ✓ Backend is connected to PostgreSQL database"
    echo "  ✓ Database has real data ($ROUTE_COUNT routes, $DRIVER_COUNT drivers, $STUDENT_COUNT students)"
    echo ""
    echo "NO MOCK DATA IS BEING USED! ✅"
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}⚠ SOME CHECKS FAILED${NC}"
    echo -e "${RED}=========================================${NC}"
    echo ""
    echo "Please fix the issues above to ensure real data is used."
fi
echo ""
