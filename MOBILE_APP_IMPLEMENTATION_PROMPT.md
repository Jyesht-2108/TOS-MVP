# 📱 Driver Mobile App - SSE + REST API Implementation Guide

**For:** Flutter Driver Mobile App Team  
**Date:** March 10, 2026  
**Backend Status:** ✅ 100% Complete and Ready  
**Estimated Time:** 3-4 days

---

## 🎯 OBJECTIVE

Implement **real-time bidirectional communication** between the driver mobile app and the Spring Boot backend using:
- **SSE (Server-Sent Events)** for receiving notifications from server
- **REST API** for sending GPS location to server

---

## 📋 WHAT YOU NEED TO BUILD

### 1. SSE Service (1 day)
Connect to backend SSE endpoint and listen for real-time notifications

### 2. GPS Service (1 day)
Send device location to backend every 30 seconds during active trip

### 3. App Lifecycle Integration (1 day)
Integrate both services with login, trip start/end, and logout flows

### 4. UI Updates (1 day)
Show notifications and update UI when events are received

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│              DRIVER MOBILE APP (Flutter)                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SSE Service (Receiving Notifications)              │  │
│  │  • Connects on login                                 │  │
│  │  • Listens for events                                │  │
│  │  • Auto-reconnects on disconnect                     │  │
│  │  • Disconnects on logout                             │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│                       │ SSE Stream (Long-lived connection)  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │  GPS Service (Sending Location)                      │  │
│  │  • Starts on trip start                              │  │
│  │  • Sends location every 30s                          │  │
│  │  • Stops on trip end                                 │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│                       │ REST API (HTTP POST every 30s)      │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              SPRING BOOT BACKEND                             │
│                                                               │
│  GET  /api/driver/events?driverId={uuid}  (SSE)             │
│  POST /api/gps/update                      (REST)            │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 DEPENDENCIES REQUIRED

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.2.0              # For REST API and SSE
  geolocator: ^10.1.0       # For GPS location
  permission_handler: ^11.1.0  # For location permissions
```

**Note:** No special SSE library needed! Use standard `http` package.

---

## 🔧 IMPLEMENTATION DETAILS

### 1. SSE SERVICE IMPLEMENTATION

#### File: `lib/services/sse_service.dart`

```dart
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

class SseService {
  // Configuration
  final String baseUrl = 'http://10.0.2.2:8080'; // Android emulator
  // final String baseUrl = 'http://localhost:8080'; // iOS simulator
  // final String baseUrl = 'http://192.168.1.100:8080'; // Physical device
  
  StreamSubscription? _subscription;
  String? _currentEvent;
  
  // Callbacks for different event types
  Function(Map<String, dynamic>)? onStudentAssigned;
  Function(Map<String, dynamic>)? onStudentRemoved;
  Function(Map<String, dynamic>)? onRouteUpdated;
  Function()? onConnected;
  Function(String)? onError;
  
  /// Connect to SSE stream
  /// Call this when driver logs in
  Future<void> connect(String driverId, String token) async {
    try {
      final url = Uri.parse('$baseUrl/api/driver/events?driverId=$driverId');
      
      final request = http.Request('GET', url);
      request.headers['Authorization'] = 'Bearer $token';
      request.headers['Accept'] = 'text/event-stream';
      
      final response = await http.Client().send(request);
      
      if (response.statusCode != 200) {
        throw Exception('SSE connection failed: ${response.statusCode}');
      }
      
      print('SSE: Connected to server');
      
      // Listen to the stream
      _subscription = response.stream
          .transform(utf8.decoder)
          .transform(LineSplitter())
          .listen(
            _handleSseLine,
            onError: (error) {
              print('SSE: Error - $error');
              onError?.call(error.toString());
              // Auto-reconnect after 5 seconds
              Future.delayed(Duration(seconds: 5), () {
                print('SSE: Attempting to reconnect...');
                connect(driverId, token);
              });
            },
            onDone: () {
              print('SSE: Connection closed');
              // Auto-reconnect
              Future.delayed(Duration(seconds: 5), () {
                print('SSE: Attempting to reconnect...');
                connect(driverId, token);
              });
            },
          );
    } catch (e) {
      print('SSE: Failed to connect - $e');
      onError?.call(e.toString());
      // Retry after 5 seconds
      Future.delayed(Duration(seconds: 5), () {
        connect(driverId, token);
      });
    }
  }
  
  /// Handle each line from SSE stream
  void _handleSseLine(String line) {
    if (line.isEmpty) return;
    
    if (line.startsWith('event:')) {
      _currentEvent = line.substring(6).trim();
      print('SSE: Event type - $_currentEvent');
    } else if (line.startsWith('data:')) {
      final data = line.substring(5).trim();
      print('SSE: Data - $data');
      _handleEvent(_currentEvent, data);
    }
  }
  
  /// Handle different event types
  void _handleEvent(String? eventType, String data) {
    switch (eventType) {
      case 'CONNECTED':
        print('SSE: Connection established');
        onConnected?.call();
        break;
        
      case 'STUDENT_ASSIGNED':
        try {
          final jsonData = jsonDecode(data) as Map<String, dynamic>;
          print('SSE: Student assigned - ${jsonData['studentId']}');
          onStudentAssigned?.call(jsonData);
        } catch (e) {
          print('SSE: Error parsing STUDENT_ASSIGNED - $e');
        }
        break;
        
      case 'STUDENT_REMOVED':
        try {
          final jsonData = jsonDecode(data) as Map<String, dynamic>;
          print('SSE: Student removed - ${jsonData['studentId']}');
          onStudentRemoved?.call(jsonData);
        } catch (e) {
          print('SSE: Error parsing STUDENT_REMOVED - $e');
        }
        break;
        
      case 'ROUTE_UPDATED':
        try {
          final jsonData = jsonDecode(data) as Map<String, dynamic>;
          print('SSE: Route updated - ${jsonData['routeId']}');
          onRouteUpdated?.call(jsonData);
        } catch (e) {
          print('SSE: Error parsing ROUTE_UPDATED - $e');
        }
        break;
        
      default:
        print('SSE: Unknown event type - $eventType');
    }
  }
  
  /// Disconnect from SSE stream
  /// Call this when driver logs out
  void disconnect() {
    _subscription?.cancel();
    _subscription = null;
    print('SSE: Disconnected');
  }
  
  /// Check if connected
  bool get isConnected => _subscription != null;
}
```

---

### 2. GPS SERVICE IMPLEMENTATION

#### File: `lib/services/gps_service.dart`

```dart
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';

class GpsService {
  // Configuration
  final String baseUrl = 'http://10.0.2.2:8080'; // Android emulator
  
  Timer? _gpsTimer;
  String? _authToken;
  bool _isTracking = false;
  
  /// Start sending GPS updates
  /// Call this when driver starts a trip
  Future<void> startTracking(String tripId, String driverId, String token) async {
    if (_isTracking) {
      print('GPS: Already tracking');
      return;
    }
    
    _authToken = token;
    _isTracking = true;
    
    print('GPS: Starting tracking for trip $tripId');
    
    // Check permissions first
    final hasPermission = await _checkPermissions();
    if (!hasPermission) {
      print('GPS: Location permission denied');
      _isTracking = false;
      return;
    }
    
    // Send GPS every 30 seconds
    _gpsTimer = Timer.periodic(Duration(seconds: 30), (timer) async {
      if (!_isTracking) {
        timer.cancel();
        return;
      }
      
      try {
        final position = await _getCurrentPosition();
        await _sendGpsUpdate(tripId, driverId, position);
      } catch (e) {
        print('GPS: Error sending update - $e');
        // Don't stop tracking, just log the error
        // Next update will be sent in 30 seconds
      }
    });
    
    // Send first GPS update immediately
    try {
      final position = await _getCurrentPosition();
      await _sendGpsUpdate(tripId, driverId, position);
    } catch (e) {
      print('GPS: Error sending initial update - $e');
    }
  }
  
  /// Check and request location permissions
  Future<bool> _checkPermissions() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      print('GPS: Location services are disabled');
      return false;
    }
    
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        print('GPS: Location permissions are denied');
        return false;
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      print('GPS: Location permissions are permanently denied');
      return false;
    }
    
    return true;
  }
  
  /// Get current GPS position
  Future<Position> _getCurrentPosition() async {
    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
      timeLimit: Duration(seconds: 10),
    );
  }
  
  /// Send GPS update to backend
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
    
    print('GPS: Sending update - lat: ${position.latitude}, lng: ${position.longitude}');
    
    try {
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $_authToken',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );
      
      if (response.statusCode == 200) {
        print('GPS: Update sent successfully');
      } else {
        print('GPS: Failed to send update - ${response.statusCode}');
        print('GPS: Response - ${response.body}');
      }
    } catch (e) {
      print('GPS: Network error - $e');
      // Don't throw, just log. Next update will be sent in 30s
    }
  }
  
  /// Stop sending GPS updates
  /// Call this when driver ends a trip
  void stopTracking() {
    _gpsTimer?.cancel();
    _gpsTimer = null;
    _isTracking = false;
    print('GPS: Stopped tracking');
  }
  
  /// Check if currently tracking
  bool get isTracking => _isTracking;
}
```

---

### 3. APP LIFECYCLE INTEGRATION

#### File: `lib/services/app_lifecycle_service.dart`

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'sse_service.dart';
import 'gps_service.dart';

class AppLifecycleService {
  final SseService sseService;
  final GpsService gpsService;
  
  AppLifecycleService({
    required this.sseService,
    required this.gpsService,
  });
  
  /// Called when driver logs in
  Future<void> onLogin(String driverId, String token) async {
    print('Lifecycle: Driver logged in');
    
    // Connect to SSE stream
    await sseService.connect(driverId, token);
    
    // Setup SSE callbacks
    sseService.onConnected = () {
      print('Lifecycle: SSE connected');
      // Update UI to show connected status
    };
    
    sseService.onStudentAssigned = (data) {
      print('Lifecycle: Student assigned - ${data['studentId']}');
      // Show notification to driver
      // Refresh student list
      // Update UI
    };
    
    sseService.onStudentRemoved = (data) {
      print('Lifecycle: Student removed - ${data['studentId']}');
      // Show notification to driver
      // Refresh student list
      // Update UI
    };
    
    sseService.onRouteUpdated = (data) {
      print('Lifecycle: Route updated - ${data['routeId']}');
      // Show notification to driver
      // Refresh route details
      // Update UI
    };
    
    sseService.onError = (error) {
      print('Lifecycle: SSE error - $error');
      // Show error message to driver
    };
  }
  
  /// Called when driver starts a trip
  Future<void> onTripStart(String tripId, String driverId, String token) async {
    print('Lifecycle: Trip started - $tripId');
    
    // Start GPS tracking
    await gpsService.startTracking(tripId, driverId, token);
  }
  
  /// Called when driver ends a trip
  void onTripEnd() {
    print('Lifecycle: Trip ended');
    
    // Stop GPS tracking
    gpsService.stopTracking();
  }
  
  /// Called when driver logs out
  void onLogout() {
    print('Lifecycle: Driver logged out');
    
    // Stop GPS tracking if active
    gpsService.stopTracking();
    
    // Disconnect SSE
    sseService.disconnect();
  }
}

// Riverpod providers
final sseServiceProvider = Provider<SseService>((ref) => SseService());
final gpsServiceProvider = Provider<GpsService>((ref) => GpsService());

final appLifecycleServiceProvider = Provider<AppLifecycleService>((ref) {
  return AppLifecycleService(
    sseService: ref.watch(sseServiceProvider),
    gpsService: ref.watch(gpsServiceProvider),
  );
});
```

---

### 4. USAGE IN YOUR APP

#### In Login Screen:

```dart
// After successful login
final lifecycleService = ref.read(appLifecycleServiceProvider);
await lifecycleService.onLogin(driverId, token);
```

#### In Trip Start Screen:

```dart
// When driver clicks "Start Trip"
final lifecycleService = ref.read(appLifecycleServiceProvider);
await lifecycleService.onTripStart(tripId, driverId, token);
```

#### In Trip End Screen:

```dart
// When driver clicks "End Trip"
final lifecycleService = ref.read(appLifecycleServiceProvider);
lifecycleService.onTripEnd();
```

#### In Logout:

```dart
// When driver logs out
final lifecycleService = ref.read(appLifecycleServiceProvider);
lifecycleService.onLogout();
```

---

## 🧪 TESTING GUIDE

### Step 1: Test SSE Connection

1. Start the Spring Boot backend
2. Login to driver app
3. Check logs for: `SSE: Connected to server`
4. Check logs for: `SSE: Connection established`

**Expected Backend Logs:**
```
INFO: Driver {uuid} connecting to SSE stream
INFO: SSE connection established for driver: {uuid}
```

---

### Step 2: Test GPS Tracking

1. Start a trip in driver app
2. Check logs for: `GPS: Starting tracking for trip {uuid}`
3. Check logs for: `GPS: Update sent successfully` (every 30s)

**Expected Backend Logs:**
```
INFO: Received GPS update for trip: {uuid}, lat: 23.8103, lng: 90.4125
INFO: Latest bus location updated for trip: {uuid}
```

**Verify in Database:**
```sql
-- Check GPS logs
SELECT * FROM gps_logs ORDER BY timestamp DESC LIMIT 5;

-- Check latest location
SELECT * FROM latest_bus_location WHERE trip_id = 'your-trip-id';
```

---

### Step 3: Test Admin Notifications

1. Keep driver app open and connected
2. From admin portal, assign a student to driver's route
3. Check driver app logs for: `SSE: Student assigned`
4. Verify notification appears in app

**Expected Flow:**
```
Admin Portal → Assigns Student
     ↓
Backend → Sends SSE Event
     ↓
Driver App → Receives Event
     ↓
Driver App → Shows Notification
     ↓
Driver App → Refreshes Student List
```

---

### Step 4: Test Reconnection

1. Turn off WiFi for 10 seconds
2. Turn WiFi back on
3. Check logs for: `SSE: Attempting to reconnect...`
4. Check logs for: `SSE: Connected to server`

---

## 🐛 TROUBLESHOOTING

### Issue 1: SSE Connection Fails

**Symptoms:**
- `SSE connection failed: 401` or `403`

**Solution:**
- Check if backend security is enabled
- Verify JWT token is valid
- Check Authorization header format

---

### Issue 2: GPS Not Sending

**Symptoms:**
- No GPS logs in backend
- `GPS: Location permission denied`

**Solution:**
- Check location permissions in app settings
- Verify GPS is enabled on device
- Check network connectivity

---

### Issue 3: Events Not Received

**Symptoms:**
- SSE connected but no events received
- Admin assigns student but driver doesn't see it

**Solution:**
- Check if driver is assigned to the route
- Verify SSE connection is still active
- Check backend logs for notification sending

---

### Issue 4: High Battery Usage

**Symptoms:**
- App drains battery quickly

**Solution:**
- GPS tracking only during active trip
- Use `LocationAccuracy.balanced` instead of `high`
- Increase GPS interval to 60 seconds if needed

---

## 📊 PERFORMANCE CONSIDERATIONS

### GPS Tracking
- **Interval:** 30 seconds (configurable)
- **Accuracy:** High (can be reduced to save battery)
- **Battery Impact:** Moderate (only during active trip)

### SSE Connection
- **Connection:** Persistent (stays open)
- **Data Usage:** Minimal (only when events sent)
- **Battery Impact:** Very low

### Network Usage
- **GPS:** ~200 bytes per update = 400 bytes/minute
- **SSE:** ~100 bytes per event (occasional)
- **Total:** < 1 MB per hour

---

## ✅ IMPLEMENTATION CHECKLIST

### Day 1: SSE Service
- [ ] Create `sse_service.dart`
- [ ] Implement `connect()` method
- [ ] Implement event parsing
- [ ] Implement auto-reconnect
- [ ] Test connection with backend
- [ ] Test receiving CONNECTED event

### Day 2: GPS Service
- [ ] Create `gps_service.dart`
- [ ] Implement `startTracking()` method
- [ ] Implement `stopTracking()` method
- [ ] Handle location permissions
- [ ] Test GPS sending
- [ ] Verify data in backend database

### Day 3: Integration
- [ ] Create `app_lifecycle_service.dart`
- [ ] Integrate with login flow
- [ ] Integrate with trip start/end
- [ ] Integrate with logout
- [ ] Test complete flow

### Day 4: UI & Polish
- [ ] Add connection status indicator
- [ ] Show notifications for events
- [ ] Refresh student list on events
- [ ] Add error handling
- [ ] Test edge cases
- [ ] Fix bugs

---

## 🎯 SUCCESS CRITERIA

Your implementation is complete when:

1. ✅ Driver can login and SSE connects automatically
2. ✅ Driver receives CONNECTED event
3. ✅ Driver starts trip and GPS starts sending
4. ✅ GPS updates appear in backend database every 30s
5. ✅ Admin assigns student and driver receives notification instantly
6. ✅ Admin removes student and driver receives notification
7. ✅ SSE auto-reconnects on network loss
8. ✅ GPS stops when trip ends
9. ✅ SSE disconnects when driver logs out
10. ✅ No crashes or memory leaks

---

## 📞 SUPPORT & DOCUMENTATION

### Backend Documentation
- `SSE_REST_API_IMPLEMENTATION.md` - Complete API guide
- `TESTING_AND_INTEGRATION_GUIDE.md` - Testing instructions
- `QUICK_START_TESTING.md` - 5-minute quick test

### Backend Endpoints
- **SSE:** `GET /api/driver/events?driverId={uuid}`
- **GPS:** `POST /api/gps/update`
- **Health:** `GET /health`

### Backend Server
- **Dev URL:** `http://localhost:8080`
- **Status:** ✅ Running and ready

---

## 🚀 LET'S GET STARTED!

The backend is **100% ready** and waiting for your implementation. Follow this guide step by step, and you'll have a fully functional real-time communication system in 3-4 days.

**Questions?** Check the backend documentation or ask the backend team.

**Good luck! 🎉**

