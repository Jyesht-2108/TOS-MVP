# Live GPS Tracking Implementation

## Overview
Implemented real-time GPS tracking with 10-second polling for both Admin Dashboard and Parent Portal as per TOS MVP PRD requirements.

## Features Implemented

### 1. Real-Time Polling (10 seconds)
- ✅ Automatic polling every 10 seconds using React hooks
- ✅ Proper cleanup on component unmount to prevent memory leaks
- ✅ Smooth marker updates on the map without page refresh

### 2. Health Status Detection
Implemented strict health indicator logic based on GPS data freshness:
- **Healthy** (<30s delay): Green badge with checkmark
- **Warning** (30-90s delay): Yellow badge with clock icon
- **Stale** (>90s delay): Red/gray badge with alert icon

### 3. Dynamic UI Updates
- ✅ Live marker position updates on Leaflet map
- ✅ Custom bus icon with vehicle number label
- ✅ Real-time speed and trip type display
- ✅ "Last Updated" timestamp with relative time (e.g., "2 minutes ago")
- ✅ Popup with detailed route information

## Architecture

### Frontend Components

#### 1. Admin Dashboard - TripLiveMap Component
**Location**: `frontend/src/modules/admin/components/TripLiveMap.tsx`

**Features**:
- Full GPS tracking with health status
- Speed, coordinates, and trip type display
- Custom bus marker with vehicle number
- Detailed status bar with health indicators
- Error handling and retry logic

**Usage**:
```tsx
<TripLiveMap
  routeId={trip.routeId}
  routeName={trip.routeName}
  vehicleNumber={trip.vehicleNumber}
  driverName={trip.driverName}
  height="500px"
/>
```

#### 2. Parent Portal - ChildLiveMap Component
**Location**: `frontend/src/modules/parent/components/ChildLiveMap.tsx`

**Features**:
- Simplified UI for parents
- Child name display in popup
- Live/Delayed/Offline status badges
- Friendly error messages
- Speed and trip type display

**Usage**:
```tsx
<ChildLiveMap
  routeId={child.routeId}
  routeName={child.routeName}
  vehicleNumber={child.vehicleNumber}
  driverName={child.driverName}
  childName={child.name}
  height="450px"
/>
```

#### 3. useLiveTracking Hook
**Location**: `frontend/src/hooks/useLiveTracking.ts`

**Responsibilities**:
- Manages polling interval (default 10 seconds)
- Fetches GPS data from backend
- Calculates health status based on timestamp
- Handles loading and error states
- Automatic cleanup on unmount

**Health Status Logic**:
```typescript
const calculateHealthStatus = (updatedAt: string): HealthStatus => {
  const now = new Date().getTime();
  const updateTime = new Date(updatedAt).getTime();
  const delayInSeconds = (now - updateTime) / 1000;

  if (delayInSeconds < 30) return 'healthy';
  else if (delayInSeconds < 90) return 'warning';
  else return 'stale';
};
```

**Features**:
- Configurable polling interval
- Enable/disable polling
- Automatic health status updates every 5 seconds
- Memory leak prevention with cleanup

#### 4. Tracking Service
**Location**: `frontend/src/services/tracking.service.ts`

**API Integration**:
```typescript
async fetchLiveTracking(routeId: string): Promise<LiveTrackingResponse> {
  const response = await api.get<{ success: boolean; data: LiveTrackingResponse }>(
    '/tracking/live',
    { params: { route_id: routeId } }
  );
  return response.data.data;
}
```

**Response Structure**:
```typescript
interface LiveTrackingResponse {
  lat: number;
  lng: number;
  updated_at: string;
  trip_id: string;
  trip_type: 'MORNING' | 'EVENING';
  speed?: number;
  heading?: number;
}
```

### Backend API

#### Endpoint
```
GET /api/v1/tracking/live?route_id={routeId}
```

**Controller**: `backend/src/main/java/com/school/transport/module/tracking/controller/TrackingController.java`

**Response Format**:
```json
{
  "success": true,
  "data": {
    "lat": 12.9716,
    "lng": 77.5946,
    "updated_at": "2026-03-26T09:15:30.123456",
    "trip_id": "633baaf8-dfe3-4bd0-bf1f-35914055844b",
    "trip_type": "MORNING",
    "speed": 35,
    "heading": 180
  }
}
```

## Implementation Details

### Polling Mechanism

The polling is implemented using React's `useEffect` with `setInterval`:

```typescript
useEffect(() => {
  if (!routeId || !enabled) return;

  // Initial fetch
  fetchTracking();

  // Set up polling
  const interval = setInterval(() => {
    fetchTracking();
  }, pollingInterval);

  // Cleanup on unmount
  return () => {
    clearInterval(interval);
  };
}, [routeId, enabled, pollingInterval]);
```

### Marker Updates

Markers are updated smoothly without recreating the map:

```typescript
useEffect(() => {
  if (!mapRef.current || !data) return;

  const position: L.LatLngExpression = [data.lat, data.lng];

  if (markerRef.current) {
    // Update existing marker position
    markerRef.current.setLatLng(position);
  } else {
    // Create new marker
    markerRef.current = L.marker(position, { icon: busIcon }).addTo(map);
  }

  // Center map on marker
  map.setView(position, 14);
}, [data]);
```

### Health Status Updates

Health status is recalculated every 5 seconds even without new data:

```typescript
useEffect(() => {
  if (!state.data) return;

  const healthCheckInterval = setInterval(() => {
    if (state.data) {
      const newHealthStatus = calculateHealthStatus(state.data.updated_at);
      if (newHealthStatus !== state.healthStatus) {
        setState(prev => ({ ...prev, healthStatus: newHealthStatus }));
      }
    }
  }, 5000);

  return () => clearInterval(healthCheckInterval);
}, [state.data, state.healthStatus]);
```

## User Experience

### Admin Dashboard

1. **Live Monitoring Page**: Shows all active trips with attendance stats
2. **Trip Details Page**: Click on a trip to see:
   - Live GPS map with bus location
   - Health status indicator (Healthy/Warning/Stale)
   - Speed, coordinates, and trip type
   - Last updated timestamp
   - Student attendance list
   - Attendance audit log

### Parent Portal

1. **My Children Page**: Shows all children with transport info
2. **Transport Details Page**: Click on a child to see:
   - Child information
   - Assigned route details
   - Driver contact information
   - Pickup/drop-off schedule
   - **Live bus location map** (NEW)
   - Live/Delayed/Offline status
   - Current speed and trip type

## Testing

### Test Live Tracking

1. **Start a trip** (using driver app or backend)
2. **Navigate to Admin Dashboard** → Live Monitoring
3. **Click on active trip** to see live map
4. **Verify**:
   - Map loads with bus marker
   - Status shows "Healthy" (green)
   - Speed and coordinates update
   - "Last updated" shows recent time

### Test Health Status

1. **Stop GPS updates** (stop driver app)
2. **Wait 30 seconds**:
   - Status changes to "Warning" (yellow)
3. **Wait 90 seconds**:
   - Status changes to "Stale" (red/gray)

### Test Parent Portal

1. **Login as parent**
2. **Navigate to My Children**
3. **Click on a child** with assigned route
4. **Scroll to "Live Bus Location"**
5. **Verify**:
   - Map shows bus location
   - Status badge shows Live/Delayed/Offline
   - Speed and trip type displayed
   - Friendly error messages if bus not active

### Test Polling

1. **Open browser DevTools** → Network tab
2. **Filter by** `/tracking/live`
3. **Verify**:
   - Request fires every 10 seconds
   - Response contains lat, lng, updated_at
   - No duplicate requests

### Test Memory Leaks

1. **Navigate to trip details**
2. **Wait for polling to start**
3. **Navigate away** (back button)
4. **Check DevTools** → Network tab
5. **Verify**: No more `/tracking/live` requests after leaving page

## Configuration

### Polling Interval

Default: 10 seconds (10000ms)

To change:
```typescript
<TripLiveMap
  routeId={routeId}
  pollingInterval={5000} // 5 seconds
/>
```

Or in the hook:
```typescript
const { data, healthStatus } = useLiveTracking({
  routeId,
  pollingInterval: 15000, // 15 seconds
  enabled: true,
});
```

### Health Status Thresholds

Located in `useLiveTracking.ts`:
```typescript
if (delayInSeconds < 30) return 'healthy';      // < 30s
else if (delayInSeconds < 90) return 'warning'; // 30-90s
else return 'stale';                            // > 90s
```

## Files Modified/Created

### Created
- `frontend/src/modules/parent/components/ChildLiveMap.tsx` - Parent portal live map
- `LIVE_GPS_TRACKING_IMPLEMENTATION.md` - This documentation

### Modified
- `frontend/src/services/tracking.service.ts` - Fixed API response handling
- `frontend/src/modules/parent/pages/TransportDetails.tsx` - Added live map section

### Existing (Already Implemented)
- `frontend/src/hooks/useLiveTracking.ts` - Polling hook
- `frontend/src/modules/admin/components/TripLiveMap.tsx` - Admin live map
- `backend/src/main/java/com/school/transport/module/tracking/controller/TrackingController.java` - Backend API

## Performance Considerations

1. **Polling Frequency**: 10 seconds balances real-time updates with server load
2. **Cleanup**: All intervals are properly cleared on unmount
3. **Conditional Rendering**: Maps only render when data is available
4. **Error Handling**: Failed requests don't break the UI, polling continues
5. **Health Check**: Separate 5-second interval for status updates (doesn't hit server)

## Future Enhancements

1. **WebSocket Support**: Replace polling with WebSocket for true real-time updates
2. **Route Polyline**: Show the complete route path on the map
3. **ETA Calculation**: Estimate arrival time based on current location
4. **Geofencing**: Alert when bus enters/exits specific zones
5. **Historical Playback**: Replay past trips with GPS trail
6. **Multiple Markers**: Show all active buses on a single map
7. **Offline Support**: Cache last known location when offline

## Troubleshooting

### Map Not Loading
- Check if Leaflet CSS is imported
- Verify routeId is valid
- Check browser console for errors

### Marker Not Moving
- Verify backend is returning different coordinates
- Check if polling is active (Network tab)
- Ensure `data` prop is updating in component

### Health Status Always Stale
- Check system time synchronization
- Verify `updated_at` timestamp format
- Ensure backend is returning recent timestamps

### Memory Leak
- Verify cleanup functions in useEffect
- Check if intervals are cleared on unmount
- Use React DevTools Profiler to monitor

## Conclusion

The live GPS tracking system is fully implemented with:
- ✅ 10-second polling for real-time updates
- ✅ Health status detection (healthy/warning/stale)
- ✅ Dynamic marker updates on Leaflet maps
- ✅ Admin and Parent portal integration
- ✅ Proper cleanup and memory management
- ✅ Error handling and retry logic
- ✅ Responsive UI with status indicators

Both Admin Dashboard and Parent Portal now have fully functional live GPS tracking with automatic updates and health monitoring.
