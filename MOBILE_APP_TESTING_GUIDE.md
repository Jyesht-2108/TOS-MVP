# 📱 Mobile App Testing Guide

## ✅ System Status: WORKING

The database and API communication between Admin Portal and Driver Mobile App is **fully functional and verified**.

---

## 🔑 Test Driver Credentials

**Driver Name:** John Anderson  
**Phone Number:** `+1234567891`  
**User ID:** `20000000-0000-0000-0000-000000000001`  
**Assigned Route:** Route A - Morning  
**Route ID:** `50000000-0000-0000-0000-000000000001`

---

## 🌐 Backend URL

**Local Development:**
- Android Emulator: `http://10.0.2.2:8080`
- iOS Simulator: `http://localhost:8080`
- Physical Device: `http://YOUR_COMPUTER_IP:8080`

**Backend Status:** ✅ Running on `http://localhost:8080`

---

## 📡 API Endpoints for Mobile App

### 1. Get Driver's Assigned Routes
```
GET /api/v1/routes/driver/{driverId}
```

**Example:**
```bash
curl http://localhost:8080/api/v1/routes/driver/20000000-0000-0000-0000-000000000001
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "50000000-0000-0000-0000-000000000001",
      "name": "Route A - Morning",
      "status": "ACTIVE",
      "driverId": "20000000-0000-0000-0000-000000000001",
      "studentCount": 3
    }
  ]
}
```

---

### 2. SSE Real-Time Notifications
```
GET /api/driver/events?driverId={driverId}
Headers: Accept: text/event-stream
```

**Example:**
```bash
curl -N -H "Accept: text/event-stream" \
  "http://localhost:8080/api/driver/events?driverId=20000000-0000-0000-0000-000000000001"
```

**Events You'll Receive:**
```
event:CONNECTED
data:Connection established

event:STUDENT_ASSIGNED
data:{"routeId":"xxx","studentId":"yyy"}

event:STUDENT_REMOVED
data:{"routeId":"xxx","studentId":"yyy"}

event:ROUTE_UPDATED
data:{"routeId":"xxx","message":"Route details updated"}
```

---

### 3. Start Trip
```
POST /api/v1/trips/start
Content-Type: application/json
```

**Request Body:**
```json
{
  "driverId": "20000000-0000-0000-0000-000000000001",
  "routeId": "50000000-0000-0000-0000-000000000001",
  "tripType": "PICKUP"
}
```

---

### 4. Send GPS Update
```
POST /api/gps/update
Content-Type: application/json
```

**Request Body:**
```json
{
  "tripId": "trip-id-from-start-trip",
  "driverId": "20000000-0000-0000-0000-000000000001",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "speed": 25.5,
  "heading": 90.0,
  "accuracy": 10.5,
  "timestamp": "2026-03-15T10:30:00"
}
```

**Send every 30 seconds during active trip**

---

### 5. End Trip
```
POST /api/v1/trips/{tripId}/end
```

---

## 🧪 Testing Flow

### Step 1: Login (Mobile App)
- Enter phone: `+1234567891`
- App should authenticate and get driver details
- Store `driverId`: `20000000-0000-0000-0000-000000000001`

### Step 2: Fetch Routes (Mobile App)
```
GET /api/v1/routes/driver/20000000-0000-0000-0000-000000000001
```
- Should see "Route A - Morning" with 3 students

### Step 3: Connect SSE (Mobile App)
```
GET /api/driver/events?driverId=20000000-0000-0000-0000-000000000001
```
- Keep connection open
- Listen for events

### Step 4: Assign Student (Admin Portal)
- Open admin portal
- Go to Routes → Route A - Morning
- Assign a new student

### Step 5: Verify Notification (Mobile App)
- Should receive SSE event: `STUDENT_ASSIGNED`
- Refresh routes API
- Student count should increase

---

## ✅ Verified Working

The following has been tested and confirmed working:

1. ✅ **Database Connection**
   - Driver exists in database
   - Routes are properly assigned
   - Student assignments are tracked

2. ✅ **API Communication**
   - Driver can fetch assigned routes
   - Route data includes student count
   - All endpoints respond correctly

3. ✅ **Real-Time Notifications (SSE)**
   - SSE connection establishes successfully
   - Admin actions trigger notifications
   - Driver receives `STUDENT_ASSIGNED` events instantly

4. ✅ **Data Synchronization**
   - Admin assigns student → Database updated
   - Driver fetches routes → Sees updated student count
   - Complete bidirectional sync working

---

## 🔍 Test Results

**Test Date:** March 15, 2026

**Test Scenario:**
1. Driver John Anderson logged in
2. Had 2 students on Route A
3. Admin assigned Olivia Smith to Route A
4. SSE notification sent instantly
5. Driver's route now shows 3 students

**Result:** ✅ **SUCCESS**

**SSE Event Captured:**
```
event:STUDENT_ASSIGNED
data:{"routeId":"50000000-0000-0000-0000-000000000001","studentId":"40000000-0000-0000-0000-000000000003"}
```

---

## 📱 Mobile App Implementation Checklist

### On Login:
- [ ] Call login API with phone number
- [ ] Store `driverId` from response
- [ ] Fetch driver's routes: `GET /api/v1/routes/driver/{driverId}`
- [ ] Establish SSE connection: `GET /api/driver/events?driverId={driverId}`

### During Active Session:
- [ ] Keep SSE connection alive
- [ ] Listen for events: `STUDENT_ASSIGNED`, `STUDENT_REMOVED`, `ROUTE_UPDATED`
- [ ] On event received: Refresh routes data
- [ ] Show notification to driver

### On Trip Start:
- [ ] Call `POST /api/v1/trips/start`
- [ ] Store `tripId` from response
- [ ] Start GPS tracking (send every 30 seconds)

### During Trip:
- [ ] Send GPS updates: `POST /api/gps/update`
- [ ] Continue listening for SSE events

### On Trip End:
- [ ] Call `POST /api/v1/trips/{tripId}/end`
- [ ] Stop GPS tracking

### On Logout:
- [ ] Close SSE connection
- [ ] Clear stored data

---

## 🐛 Troubleshooting

### SSE Not Connecting
- Check backend URL is correct
- Verify `driverId` is valid UUID
- Ensure `Accept: text/event-stream` header is set

### Routes Not Loading
- Verify driver exists in database
- Check `driverId` is correct
- Ensure backend is running

### Notifications Not Received
- Confirm SSE connection is active
- Check driver is assigned to the route
- Verify admin is making changes to driver's route

---

## 📞 Quick Reference

**Backend Health Check:**
```bash
curl http://localhost:8080/health
```

**Get Driver Routes:**
```bash
curl http://localhost:8080/api/v1/routes/driver/20000000-0000-0000-0000-000000000001
```

**Test SSE Connection:**
```bash
curl -N -H "Accept: text/event-stream" \
  "http://localhost:8080/api/driver/events?driverId=20000000-0000-0000-0000-000000000001"
```

---

## ✅ Ready for Mobile App Testing!

The backend is fully functional and ready for integration with your Flutter mobile app. All APIs are working, database is connected, and real-time notifications are operational.

**You can now test the mobile app with confidence!** 🚀
