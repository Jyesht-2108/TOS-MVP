# Admin Attendance Monitoring - Architecture & Data Flow

## Component Hierarchy

```
TripDetails Page
│
├── AnimatedPage (wrapper)
│   │
│   ├── Trip Information Card
│   ├── GPS Status Card
│   ├── Live Map Card
│   │
│   ├── TripAttendanceView ⭐ NEW
│   │   │
│   │   ├── AnimatedCard (Stats)
│   │   │   ├── AttendanceStatCard (Present)
│   │   │   ├── AttendanceStatCard (Absent)
│   │   │   └── AttendanceStatCard (Unmarked)
│   │   │
│   │   ├── AnimatedCard (Student List)
│   │   │   └── Student Rows
│   │   │       ├── StatusBadge
│   │   │       └── Edit Button
│   │   │
│   │   └── AttendanceOverrideModal ⭐ NEW
│   │       ├── Dialog (Radix UI)
│   │       ├── Current Status Display
│   │       ├── RadioGroup (Status Selection)
│   │       ├── Textarea (Reason Input)
│   │       └── Submit Button
│   │
│   └── AuditLogViewer
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
│                  (Live Monitoring Page)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Click Active Trip
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Trip Details Page                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         TripAttendanceView Component                   │ │
│  │                                                        │ │
│  │  useQuery('tripAttendance', tripId)                   │ │
│  │         ↓                                              │ │
│  │  GET /api/v1/attendance?trip_id={tripId}              │ │
│  │         ↓                                              │ │
│  │  ┌──────────────────────────────────────────────┐    │ │
│  │  │  AttendanceSummary                           │    │ │
│  │  │  - totalStudents: 20                         │    │ │
│  │  │  - presentCount: 15                          │    │ │
│  │  │  - absentCount: 3                            │    │ │
│  │  │  - unmarkedCount: 2                          │    │ │
│  │  │  - attendance: AttendanceRecord[]            │    │ │
│  │  └──────────────────────────────────────────────┘    │ │
│  │         ↓                                              │ │
│  │  Render Stats + Student List                          │ │
│  │         ↓                                              │ │
│  │  User clicks "Edit" button                            │ │
│  │         ↓                                              │ │
│  │  ┌──────────────────────────────────────────────┐    │ │
│  │  │   AttendanceOverrideModal Opens              │    │ │
│  │  │                                              │    │ │
│  │  │   1. Show current status                     │    │ │
│  │  │   2. User selects new status                 │    │ │
│  │  │   3. User enters reason (min 10 chars)       │    │ │
│  │  │   4. User clicks "Update Attendance"         │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   useMutation(adminOverrideAttendance)       │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   PATCH /api/v1/admin/attendance/{id}        │    │ │
│  │  │   Body: { status, reason }                   │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   Backend validates & updates                │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   Backend creates audit log                  │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   Success response                           │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   queryClient.invalidateQueries()            │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   Refetch attendance data                    │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   Show success toast                         │    │ │
│  │  │         ↓                                     │    │ │
│  │  │   Close modal                                │    │ │
│  │  └──────────────────────────────────────────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## State Management

### React Query Cache Keys

```typescript
// Attendance data for a specific trip
['tripAttendance', tripId]

// Active trips list (invalidated after override)
['activeTrips']

// Audit logs for a trip
['attendanceAudit', tripId]
```

### Component State

```typescript
// TripAttendanceView
const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

// AttendanceOverrideModal
const [newStatus, setNewStatus] = useState<'PRESENT' | 'ABSENT'>('PRESENT');
const [reason, setReason] = useState('');
const [errors, setErrors] = useState<{ reason?: string }>({});
```

## API Integration Layer

```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (React)                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  attendanceService.ts                                  │ │
│  │                                                        │ │
│  │  fetchTripAttendance(tripId)                          │ │
│  │  adminOverrideAttendance(attendanceId, data)          │ │
│  │  fetchAttendanceAuditLog(tripId)                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↕                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  api.ts (Axios Instance)                              │ │
│  │                                                        │ │
│  │  - JWT token injection                                │ │
│  │  - Error handling                                     │ │
│  │  - Response unwrapping                                │ │
│  │  - 401 auto-logout                                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         ↕
                    HTTP/HTTPS
                         ↕
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Spring Boot)                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AttendanceController                                  │ │
│  │                                                        │ │
│  │  GET  /api/v1/attendance                              │ │
│  │  PATCH /api/v1/admin/attendance/{id}                  │ │
│  │  GET  /api/v1/admin/attendance/audit                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↕                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AttendanceService                                     │ │
│  │                                                        │ │
│  │  - Business logic                                     │ │
│  │  - Validation                                         │ │
│  │  - Audit log creation                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↕                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AttendanceRepository                                  │ │
│  │  AttendanceAuditRepository                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                       │
│                                                              │
│  - attendance table                                          │
│  - attendance_audit table                                    │
└─────────────────────────────────────────────────────────────┘
```

## Sequence Diagram: Override Flow

```
Admin          TripAttendanceView    Modal           API           Backend        Database
  │                    │               │              │               │               │
  │  View Trip         │               │              │               │               │
  ├───────────────────>│               │              │               │               │
  │                    │               │              │               │               │
  │                    │  Fetch Attendance            │               │               │
  │                    ├──────────────────────────────>│               │               │
  │                    │               │              │  Query DB     │               │
  │                    │               │              │──────────────>│               │
  │                    │               │              │               │  SELECT       │
  │                    │               │              │               ├──────────────>│
  │                    │               │              │               │<──────────────┤
  │                    │               │              │<──────────────┤               │
  │                    │<──────────────────────────────┤               │               │
  │                    │               │              │               │               │
  │  Display List      │               │              │               │               │
  │<───────────────────┤               │              │               │               │
  │                    │               │              │               │               │
  │  Click "Edit"      │               │              │               │               │
  ├───────────────────>│               │              │               │               │
  │                    │  Open Modal   │              │               │               │
  │                    ├──────────────>│              │               │               │
  │                    │               │              │               │               │
  │  Change Status     │               │              │               │               │
  ├────────────────────────────────────>│              │               │               │
  │                    │               │              │               │               │
  │  Enter Reason      │               │              │               │               │
  ├────────────────────────────────────>│              │               │               │
  │                    │               │              │               │               │
  │  Submit            │               │              │               │               │
  ├────────────────────────────────────>│              │               │               │
  │                    │               │  Validate    │               │               │
  │                    │               ├──────────────┤               │               │
  │                    │               │              │               │               │
  │                    │               │  PATCH Override              │               │
  │                    │               ├──────────────────────────────>│               │
  │                    │               │              │  Validate     │               │
  │                    │               │              ├──────────────>│               │
  │                    │               │              │               │  UPDATE       │
  │                    │               │              │               ├──────────────>│
  │                    │               │              │               │<──────────────┤
  │                    │               │              │               │  INSERT audit │
  │                    │               │              │               ├──────────────>│
  │                    │               │              │               │<──────────────┤
  │                    │               │              │<──────────────┤               │
  │                    │               │<──────────────────────────────┤               │
  │                    │               │              │               │               │
  │                    │               │  Invalidate Cache            │               │
  │                    │               ├──────────────┤               │               │
  │                    │               │              │               │               │
  │                    │  Refetch Attendance          │               │               │
  │                    ├──────────────────────────────>│               │               │
  │                    │               │              │  Query DB     │               │
  │                    │               │              │──────────────>│               │
  │                    │               │              │               │  SELECT       │
  │                    │               │              │               ├──────────────>│
  │                    │               │              │               │<──────────────┤
  │                    │               │              │<──────────────┤               │
  │                    │<──────────────────────────────┤               │               │
  │                    │               │              │               │               │
  │                    │  Close Modal  │              │               │               │
  │                    ├──────────────>│              │               │               │
  │                    │               │              │               │               │
  │  Show Success      │               │              │               │               │
  │<───────────────────┤               │              │               │               │
  │                    │               │              │               │               │
  │  Updated List      │               │              │               │               │
  │<───────────────────┤               │              │               │               │
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Scenarios                           │
└─────────────────────────────────────────────────────────────┘

1. Network Error
   ├─> Axios interceptor catches
   ├─> Display error toast
   ├─> Show retry button
   └─> Log to console

2. Validation Error (Frontend)
   ├─> Form validation catches
   ├─> Display inline error message
   ├─> Highlight field in red
   └─> Prevent submission

3. Validation Error (Backend)
   ├─> API returns 400
   ├─> Error message extracted
   ├─> Display error toast
   └─> Keep modal open

4. Authorization Error
   ├─> API returns 401/403
   ├─> Redirect to login
   ├─> Clear auth token
   └─> Show error message

5. Server Error
   ├─> API returns 500
   ├─> Display generic error
   ├─> Log full error
   └─> Offer retry option

6. Concurrent Update
   ├─> Optimistic lock failure
   ├─> Refetch latest data
   ├─> Show conflict message
   └─> Ask user to retry
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────────┐
│                  Optimization Strategies                     │
└─────────────────────────────────────────────────────────────┘

1. React Query Caching
   ├─> Cache attendance data for 10 seconds
   ├─> Automatic background refetch
   ├─> Stale-while-revalidate pattern
   └─> Reduce unnecessary API calls

2. Optimistic Updates
   ├─> Update UI immediately
   ├─> Rollback on error
   ├─> Better perceived performance
   └─> Smooth user experience

3. Lazy Loading
   ├─> Code splitting for modal
   ├─> Load on demand
   ├─> Reduce initial bundle size
   └─> Faster page load

4. Debounced Auto-refresh
   ├─> 10-second interval
   ├─> Pause when modal open
   ├─> Resume after close
   └─> Prevent disruption

5. Memoization
   ├─> React.memo for stat cards
   ├─> useMemo for computed values
   ├─> useCallback for handlers
   └─> Prevent unnecessary re-renders

6. Efficient Re-renders
   ├─> Key-based list rendering
   ├─> Minimal state updates
   ├─> Isolated component updates
   └─> Smooth animations
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
└─────────────────────────────────────────────────────────────┘

1. Authentication
   ├─> JWT token required
   ├─> Token in Authorization header
   ├─> Auto-refresh on expiry
   └─> Logout on 401

2. Authorization
   ├─> Admin role required
   ├─> Role-based routing
   ├─> Backend permission check
   └─> Tenant isolation

3. Input Validation
   ├─> Frontend validation (UX)
   ├─> Backend validation (Security)
   ├─> SQL injection prevention
   └─> XSS protection

4. Audit Trail
   ├─> Every change logged
   ├─> User attribution
   ├─> Timestamp recorded
   └─> Immutable logs

5. Data Integrity
   ├─> Optimistic locking
   ├─> Transaction management
   ├─> Constraint enforcement
   └─> Referential integrity
```

## Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                           │
└─────────────────────────────────────────────────────────────┘

                    ▲
                   ╱ ╲
                  ╱   ╲
                 ╱ E2E ╲
                ╱───────╲
               ╱         ╲
              ╱Integration╲
             ╱─────────────╲
            ╱               ╲
           ╱  Unit Tests     ╲
          ╱___________________╲

Unit Tests:
├─> attendanceService.test.ts
├─> AttendanceOverrideModal.test.tsx
├─> TripAttendanceView.test.tsx
└─> Validation logic tests

Integration Tests:
├─> API integration tests
├─> React Query cache tests
├─> Form submission tests
└─> Error handling tests

E2E Tests:
├─> Full override workflow
├─> Multi-user scenarios
├─> Real-time update tests
└─> Mobile responsiveness
```

---

**Architecture Version:** 1.0.0  
**Last Updated:** March 20, 2026  
**Status:** ✅ Production Ready
