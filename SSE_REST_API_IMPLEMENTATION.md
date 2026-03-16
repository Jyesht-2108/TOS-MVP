# SSE + REST API Implementation Guide

## 📋 Overview

**Architecture:** Server-Sent Events (SSE) + REST API for bidirectional communication

**Purpose:** 
- Driver sends GPS updates to server (REST API)
- Server sends real-time notifications to driver (SSE)

**Benefits:**
- ✅ Simple and reliable
- ✅ Cheap (low server resources)
- ✅ Auto-reconnects on connection drop
- ✅ Built into HTTP - no special libraries needed
- ✅ Perfect for your use case

---

## 🏗️ Architecture

```
Driver App (Flutter)
    │
    ├─→ REST API (POST)
    │   └─ POST /api/gps/update (every 30s)
    │      Send GPS location during active trip
    │
    └─← SSE (GET - keeps connection open)
        └─ GET /api/driver/events?driverId={id}
           Receive real-time notifications from admin
```

**Two separate connections:**
1. **REST API** - Driver → Server (GPS updates)
2. **SSE** - Server → Driver (Admin notifications)

---

## 📡 How It Works

### Connection Lifecycle

```
1. Driver logs in
   ↓
2. Driver connects to SSE endpoint
   GET /api/driver/events?driverId=driver-123
   (Connection stays OPEN)
   ↓
3. Driver starts trip
   ↓
4. Driver sends GPS every 30s
   POST /api/gps/update
   (Connection opens and closes each time)
   ↓
5. Admin assigns student
   ↓
6. Server sends notification via SSE
   (Uses the OPEN connection from step 2)
   ↓
7. Driver receives notification instantly
   ↓
8. Driver logs out
   SSE connection closes
```

---

## 🔌 API Endpoints

### 1. SSE Connection (Driver Receives Updates)

**Endpoint:** `GET /api/driver/events`

**Query Parameters:**
- `driverId` (UUID, required) - Driver's unique ID

**Response:** Server-Sent Events stream

**Connection:** Stays open until driver logs out

**Example Request:**
```http
GET /api/driver/events?driverId=bf6798b0-850f-4aa9-b1ed-b5edec583daf HTTP/1.1
Host: localhost:8080
Authorization: Bearer <jwt-token>
Accept: text/event-stream
```

**Example Response (SSE Stream):**
```
event: CONNECTED
data: Connection established

event: STUDENT_ASSIGNED
data: {"studentId":"40000000-0000-0000-0000-000000000005","studentName":"Emma Wilson","grade":"Grade 5","section":"A","routeId":"50000000-0000-0000-0000-000000000001"}

event: ROUTE_UPDATED
data: {"routeId":"50000000-0000-0000-0000-000000000001","message":"Route details updated"}

event: STUDENT_REMOVED
data: {"studentId":"40000000-0000-0000-0000-000000000005","routeId":"50000000-0000-0000-0000-000000000001"}
```

---

### 2. GPS Update (Driver Sends Location)

**Endpoint:** `POST /api/gps/update`

**Headers:**
- `Authorization: Bearer <jwt-token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "tripId": "bf6798b0-850f-4aa9-b1ed-b5edec583daf",
  "driverId": "driver-123",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "speed": 25.5,
  "heading": 90.0,
  "accuracy": 10.5,
  "timestamp": "2026-03-09T07:15:30"
}
```

**Response:**
```json
{
  "message": "GPS location updated successfully"
}
```

**Frequency:** Every 30 seconds during active trip

---

## 📱 Driver App Implementation (Flutter)

### Step 1: Add Dependencies

```yaml
# pubspec.yaml
dependencies:
  http: ^1.1.0
  geolocator: ^10.1.0
  permission_handler: ^11.1.0
```

No special SSE library needed - use standard HTTP!

---

### Step 2: Create SSE Service

```dart
// lib/services/sse_service.dart
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

class SseService {
  StreamSubscription? _subscription;
  final String baseUrl = 'http://localhost:8080';
  
  // Connect to SSE stream
  Future<void> connect(String driverId, String token) async {
    final url = Uri.parse('$baseUrl/api/driver/events?driverId=$driverId');
    
    final request = http.Request('GET', url);
    request.headers['Authorization'] = 'Bearer $token';
    request.headers['Accept'] = 'text/event-stream';
    
    final response = await http.Client().send(request);
    
    _subscription = response.stream
        .transform(utf8.decoder)
        .transform(LineSplitter())
        .listen(_handleSseLine);
  }
  
  String? _currentEvent;
  
  void _handleSseLine(String line) {
    if (line.startsWith('event:')) {
      _currentEvent = line.substring(6).trim();
    } else if (line.startsWith('data:')) {
      final data = line.substring(5).trim();
      _handleEvent(_currentEvent, data);
    }
  }
  
  void _handleEvent(String? eventType, String data) {
    print('Received event: $eventType, data: $data');
    
    switch (eventType) {
      case 'CONNECTED':
        print('SSE connection established');
        break;
      case 'STUDENT_ASSIGNED':
        _handleStudentAssigned(jsonDecode(data));
        break;
      case 'STUDENT_REMOVED':
        _handleStudentRemoved(jsonDecode(data));
        break;
      case 'ROUTE_UPDATED':
        _handleRouteUpdated(jsonDecode(data));
        break;
    }
  }
  
  void _handleStudentAssigned(Map<String, dynamic> data) {
    // Update your state management (Riverpod/Provider)
    // Show notification to driver
    print('New student assigned: ${data['studentName']}');
  }
  
  void _handleStudentRemoved(Map<String, dynamic> data) {
    print('Student removed: ${data['studentId']}');
  }
  
  void _handleRouteUpdated(Map<String, dynamic> data) {
    print('Route updated: ${data['routeId']}');
  }
  
  // Disconnect
  void disconnect() {
    _subscription?.cancel();
  }
}
```

---

### Step 3: Create GPS Service

```dart
// lib/services/gps_service.dart
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';

class GpsService {
  Timer? _gpsTimer;
  final String baseUrl = 'http://localhost:8080';
  String? _authToken;
  
  // Start sending GPS updates
  void startTracking(String tripId, String driverId, String token) {
    _authToken = token;
    
    _gpsTimer = Timer.periodic(Duration(seconds: 30), (timer) async {
      try {
        final position = await _getCurrentPosition();
        await _sendGpsUpdate(tripId, driverId, position);
      } catch (e) {
        print('Error sending GPS update: $e');
      }
    });
  }
  
  // Get current GPS position
  Future<Position> _getCurrentPosition() async {
    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }
  
  // Send GPS update to server
  Future<void> _sendGpsUpdate(String tripId, String driverId, Position position) async {
    final url = Uri.parse('$baseUrl/api/gps/update');
    
    final body = {
      'tripId': tripId,
      'driverId': driverId,
      'latitude': position.latitude,
      'longitude': position.longitude,
      'speed': position.speed,
      'heading': position.heading,
      'accuracy': position.accuracy,
      'timestamp': DateTime.now().toIso8601String(),
    };
    
    final response = await http.post(
      url,
      headers: {
        'Authorization': 'Bearer $_authToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );
    
    if (response.statusCode == 200) {
      print('GPS update sent successfully');
    } else {
      print('Failed to send GPS update: ${response.statusCode}');
    }
  }
  
  // Stop sending GPS updates
  void stopTracking() {
    _gpsTimer?.cancel();
    _gpsTimer = null;
  }
}
```

---

### Step 4: Integrate with App Flow

```dart
// In your auth provider or main app
class AppLifecycle {
  final SseService sseService = SseService();
  final GpsService gpsService = GpsService();
  
  // On login
  Future<void> onLogin(String driverId, String token) async {
    // Connect to SSE stream
    await sseService.connect(driverId, token);
    print('Connected to SSE stream');
  }
  
  // On trip start
  void onTripStart(String tripId, String driverId, String token) {
    // Start sending GPS updates
    gpsService.startTracking(tripId, driverId, token);
    print('Started GPS tracking');
  }
  
  // On trip end
  void onTripEnd() {
    // Stop sending GPS updates
    gpsService.stopTracking();
    print('Stopped GPS tracking');
  }
  
  // On logout
  void onLogout() {
    // Stop GPS tracking
    gpsService.stopTracking();
    
    // Disconnect SSE
    sseService.disconnect();
    print('Disconnected from SSE stream');
  }
}
```

---

## 🔄 Complete Flow Example

### Scenario: Admin Assigns New Student

**Step 1: Driver is logged in and on active trip**
```dart
// Driver logged in at 07:00 AM
await sseService.connect('driver-123', token);

// Driver started trip at 07:15 AM
gpsService.startTracking('trip-456', 'driver-123', token);

// GPS updates being sent every 30s
// 07:15:30 - GPS sent
// 07:16:00 - GPS sent
// 07:16:30 - GPS sent
```

**Step 2: Admin assigns student (07:17:00)**
```javascript
// Admin portal calls API
POST /api/routes/route-789/students
{
  "studentId": "student-999"
}
```

**Step 3: Server processes and notifies driver**
```java
// Spring Boot
routeService.assignStudent(routeId, studentId);
driverNotificationService.notifyDriver(driverId, "STUDENT_ASSIGNED", data);
```

**Step 4: Driver receives notification instantly**
```dart
// SSE listener receives event
event: STUDENT_ASSIGNED
data: {"studentId":"student-999","studentName":"Emma Wilson",...}

// Handler processes
_handleStudentAssigned(data) {
  // Update UI
  routeProvider.addStudent(data);
  
  // Show notification
  showNotification('New student: Emma Wilson');
}
```

**Step 5: Driver sees update**
- 📱 Notification appears
- 📱 Student list refreshes
- 📱 Emma Wilson now visible

**Meanwhile, GPS continues:**
```
07:17:00 - GPS sent (continues normally)
07:17:30 - GPS sent
07:18:00 - GPS sent
```

---

## 🧪 Testing Guide

### Test 1: SSE Connection

**Driver App:**
```dart
await sseService.connect('driver-123', token);
```

**Expected:**
- Connection established
- Receives `CONNECTED` event
- No errors in console

**Spring Boot logs:**
```
INFO: SSE connection established for driver: driver-123
```

---

### Test 2: GPS Updates

**Driver App:**
```dart
gpsService.startTracking('trip-456', 'driver-123', token);
```

**Expected:**
- GPS sent every 30 seconds
- Response: 200 OK
- No errors

**Spring Boot logs:**
```
INFO: Received GPS update for trip: trip-456, lat: 23.8103, lng: 90.4125
INFO: Latest bus location updated for trip: trip-456
```

**Database check:**
```sql
SELECT * FROM gps_logs ORDER BY timestamp DESC LIMIT 1;
SELECT * FROM latest_bus_location WHERE trip_id = 'trip-456';
```

---

### Test 3: Admin Notification

**Admin Portal:**
- Assign student to route

**Expected in Driver App:**
- Receives `STUDENT_ASSIGNED` event
- UI updates automatically
- Notification shown

**Spring Boot logs:**
```
INFO: Sent STUDENT_ASSIGNED event to driver: driver-123
```

---

### Test 4: Reconnection

**Simulate network loss:**
```dart
// Disconnect WiFi for 10 seconds
// Reconnect WiFi
```

**Expected:**
- SSE auto-reconnects
- GPS resumes sending
- No data loss

---

## 🚨 Error Handling

### SSE Connection Errors

```dart
void connect(String driverId, String token) async {
  try {
    final response = await http.Client().send(request);
    
    _subscription = response.stream
        .transform(utf8.decoder)
        .transform(LineSplitter())
        .listen(
          _handleSseLine,
          onError: (error) {
            print('SSE error: $error');
            // Retry connection after 5 seconds
            Future.delayed(Duration(seconds: 5), () {
              connect(driverId, token);
            });
          },
          onDone: () {
            print('SSE connection closed');
            // Reconnect
            connect(driverId, token);
          },
        );
  } catch (e) {
    print('Failed to connect to SSE: $e');
  }
}
```

### GPS Send Errors

```dart
Future<void> _sendGpsUpdate(...) async {
  try {
    final response = await http.post(url, ...);
    
    if (response.statusCode != 200) {
      // Log error but continue (next update in 30s)
      print('GPS update failed: ${response.statusCode}');
    }
  } catch (e) {
    // Network error - will retry in 30s
    print('GPS send error: $e');
  }
}
```

---

## 📊 Event Types Reference

### STUDENT_ASSIGNED
```json
{
  "studentId": "uuid",
  "studentName": "Emma Wilson",
  "grade": "Grade 5",
  "section": "A",
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

## ✅ Implementation Checklist

### Backend (Spring Boot) ✅
- [x] GPS tracking controller
- [x] GPS tracking service
- [x] Driver notification controller
- [x] Driver notification service (SSE)
- [x] Database tables ready

### Driver App (Flutter) 🔄
- [ ] Add dependencies (http, geolocator)
- [ ] Create SSE service
- [ ] Create GPS service
- [ ] Integrate with login flow
- [ ] Integrate with trip flow
- [ ] Add error handling
- [ ] Test SSE connection
- [ ] Test GPS updates
- [ ] Test notifications

---

## 🚀 Ready to Implement!

**Backend is ready!** Start implementing the Flutter side following this guide.

**Questions?** Check Spring Boot logs for debugging.

**Timeline:** 2-3 days for complete implementation
