# Setup Driver with Phone 9876543210

**Driver Name:** Michael Kumar  
**Phone:** 9876543210  
**Route:** Route C - Afternoon  
**Vehicle:** BUS-003

---

## 🎯 WHAT'S BEEN DONE

### 1. Backend Implementation ✅
- Created `TripsController.java` with endpoints:
  - `POST /api/v1/trips/start` - Start a trip
  - `POST /api/v1/trips/{tripId}/end` - End a trip
  - `GET /api/v1/trips/active` - Get all active trips
  - `GET /api/v1/trips/{tripId}` - Get trip by ID
  - `GET /api/v1/trips/driver/{driverId}` - Get trips by driver
  - `GET /api/v1/trips/driver/{driverId}/active` - Get active trip for driver

- Created `TripService.java` with business logic
- Updated `TripRepository.java` with required queries

### 2. Database Seed Data ✅
- Added Driver 3: Michael Kumar (9876543210)
- Added Route C: Afternoon route
- Assigned Michael Kumar to Route C

---

## 📋 DATABASE SETUP

### Step 1: Drop and Recreate Database (if needed)

```bash
# Drop existing database
psql -U postgres -c "DROP DATABASE IF EXISTS tos_db;"

# Create fresh database
psql -U postgres -c "CREATE DATABASE tos_db;"
```

### Step 2: Run Schema

```bash
psql -U postgres -d tos_db -f backend/db/schema-unified.sql
```

### Step 3: Load Seed Data

```bash
psql -U postgres -d tos_db -f backend/db/seeds-unified.sql
```

### Step 4: Verify Driver Exists

```sql
-- Connect to database
psql -U postgres -d tos_db

-- Check driver exists
SELECT u.id, u.name, u.phone, u.role, d.vehicle_number, r.name as route_name
FROM users u
JOIN drivers d ON d.user_id = u.id
LEFT JOIN route_driver_assignment rda ON rda.driver_id = u.id AND rda.active_to IS NULL
LEFT JOIN routes r ON r.id = rda.route_id
WHERE u.phone = '9876543210';
```

**Expected Output:**
```
                  id                  |     name      |    phone    | role   | vehicle_number |    route_name     
--------------------------------------+---------------+-------------+--------+----------------+-------------------
 20000000-0000-0000-0000-000000000003 | Michael Kumar | 9876543210  | DRIVER | BUS-003        | Route C - Afternoon
```

---

## 🚀 TESTING THE FLOW

### Step 1: Start Backend

```bash
cd backend
mvn spring-boot:run
```

### Step 2: Driver Logs In (Mobile App)

**Login with:**
- Phone: `9876543210`
- Driver ID: `20000000-0000-0000-0000-000000000003`

**SSE Connection:**
```
GET /api/driver/events?driverId=20000000-0000-0000-0000-000000000003
```

### Step 3: Driver Starts Trip (Mobile App)

**API Call:**
```bash
curl -X POST http://localhost:8080/api/v1/trips/start \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "20000000-0000-0000-0000-000000000003",
    "routeId": "50000000-0000-0000-0000-000000000003",
    "tripType": "PICKUP"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Trip started successfully",
  "data": {
    "id": "generated-trip-id",
    "tenantId": "a0000000-0000-0000-0000-000000000001",
    "routeId": "50000000-0000-0000-0000-000000000003",
    "driverId": "20000000-0000-0000-0000-000000000003",
    "tripType": "PICKUP",
    "tripDate": "2026-03-10",
    "startTime": "2026-03-10T10:30:00",
    "endTime": null,
    "status": "ACTIVE",
    "createdAt": "2026-03-10T10:30:00"
  }
}
```

### Step 4: Admin Portal Sees Active Trip

**Admin Portal Calls:**
```bash
curl http://localhost:8080/api/v1/trips/active
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trip-id",
      "routeId": "50000000-0000-0000-0000-000000000003",
      "driverId": "20000000-0000-0000-0000-000000000003",
      "tripType": "PICKUP",
      "status": "ACTIVE",
      "startTime": "2026-03-10T10:30:00",
      ...
    }
  ]
}
```

### Step 5: Driver Sends GPS Updates

**Every 30 seconds:**
```bash
curl -X POST http://localhost:8080/api/gps/update \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": "trip-id-from-step-3",
    "driverId": "20000000-0000-0000-0000-000000000003",
    "latitude": 23.8103,
    "longitude": 90.4125,
    "speed": 25.5,
    "heading": 90.0,
    "accuracy": 10.5,
    "timestamp": "2026-03-10T10:31:00"
  }'
```

### Step 6: Admin Portal Sees GPS Location

**Admin Portal Calls:**
```bash
curl http://localhost:8080/api/gps/location/{trip-id}
```

**Expected Response:**
```json
{
  "tripId": "trip-id",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "speed": 25.5,
  "heading": 90.0,
  "timestamp": "2026-03-10T10:31:00",
  "updatedAt": "2026-03-10T10:31:01"
}
```

### Step 7: Driver Ends Trip

**API Call:**
```bash
curl -X POST http://localhost:8080/api/v1/trips/{trip-id}/end
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Trip ended successfully",
  "data": {
    "id": "trip-id",
    "status": "ENDED",
    "endTime": "2026-03-10T11:00:00",
    ...
  }
}
```

---

## 🔧 FRONTEND CONFIGURATION

### Disable Mock Data

Update `frontend/.env`:
```env
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8080/api/v1
```

Or set in code:
```typescript
// frontend/src/services/admin.service.ts
const USE_MOCK = false; // Change this to false
```

---

## 📊 VERIFICATION QUERIES

### Check Active Trips
```sql
SELECT 
    t.id,
    t.trip_type,
    t.status,
    t.start_time,
    u.name as driver_name,
    u.phone as driver_phone,
    r.name as route_name
FROM trips t
JOIN users u ON u.id = t.driver_id
JOIN routes r ON r.id = t.route_id
WHERE t.status = 'ACTIVE';
```

### Check GPS Logs
```sql
SELECT 
    gl.trip_id,
    gl.latitude,
    gl.longitude,
    gl.speed,
    gl.timestamp,
    gl.received_at
FROM gps_logs gl
ORDER BY gl.received_at DESC
LIMIT 10;
```

### Check Latest Bus Location
```sql
SELECT 
    lbl.trip_id,
    lbl.latitude,
    lbl.longitude,
    lbl.speed,
    lbl.timestamp,
    lbl.updated_at,
    r.name as route_name,
    u.name as driver_name
FROM latest_bus_location lbl
JOIN routes r ON r.id = lbl.route_id
JOIN users u ON u.id = lbl.driver_id;
```

---

## ✅ SUCCESS CRITERIA

Your setup is complete when:

1. ✅ Driver Michael Kumar (9876543210) exists in database
2. ✅ Driver is assigned to Route C
3. ✅ Driver can start a trip from mobile app
4. ✅ Trip appears in admin portal immediately
5. ✅ GPS updates are received and stored
6. ✅ Admin portal shows GPS location on map
7. ✅ Driver can end trip
8. ✅ Trip status changes to ENDED in admin portal

---

## 🐛 TROUBLESHOOTING

### Issue: Driver not found
**Solution:** Run seed data again
```bash
psql -U postgres -d tos_db -f backend/db/seeds-unified.sql
```

### Issue: Trip not appearing in admin portal
**Solution:** Check if frontend is using mock data
```typescript
// Set USE_MOCK = false in admin.service.ts
```

### Issue: GPS not saving
**Solution:** Check if trip is active
```sql
SELECT * FROM trips WHERE status = 'ACTIVE';
```

---

## 📞 QUICK REFERENCE

**Driver Details:**
- ID: `20000000-0000-0000-0000-000000000003`
- Name: Michael Kumar
- Phone: `9876543210`
- Route: Route C - Afternoon
- Vehicle: BUS-003

**API Endpoints:**
- Start Trip: `POST /api/v1/trips/start`
- End Trip: `POST /api/v1/trips/{tripId}/end`
- Get Active Trips: `GET /api/v1/trips/active`
- Send GPS: `POST /api/gps/update`
- Get GPS Location: `GET /api/gps/location/{tripId}`

---

## 🎉 YOU'RE READY!

The backend is configured with the new driver. When the driver logs in with phone `9876543210` and starts a trip, it will immediately appear in the admin portal with real-time GPS tracking!

