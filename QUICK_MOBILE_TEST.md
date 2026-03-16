# 📱 Quick Mobile App Test Guide

## 🚀 Start Here

### Backend Status
```bash
# Check if backend is running
curl http://localhost:8080/health
# Expected: {"status":"ok"}
```

---

## 👤 Test Driver Credentials

```
Phone: +1234567891
Name: John Anderson
User ID: 20000000-0000-0000-0000-000000000001
```

---

## 🔗 API Endpoints (Copy-Paste Ready)

### 1. Get Driver's Routes
```bash
# Android Emulator
http://10.0.2.2:8080/api/v1/routes/driver/20000000-0000-0000-0000-000000000001

# iOS Simulator
http://localhost:8080/api/v1/routes/driver/20000000-0000-0000-0000-000000000001
```

### 2. SSE Connection
```bash
# Android Emulator
http://10.0.2.2:8080/api/driver/events?driverId=20000000-0000-0000-0000-000000000001

# iOS Simulator
http://localhost:8080/api/driver/events?driverId=20000000-0000-0000-0000-000000000001
```

---

## 🧪 Quick Test Steps

### Step 1: Test API Connection
In your mobile app, make this API call:
```
GET /api/v1/routes/driver/20000000-0000-0000-0000-000000000001
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "50000000-0000-0000-0000-000000000001",
      "name": "Route A - Morning",
      "studentCount": 3
    }
  ]
}
```

### Step 2: Test SSE Connection
Connect to SSE endpoint:
```
GET /api/driver/events?driverId=20000000-0000-0000-0000-000000000001
Headers: Accept: text/event-stream
```

**Expected Event:**
```
event:CONNECTED
data:Connection established
```

### Step 3: Test Real-Time Notification
1. Keep SSE connection open in mobile app
2. Run this command on your computer:
```bash
./test-driver-student-sync.sh
```
3. Mobile app should receive `STUDENT_ASSIGNED` event

---

## 📋 Flutter Code Example

```dart
// 1. Get Driver Routes
Future<List<Route>> getDriverRoutes(String driverId) async {
  final response = await http.get(
    Uri.parse('$baseUrl/api/v1/routes/driver/$driverId'),
  );
  
  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    return (data['data'] as List)
        .map((route) => Route.fromJson(route))
        .toList();
  }
  throw Exception('Failed to load routes');
}

// 2. Connect to SSE
Future<void> connectSSE(String driverId) async {
  final request = http.Request(
    'GET',
    Uri.parse('$baseUrl/api/driver/events?driverId=$driverId'),
  );
  request.headers['Accept'] = 'text/event-stream';
  
  final response = await http.Client().send(request);
  
  response.stream
      .transform(utf8.decoder)
      .transform(LineSplitter())
      .listen((line) {
        if (line.startsWith('event:')) {
          _currentEvent = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          final data = line.substring(5).trim();
          _handleEvent(_currentEvent, data);
        }
      });
}

// 3. Handle SSE Events
void _handleEvent(String? eventType, String data) {
  switch (eventType) {
    case 'CONNECTED':
      print('SSE Connected');
      break;
    case 'STUDENT_ASSIGNED':
      final eventData = jsonDecode(data);
      print('New student assigned: ${eventData['studentId']}');
      // Refresh routes
      getDriverRoutes(driverId);
      break;
    case 'STUDENT_REMOVED':
      final eventData = jsonDecode(data);
      print('Student removed: ${eventData['studentId']}');
      // Refresh routes
      getDriverRoutes(driverId);
      break;
  }
}
```

---

## ✅ Verification Checklist

- [ ] Backend is running (`curl http://localhost:8080/health`)
- [ ] Mobile app can connect to backend
- [ ] API call returns driver's routes
- [ ] SSE connection establishes successfully
- [ ] Mobile app receives CONNECTED event
- [ ] Run test script: `./test-driver-student-sync.sh`
- [ ] Mobile app receives STUDENT_ASSIGNED event
- [ ] Mobile app refreshes and shows updated student count

---

## 🐛 Troubleshooting

### "Connection refused"
- Check backend is running: `curl http://localhost:8080/health`
- Verify URL (Android emulator uses `10.0.2.2`, not `localhost`)

### "No routes returned"
- Verify driver ID is correct
- Check database: `./test-database-connection.sh`

### "SSE not connecting"
- Ensure `Accept: text/event-stream` header is set
- Check driver ID is valid UUID
- Verify backend logs for errors

### "No notifications received"
- Confirm SSE connection is active
- Run test script to trigger notification
- Check backend logs for SSE events

---

## 🎯 Success Criteria

When everything works, you should see:

1. ✅ Mobile app shows "Route A - Morning" with 3 students
2. ✅ SSE connection shows "Connected"
3. ✅ When test script runs, mobile app receives notification
4. ✅ Student count updates automatically
5. ✅ No errors in mobile app logs

---

## 📞 Quick Commands

```bash
# Check backend health
curl http://localhost:8080/health

# Test driver routes API
curl http://localhost:8080/api/v1/routes/driver/20000000-0000-0000-0000-000000000001

# Test SSE connection
curl -N -H "Accept: text/event-stream" \
  "http://localhost:8080/api/driver/events?driverId=20000000-0000-0000-0000-000000000001"

# Run complete test
./test-driver-student-sync.sh

# Check database
./test-database-connection.sh
```

---

## 🎉 You're Ready!

Everything is set up and verified. Start testing your mobile app with confidence!

**Driver Phone:** `+1234567891`  
**Backend URL:** `http://10.0.2.2:8080` (Android) or `http://localhost:8080` (iOS)  
**Status:** ✅ Ready for Testing
