# Parent Portal Stale GPS Fix

## Problem
Every time the parent portal was opened, it showed:
- GPS Health: "Stale" (red/offline status)
- Bus icon not visible on the map
- Old GPS data from previous trips

## Root Cause
1. **Zombie Trips**: Old trips from March 31 were still marked as ACTIVE in the database, even though they had ended days ago
2. **Stale GPS Data**: The `latest_bus_location` table contained GPS coordinates from these old trips
3. **Backend Behavior**: The tracking endpoint was returning this stale data (2+ days old)
4. **Health Status Calculation**: The frontend correctly identified the data as "stale" because it was older than 90 seconds

## Solution Applied

### 1. Database Cleanup
Cleaned up zombie trips and stale GPS data:

```sql
-- End all trips older than 1 day
UPDATE trips 
SET status = 'ENDED', 
    end_time = start_time + INTERVAL '2 hours'
WHERE status = 'ACTIVE' 
  AND start_time < NOW() - INTERVAL '1 day';

-- Delete stale GPS data for ended trips
DELETE FROM latest_bus_location 
WHERE trip_id IN (SELECT id FROM trips WHERE status = 'ENDED');
```

Results:
- 2 zombie trips ended
- 3 stale GPS records deleted
- Database now clean with no active trips

### 2. Frontend Cleanup
Removed excessive debug logging from:
- `ChildLiveMap.tsx` - Removed debug info panel and console logs
- `useLiveTracking.ts` - Removed verbose state logging
- `tracking.service.ts` - Kept only error logging

### 3. Current Behavior
Now when you open the parent portal:
- If there's NO active trip → Shows "No Active Trips" message (clean UX)
- If there IS an active trip → Shows live GPS with health status:
  - **Healthy** (green): Data < 30 seconds old
  - **Warning** (yellow): Data 30-90 seconds old
  - **Stale** (gray): Data > 90 seconds old

## Health Status Logic
The health status is calculated based on GPS data age:

```typescript
if (delayInSeconds < 30) return 'healthy';
else if (delayInSeconds < 90) return 'warning';
else return 'stale';
```

## Testing
1. **No Active Trip** (current state):
   - Parent portal shows "No Active Trips" message
   - No 404 errors in console (handled gracefully)
   - Clean UX

2. **With Active Trip** (when driver starts a trip):
   - Bus icon appears on map
   - GPS health shows "Healthy" if data is fresh
   - Auto-updates every 10 seconds
   - Health status degrades if GPS stops updating

## Prevention
To prevent zombie trips in the future, consider:
1. Adding a scheduled job to auto-end trips older than 24 hours
2. Adding trip timeout logic in the driver app
3. Adding admin tools to manually end stuck trips

## Files Modified
- `frontend/src/modules/parent/components/ChildLiveMap.tsx` - Removed debug UI and logs
- `frontend/src/hooks/useLiveTracking.ts` - Cleaned up logging
- `frontend/src/services/tracking.service.ts` - Simplified logging
- Database: Cleaned up zombie trips and stale GPS data

## Verification
```bash
# Check for active trips
PGPASSWORD=123456 psql -U postgres -d tos_db -c "SELECT COUNT(*) FROM trips WHERE status = 'ACTIVE';"
# Should return: 0

# Check for GPS data
PGPASSWORD=123456 psql -U postgres -d tos_db -c "SELECT COUNT(*) FROM latest_bus_location;"
# Should return: 0

# Test tracking endpoint
curl "http://localhost:8080/api/v1/tracking/live?route_id=50000000-0000-0000-0000-000000000001"
# Should return: 404 (no active trip)
```

## Status
✅ Fixed - Parent portal now shows clean "No Active Trips" message instead of stale GPS data
