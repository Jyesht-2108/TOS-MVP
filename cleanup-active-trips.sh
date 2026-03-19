#!/bin/bash

# Cleanup Active Trips Script
# This script ends all active trips in the database to resolve constraint conflicts

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           CLEANUP ACTIVE TRIPS - TOS DATABASE                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "📊 Checking for active trips..."
echo ""

# Check current active trips
ACTIVE_COUNT=$(sudo -u postgres psql -d tos_db -t -A -c "SELECT COUNT(*) FROM trips WHERE status = 'ACTIVE';" 2>&1)

# Check if query failed
if [ $? -ne 0 ]; then
    echo "❌ Error connecting to database. Please check:"
    echo "   - PostgreSQL is running"
    echo "   - Database 'tos_db' exists"
    echo ""
    echo "Error details: $ACTIVE_COUNT"
    exit 1
fi

# Trim whitespace
ACTIVE_COUNT=$(echo "$ACTIVE_COUNT" | xargs)

if [ "$ACTIVE_COUNT" = "0" ]; then
    echo "✅ No active trips found. Database is clean!"
    echo ""
    echo "You can now start new trips from the driver mobile app."
    exit 0
fi

echo "⚠️  Found $ACTIVE_COUNT active trip(s) in the database"
echo ""
echo "These trips will be ended:"
echo ""
sudo -u postgres psql -d tos_db << 'EOF'
\x auto
SELECT 
    id,
    route_id,
    trip_type,
    start_time,
    CASE 
        WHEN end_time IS NULL THEN 'Not ended'
        ELSE end_time::text
    END as end_time
FROM trips 
WHERE status = 'ACTIVE'
ORDER BY start_time DESC;
EOF

echo ""
read -p "Do you want to end these trips? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Ending all active trips..."
    
    RESULT=$(sudo -u postgres psql -d tos_db -f backend/db/cleanup-active-trips.sql 2>&1)
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ All active trips have been ended!"
        echo ""
        echo "You can now start new trips from the driver mobile app."
    else
        echo ""
        echo "❌ Error ending trips:"
        echo "$RESULT"
        exit 1
    fi
else
    echo ""
    echo "❌ Cleanup cancelled."
    exit 1
fi
