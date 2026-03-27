# Parent Live Tracking Implementation

## Overview
Implemented the Parent Live Tracking view as defined in the TOS MVP PRD. The implementation reuses the Google Maps integration and polling logic from the Admin dashboard, but restricts data to the authenticated parent's children.

## Implementation Details

### Frontend Changes

#### 1. Parent Service (`frontend/src/services/parent.service.ts`)
- Added `fetchActiveLiveTrip()` method
- Returns trip details if any child has an active trip, null otherwise
- Supports both mock and real backend modes

#### 2. Mock API (`frontend/src/lib/mockApi.ts`)
- Added `/parent/live-trip` endpoint
- Checks parent's children and their assigned routes
- Returns active trip data if found, 404 if no active trips

#### 3. Parent Dashboard (`frontend/src/modules/parent/pages/Dashboard.tsx`)
- Replaced old LiveMap component with new ChildLiveMap component
- Implemented two states:
  - **State 1 (No Active Trip)**: Shows EmptyState with message "No active trips right now. We will notify you when the bus starts."
  - **State 2 (Active Trip)**: Shows Google Maps with live tracking
- Removed redundant Transport Schedule section
- Simplified UI to focus on active trip tracking

#### 4. ChildLiveMap Component (`frontend/src/modules/parent/components/ChildLiveMap.tsx`)
- Already implemented with Google Maps API
- 10-second polling loop for live GPS updates
- Health status indicators (Live/Delayed/Offline)
- Shows last updated timestamp
- Displays current speed and trip type

### Backend Changes

#### 1. Parent Controller (`backend/src/main/java/com/school/transport/module/parent/controller/ParentController.java`)
- New REST controller for Parent Portal endpoints
- `GET /api/v1/parent/live-trip` endpoint
- Returns 404 if no active trip found

#### 2. Parent Service (`backend/src/main/java/com/school/transport/module/parent/service/ParentService.java`)
- `getActiveLiveTrip()` method
- Uses JdbcTemplate to query student_parents and route_students junction tables
- Finds active trips for parent's children
- Returns first active trip found

#### 3. Parent Live Trip Response DTO (`backend/src/main/java/com/school/transport/module/parent/dto/ParentLiveTripResponse.java`)
- Contains: tripId, routeId, routeName, vehicleNumber, driverName, childName, tripType

#### 4. Repository Updates
- **StudentRepository**: Added `findByParentUserId()` method (not used in final implementation)
- **TripRepository**: Added `findActiveByRouteId()` method

## Database Schema
The implementation uses the following junction tables:
- `student_parents`: Links students to parent users
- `route_students`: Links students to routes
- `trips`: Contains active trip information

## API Endpoints

### GET /api/v1/parent/live-trip
Returns active trip information for the authenticated parent's children.

**Response (200 OK)**:
```json
{
  "tripId": "uuid",
  "routeId": "uuid",
  "routeName": "North District Route",
  "vehicleNumber": "BUS-101",
  "driverName": "John Doe",
  "childName": "Emma Johnson",
  "tripType": "PICKUP"
}
```

**Response (404 Not Found)**:
No active trips for parent's children.

## Features

### Parent Dashboard
1. **Dashboard Stats**: Shows number of children, active routes, and upcoming trips
2. **My Children Section**: Displays children with attendance summaries
3. **Live Bus Tracking**: 
   - Shows active trip banner with trip details
   - Google Maps with live marker updates every 10 seconds
   - Health status indicators
   - Current speed and trip type display
4. **Information Notice**: Explains how live tracking works

### Polling Logic
- Parent dashboard checks for active trips every 30 seconds
- Once an active trip is found, ChildLiveMap polls GPS location every 10 seconds
- GPS health status: Healthy (<30s), Warning (30-90s), Stale (>90s)
- Parents see simplified UI without admin-level health badges

## Testing

### Mock Data Testing
1. Set `VITE_USE_MOCK=true` in `frontend/.env`
2. Login as parent user
3. Mock data will show active trips if configured in `mockData.ts`

### Real Backend Testing
1. Set `VITE_USE_MOCK=false` in `frontend/.env`
2. Ensure backend is running on port 8080
3. Ensure CORS allows `http://localhost:3001`
4. Login as parent user
5. Start a trip from driver app
6. Parent dashboard should show live tracking

## CORS Configuration
Updated `backend/src/main/resources/application-dev.yml` to allow `http://localhost:3001`:
```yaml
cors:
  allowed-origins: http://localhost:3000,http://localhost:3001,http://localhost:5173,http://10.0.2.2:8080,http://localhost:8080
```

## Next Steps
1. Add Google Maps API key to `frontend/.env`
2. Test with real backend and active trips
3. Verify marker updates and polling behavior
4. Test with multiple children on different routes
5. Test empty state when no trips are active

## Files Modified

### Frontend
- `frontend/src/services/parent.service.ts`
- `frontend/src/lib/mockApi.ts`
- `frontend/src/modules/parent/pages/Dashboard.tsx`
- `frontend/src/modules/parent/components/ChildLiveMap.tsx` (already existed)

### Backend
- `backend/src/main/java/com/school/transport/module/parent/controller/ParentController.java` (new)
- `backend/src/main/java/com/school/transport/module/parent/service/ParentService.java` (new)
- `backend/src/main/java/com/school/transport/module/parent/dto/ParentLiveTripResponse.java` (new)
- `backend/src/main/java/com/school/transport/module/students/repository/StudentRepository.java`
- `backend/src/main/java/com/school/transport/module/trips/repository/TripRepository.java`
- `backend/src/main/resources/application-dev.yml`

## Notes
- Parent UI is intentionally simpler than Admin UI (no stale/warning badges)
- Only shows "Last Updated" timestamp for parents
- Automatically checks for new trips every 30 seconds
- GPS polling happens every 10 seconds when trip is active
- Uses Google Maps API (requires valid API key)
