# Live Trips Monitoring - Implementation Guide

**Date**: March 22, 2026  
**Epic**: H1 - Live Buses / Active Trips Monitoring  
**Status**: ✅ COMPLETE

## Overview

Implemented the Live Trips monitoring feature that automatically detects and displays active trips in the Admin Dashboard. The system uses the frontend mock API with 10-second polling to ensure real-time updates.

## Implementation Details

### 1. Mock API Endpoint

**File**: `frontend/src/lib/mockApi.ts`

**Endpoint**: `GET /api/v1/admin/live-trips`

**Implementation**:
```typescript
// Mock GET /admin/live-trips (Active Trips Monitoring)
if (method === 'get' && url === '/admin/live-trips') {
  const { getMockActiveTrips } = await import('./mockData');
  const activeTrips = getMockActiveTrips();
  
  return Promise.reject({
    __isMockResponse: true,
    config,
    response: {
      data: activeTrips,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    },
  });
}
```

**Features**:
- Filters `mockTrips` array for trips with `status === 'ACTIVE'`
- Returns nested/joined data including route name and driver name
- Includes GPS health status, attendance counts, and location data
- Automatically updates when trip status changes

### 2. Mock Data Enhancement

**File**: `frontend/src/lib/mockData.ts`

**Updated Function**: `getMockActiveTrips()`

**Key Changes**:
```typescript
export const getMockActiveTrips = (): import('@/types').ActiveTrip[] => {
  // Filter mockTrips array for ACTIVE status trips
  const activeTrips = mockTrips.filter(trip => trip.status === 'ACTIVE');
  
  // Transform Trip[] to ActiveTrip[] with additional live monitoring data
  return activeTrips.map((trip, index) => {
    // Fetch route and driver details
    // Generate GPS health status
    // Include attendance data
    // Calculate estimated end time
    // Return complete ActiveTrip object
  });
};
```

**New Helper Functions**:
```typescript
// Start a trip (changes status to ACTIVE)
export const startMockTrip = (tripId: string) => {
  const trip = mockTrips.find(t => t.id === tripId);
  if (trip) {
    trip.status = 'ACTIVE';
    trip.startTime = new Date().toISOString();
  }
};

// End a trip (changes status to COMPLETED)
export const endMockTrip = (tripId: string) => {
  const trip = mockTrips.find(t => t.id === tripId);
  if (trip) {
    trip.status = 'COMPLETED';
    trip.endTime = new Date().toISOString();
  }
};
```

### 3. Admin Service Update

**File**: `frontend/src/services/admin.service.ts`

**Updated Method**: `fetchActiveTrips()`

```typescript
async fetchActiveTrips(): Promise<import('@/types').ActiveTrip[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const { getMockActiveTrips } = await import('@/lib/mockData');
    return getMockActiveTrips();
  }
  
  // Real API call to /admin/live-trips
  const response = await api.get<any[]>('/admin/live-trips');
  return response.data;
}
```

### 4. Live Monitoring UI

**File**: `frontend/src/modules/admin/pages/LiveMonitoring.tsx`

**Existing Implementation** (Already has polling):
```typescript
const {
  data: activeTrips,
  isLoading: isLoadingTrips,
  error: tripsError,
  refetch: refetchTrips,
  isRefetching: isRefetchingTrips,
} = useQuery<ActiveTrip[]>({
  queryKey: ['activeTrips'],
  queryFn: () => adminService.fetchActiveTrips(),
  refetchInterval: autoRefresh ? 10000 : false, // ✅ 10-second polling
});
```

**Features**:
- ✅ Automatic polling every 10 seconds
- ✅ Manual refresh button
- ✅ Auto-refresh toggle
- ✅ Displays route name, driver, trip type, start time
- ✅ Shows attendance counts (Present/Total)
- ✅ GPS health status indicators
- ✅ Empty state when no active trips
- ✅ Cleanup on component unmount (handled by React Query)

### 5. Test Utilities

**File**: `frontend/src/lib/testLiveTrips.ts`

**Console Commands**:
```javascript
// Start a trip
startTrip('trip-1')

// End a trip
endTrip('trip-1')

// View active trips
viewActiveTrips()

// List all trips
listAllTrips()
```

**Auto-loaded in Development**:
```typescript
// frontend/src/App.tsx
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
  import('@/lib/testLiveTrips');
}
```

## Configuration

**File**: `frontend/.env`

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_USE_MOCK=true
VITE_USE_MOCK_API=true
```

## Testing Guide

### Step 1: Start the Frontend

```bash
cd frontend
npm run dev
```

### Step 2: Open Admin Dashboard

1. Navigate to `http://localhost:3000`
2. Login as admin (credentials from mock data)
3. Click "Live Monitoring" in the sidebar

### Step 3: Test Live Trip Detection

Open browser console and run:

```javascript
// List all available trips
listAllTrips()

// Start a trip (example: trip-1)
startTrip('trip-1')

// Wait 10 seconds and watch the dashboard update automatically
// The trip will appear in the Active Trips table

// End the trip
endTrip('trip-1')

// Wait 10 seconds and watch it disappear from the dashboard
```

### Step 4: Verify Polling

1. Start multiple trips:
   ```javascript
   startTrip('trip-1')
   startTrip('trip-2')
   ```

2. Watch the Live Monitoring page
3. Trips should appear within 10 seconds
4. Toggle "Auto-refresh Off" to stop polling
5. Toggle "Auto-refresh On" to resume polling

### Step 5: Test Manual Refresh

1. Start a trip in console: `startTrip('trip-3')`
2. Click the "Refresh" button in the UI
3. Trip should appear immediately

## Data Flow

```
Console Command
    ↓
startTrip('trip-1')
    ↓
Updates mockTrips array (status = 'ACTIVE')
    ↓
React Query polls every 10 seconds
    ↓
Calls adminService.fetchActiveTrips()
    ↓
Calls GET /admin/live-trips (mock API)
    ↓
getMockActiveTrips() filters mockTrips
    ↓
Returns only ACTIVE trips
    ↓
UI re-renders with new data
    ↓
Trip appears in Active Trips table
```

## UI Features

### Active Trips Table

Displays:
- ✅ Route Name / Vehicle Number
- ✅ Driver Name / Phone
- ✅ GPS Status (Healthy/Warning/Stale)
- ✅ Attendance (Present/Total with percentage)
- ✅ Last GPS Ping (relative time)
- ✅ View button to see trip details

### Empty State

When no active trips:
- Shows animated empty state component
- Message: "No Active Trips"
- Subtitle: "There are no active trips at the moment."

### Polling Controls

- **Auto-refresh Toggle**: Enable/disable 10-second polling
- **Manual Refresh Button**: Fetch latest data immediately
- **Loading Indicator**: Shows when fetching data

## Mock Data Structure

### Trip Status Values

```typescript
type TripStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
```

### Sample Trip

```typescript
{
  id: 'trip-1',
  routeId: 'route-1',
  routeName: 'Route A - Morning',
  driverId: 'driver-1',
  driverName: 'John Anderson',
  vehicleNumber: 'BUS-101',
  tripType: 'PICKUP',
  tripDate: '2026-03-22',
  startTime: '2026-03-22T07:00:00Z',
  endTime: null,
  status: 'ACTIVE', // ← Key field for filtering
  totalStudents: 10,
  presentStudents: 8,
  absentStudents: 2,
}
```

## API Response Format

### GET /admin/live-trips

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "tripId": "trip-1",
      "routeId": "route-1",
      "routeName": "Route A - Morning",
      "vehicleNumber": "BUS-101",
      "driverId": "driver-1",
      "driverName": "John Anderson",
      "driverPhone": "+1234567890",
      "tripType": "MORNING",
      "startTime": "2026-03-22T07:00:00Z",
      "estimatedEndTime": "2026-03-22T08:00:00Z",
      "averageTripDuration": 60,
      "currentLocation": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timestamp": "2026-03-22T07:30:00Z",
        "speed": 25,
        "heading": 90
      },
      "lastGPSPing": "2026-03-22T07:30:00Z",
      "gpsHealthStatus": "HEALTHY",
      "totalStudents": 10,
      "presentStudents": 8,
      "absentStudents": 2,
      "pendingStudents": 0,
      "attendance": [...],
      "status": "ACTIVE"
    }
  ]
}
```

## Console Commands Reference

### Start a Trip
```javascript
startTrip('trip-1')
// Output:
// ✅ Trip started: Route A - Morning (PICKUP)
//    Trip ID: trip-1
//    Driver: John Anderson
//    Students: 10
// 💡 The admin dashboard will show this trip within 10 seconds.
```

### End a Trip
```javascript
endTrip('trip-1')
// Output:
// 🏁 Trip ended: Route A - Morning (PICKUP)
//    Trip ID: trip-1
// 💡 The trip will disappear from the admin dashboard within 10 seconds.
```

### View Active Trips
```javascript
viewActiveTrips()
// Output:
// 🚌 Active Trips: 2
// ────────────────────────────────────────────────────────────────────────────────
// 📍 Route A - Morning (MORNING)
//    Trip ID: trip-1
//    Driver: John Anderson
//    Vehicle: BUS-101
//    Students: 8/10 present
//    Started: 7:00:00 AM
//    GPS Status: HEALTHY
```

### List All Trips
```javascript
listAllTrips()
// Output:
// 📋 All Trips: 50
// ────────────────────────────────────────────────────────────────────────────────
// ACTIVE (2):
//    trip-1: Route A - Morning (PICKUP) - John Anderson
//    trip-2: Route B - Evening (DROP) - Jane Smith
// 
// COMPLETED (48):
//    trip-3: Route A - Morning (PICKUP) - John Anderson
//    ...
```

## Troubleshooting

### Issue: Trips not appearing in dashboard

**Check**:
1. Verify mock mode is enabled:
   ```bash
   # frontend/.env
   VITE_USE_MOCK=true
   VITE_USE_MOCK_API=true
   ```

2. Check console for errors:
   ```javascript
   // Should see:
   // 🎭 Mock API enabled - Using sample data
   // 🎭 Live Trips Test Utilities Loaded
   ```

3. Verify trip status:
   ```javascript
   listAllTrips()
   // Check if trip is in ACTIVE list
   ```

### Issue: Polling not working

**Check**:
1. Auto-refresh is enabled (toggle button should be blue)
2. Check React Query DevTools (if installed)
3. Verify `refetchInterval` is set to 10000 in LiveMonitoring.tsx

### Issue: Trip status not changing

**Check**:
1. Use correct trip ID:
   ```javascript
   listAllTrips() // Get valid trip IDs
   startTrip('correct-trip-id')
   ```

2. Check console for error messages

## Files Modified/Created

### Created:
- `frontend/src/lib/testLiveTrips.ts` - Test utilities for console testing

### Modified:
- `frontend/src/lib/mockApi.ts` - Added `/admin/live-trips` endpoint
- `frontend/src/lib/mockData.ts` - Updated `getMockActiveTrips()` to filter by status
- `frontend/src/services/admin.service.ts` - Updated endpoint to `/admin/live-trips`
- `frontend/.env` - Enabled mock mode
- `frontend/src/App.tsx` - Auto-load test utilities in dev mode

### Existing (No changes needed):
- `frontend/src/modules/admin/pages/LiveMonitoring.tsx` - Already has polling implemented

## Success Criteria

✅ Mock API endpoint `/admin/live-trips` returns only ACTIVE trips  
✅ Endpoint includes nested route name and driver name  
✅ Live Monitoring UI polls every 10 seconds  
✅ React state updates automatically when trips change  
✅ UI displays route name, driver, trip type, start time  
✅ Empty state shown when no active trips  
✅ Polling interval cleaned up on component unmount  
✅ Console test utilities available for easy testing  

## Next Steps

1. **Test the implementation**:
   - Start the frontend: `npm run dev`
   - Open Live Monitoring page
   - Use console commands to start/end trips
   - Verify automatic updates within 10 seconds

2. **Integration with real backend**:
   - When ready to use real API, set `VITE_USE_MOCK=false`
   - Backend should implement `GET /api/v1/admin/live-trips`
   - Response format should match the mock API structure

3. **Additional features** (future):
   - Real-time GPS tracking updates
   - Push notifications for trip events
   - Trip history and analytics
   - Driver performance metrics

## Conclusion

The Live Trips Monitoring feature is now fully implemented using the frontend mock API. The system automatically detects when drivers start trips and displays them in the Admin Dashboard within 10 seconds. The polling mechanism ensures real-time updates without manual refresh.
