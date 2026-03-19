#!/bin/bash

# End a specific trip by ID

if [ -z "$1" ]; then
    echo "Usage: ./end-specific-trip.sh <trip_id>"
    echo ""
    echo "Example: ./end-specific-trip.sh 67fdab8c-b861-4531-93f5-d40703ef3a83"
    echo ""
    echo "To see active trips, run: ./diagnose-trips.sh"
    exit 1
fi

TRIP_ID="$1"

echo "🔄 Ending trip: $TRIP_ID"
echo ""

RESULT=$(sudo -u postgres psql -d tos_db -t -A -c "
UPDATE trips 
SET status = 'ENDED', end_time = NOW()
WHERE id = '$TRIP_ID' AND status = 'ACTIVE'
RETURNING id, route_id, trip_type;
" 2>&1)

if [ $? -eq 0 ] && [ -n "$RESULT" ]; then
    echo "✅ Trip ended successfully!"
    echo ""
    echo "Details:"
    echo "$RESULT" | awk -F'|' '{print "  Trip ID: " $1 "\n  Route ID: " $2 "\n  Type: " $3}'
else
    echo "❌ Trip not found or already ended"
    echo ""
    echo "Run ./diagnose-trips.sh to see active trips"
fi
