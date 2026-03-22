# 🔄 Driver App ↔ Admin Portal Sync Guide

## 🎯 Issue

Driver marked attendance for "Route B - Evening" but Admin Portal is not showing the updated data.

---

## 📍 Where to View Attendance in Admin Portal

### ❌ WRONG: Route Details Page
**You are currently here:**
- URL: `/admin/routes/{routeId}`
- Tab: "Students"
- Shows: Student assignments and historical stats (0/0)
- **This is NOT real-time trip attendance!**

### ✅ CORRECT: Live Monitoring → Trip Details
**You need to go here:**
1. Navigate to **Live Monitoring** (`/admin/live-monitoring`)
2. Find the active trip for "Route B - Evening"
3. Click on the trip row
4. View the **Student Attendance** section
5. This shows real-time attendance with Present/Absent/Unmarked counts

---

## 🔍 Questions for Driver App Team

Please ask the driver app team to provide:

### 1. Trip Information
```
Q: What is the trip_id for the "Route B - Evening" trip?
Expected format: "trip-xxx" or UUID

Q: When was the trip started?
Expected: Timestamp (e.g., "2026-03-21T10:30:00Z")

Q: Is the trip still ACTIVE or has it been ENDED?
Expected: "ACTIVE" or "ENDED"
```

### 2. API Endpoint Used
```
Q: Which endpoint does the driver app call to mark attendance?
Expected examples:
- POST /api/v1/attendance/mark
- POST /api/v1/trips/{tripId}/attendance
- PATCH /api/v1/attendance/{attendanceId}

Q: What is the FULL URL including base URL?
Expected: http://localhost:8080/api/v1/...
```

### 3. Request Payload
```
Q: What data does the driver app send when marking attendance?
Expected format (example):
{
  "tripId": "trip-2",
  "studentId": "student-4",
  "status": "PRESENT"
}

OR:

{
  "attendanceId": "att-4",
  "status": "PRESENT",
  "markedBy": "driver-2"
}

Please share the ACTUAL payload sent.
```

### 4. Response Received
```
Q: What response did the driver app receive?
Expected:
- Status code: 200, 201, 204, etc.
- Response body: { "success": true, ... }

Q: Were there any errors?
Expected: Error messages if any
```

### 5. Students Marked
```
Q: Which students did you mark attendance for?
Expected:
- Student Name: "Noah Davis"
- Student ID: "student-4"
- Status: "PRESENT" or "ABSENT"
- Time marked: "2026-03-21T10:35:00Z"

Please list ALL students marked.
```

### 6. Database Verification
```
Q: Can you verify the data was saved in the database?
Query to run:
SELECT * FROM attendance WHERE trip_id = 'your-trip-id';

Expected result:
- Rows with student_id, status, marked_at, marked_by
- Status should be 'PRESENT' or 'ABSENT' (not null)

Please share the query results.
```

---

## 🔧 Debugging Steps

### Step 1: Check Backend Logs
```bash
# In the backend terminal where mvn spring-boot:run is running
# Look for:
- POST /api/v1/attendance/... requests
- Any errors or exceptions
- Database query logs
```

### Step 2: Check Database Directly
```bash
# Connect to database
sudo -u postgres psql -d tos_db

# Check trips table
SELECT id, route_id, trip_type, status, start_time 
FROM trips 
WHERE status = 'ACTIVE';

# Check attendance table
SELECT a.id, a.trip_id, a.student_id, s.name, a.status, a.marked_at 
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE a.trip_id = 'YOUR_TRIP_ID';

# Exit
\q
```

### Step 3: Check Admin Portal API Calls
```
1. Open Admin Portal
2. Go to Live Monitoring
3. Open Browser DevTools (F12)
4. Go to Network tab
5. Filter by "attendance"
6. Click on a trip
7. Check the API request/response
```

---

## 🎯 Expected Data Flow

### Correct Flow
```
1. Driver App: Start Trip
   POST /api/v1/trips/start
   Response: { tripId: "trip-2", ... }
   ↓
2. Driver App: Mark Attendance
   POST /api/v1/attendance/mark
   Body: { tripId: "trip-2", studentId: "student-4", status: "PRESENT" }
   ↓
3. Backend: Save to Database
   INSERT INTO attendance (trip_id, student_id, status, marked_at, marked_by)
   ↓
4. Admin Portal: Poll for Updates
   GET /api/v1/attendance?trip_id=trip-2
   (Every 10 seconds)
   ↓
5. Admin Portal: Display Updated Data
   Present: 1/2 (50%)
   ✅ Noah Davis [Present]
```

---

## 🐛 Common Issues

### Issue 1: Wrong Trip ID
**Problem:** Driver app using different trip_id than admin expects
**Solution:** Verify trip_id matches in both apps

### Issue 2: Trip Not Active
**Problem:** Trip was ended before marking attendance
**Solution:** Check trip status in database

### Issue 3: Wrong API Endpoint
**Problem:** Driver app calling wrong endpoint
**Solution:** Verify endpoint matches backend controller

### Issue 4: Data Not Saved
**Problem:** Database insert failed
**Solution:** Check backend logs for errors

### Issue 5: Admin Viewing Wrong Page
**Problem:** Looking at Route Details instead of Trip Details
**Solution:** Go to Live Monitoring → Click active trip

---

## 📋 Checklist for Driver App Team

Please verify:

- [ ] Trip was started successfully (got trip_id back)
- [ ] Trip is still ACTIVE (not ended)
- [ ] Attendance API endpoint is correct
- [ ] Request payload matches backend expectations
- [ ] Response was successful (200/201 status)
- [ ] Data is visible in database (run SELECT query)
- [ ] Backend logs show no errors
- [ ] Using correct student IDs
- [ ] Using correct trip ID

---

## 🔄 Testing with Mock Data

If using mock mode, you can test with console commands:

```javascript
// In browser console on Admin Portal
window.testMarkAttendance("att-5", "PRESENT")

// Wait 10 seconds
// Should see update in UI
```

---

## 📞 Information Needed

Please provide this information to debug:

```
1. Trip ID: _______________
2. Route Name: Route B - Evening
3. API Endpoint: _______________
4. Request Payload: _______________
5. Response Status: _______________
6. Response Body: _______________
7. Students Marked: _______________
8. Database Query Result: _______________
9. Backend Logs: _______________
10. Any Errors: _______________
```

---

## 🎯 Quick Test

### For Driver App Team:
```bash
# Test the attendance endpoint directly
curl -X POST http://localhost:8080/api/v1/attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tripId": "trip-2",
    "studentId": "student-4",
    "status": "PRESENT"
  }'

# Check response
# Should get 200 OK with updated attendance
```

### For Admin Portal:
```bash
# Test fetching attendance
curl -X GET "http://localhost:8080/api/v1/attendance?trip_id=trip-2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Should see student with status "PRESENT"
```

---

## ✅ Success Criteria

When working correctly:

1. Driver marks attendance → Backend saves to DB
2. Admin polls every 10 seconds → Gets fresh data
3. Admin UI updates automatically → Shows new status
4. No manual refresh needed
5. Counts update correctly (Present/Absent/Unmarked)

---

**Next Steps:**
1. Get information from driver app team
2. Verify data in database
3. Check backend logs
4. Test API endpoints directly
5. Debug based on findings

---

**Status:** 🔍 INVESTIGATING  
**Last Updated:** March 21, 2026
