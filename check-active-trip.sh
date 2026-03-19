#!/bin/bash

echo "Checking for active trips in database..."
echo ""

sudo -u postgres psql -d tos_db << 'EOF'
SELECT 
    t.id as trip_id,
    t.route_id,
    r.name as route_name,
    t.driver_id,
    u.name as driver_name,
    t.trip_type,
    t.status,
    t.start_time,
    CASE 
        WHEN t.status = 'ACTIVE' THEN '✅ ACTIVE'
        ELSE '❌ NOT ACTIVE'
    END as trip_status
FROM trips t
LEFT JOIN routes r ON t.route_id = r.id
LEFT JOIN users u ON t.driver_id = u.id
WHERE t.status = 'ACTIVE'
ORDER BY t.start_time DESC;
EOF

echo ""
echo "Checking latest bus locations..."
echo ""

sudo -u postgres psql -d tos_db << 'EOF'
SELECT 
    trip_id,
    route_id,
    driver_id,
    latitude,
    longitude,
    timestamp,
    updated_at
FROM latest_bus_location
ORDER BY updated_at DESC
LIMIT 5;
EOF
