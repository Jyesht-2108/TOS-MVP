# Routes Driver Display Fix

**Date**: March 23, 2026  
**Issue**: Routes page showing "Unassigned" for all drivers  
**Status**: ✅ FIXED

## Problem

The Routes page was displaying "Unassigned" in the Driver column for all routes, even though drivers were assigned to those routes in the database.

## Root Cause

The `AdminService.getRoutes()` method was only returning basic route information (id, name, status) without fetching the driver assignment data from the `route_driver_assignment` table.

## Solution

### Updated AdminService

**File**: `backend/src/main/java/com/school/transport/module/admin/service/AdminService.java`

**Changes**:

1. **Added Dependencies**:
   ```java
   private final RouteDriverAssignmentRepository routeDriverAssignmentRepository;
   private final RouteStudentRepository routeStudentRepository;
   ```

2. **Updated getRoutes() Method**:
   ```java
   public List<RouteResponse> getRoutes() {
       List<Route> routes = routeRepository.findAll();
       
       return routes.stream()
           .map(route -> {
               // Get active driver assignment
               Optional<RouteDriverAssignment> activeAssignment = 
                   routeDriverAssignmentRepository.findActiveAssignmentByRouteId(route.getId());
               
               UUID driverId = null;
               String driverName = null;
               
               if (activeAssignment.isPresent()) {
                   driverId = activeAssignment.get().getDriverId();
                   // Fetch driver name from users table
                   User driver = userRepository.findById(driverId).orElse(null);
                   driverName = driver != null ? driver.getName() : null;
               }
               
               // Get student count
               int studentCount = (int) routeStudentRepository.countByRouteId(route.getId());
               
               return RouteResponse.builder()
                   .id(route.getId())
                   .tenantId(route.getTenantId())
                   .name(route.getName())
                   .status(route.getStatus())
                   .driverId(driverId)
                   .driverName(driverName)
                   .studentCount(studentCount)
                   .createdAt(route.getCreatedAt())
                   .updatedAt(route.getUpdatedAt())
                   .build();
           })
           .collect(Collectors.toList());
   }
   ```

3. **Added Imports**:
   ```java
   import com.school.transport.module.routes.entity.RouteDriverAssignment;
   import com.school.transport.module.routes.repository.RouteDriverAssignmentRepository;
   import com.school.transport.module.routes.repository.RouteStudentRepository;
   import java.util.Optional;
   ```

4. **Fixed UUID Format**:
   ```java
   // Before (incorrect - missing digits)
   private static final UUID MOCK_TENANT_ID = UUID.fromString("a0000000-0000-0000-000000000001");
   
   // After (correct - proper UUID format)
   private static final UUID MOCK_TENANT_ID = UUID.fromString("a0000000-0000-0000-0000-000000000001");
   ```

## How It Works

### Data Flow

```
Frontend Routes Page
    ↓
GET /api/v1/admin/routes
    ↓
AdminController.getRoutes()
    ↓
AdminService.getRoutes()
    ↓
For each route:
  1. Query route_driver_assignment table
  2. Find active assignment (where active_to IS NULL)
  3. Get driver_id from assignment
  4. Query users table for driver name
  5. Count students from route_students table
    ↓
Return RouteResponse with driver info
    ↓
Frontend displays driver name
```

### Database Queries

1. **Get all routes**:
   ```sql
   SELECT * FROM routes;
   ```

2. **Get active driver assignment for each route**:
   ```sql
   SELECT * FROM route_driver_assignment 
   WHERE route_id = ? AND active_to IS NULL;
   ```

3. **Get driver name**:
   ```sql
   SELECT * FROM users WHERE id = ?;
   ```

4. **Get student count**:
   ```sql
   SELECT COUNT(*) FROM route_students WHERE route_id = ?;
   ```

## API Response

### GET /api/v1/admin/routes

**Before Fix**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Route A - Morning",
      "status": "ACTIVE",
      "driverId": null,
      "driverName": null,
      "studentCount": 0
    }
  ]
}
```

**After Fix**:
```json
{
  "success": true,
  "data": [
    {
      "id": "50000000-0000-0000-0000-000000000001",
      "tenantId": "a0000000-0000-0000-0000-000000000001",
      "name": "Route A - Morning",
      "status": "ACTIVE",
      "driverId": "20000000-0000-0000-0000-000000000001",
      "driverName": "John Anderson",
      "studentCount": 2,
      "createdAt": "2026-03-21T15:22:28.645667",
      "updatedAt": "2026-03-21T15:22:28.645667"
    },
    {
      "id": "50000000-0000-0000-0000-000000000002",
      "tenantId": "a0000000-0000-0000-0000-000000000001",
      "name": "Route B - Evening",
      "status": "ACTIVE",
      "driverId": "20000000-0000-0000-0000-000000000001",
      "driverName": "John Anderson",
      "studentCount": 2,
      "createdAt": "2026-03-21T15:22:28.645667",
      "updatedAt": "2026-03-21T15:22:28.645667"
    },
    {
      "id": "50000000-0000-0000-0000-000000000003",
      "tenantId": "a0000000-0000-0000-0000-000000000001",
      "name": "Route C - Afternoon",
      "status": "ACTIVE",
      "driverId": "20000000-0000-0000-0000-000000000003",
      "driverName": "Michael Kumar",
      "studentCount": 0,
      "createdAt": "2026-03-21T15:22:28.645667",
      "updatedAt": "2026-03-21T15:22:28.645667"
    }
  ]
}
```

## Current Route Assignments

Based on the database:

| Route | Driver | Students |
|-------|--------|----------|
| Route A - Morning | John Anderson | 2 |
| Route B - Evening | John Anderson | 2 |
| Route C - Afternoon | Michael Kumar | 0 |

## Frontend Display

The Routes page will now show:

```
┌─────────────────────┬────────┬──────────────────┬──────────┬─────────┐
│ Route Name          │ Status │ Driver           │ Students │ Actions │
├─────────────────────┼────────┼──────────────────┼──────────┼─────────┤
│ Route A - Morning   │ ACTIVE │ John Anderson    │ 👥 2     │ [...]   │
│ Route B - Evening   │ ACTIVE │ John Anderson    │ 👥 2     │ [...]   │
│ Route C - Afternoon │ ACTIVE │ Michael Kumar    │ 👥 0     │ [...]   │
└─────────────────────┴────────┴──────────────────┴──────────┴─────────┘
```

## Driver Assignment Flow

### Assigning a Driver to a Route

1. **Admin clicks "Driver" button** on a route
2. **Selects a driver** from the dropdown
3. **Backend processes assignment**:
   ```java
   // Deactivate existing assignment
   UPDATE route_driver_assignment 
   SET active_to = NOW() 
   WHERE route_id = ? AND active_to IS NULL;
   
   // Create new assignment
   INSERT INTO route_driver_assignment 
   (id, route_id, driver_id, active_from, active_to)
   VALUES (uuid, ?, ?, NOW(), NULL);
   ```
4. **Frontend refreshes** and shows new driver name

### Unassigning a Driver

1. **Admin removes driver assignment**
2. **Backend deactivates assignment**:
   ```java
   UPDATE route_driver_assignment 
   SET active_to = NOW() 
   WHERE route_id = ? AND active_to IS NULL;
   ```
3. **Frontend shows "Unassigned"**

## Testing

### Verify Driver Display

1. **Open Routes page**: Navigate to `/admin/routes`
2. **Check Driver column**: Should show driver names
3. **Verify data**: Matches database assignments

### Test Driver Assignment

1. **Click "Driver" button** on a route
2. **Select a different driver**
3. **Save assignment**
4. **Verify update**: Driver name changes in the table

### Test API Directly

```bash
# Get all routes with driver info
curl http://localhost:8080/api/v1/admin/routes | jq '.data[] | {name, driverName}'

# Output:
# {
#   "name": "Route A - Morning",
#   "driverName": "John Anderson"
# }
```

## Files Modified

- `backend/src/main/java/com/school/transport/module/admin/service/AdminService.java`
  - Added `RouteDriverAssignmentRepository` dependency
  - Added `RouteStudentRepository` dependency
  - Updated `getRoutes()` method to fetch driver assignments
  - Fixed `MOCK_TENANT_ID` UUID format

## Benefits

✅ Routes page shows actual driver names  
✅ Student counts are accurate  
✅ Driver assignments are reflected in real-time  
✅ No more "Unassigned" for assigned routes  
✅ Consistent with database state  

## Conclusion

The Routes page now correctly displays driver names by fetching active driver assignments from the `route_driver_assignment` table. When you assign or reassign a driver to a route, the change will be reflected immediately in the UI.
