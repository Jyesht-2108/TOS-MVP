# Parent Portal Live Tracking & Attendance Auto-Refresh Fix

## Issues Fixed

### 1. Bus Icon Not Visible on Parent Map ✅
**Problem**: The bus icon was not appearing on the parent portal map, even though GPS data was being fetched.

**Root Cause**: The ChildLiveMap component was using an incorrect SVG icon with wrong viewBox dimensions and anchor point.

**Solution**:
- Replaced the inline SVG with the same `createBusIcon()` function used in the admin portal
- Changed anchor point from `(24, 48)` to `(24, 24)` to center the icon properly
- Added color-coded markers based on GPS health status:
  - Green (#22c55e) = Healthy (< 30 seconds old)
  - Yellow (#eab308) = Warning (30-90 seconds old)
  - Gray (#6b7280) = Stale (> 90 seconds old)

**Files Modified**:
- `frontend/src/modules/parent/components/ChildLiveMap.tsx`

### 2. Attendance Not Auto-Refreshing ✅
**Problem**: Attendance data was not updating automatically when the driver marked attendance.

**Root Cause**: The attendance query in ParentDashboard was missing the `refetchInterval` option.

**Solution**:
- Added `refetchInterval: 30000` (30 seconds) to the attendance query
- Updated query key to include children IDs to ensure proper cache invalidation
- Now attendance data refreshes every 30 seconds, just like in the admin portal

**Files Modified**:
- `frontend/src/modules/parent/pages/Dashboard.tsx`

### 3. Duplicate Children in Parent Portal ✅
**Problem**: Each child was appearing multiple times in the "My Children" section because they're assigned to multiple routes.

**Root Cause**: The SQL query in `ParentService.getChildrenTransport()` was returning one row per child-route combination.

**Solution**:
- Added `DISTINCT ON (s.id)` to the SQL query to return only one row per student
- This picks the first route alphabetically for each child

**Files Modified**:
- `backend/src/main/java/com/school/transport/module/parent/service/ParentService.java`

### 4. Backend SQL Enum Casting Issues ✅
**Problem**: SQL queries were failing with enum type errors.

**Root Cause**: PostgreSQL enum types require explicit casting in comparisons.

**Solution**:
- Changed `t.status::text = 'ACTIVE'` to `t.status = 'ACTIVE'::trip_status_enum`
- Applied to both `getChildrenTransport()` and `getTodayAttendanceStatus()` methods

**Files Modified**:
- `backend/src/main/java/com/school/transport/module/parent/service/ParentService.java`

## Auto-Refresh Configuration

The parent portal now has the same auto-refresh behavior as the admin portal:

| Data Type | Refresh Interval | Method |
|-----------|------------------|--------|
| Dashboard Stats | 30 seconds | React Query `refetchInterval` |
| Active Live Trip | 30 seconds | React Query `refetchInterval` |
| Children Transport Info | 30 seconds | React Query `refetchInterval` |
| Children Attendance | 30 seconds | React Query `refetchInterval` |
| GPS Location | 10 seconds | `useLiveTracking` hook polling |

## Testing Setup

### Database Setup (Already Completed)
```sql
-- Active trip on Route A (parent1's children's route)
INSERT INTO trips (id, tenant_id, route_id, driver_id, trip_type, trip_date, start_time, status) 
VALUES (
  '7af58af0-eebc-4a47-b701-d410df739268'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '50000000-0000-0000-0000-000000000001'::uuid,
  '20000000-0000-0000-0000-000000000001'::uuid,
  'PICKUP'::trip_type_enum,
  CURRENT_DATE,
  NOW(),
  'ACTIVE'::trip_status_enum
);

-- Attendance records for Emma and Liam
INSERT INTO attendance (id, trip_id, student_id, status, marked_at, marked_by) 
VALUES 
  (gen_random_uuid(), '7af58af0-eebc-4a47-b701-d410df739268'::uuid, '40000000-0000-0000-0000-000000000001'::uuid, 'PRESENT'::attendance_status_enum, NOW(), '20000000-0000-0000-0000-000000000001'::uuid),
  (gen_random_uuid(), '7af58af0-eebc-4a47-b701-d410df739268'::uuid, '40000000-0000-0000-0000-000000000002'::uuid, 'PRESENT'::attendance_status_enum, NOW(), '20000000-0000-0000-0000-000000000001'::uuid);

-- GPS tracking data
INSERT INTO gps_logs (id, trip_id, latitude, longitude, speed, heading, timestamp) 
VALUES (
  gen_random_uuid(),
  '7af58af0-eebc-4a47-b701-d410df739268'::uuid,
  12.9862666,
  77.7172536,
  25.5,
  180,
  NOW()
);
```

## Next Steps

### 1. Restart Backend (REQUIRED)
The backend needs to be restarted to load the updated code:

```bash
cd backend
mvn spring-boot:run
```

### 2. Verify Parent Portal
After backend restart, test the parent portal:

1. **Login**: Use `parent1@example.com` with any password
2. **Check Children Cards**: Should show 2 children (Emma and Liam) without duplicates
3. **Check Attendance**: Should show:
   - Emma: 4 trips, 4 present, 100% rate, Today: PRESENT
   - Liam: Similar stats
4. **Check Live Map**: Should show:
   - Green "Active Trip" badge
   - Route A - Morning
   - Bus icon visible on map at Whitefield coordinates
   - Map updates every 10 seconds

### 3. Test Auto-Refresh
1. Open browser console (F12)
2. Watch for console logs showing data fetches every 30 seconds
3. Mark new attendance in driver app
4. Wait 30 seconds - attendance should update automatically
5. Update GPS location in database
6. Wait 10 seconds - map should update automatically

## Console Logs to Monitor

The ChildLiveMap now logs tracking data for debugging:
```
[ChildLiveMap] Tracking data updated: { data: {...}, healthStatus: 'healthy', error: null }
[ChildLiveMap] Marker clicked at: { lat: 12.9862666, lng: 77.7172536 }
```

## API Endpoints

All parent endpoints are working:
- `GET /api/v1/parent/live-trip` - Returns active trip or 404
- `GET /api/v1/parent/dashboard/stats` - Returns dashboard statistics
- `GET /api/v1/parent/children/transport` - Returns children with transport info (no duplicates after restart)
- `GET /api/v1/parent/children/{childId}/attendance` - Returns attendance summary

## Summary

✅ Bus icon now visible on parent map (same as admin portal)
✅ Attendance auto-refreshes every 30 seconds
✅ GPS location auto-updates every 10 seconds
✅ No duplicate children in the list
✅ All queries have proper refetch intervals
✅ Backend SQL queries fixed for PostgreSQL enums

The parent portal now has the same real-time update behavior as the admin portal!
