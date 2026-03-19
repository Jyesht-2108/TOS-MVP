#!/bin/bash

# Diagnostic script to check trip status

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              TRIP DIAGNOSTIC - TOS DATABASE                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "1️⃣  Checking ALL trips in database..."
echo ""
sudo -u postgres psql -d tos_db << 'EOF'
SELECT 
    id,
    route_id,
    trip_type,
    status,
    start_time,
    end_time
FROM trips 
ORDER BY start_time DESC 
LIMIT 20;
EOF

echo ""
echo "2️⃣  Checking ACTIVE trips specifically..."
echo ""
sudo -u postgres psql -d tos_db << 'EOF'
SELECT 
    COUNT(*) as total_active,
    trip_type,
    route_id
FROM trips 
WHERE status = 'ACTIVE'
GROUP BY trip_type, route_id;
EOF

echo ""
echo "3️⃣  Checking Route 50000000-0000-0000-0000-000000000002 specifically..."
echo ""
sudo -u postgres psql -d tos_db << 'EOF'
SELECT 
    id,
    trip_type,
    status,
    start_time,
    end_time
FROM trips 
WHERE route_id = '50000000-0000-0000-0000-000000000002'
ORDER BY start_time DESC;
EOF

echo ""
echo "4️⃣  Checking for DROP trips on Route 50000000-0000-0000-0000-000000000002..."
echo ""
sudo -u postgres psql -d tos_db << 'EOF'
SELECT 
    id,
    trip_type,
    status,
    start_time,
    end_time,
    CASE 
        WHEN status = 'ACTIVE' THEN '⚠️  BLOCKING NEW TRIPS'
        ELSE '✅ OK'
    END as note
FROM trips 
WHERE route_id = '50000000-0000-0000-0000-000000000002'
  AND trip_type = 'DROP'
ORDER BY start_time DESC
LIMIT 5;
EOF

echo ""
echo "═══════════════════════════════════════════════════════════════"
