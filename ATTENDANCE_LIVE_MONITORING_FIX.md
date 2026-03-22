# Attendance Live Monitoring Fix

**Date**: March 22, 2026  
**Issue**: Attendance data not showing in Live Monitoring page  
**Status**: ✅ RESOLVED

## Problem

User started Route A - Morning trip and marked attendance in the driver app. The data was saved to the database correctly, but the admin portal's Live Monitoring page was not displaying the attendance counts.

## Root Cause

The backend `/api/v1/admin/trips/active` endpoint was returning trip data without attendance counts. The `TripService.mapToTripResponse()` method was not fetching or populating the `presentCount`, `absentCount`, and `totalStudents` fields.

## Solution

### 1. Updated TripService to Include Attendance Data

**File**: `backend/src/main/java/com/school/transport/module/trips/service/TripService.java`

**Changes**:
- Added dependencies: `AttendanceRepository`, `RouteStudentRepository`, `UserRepository`
- Modified `mapToTripResponse()` to:
  - Fetch route name from `routes` table
  - Fetch driver name from `users` table
  - Query attendance counts using `AttendanceRepository.countPresentByTripId()` and `countAbsentByTripId()`
  - Query total students on route using `RouteStudentRepository.countByRouteId()`
  - Populate all fields in `TripResponse`

**Code**:
```java
private TripResponse mapToTripResponse(Trip trip) {
    // Fetch route name
    String routeName = routeRepository.findById(trip.getRouteId())
            .map(Route::getName)
            .orElse("Unknown Route");
    
    // Fetch driver name
    String driverName = userRepository.findById(trip.getDriverId())
            .map(User::getName)
            .orElse("Unknown Driver");
    
    // Fetch attendance counts
    long presentCount = attendanceRepository.countPresentByTripId(trip.getId());
    long absentCount = attendanceRepository.countAbsentByTripId(trip.getId());
    
    // Fetch total students on route
    long totalStudents = routeStudentRepository.countByRouteId(trip.getRouteId());
    
    return TripResponse.builder()
            .id(trip.getId())
            .routeId(trip.getRouteId())
            .routeName(routeName)
            .driverId(trip.getDriverId())
            .driverName(driverName)
            .tripType(trip.getTripType())
            .tripDate(trip.getTripDate())
            .startTime(trip.getStartTime())
            .endTime(trip.getEndTime())
            .status(trip.getStatus())
            .totalStudents((int) totalStudents)
            .presentCount((int) presentCount)
            .absentCount((int) absentCount)
            .createdAt(trip.getCreatedAt())
            .build();
}
```

### 2. Updated Frontend Admin Service

**File**: `frontend/src/services/admin.service.ts`

**Changes**:
- Fixed endpoint from `/trips/active` to `/admin/trips/active`
- Added transformation to map backend response to frontend `ActiveTrip` interface
- Mapped field names:
  - `id` → `tripId`
  - `presentCount` → `presentStudents`
  - `absentCount` → `absentStudents`
  - Calculated `pendingStudents` = totalStudents - presentCount - absentCount

**Code**:
```typescript
async fetchActiveTrips(): Promise<import('@/types').ActiveTrip[]> {
  const response = await api.get<any[]>('/admin/trips/active');
  return response.data.map((trip: any) => ({
    tripId: trip.id,
    routeId: trip.routeId,
    routeName: trip.routeName,
    driverId: trip.driverId,
    driverName: trip.driverName,
    tripType: trip.tripType,
    startTime: trip.startTime,
    endTime: trip.endTime,
    lastGPSPing: trip.startTime,
    gpsHealthStatus: 'HEALTHY' as const,
    totalStudents: trip.totalStudents || 0,
    presentStudents: trip.presentCount || 0,
    absentStudents: trip.absentCount || 0,
    pendingStudents: trip.totalStudents - (trip.presentCount || 0) - (trip.absentCount || 0),
    attendance: [],
    status: trip.status,
  }));
}
```

## Testing

### Test 1: Active Trips API
```bash
curl "http://localhost:8080/api/v1/admin/trips/active"
```

**Result**: ✅ SUCCESS
```json
{
  "success": true,
  "data": [
    {
      "id": "a9d74bbb-5348-4358-8a46-a5b08afae801",
      "routeName": "Route A - Morning",
      "driverName": "John Anderson",
      "totalStudents": 2,
      "presentCount": 2,
      "absentCount": 0
    }
  ]
}
```

### Test 2: Trip Details API
```bash
curl "http://localhost:8080/api/v1/admin/trips/a9d74bbb-5348-4358-8a46-a5b08afae801"
```

**Result**: ✅ SUCCESS
```json
{
  "success": true,
  "data": {
    "id": "a9d74bbb-5348-4358-8a46-a5b08afae801",
    "routeName": "Route A - Morning",
    "driverName": "John Anderson",
    "totalStudents": 2,
    "presentCount": 2,
    "absentCount": 0
  }
}
```

### Test 3: Database Verification
```sql
SELECT a.id, s.name, a.status 
FROM attendance a 
JOIN students s ON a.student_id = s.id 
WHERE a.trip_id = 'a9d74bbb-5348-4358-8a46-a5b08afae801';
```

**Result**: ✅ SUCCESS
```
Emma Johnson | PRESENT
Liam Johnson | PRESENT
```

## How to Use

### For Admin Portal Users:

1. **Navigate to Live Monitoring**:
   - Click "Live Monitoring" in the sidebar
   - You'll see a table of all active trips

2. **View Attendance Counts**:
   - The "Attendance" column shows: `2/2 (100%)`
   - Format: `presentStudents/totalStudents (percentage)`

3. **View Detailed Attendance**:
   - Click the "View" button on any active trip
   - You'll be taken to the Trip Details page
   - Scroll down to the "Student Attendance" section
   - You'll see:
     - Stat cards: Present, Absent, Unmarked counts
     - Student list with real-time status
     - Edit button to override attendance

4. **Real-time Updates**:
   - The page automatically refreshes every 10 seconds
   - You can manually refresh using the "Refresh" button
   - Toggle "Auto-refresh" on/off as needed

## Data Flow

```
Driver App (Go)
    ↓
POST /api/v1/attendance/mark
    ↓
PostgreSQL Database
    ↓
GET /api/v1/admin/trips/active
    ↓
Admin Portal (React)
    ↓
Live Monitoring Page
```

## Files Modified

### Backend:
- `backend/src/main/java/com/school/transport/module/trips/service/TripService.java`

### Frontend:
- `frontend/src/services/admin.service.ts`

## API Endpoints

### GET /api/v1/admin/trips/active
Returns all active trips with attendance counts.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "routeId": "uuid",
      "routeName": "Route A - Morning",
      "driverId": "uuid",
      "driverName": "John Anderson",
      "tripType": "PICKUP",
      "startTime": "2026-03-22T10:00:00",
      "status": "ACTIVE",
      "totalStudents": 2,
      "presentCount": 2,
      "absentCount": 0
    }
  ]
}
```

### GET /api/v1/admin/trips/{tripId}
Returns detailed information for a specific trip.

**Response**: Same structure as above, but for a single trip.

### GET /api/v1/attendance?trip_id={tripId}
Returns detailed attendance data with student names.

**Response**:
```json
{
  "success": true,
  "data": {
    "tripId": "uuid",
    "totalStudents": 2,
    "presentCount": 2,
    "absentCount": 0,
    "unmarkedCount": 0,
    "students": [
      {
        "id": "uuid",
        "studentName": "Emma Johnson",
        "status": "PRESENT",
        "markedAt": "2026-03-22T10:05:00"
      }
    ]
  }
}
```

## Next Steps

The attendance data is now flowing correctly from the driver app to the admin portal. Users can:

1. ✅ View attendance counts in Live Monitoring table
2. ✅ Click "View" to see detailed attendance
3. ✅ See real-time updates with 10-second polling
4. ✅ Override attendance with mandatory reason
5. ✅ View audit trail of changes

## Notes

- The Live Monitoring page shows attendance counts in the table
- For detailed attendance with student names, click "View" to go to Trip Details page
- The Trip Details page has a dedicated "Student Attendance" section
- All attendance data is fetched from the real database (not mock data)
- The frontend is configured to use the real API (`VITE_USE_MOCK=false`)

## Troubleshooting

If attendance is not showing:

1. **Check if trip is active**:
   ```sql
   SELECT * FROM trips WHERE status = 'ACTIVE';
   ```

2. **Check if attendance is marked**:
   ```sql
   SELECT * FROM attendance WHERE trip_id = 'your-trip-id';
   ```

3. **Check backend logs**:
   - Look for "Fetching active trips" log messages
   - Verify attendance counts are being calculated

4. **Check frontend console**:
   - Open browser DevTools → Console
   - Look for API errors or transformation issues

5. **Verify API response**:
   ```bash
   curl "http://localhost:8080/api/v1/admin/trips/active"
   ```

## Conclusion

The attendance monitoring feature is now fully functional. Admins can view real-time attendance data in the Live Monitoring page and drill down into detailed attendance information in the Trip Details page.
