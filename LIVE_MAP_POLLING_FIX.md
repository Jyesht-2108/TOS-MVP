# Live Map Polling Fix - Admin Live Monitoring

## Issue
The live GPS tracking map on the Admin Live Monitoring page was not updating with real-time GPS data from active trips, even though the backend was successfully receiving and storing GPS coordinates from the driver's phone.

## Root Cause
The `MultiRouteLiveMap` component had polling implemented but with missing React dependencies in the `useEffect` hooks. This caused:
1. The `fetchAllTracking` function was not wrapped in `useCallback`, causing unnecessary re-renders
2. The `useEffect` hooks didn't include `fetchAllTracking` in their dependency arrays
3. React hooks weren't properly imported (`useCallback`, `useMemo`)

## Changes Made

### File: `frontend/src/modules/admin/components/MultiRouteLiveMap.tsx`

#### 1. Added Missing React Hooks
```typescript
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
```

#### 2. Wrapped fetchAllTracking in useCallback
```typescript
const fetchAllTracking = useCallback(async () => {
  if (!routes || routes.length === 0) return;

  const newTrackingData = new Map<string, RouteTrackingData>();

  await Promise.all(
    routes.map(async (route) => {
      try {
        const data = await trackingService.fetchLiveTracking(route.routeId);
        const healthStatus = calculateHealthStatus(data.updated_at);
        newTrackingData.set(route.routeId, { data, healthStatus });
      } catch (error) {
        console.error(`Failed to fetch tracking for route ${route.routeId}:`, error);
      }
    })
  );

  if (isMountedRef.current) {
    setTrackingData(newTrackingData);
  }
}, [routes]);
```

#### 3. Fixed useEffect Dependencies
```typescript
// Initial fetch
useEffect(() => {
  if (routes && routes.length > 0) {
    fetchAllTracking();
  }
}, [routes, fetchAllTracking]);

// Set up polling interval
useEffect(() => {
  if (!routes || routes.length === 0) return;

  intervalRef.current = setInterval(() => {
    fetchAllTracking();
  }, 10000); // Poll every 10 seconds

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [routes, fetchAllTracking]);
```

#### 4. Fixed useMemo Usage
```typescript
const healthStats = useMemo(() => {
  let healthy = 0;
  let warning = 0;
  let stale = 0;

  trackingData.forEach((tracking) => {
    if (tracking.healthStatus === 'healthy') healthy++;
    else if (tracking.healthStatus === 'warning') warning++;
    else stale++;
  });

  return { healthy, warning, stale };
}, [trackingData]);
```

## How It Works Now

### 1. Initial Load
- When the Live Monitoring page loads, it fetches active trips
- The `MultiRouteLiveMap` component receives the list of routes
- It immediately fetches GPS data for all routes

### 2. Polling (Every 10 Seconds)
- A `setInterval` runs every 10 seconds
- Fetches fresh GPS coordinates for all active routes
- Updates markers on the map with new positions
- Recalculates health status based on timestamp freshness

### 3. Health Status Indicators
- **Healthy** (Green): GPS data is less than 30 seconds old
- **Warning** (Yellow): GPS data is 30-90 seconds old
- **Stale** (Red): GPS data is more than 90 seconds old

### 4. Map Updates
- Markers are color-coded based on health status
- Marker positions update smoothly without recreating the map
- Map auto-fits to show all active buses
- Popups show detailed route information

## Data Flow

```
Driver Phone (GPS) 
    ↓
Backend API (POST /api/v1/tracking/update)
    ↓
PostgreSQL (latest_bus_location table)
    ↓
Backend API (GET /api/v1/tracking/live?route_id=...)
    ↓
Frontend (MultiRouteLiveMap component)
    ↓
Leaflet Map (Visual markers)
```

## Testing

### 1. Start a Trip on Driver Phone
```bash
# The driver app sends GPS updates to:
POST http://localhost:8082/api/v1/tracking/update
```

### 2. Verify Backend Receives Data
```bash
curl -s "http://localhost:8080/api/v1/tracking/live?route_id=50000000-0000-0000-0000-000000000001" | jq '.'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "lat": 12.9862666,
    "lng": 77.7172536,
    "updated_at": "2026-03-26T15:03:14.325961",
    "trip_id": "11c78621-f566-40a4-90fd-b7507c1ecd9b",
    "trip_type": "PICKUP",
    "speed": 0.0,
    "heading": 0.0
  }
}
```

### 3. Check Admin Live Monitoring
1. Navigate to Admin Dashboard → Live Monitoring
2. Verify the "Live Map Overview" section appears
3. Check that bus markers appear on the map
4. Verify markers are color-coded (green/yellow/red)
5. Wait 10 seconds and verify markers update position

### 4. Verify Polling in Browser
1. Open DevTools → Network tab
2. Filter by `/tracking/live`
3. Verify requests fire every 10 seconds
4. Check each request returns fresh GPS data

### 5. Test Health Status
1. **Healthy**: GPS data < 30s old → Green marker
2. **Warning**: Stop driver app, wait 30s → Yellow marker
3. **Stale**: Wait 90s → Red marker

## Backend API

### Endpoint
```
GET /api/v1/tracking/live?route_id={routeId}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "lat": 12.9862666,
    "lng": 77.7172536,
    "updated_at": "2026-03-26T15:03:14.325961",
    "trip_id": "11c78621-f566-40a4-90fd-b7507c1ecd9b",
    "trip_type": "PICKUP",
    "speed": 0.0,
    "heading": 0.0
  }
}
```

### Database Table
```sql
-- latest_bus_location table stores the most recent GPS coordinates
SELECT * FROM latest_bus_location WHERE route_id = '50000000-0000-0000-0000-000000000001';
```

## Features

### Live Map Overview
- Shows all active buses on a single map
- Color-coded markers based on GPS health
- Auto-fits map bounds to show all buses
- Displays vehicle number on marker label

### Health Statistics Bar
- Shows count of healthy/warning/stale buses
- Updates in real-time as GPS data ages
- Displays "Tracking X of Y routes"

### Marker Popups
- Route name
- Driver name
- Vehicle number
- Current speed
- Trip type (PICKUP/DROP)
- Last updated timestamp

### Active Trips Table
- Lists all active trips
- Shows GPS health status badge
- Displays attendance stats
- "View" button to see trip details

## Performance

- **Polling Interval**: 10 seconds (configurable)
- **Concurrent Requests**: Fetches all routes in parallel using `Promise.all`
- **Memory Management**: Proper cleanup on unmount
- **Error Handling**: Failed requests don't break the UI

## Troubleshooting

### Map Not Showing Buses
1. Check if trips are active: `curl http://localhost:8080/api/v1/admin/trips/active`
2. Verify GPS data exists: `curl http://localhost:8080/api/v1/tracking/live?route_id=...`
3. Check browser console for errors
4. Verify backend is running on port 8080

### Markers Not Updating
1. Open DevTools → Network tab
2. Verify `/tracking/live` requests fire every 10 seconds
3. Check if responses contain different coordinates
4. Ensure `updated_at` timestamp is recent

### Health Status Always Stale
1. Check system time synchronization
2. Verify driver app is sending GPS updates
3. Check backend logs for GPS update errors
4. Ensure `updated_at` timestamp format is correct

### Polling Stopped
1. Check if component is still mounted
2. Verify no JavaScript errors in console
3. Check if `routes` prop is empty
4. Ensure cleanup functions are working

## Files Modified

- `frontend/src/modules/admin/components/MultiRouteLiveMap.tsx` - Fixed polling dependencies

## Related Components

- `frontend/src/modules/admin/pages/LiveMonitoring.tsx` - Uses MultiRouteLiveMap
- `frontend/src/modules/admin/components/TripLiveMap.tsx` - Single route map
- `frontend/src/hooks/useLiveTracking.ts` - Polling hook for single route
- `frontend/src/services/tracking.service.ts` - API service
- `backend/src/main/java/com/school/transport/module/tracking/controller/TrackingController.java` - Backend API

## Result

✅ Live map now updates every 10 seconds with fresh GPS data
✅ Markers move smoothly as buses travel
✅ Health status indicators work correctly
✅ Multiple buses displayed simultaneously
✅ Proper cleanup prevents memory leaks
✅ Error handling ensures UI stability

The Admin Live Monitoring page now provides real-time GPS tracking for all active buses with automatic updates and health monitoring.
