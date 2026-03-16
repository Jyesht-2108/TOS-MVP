# 🚀 Quick Start Guide - Driver 9876543210

**Goal:** Get the system running with driver phone 9876543210

---

## ⚡ SUPER QUICK START (3 Commands)

```bash
# 1. Setup database
chmod +x setup-db.sh && ./setup-db.sh

# 2. Start backend
cd backend && mvn spring-boot:run

# 3. Test (in another terminal)
curl http://localhost:8080/health
```

**Done! Backend is ready for mobile app.** ✅

---

## 📱 MOBILE APP - WHAT TO DO

### After Driver Logs In with 9876543210:

**Use These IDs:**
```dart
final userId = '20000000-0000-0000-0000-000000000003';
final routeId = '50000000-0000-0000-0000-000000000003';
```

**1. Connect SSE:**
```dart
await sseService.connect(
  driverId: userId,  // Use user ID
  token: 'dummy-token'  // Or real token from login
);
```

**2. Start Trip:**
```dart
final response = await http.post(
  Uri.parse('http://10.0.2.2:8080/api/v1/trips/start'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'driverId': userId,
    'routeId': routeId,
    'tripType': 'PICKUP'  // or 'DROP'
  })
);

final tripId = jsonDecode(response.body)['data']['id'];
```

**3. Send GPS (every 30s):**
```dart
await http.post(
  Uri.parse('http://10.0.2.2:8080/api/gps/update'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'tripId': tripId,
    'driverId': userId,
    'latitude': position.latitude,
    'longitude': position.longitude,
    'speed': position.speed,
    'heading': position.heading,
    'accuracy': position.accuracy,
    'timestamp': DateTime.now().toIso8601String()
  })
);
```

**4. End Trip:**
```dart
await http.post(
  Uri.parse('http://10.0.2.2:8080/api/v1/trips/$tripId/end')
);
```

---

## 🖥️ ADMIN PORTAL - WHAT TO DO

### Disable Mock Data:

**Option 1: Environment Variable**
```bash
# frontend/.env
VITE_USE_MOCK=false
```

**Option 2: Code Change**
```typescript
// frontend/src/services/admin.service.ts
const USE_MOCK = false;  // Change to false
```

### View Active Trips:

1. Start frontend: `cd frontend && npm run dev`
2. Open: `http://localhost:5173/admin/live-monitoring`
3. Should see active trip when driver starts trip
4. Should see GPS location updating every 10 seconds

---

## 🧪 TESTING

### Test 1: Database Setup

```bash
./setup-db.sh
```

**Expected:** Should see driver 9876543210 in output

---

### Test 2: Backend Health

```bash
curl http://localhost:8080/health
```

**Expected:** `{"status":"ok"}`

---

### Test 3: Start Trip (Manual)

```bash
curl -X POST http://localhost:8080/api/v1/trips/start \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "20000000-0000-0000-0000-000000000003",
    "routeId": "50000000-0000-0000-0000-000000000003",
    "tripType": "PICKUP"
  }'
```

**Expected:** Should return trip ID

---

### Test 4: Get Active Trips

```bash
curl http://localhost:8080/api/v1/trips/active
```

**Expected:** Should show the trip from Test 3

---

### Test 5: Send GPS

```bash
# Use trip ID from Test 3
curl -X POST http://localhost:8080/api/gps/update \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": "YOUR-TRIP-ID",
    "driverId": "20000000-0000-0000-0000-000000000003",
    "latitude": 23.8103,
    "longitude": 90.4125,
    "speed": 25.5,
    "heading": 90.0,
    "accuracy": 10.5,
    "timestamp": "2026-03-11T10:30:00"
  }'
```

**Expected:** `GPS location updated successfully`

---

### Test 6: Get GPS Location

```bash
curl http://localhost:8080/api/gps/location/YOUR-TRIP-ID
```

**Expected:** Should return GPS coordinates

---

### Test 7: End Trip

```bash
curl -X POST http://localhost:8080/api/v1/trips/YOUR-TRIP-ID/end
```

**Expected:** Trip status changes to ENDED

---

## 🐛 TROUBLESHOOTING

### Issue: PostgreSQL Authentication Error

**Solution:**
```bash
# Use sudo -u postgres for all commands
sudo -u postgres psql -d tos_db -c "SELECT COUNT(*) FROM users;"
```

See `FIX_POSTGRES_AUTH.md` for details.

---

### Issue: Backend Won't Start

**Check:**
```bash
# 1. Database exists
sudo -u postgres psql -l | grep tos_db

# 2. Database has tables
sudo -u postgres psql -d tos_db -c "\dt"

# 3. Java version
java -version  # Should be 17+
```

---

### Issue: Mobile App Can't Connect

**Check:**
```bash
# 1. Backend is running
curl http://localhost:8080/health

# 2. Use correct URL in mobile app
# Android Emulator: http://10.0.2.2:8080
# iOS Simulator: http://localhost:8080
# Physical Device: http://YOUR-COMPUTER-IP:8080
```

---

### Issue: Trip Not Appearing in Admin Portal

**Check:**
```bash
# 1. Mock data is disabled
# frontend/src/services/admin.service.ts
# const USE_MOCK = false;

# 2. Trip exists in database
sudo -u postgres psql -d tos_db -c "SELECT * FROM trips WHERE status = 'ACTIVE';"

# 3. Frontend is calling correct endpoint
# Should call: GET /api/v1/trips/active
```

---

## 📊 VERIFICATION CHECKLIST

- [ ] Database setup complete (`./setup-db.sh`)
- [ ] Driver 9876543210 exists in database
- [ ] Backend starts without errors
- [ ] Health check returns OK
- [ ] Can start trip via API
- [ ] Trip appears in active trips
- [ ] Can send GPS updates
- [ ] GPS data saves to database
- [ ] Can get GPS location
- [ ] Can end trip
- [ ] Admin portal shows active trips (no mock data)

---

## 🎉 SUCCESS!

When all checks pass:

1. ✅ Driver can log in with 9876543210
2. ✅ Driver can start trip
3. ✅ Trip appears in admin portal immediately
4. ✅ GPS updates are tracked in real-time
5. ✅ Admin can see bus location on map
6. ✅ Driver can end trip

**You're ready for production!** 🚀

---

## 📞 QUICK REFERENCE

**Driver Details:**
- Phone: `9876543210`
- User ID: `20000000-0000-0000-0000-000000000003`
- Route ID: `50000000-0000-0000-0000-000000000003`
- Name: Michael Kumar
- Vehicle: BUS-003

**API Endpoints:**
- Health: `GET /health`
- Start Trip: `POST /api/v1/trips/start`
- Active Trips: `GET /api/v1/trips/active`
- Send GPS: `POST /api/gps/update`
- Get GPS: `GET /api/gps/location/{tripId}`
- End Trip: `POST /api/v1/trips/{tripId}/end`
- SSE: `GET /api/driver/events?driverId={userId}`

**Database:**
- Name: `tos_db`
- User: `postgres`
- Setup: `./setup-db.sh`

---

**Everything is ready! Follow the steps above and you'll have a working system in minutes!** ⚡

