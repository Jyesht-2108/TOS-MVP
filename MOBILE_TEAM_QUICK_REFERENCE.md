# 📱 Mobile Team Quick Reference Card

**Backend Status:** ✅ Ready  
**Your Task:** Implement SSE + GPS  
**Timeline:** 3-4 days

---

## 🎯 WHAT TO BUILD

### 1. SSE Service
Receive real-time notifications from server

### 2. GPS Service
Send location to server every 30 seconds

---

## 📦 DEPENDENCIES

```yaml
dependencies:
  http: ^1.2.0
  geolocator: ^10.1.0
  permission_handler: ^11.1.0
```

---

## 🔌 BACKEND ENDPOINTS

### SSE (Receiving Notifications)
```
GET /api/driver/events?driverId={uuid}
Headers: Accept: text/event-stream
```

### GPS (Sending Location)
```
POST /api/gps/update
Body: {tripId, driverId, latitude, longitude, speed, heading, accuracy, timestamp}
```

---

## 💻 BACKEND URL

```dart
// Android Emulator
'http://10.0.2.2:8080'

// iOS Simulator
'http://localhost:8080'

// Physical Device
'http://192.168.1.100:8080'  // Your computer's IP
```

---

## 🎬 USAGE

### On Login:
```dart
await sseService.connect(driverId, token);
```

### On Trip Start:
```dart
await gpsService.startTracking(tripId, driverId, token);
```

### On Trip End:
```dart
gpsService.stopTracking();
```

### On Logout:
```dart
sseService.disconnect();
gpsService.stopTracking();
```

---

## 📡 SSE EVENTS

### CONNECTED
```
Connection established
```

### STUDENT_ASSIGNED
```json
{
  "studentId": "uuid",
  "routeId": "uuid"
}
```

### STUDENT_REMOVED
```json
{
  "studentId": "uuid",
  "routeId": "uuid"
}
```

### ROUTE_UPDATED
```json
{
  "routeId": "uuid",
  "message": "Route details updated"
}
```

---

## 🧪 TESTING

### Test SSE:
1. Login to app
2. Check logs: `SSE: Connected to server`
3. ✅ Success

### Test GPS:
1. Start trip
2. Check logs: `GPS: Update sent successfully` (every 30s)
3. ✅ Success

### Test Notifications:
1. Keep app open
2. Admin assigns student
3. Check logs: `SSE: Student assigned`
4. ✅ Success

---

## 📚 DOCUMENTATION

**Start Here:**
- `MOBILE_APP_IMPLEMENTATION_PROMPT.md` ← Full guide with code

**Reference:**
- `SSE_REST_API_IMPLEMENTATION.md` ← API docs
- `TESTING_AND_INTEGRATION_GUIDE.md` ← Testing

---

## ⚡ QUICK START

1. Read `MOBILE_APP_IMPLEMENTATION_PROMPT.md`
2. Add dependencies
3. Copy code examples
4. Test as you go

---

## 🐛 COMMON ISSUES

### SSE won't connect
- Check backend is running
- Verify URL is correct
- Check token is valid

### GPS not sending
- Check location permissions
- Verify trip is active
- Check network connection

### Events not received
- Verify SSE is connected
- Check driver is assigned to route
- Check backend logs

---

## ✅ CHECKLIST

- [ ] Add dependencies
- [ ] Create `sse_service.dart`
- [ ] Create `gps_service.dart`
- [ ] Integrate with login
- [ ] Integrate with trip flow
- [ ] Test SSE connection
- [ ] Test GPS sending
- [ ] Test notifications
- [ ] Handle errors
- [ ] Test reconnection

---

## 📞 SUPPORT

**Backend URL:** `http://localhost:8080`  
**Health Check:** `http://localhost:8080/health`  
**Documentation:** See files above

---

## 🚀 YOU GOT THIS!

The backend is ready and waiting. Follow the guide, copy the code, test as you go. You'll be done in 3-4 days!

**Good luck! 💪**

