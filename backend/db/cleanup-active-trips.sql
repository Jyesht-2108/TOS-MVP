-- Cleanup script to end all active trips
-- This resolves the "duplicate key value violates unique constraint" error
-- Run this when you need to reset the trip state

-- End all active trips by setting their status to 'ENDED' and setting end_time
UPDATE trips 
SET 
    status = 'ENDED',
    end_time = COALESCE(end_time, NOW())
WHERE status = 'ACTIVE';

-- Show the trips that were ended
SELECT 
    id,
    route_id,
    trip_type,
    start_time,
    end_time,
    'Trip ended by cleanup script' as note
FROM trips 
WHERE status = 'ENDED' 
  AND end_time >= NOW() - INTERVAL '1 minute'
ORDER BY end_time DESC;
