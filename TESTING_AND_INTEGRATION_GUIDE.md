# Testing & Integration Guide - SSE + REST API

**Status:** Driver App Implementation Complete ✅  
**Next Phase:** Testing & Integration 🧪

---

## 🎯 Testing Phases

### Phase 1: Backend Verification (15 mins)
### Phase 2: Driver App Connection Test (30 mins)
### Phase 3: GPS Tracking Test (30 mins)
### Phase 4: Admin Notifications Test (45 mins)
### Phase 5: End-to-End Integration (1 hour)

---

## Phase 1: Backend Verification ✅

### Step 1.1: Start Spring Boot Server

```bash
cd backend
mvn spring-boot:run
```

**Expected output:**
```
Started TransportOperationsSystemApplication in X seconds
```

---

### Step 1.2: Verify Endpoints are Available

**Test SSE Endpoint:**
```bash
curl -N -H "Accept: text/event-stream" \
  "http://localhost:8080/api/driver/events?driverId=bf6798b0-850f-4aa9-b1ed-b5edec583daf"
```

**Expected response:**
```
event: CONNECTED
data: Connection established
```

Press `Ctrl+C` to stop.

**Test GPS Endpoint:**
```bash
curl -X POST http://localhost:8080/api/gps/update \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": "bf6798b0-850f-4aa9-b1ed-b5edec583daf",
    "driverId": "bf6798b0-850f-4aa9-b1ed-b5edec583daf",
    "latitude": 23.8103,
    "longitude": 90.4125,
    "speed": 25.5,
    "heading": 90.0,
    "accuracy": 10.5,
    "timestamp": "2026-03-09T07:15:30"
  }'
```

**Expected response:**
```
GPS location updated successfully
```

✅ **Phase 1 Complete** if both endpoints respond correctly.

---

## Phase 2: Driver App Connection Test

### Step 2.1: Driver App Connects to SSE

**Driver App Action:**
1. Open driver app
2. Login with credentials
3. Check logs for SSE connection

**Expected Driver App Logs:**
```
SSE connection established
Received event: CONNECTED, data: Connection established
```

**Expected Spring Boot Logs:**
```
INFO: Driver bf6798b0-850f-4aa9-b1ed-b5edec583daf connecting to SSE stream
INFO: SSE connection established for driver: bf6798b0-850f-4aa9-b1ed-b5edec583daf
```

---

### Step 2.2: Verify Connection is Maintained

**Wait 2 minutes, then check:**

**Driver App:** Should still show "Connected" status

**Spring Boot:** Check active connections
```bash
# In Spring Boot logs, you should NOT see:
# "SSE connection completed" or "SSE connection timeout"
```

✅ **Phase 2 Complete** if connection stays alive for 2+ minutes.

---

## Phase 3: GPS Tracking Test

### Step 3.1: Driver Starts Trip

**Driver App Action:**
1. Select a route
2. Tap "Start Trip"
3. Wait for GPS updates to begin

**Expected Driver App Logs:**
```
Started GPS tracking
GPS update sent successfully
GPS update sent successfully (every 30s)
```

**Expected Spring Boot Logs:**
```
INFO: Received GPS update for trip: xxx, lat: 23.8103, lng: 90.4125
INFO: Latest bus location updated for trip: xxx
```

---

### Step 3.2: Verify GPS Data in Database

**Query database:**
```sql
-- Check latest location
SELECT * FROM latest_bus_location 
WHERE trip_id = 'your-trip-id' 
ORDER BY updated_at DESC 
LIMIT 1;

-- Check GPS logs (should have multiple entries)
SELECT COUNT(*) FROM gps_logs 
WHERE trip_id = 'your-trip-id';

-- View recent GPS logs
SELECT latitude, longitude, speed, timestamp 
FROM gps_logs 
WHERE trip_id = 'your-trip-id' 
ORDER BY timestamp DESC 
LIMIT 5;
```

**Expected:**
- `latest_bus_location` has 1 row with current position
- `gps_logs` has multiple rows (1 per 30 seconds)
- Coordinates are updating

✅ **Phase 3 Complete** if GPS data is being saved correctly.

---

## Phase 4: Admin Notifications Test

### Step 4.1: Test Student Assignment Notification

**Setup:**
- Driver app is logged in and connected to SSE
- Driver is on an active trip (GPS sending)

**Admin Portal Action:**
1. Open admin portal
2. Navigate to route management
3. Assign a new student to the driver's route

**API Call (if testing manually):**
```bash
curl -X POST http://localhost:8080/api/routes/{routeId}/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin-token}" \
  -d '{
    "studentIds": ["40000000-0000-0000-0000-000000000005"]
  }'
```

**Expected Driver App:**
- Receives SSE event within 1 second
- Shows notification: "New student assigned"
- Student list refreshes automatically
- New student appears in the list

**Expected Driver App Logs:**
```
Received event: STUDENT_ASSIGNED
New student assigned: Emma Wilson
```

**Expected Spring Boot Logs:**
```
INFO: Assigned 1 students to route: xxx
INFO: Sent STUDENT_ASSIGNED event to driver: xxx
```

---

### Step 4.2: Test Student Removal Notification

**Admin Portal Action:**
1. Remove a student from the driver's route

**Expected Driver App:**
- Receives SSE event
- Shows notification: "Student removed"
- Student list refreshes
- Student disappears from list

**Expected Driver App Logs:**
```
Received event: STUDENT_REMOVED
Student removed: student-id
```

✅ **Phase 4 Complete** if notifications are received instantly.

---

## Phase 5: End-to-End Integration Test

### Scenario: Complete Trip with Real-Time Updates

**Timeline:**

**T+0:00 - Driver Logs In**
```
✓ Driver app connects to SSE
✓ Connection established
```

**T+0:30 - Driver Starts Trip**
```
✓ GPS tracking starts
✓ First GPS update sent
```

**T+1:00 - GPS Update #2**
```
✓ GPS sent successfully
✓ Database updated
```

**T+1:30 - Admin Assigns Student**
```
✓ Admin adds student via portal
✓ Driver receives notification instantly
✓ Driver sees new student in list
✓ GPS continues sending (no interruption)
```

**T+2:00 - GPS Update #4**
```
✓ GPS sent successfully
✓ Still connected to SSE
```

**T+2:30 - Admin Removes Student**
```
✓ Admin removes student
✓ Driver receives notification
✓ Student removed from list
✓ GPS continues sending
```

**T+3:00 - Driver Ends Trip**
```
✓ GPS tracking stops
✓ SSE connection still alive
```

**T+3:30 - Driver Logs Out**
```
✓ GPS stopped
✓ SSE disconnected
```

---

## 🐛 Troubleshooting

### Issue 1: SSE Connection Drops

**Symptoms:**
- Driver app shows "Disconnected"
- Spring Boot logs: "SSE connection timeout"

**Solutions:**
1. Check network connectivity
2. Verify SSE auto-reconnect logic in driver app
3. Check Spring Boot logs for errors

**Driver App Fix:**
```dart
// Ensure auto-reconnect is implemented
onDone: () {
  print('SSE connection closed, reconnecting...');
  Future.delayed(Duration(seconds: 5), () {
    connect(driverId, token);
  });
}
```

---

### Issue 2: GPS Not Sending

**Symptoms:**
- No GPS logs in Spring Boot
- Database not updating

**Solutions:**
1. Check GPS permissions in driver app
2. Verify trip is active
3. Check network connectivity
4. Verify endpoint URL is correct

**Debug:**
```dart
// Add detailed logging
print('Sending GPS to: $url');
print('Body: ${jsonEncode(body)}');
print('Response: ${response.statusCode}');
```

---

### Issue 3: Notifications Not Received

**Symptoms:**
- Admin assigns student
- Driver doesn't receive notification

**Solutions:**
1. Verify SSE connection is active
2. Check driver ID matches
3. Verify route has active driver assignment

**Debug in Spring Boot:**
```java
// Add logging in DriverNotificationService
log.info("Active connections: {}", driverConnections.size());
log.info("Driver {} connected: {}", driverId, driverConnections.containsKey(driverId));
```

---

### Issue 4: GPS and SSE Conflict

**Symptoms:**
- GPS stops when notification received
- SSE drops when GPS sends

**Solution:**
- These should be independent
- Check if driver app is blocking on either operation
- Ensure both use separate HTTP clients

---

## 📊 Success Criteria

### ✅ All Tests Pass When:

1. **SSE Connection:**
   - Stays alive for 5+ minutes
   - Auto-reconnects on network drop
   - No memory leaks

2. **GPS Tracking:**
   - Updates every 30 seconds
   - Data saved to database
   - Coordinates are accurate

3. **Notifications:**
   - Received within 1 second
   - UI updates automatically
   - No missed notifications

4. **Integration:**
   - GPS and SSE work simultaneously
   - No conflicts or race conditions
   - Clean disconnect on logout

---

## 🚀 Production Readiness Checklist

### Before Production Deployment:

**Backend:**
- [ ] Add authentication to GPS endpoint
- [ ] Add rate limiting (prevent GPS spam)
- [ ] Add monitoring for SSE connections
- [ ] Configure proper CORS for production
- [ ] Set up database indexes
- [ ] Configure logging levels

**Driver App:**
- [ ] Handle all error cases
- [ ] Add retry logic with exponential backoff
- [ ] Show connection status to driver
- [ ] Queue GPS updates when offline
- [ ] Add analytics/crash reporting
- [ ] Test on slow networks

**Infrastructure:**
- [ ] Load test with 100+ concurrent drivers
- [ ] Monitor server resources
- [ ] Set up alerts for connection drops
- [ ] Configure auto-scaling
- [ ] Set up database backups

---

## 📞 Next Steps After Testing

1. **If all tests pass:**
   - Document any issues found
   - Create production deployment plan
   - Set up monitoring and alerts

2. **If issues found:**
   - Document the issue
   - Identify root cause
   - Fix and retest

3. **Performance Testing:**
   - Test with 10 drivers simultaneously
   - Test with 50 drivers
   - Test with 100+ drivers
   - Monitor server resources

---

## 🎉 Ready for Production!

Once all tests pass and performance is verified, you're ready to deploy to production!

**Estimated Timeline:**
- Testing: 3-4 hours
- Bug fixes: 1-2 days
- Production deployment: 1 day

**Total: 2-3 days to production**
