# Attendance Display Fix - Student List & Audit Log

## Issue
The Trip Details page was showing "2/2 students present" in the stats but the student list and audit log sections were empty, displaying "No Students Assigned" and "No attendance corrections" messages.

## Root Cause
1. **Student List**: The frontend `AttendanceSummary` interface had `attendance` array but the backend API returns `students` array
2. **Audit Log**: The audit log endpoint wasn't implemented in the backend

## Changes Made

### Backend Changes

#### 1. Added Audit Log DTO
**File**: `backend/src/main/java/com/school/transport/module/attendance/dto/AttendanceAuditResponse.java`
- Created new DTO to return audit log data with student and editor names

#### 2. Updated AttendanceService
**File**: `backend/src/main/java/com/school/transport/module/attendance/service/AttendanceService.java`
- Added `UserRepository` dependency to fetch editor names
- Added `getAttendanceAuditLog(UUID tripId)` method to fetch audit logs with student and editor details
- Fetches audit logs ordered by `editedAt DESC` (most recent first)

#### 3. Updated AttendanceAuditRepository
**File**: `backend/src/main/java/com/school/transport/module/attendance/repository/AttendanceAuditRepository.java`
- Added `findByTripIdOrderByEditedAtDesc(UUID tripId)` method

#### 4. Added Audit Log Endpoint
**File**: `backend/src/main/java/com/school/transport/module/attendance/controller/AdminAttendanceController.java`
- Added `GET /api/v1/admin/attendance/audit?trip_id={tripId}` endpoint
- Returns list of audit log entries with student names and editor names

### Frontend Changes

#### 1. Fixed AttendanceSummary Interface
**File**: `frontend/src/services/attendance.service.ts`
- Changed `attendance: AttendanceRecord[]` to `students: AttendanceRecord[]` to match backend response

#### 2. Updated TripAttendanceView Component
**File**: `frontend/src/modules/admin/components/TripAttendanceView.tsx`
- Changed destructuring from `attendance` to `students`
- Updated all references to use `students` array instead of `attendance`

#### 3. Updated AuditLogService
**File**: `frontend/src/services/auditLog.service.ts`
- Updated `getAuditLogs()` to call `/admin/attendance/audit?trip_id={tripId}`
- Fixed response handling to extract data from `response.data.data` (API wrapper)

#### 4. Updated AttendanceAuditLog Type
**File**: `frontend/src/types/index.ts`
- Changed `oldStatus` to allow `null` value (for initial attendance marking)

#### 5. Updated AuditLogViewer Component
**File**: `frontend/src/modules/admin/components/AuditLogViewer.tsx`
- Updated `getStatusBadge()` to handle `null` oldStatus (displays "Unmarked")

## API Endpoints

### Get Attendance Summary
```
GET /api/v1/attendance?trip_id={tripId}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "tripId": "633baaf8-dfe3-4bd0-bf1f-35914055844b",
    "totalStudents": 2,
    "presentCount": 2,
    "absentCount": 0,
    "unmarkedCount": 0,
    "students": [
      {
        "id": "34ff4d1f-52f4-4a5e-89ae-95a7ff0daacf",
        "tripId": "633baaf8-dfe3-4bd0-bf1f-35914055844b",
        "studentId": "40000000-0000-0000-0000-000000000004",
        "studentName": "Noah Smith",
        "status": "PRESENT",
        "markedAt": "2026-03-23T04:26:38.954714",
        "markedBy": "20000000-0000-0000-0000-000000000001",
        "markedByName": null,
        "createdAt": "2026-03-23T04:26:31.997832",
        "updatedAt": "2026-03-23T04:26:38.954714"
      }
    ]
  }
}
```

### Get Audit Log
```
GET /api/v1/admin/attendance/audit?trip_id={tripId}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cdbf4885-42ea-42d0-9c54-c5d8c675b6ed",
      "attendanceId": "d83e8def-6de4-4924-8f30-eced25ac328b",
      "tripId": "633baaf8-dfe3-4bd0-bf1f-35914055844b",
      "studentId": "40000000-0000-0000-0000-000000000003",
      "studentName": "Olivia Smith",
      "oldStatus": "ABSENT",
      "newStatus": "PRESENT",
      "reason": "Admin override: Student was actually present, driver marked incorrectly",
      "editedBy": "10000000-0000-0000-0000-000000000001",
      "editedByName": "Admin User",
      "editedAt": "2026-03-22T23:17:38.58908"
    }
  ]
}
```

## Testing

### Test Student List Display
1. Navigate to Live Monitoring page
2. Click on an active trip (Route A - Morning)
3. Scroll to "Student Attendance" section
4. Verify: Student list shows all students with their attendance status
5. Verify: Each student shows marked time and status badge

### Test Audit Log Display
1. On the same Trip Details page
2. Scroll to "Attendance Audit Log" section
3. Verify: Shows audit entries if any corrections were made
4. Verify: Each entry shows:
   - Student name
   - Old status → New status
   - Reason for correction
   - Who edited and when

### Test with No Audit Logs
1. For a trip with no corrections
2. Verify: Shows empty state message "No attendance corrections have been made for this trip"

## Result
✅ Student list now displays correctly with all students and their attendance status
✅ Audit log displays all attendance corrections with full details
✅ Both sections update in real-time with polling (10s for attendance, 30s for audit log)
✅ Backend properly fetches and returns student names and editor names
