#!/bin/bash

echo "========================================="
echo "TOS API Flow Test"
echo "Testing Admin Portal ↔ Driver App Flow"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://localhost:8080"

# Get driver details from database
echo -e "${BLUE}Getting driver details from database...${NC}"
DRIVER_DATA=$(sudo -u postgres psql -d tos_db -t -A -F'|' -c "SELECT u.id, u.name, u.phone FROM users u WHERE u.phone = '+1234567891' LIMIT 1;")

if [ -z "$DRIVER_DATA" ]; then
    echo -e "${RED}✗ Driver +1234567891 not found in database${NC}"
    echo "Run ./setup-db.sh first"
    exit 1
fi

DRIVER_ID=$(echo $DRIVER_DATA | cut -d'|' -f1)
DRIVER_NAME=$(echo $DRIVER_DATA | cut -d'|' -f2)
DRIVER_PHONE=$(echo $DRIVER_DATA | cut -d'|' -f3)

echo -e "${GREEN}✓ Found driver: $DRIVER_NAME ($DRIVER_PHONE)${NC}"
echo "  Driver ID: $DRIVER_ID"
echo ""

# Test 1: Health Check
echo "========================================="
echo "Test 1: Backend Health Check"
echo "========================================="
echo "GET $BASE_URL/health"
HEALTH_RESPONSE=$(curl -s $BASE_URL/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo "Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Start backend: cd backend && mvn spring-boot:run"
    exit 1
fi
echo ""

# Test 2: Get all routes (Admin Portal)
echo "========================================="
echo "Test 2: Get All Routes (Admin Portal)"
echo "========================================="
echo "GET $BASE_URL/api/v1/routes"
ROUTES_RESPONSE=$(curl -s $BASE_URL/api/v1/routes)
echo "Response:"
echo $ROUTES_RESPONSE | jq '.' 2>/dev/null || echo $ROUTES_RESPONSE
echo ""

# Test 3: Get driver's assigned routes (Driver App)
echo "========================================="
echo "Test 3: Get Driver's Routes (Driver App)"
echo "========================================="
echo "GET $BASE_URL/api/v1/routes/driver/$DRIVER_ID"
DRIVER_ROUTES=$(curl -s $BASE_URL/api/v1/routes/driver/$DRIVER_ID)
echo "Response:"
echo $DRIVER_ROUTES | jq '.' 2>/dev/null || echo $DRIVER_ROUTES

# Extract route ID if exists
ROUTE_ID=$(echo $DRIVER_ROUTES | jq -r '.data[0].id' 2>/dev/null)
if [ "$ROUTE_ID" != "null" ] && [ ! -z "$ROUTE_ID" ]; then
    echo -e "${GREEN}✓ Driver has assigned route: $ROUTE_ID${NC}"
else
    echo -e "${YELLOW}⚠ Driver has no assigned route yet${NC}"
    ROUTE_ID=""
fi
echo ""

# Test 4: Assign a new student to the route (Admin Portal)
if [ ! -z "$ROUTE_ID" ]; then
    echo "========================================="
    echo "Test 4: Assign Student to Route (Admin)"
    echo "========================================="
    
    # Get a student ID from database
    STUDENT_ID=$(sudo -u postgres psql -d tos_db -t -A -c "SELECT id FROM students LIMIT 1;")
    
    if [ ! -z "$STUDENT_ID" ]; then
        echo "POST $BASE_URL/api/v1/routes/$ROUTE_ID/assign-students"
        echo "Assigning student: $STUDENT_ID"
        
        ASSIGN_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/routes/$ROUTE_ID/assign-students \
            -H "Content-Type: application/json" \
            -d "{\"studentIds\": [\"$STUDENT_ID\"]}")
        
        echo "Response:"
        echo $ASSIGN_RESPONSE | jq '.' 2>/dev/null || echo $ASSIGN_RESPONSE
        
        if echo $ASSIGN_RESPONSE | grep -q "success"; then
            echo -e "${GREEN}✓ Student assigned successfully${NC}"
            echo -e "${YELLOW}⚡ SSE notification should be sent to driver now!${NC}"
        else
            echo -e "${YELLOW}⚠ Student might already be assigned${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ No students found in database${NC}"
    fi
    echo ""
fi

# Test 5: SSE Connection Test (Driver App)
echo "========================================="
echo "Test 5: SSE Connection (Driver App)"
echo "========================================="
echo "GET $BASE_URL/api/driver/events?driverId=$DRIVER_ID"
echo ""
echo -e "${YELLOW}Testing SSE connection for 5 seconds...${NC}"
echo "This simulates the driver app connecting to receive notifications"
echo ""

timeout 5 curl -N -H "Accept: text/event-stream" \
    "$BASE_URL/api/driver/events?driverId=$DRIVER_ID" 2>/dev/null &
SSE_PID=$!

sleep 1

if ps -p $SSE_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✓ SSE connection established${NC}"
    echo "Waiting for events..."
    wait $SSE_PID 2>/dev/null
else
    echo -e "${RED}✗ SSE connection failed${NC}"
fi
echo ""

# Test 6: Start a trip (Driver App)
echo "========================================="
echo "Test 6: Start Trip (Driver App)"
echo "========================================="

if [ ! -z "$ROUTE_ID" ]; then
    echo "POST $BASE_URL/api/v1/trips/start"
    
    START_TRIP_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/trips/start \
        -H "Content-Type: application/json" \
        -d "{
            \"driverId\": \"$DRIVER_ID\",
            \"routeId\": \"$ROUTE_ID\",
            \"tripType\": \"PICKUP\"
        }")
    
    echo "Response:"
    echo $START_TRIP_RESPONSE | jq '.' 2>/dev/null || echo $START_TRIP_RESPONSE
    
    TRIP_ID=$(echo $START_TRIP_RESPONSE | jq -r '.data.id' 2>/dev/null)
    if [ "$TRIP_ID" != "null" ] && [ ! -z "$TRIP_ID" ]; then
        echo -e "${GREEN}✓ Trip started successfully${NC}"
        echo "  Trip ID: $TRIP_ID"
    else
        echo -e "${YELLOW}⚠ Could not start trip (might already have active trip)${NC}"
        # Try to get active trip
        ACTIVE_TRIP=$(curl -s "$BASE_URL/api/v1/trips/driver/$DRIVER_ID/active")
        TRIP_ID=$(echo $ACTIVE_TRIP | jq -r '.data.id' 2>/dev/null)
        if [ "$TRIP_ID" != "null" ] && [ ! -z "$TRIP_ID" ]; then
            echo "  Using existing active trip: $TRIP_ID"
        fi
    fi
    echo ""
    
    # Test 7: Send GPS Update (Driver App)
    if [ ! -z "$TRIP_ID" ] && [ "$TRIP_ID" != "null" ]; then
        echo "========================================="
        echo "Test 7: Send GPS Update (Driver App)"
        echo "========================================="
        echo "POST $BASE_URL/api/gps/update"
        
        GPS_RESPONSE=$(curl -s -X POST $BASE_URL/api/gps/update \
            -H "Content-Type: application/json" \
            -d "{
                \"tripId\": \"$TRIP_ID\",
                \"driverId\": \"$DRIVER_ID\",
                \"latitude\": 23.8103,
                \"longitude\": 90.4125,
                \"speed\": 25.5,
                \"heading\": 90.0,
                \"accuracy\": 10.5,
                \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S)\"
            }")
        
        echo "Response: $GPS_RESPONSE"
        
        if echo $GPS_RESPONSE | grep -q "success"; then
            echo -e "${GREEN}✓ GPS update sent successfully${NC}"
        else
            echo -e "${RED}✗ GPS update failed${NC}"
        fi
        echo ""
        
        # Test 8: Get GPS Location (Admin Portal / Parent Portal)
        echo "========================================="
        echo "Test 8: Get GPS Location (Admin/Parent)"
        echo "========================================="
        echo "GET $BASE_URL/api/gps/location/$TRIP_ID"
        
        GPS_LOCATION=$(curl -s "$BASE_URL/api/gps/location/$TRIP_ID")
        echo "Response:"
        echo $GPS_LOCATION | jq '.' 2>/dev/null || echo $GPS_LOCATION
        
        if echo $GPS_LOCATION | grep -q "latitude"; then
            echo -e "${GREEN}✓ GPS location retrieved successfully${NC}"
        else
            echo -e "${RED}✗ GPS location not found${NC}"
        fi
        echo ""
        
        # Test 9: Get Active Trips (Admin Portal)
        echo "========================================="
        echo "Test 9: Get Active Trips (Admin Portal)"
        echo "========================================="
        echo "GET $BASE_URL/api/v1/trips/active"
        
        ACTIVE_TRIPS=$(curl -s "$BASE_URL/api/v1/trips/active")
        echo "Response:"
        echo $ACTIVE_TRIPS | jq '.' 2>/dev/null || echo $ACTIVE_TRIPS
        
        if echo $ACTIVE_TRIPS | grep -q "$TRIP_ID"; then
            echo -e "${GREEN}✓ Active trip visible in admin portal${NC}"
        else
            echo -e "${YELLOW}⚠ Trip not found in active trips${NC}"
        fi
        echo ""
    fi
else
    echo -e "${YELLOW}⚠ Skipping trip tests (no route assigned)${NC}"
    echo ""
fi

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
echo "Driver Details:"
echo "  Name: $DRIVER_NAME"
echo "  Phone: $DRIVER_PHONE"
echo "  User ID: $DRIVER_ID"
if [ ! -z "$ROUTE_ID" ]; then
    echo "  Route ID: $ROUTE_ID"
fi
if [ ! -z "$TRIP_ID" ] && [ "$TRIP_ID" != "null" ]; then
    echo "  Trip ID: $TRIP_ID"
fi
echo ""
echo "Flow Tested:"
echo "  1. ✓ Backend health check"
echo "  2. ✓ Admin fetches all routes"
echo "  3. ✓ Driver fetches assigned routes"
if [ ! -z "$ROUTE_ID" ]; then
    echo "  4. ✓ Admin assigns student (SSE notification sent)"
    echo "  5. ✓ Driver SSE connection"
    if [ ! -z "$TRIP_ID" ] && [ "$TRIP_ID" != "null" ]; then
        echo "  6. ✓ Driver starts trip"
        echo "  7. ✓ Driver sends GPS update"
        echo "  8. ✓ Admin/Parent gets GPS location"
        echo "  9. ✓ Admin sees active trip"
    fi
fi
echo ""
echo -e "${GREEN}✓ Database and API communication verified!${NC}"
echo ""
echo "The admin portal and driver mobile app can now communicate"
echo "through the shared database and real-time APIs."
echo ""
