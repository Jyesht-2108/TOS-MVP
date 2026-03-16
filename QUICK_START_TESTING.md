# Quick Start - Testing SSE + REST API

**Driver app implementation is complete! Let's test it.** 🧪

---

## 🚀 Quick Test (5 minutes)

### Step 1: Start Backend
```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started TransportOperationsSystemApplication`

---

### Step 2: Test Backend Endpoints

**Terminal 1 - SSE Connection:**
```bash
curl -N -H "Accept: text/event-stream" \
  "http://localhost:8080/api/driver/events?driverId=bf6798b0-850f-4aa9-b1ed-b5edec583daf"
```

You should see:
```
event: CONNECTED
data: Connection established
```

Keep this terminal open (connection stays alive).

---

**Terminal 2 - Send GPS Update:**
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

You should see:
```
GPS location updated successfully
```

✅ **Backend is working!**

---

### Step 3: Test Driver App

**Driver App Actions:**
1. Open driver app
2. Login
3. Check logs for: `SSE connection established`
4. Start a trip
5. Check logs for: `GPS update sent successfully` (every 30s)

✅ **Driver app is working!**

---

### Step 4: Test Admin Notifications

**Keep driver app open and connected.**

**Option A - Use Admin Portal:**
1. Open admin portal
2. Assign a student to driver's route
3. Check driver app receives notification

**Option B - Manual API Call:**
```bash
# You'll need to implement this endpoint or test via admin portal
# This is just to show the flow
```

**Expected in Driver App:**
- Notification appears
- Student list updates
- GPS continues sending

✅ **Notifications working!**

---

## 🎉 Success!

If all 4 steps work, your implementation is complete!

**Next:** See `TESTING_AND_INTEGRATION_GUIDE.md` for comprehensive testing.

---

## 🐛 Quick Troubleshooting

**Backend won't start:**
- Check Java version: `java -version` (need Java 17+)
- Check port 8080 is free: `lsof -i :8080`

**SSE connection fails:**
- Check backend is running
- Check URL is correct
- Check firewall settings

**GPS not sending:**
- Check GPS permissions in driver app
- Check network connectivity
- Check trip is active

**Notifications not received:**
- Check SSE connection is active
- Check driver ID matches
- Check route has active driver

---

## 📞 Need Help?

Check these files:
- `TESTING_AND_INTEGRATION_GUIDE.md` - Detailed testing
- `SSE_REST_API_IMPLEMENTATION.md` - Implementation details
- Spring Boot logs - Check for errors
