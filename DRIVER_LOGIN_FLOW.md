# Driver Login Flow with Phone + OTP

**Current:** Driver logs in with phone number + OTP  
**Need:** After login, get driver details and establish SSE connection

---

## 🔄 COMPLETE LOGIN FLOW

### Step 1: Driver Enters Phone Number (Mobile App)

```
User Input: 9876543210
```

**Mobile App:**
- Validates phone number format
- Sends OTP request to backend

---

### Step 2: Backend Sends OTP (To Be Implemented)

```
POST /api/v1/auth/send-otp
{
  "phone": "9876543210"
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otpSent": true,
    "expiresIn": 300
  }
}
```

**Note:** This endpoint needs to be implemented. For now, you can use a dummy OTP like "123456" for testing.

---

### Step 3: Driver Enters OTP (Mobile App)

```
User Input: 123456
```

**Mobile App:**
- Validates OTP format
- Sends verification request to backend

---

### Step 4: Backend Verifies OTP and Returns Driver Details

```
POST /api/v1/auth/verify-otp
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "20000000-0000-0000-0000-000000000003",
      "name": "Michael Kumar",
      "phone": "9876543210",
      "email": "driver3@springfield-school.edu",
      "role": "DRIVER"
    },
    "driver": {
      "id": "d0000000-0000-0000-0000-000000000003",
      "userId": "20000000-0000-0000-0000-000000000003",
      "licenseNumber": "DL555666777",
      "vehicleNumber": "BUS-003",
      "vehicleType": "School Bus",
      "status": "ACTIVE"
    },
    "assignedRoute": {
      "id": "50000000-0000-0000-0000-000000000003",
      "name": "Route C - Afternoon",
      "status": "ACTIVE"
    }
  }
}
```

---

### Step 5: Mobile App Stores Data and Connects SSE

**Mobile App Actions:**
```dart
// 1. Store token
await storage.write(key: 'auth_token', value: response.token);

// 2. Store user data
await storage.write(key: 'user_id', value: response.user.id);
await storage.write(key: 'driver_id', value: response.driver.id);
await storage.write(key: 'route_id', value: response.assignedRoute.id);

// 3. Connect to SSE
await sseService.connect(
  driverId: response.user.id,  // Use user ID for SSE
  token: response.token
);

// 4. Navigate to home screen
Navigator.pushReplacement(context, HomeScreen());
```

---

## 🔧 BACKEND IMPLEMENTATION NEEDED

### 1. Auth Controller (To Be Implemented)

**File:** `backend/src/main/java/com/school/transport/module/auth/controller/AuthController.java`

```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Send OTP to driver's phone
     */
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<OtpResponse>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {
        log.info("Sending OTP to phone: {}", request.getPhone());
        OtpResponse response = authService.sendOtp(request.getPhone());
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", response));
    }

    /**
     * Verify OTP and login
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<LoginResponse>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        log.info("Verifying OTP for phone: {}", request.getPhone());
        LoginResponse response = authService.verifyOtpAndLogin(request.getPhone(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * Login with phone (for testing without OTP)
     */
    @PostMapping("/login-phone")
    public ResponseEntity<ApiResponse<LoginResponse>> loginWithPhone(
            @Valid @RequestBody LoginPhoneRequest request) {
        log.info("Login with phone: {}", request.getPhone());
        LoginResponse response = authService.loginWithPhone(request.getPhone());
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
```

---

### 2. Temporary Solution: Login Without OTP (For Testing)

**For now, create a simple endpoint that logs in with just phone number:**

```
POST /api/v1/auth/login-phone
{
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "dummy-token-for-testing",
    "user": {
      "id": "20000000-0000-0000-0000-000000000003",
      "name": "Michael Kumar",
      "phone": "9876543210",
      "role": "DRIVER"
    },
    "driver": {
      "id": "d0000000-0000-0000-0000-000000000003",
      "vehicleNumber": "BUS-003"
    },
    "assignedRoute": {
      "id": "50000000-0000-0000-0000-000000000003",
      "name": "Route C - Afternoon"
    }
  }
}
```

---

## 📱 MOBILE APP INTEGRATION

### After Login, Mobile App Should:

1. **Store Driver ID:**
   ```dart
   final driverId = loginResponse.user.id;
   // Store: 20000000-0000-0000-0000-000000000003
   ```

2. **Store Route ID:**
   ```dart
   final routeId = loginResponse.assignedRoute.id;
   // Store: 50000000-0000-0000-0000-000000000003
   ```

3. **Connect SSE:**
   ```dart
   await sseService.connect(
     driverId: driverId,
     token: loginResponse.token
   );
   ```

4. **When Starting Trip:**
   ```dart
   await tripService.startTrip(
     driverId: driverId,
     routeId: routeId,
     tripType: 'PICKUP'  // or 'DROP'
   );
   ```

---

## 🧪 TESTING WITHOUT OTP

### Option 1: Use Direct Database Query

```sql
-- Get driver details by phone
SELECT 
    u.id as user_id,
    u.name,
    u.phone,
    u.email,
    u.role,
    d.id as driver_id,
    d.vehicle_number,
    r.id as route_id,
    r.name as route_name
FROM users u
JOIN drivers d ON d.user_id = u.id
LEFT JOIN route_driver_assignment rda ON rda.driver_id = u.id AND rda.active_to IS NULL
LEFT JOIN routes r ON r.id = rda.route_id
WHERE u.phone = '9876543210';
```

**Expected Output:**
```
user_id: 20000000-0000-0000-0000-000000000003
name: Michael Kumar
phone: 9876543210
driver_id: d0000000-0000-0000-0000-000000000003
vehicle_number: BUS-003
route_id: 50000000-0000-0000-0000-000000000003
route_name: Route C - Afternoon
```

### Option 2: Hardcode in Mobile App (Temporary)

```dart
// For testing only - hardcode driver details
final driverId = '20000000-0000-0000-0000-000000000003';
final routeId = '50000000-0000-0000-0000-000000000003';
final token = 'dummy-token';

// Connect SSE
await sseService.connect(driverId: driverId, token: token);

// Start trip
await tripService.startTrip(
  driverId: driverId,
  routeId: routeId,
  tripType: 'PICKUP'
);
```

---

## 🎯 WHAT MOBILE APP NEEDS

### After Login (with phone 9876543210):

**Store These Values:**
```dart
final userId = '20000000-0000-0000-0000-000000000003';  // For SSE connection
final driverId = '20000000-0000-0000-0000-000000000003';  // For trip start
final routeId = '50000000-0000-0000-0000-000000000003';  // For trip start
final driverName = 'Michael Kumar';
final vehicleNumber = 'BUS-003';
final routeName = 'Route C - Afternoon';
```

**Use These For:**
1. **SSE Connection:** `driverId` (user ID)
2. **Start Trip:** `driverId` + `routeId`
3. **Send GPS:** `tripId` (from start trip response) + `driverId`
4. **Display:** `driverName`, `vehicleNumber`, `routeName`

---

## 🔄 COMPLETE FLOW AFTER LOGIN

```
1. Driver logs in with 9876543210
   ↓
2. Backend returns driver details
   ↓
3. Mobile app stores:
   - userId: 20000000-0000-0000-0000-000000000003
   - routeId: 50000000-0000-0000-0000-000000000003
   ↓
4. Mobile app connects SSE:
   GET /api/driver/events?driverId=20000000-0000-0000-0000-000000000003
   ↓
5. Driver starts trip:
   POST /api/v1/trips/start
   {
     "driverId": "20000000-0000-0000-0000-000000000003",
     "routeId": "50000000-0000-0000-0000-000000000003",
     "tripType": "PICKUP"
   }
   ↓
6. Backend returns tripId
   ↓
7. Mobile app starts GPS tracking:
   POST /api/gps/update (every 30s)
   {
     "tripId": "trip-id-from-step-5",
     "driverId": "20000000-0000-0000-0000-000000000003",
     ...
   }
   ↓
8. Admin portal sees active trip immediately
```

---

## ✅ SUMMARY

**For Now (Testing):**
- Mobile app can hardcode driver ID and route ID after login
- Use phone 9876543210 to identify the driver
- Driver ID: `20000000-0000-0000-0000-000000000003`
- Route ID: `50000000-0000-0000-0000-000000000003`

**For Production:**
- Implement OTP send/verify endpoints
- Return driver details after OTP verification
- Mobile app uses returned IDs for SSE and trip management

**The backend is ready to receive trip start requests and GPS updates once the mobile app has the driver ID and route ID!** 🚀

