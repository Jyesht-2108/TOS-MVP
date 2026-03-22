# Admin Attendance Monitoring - Quick Start Guide

## 🚀 Quick Access

### View Attendance for Active Trips
1. Navigate to **Admin Dashboard** → **Live Monitoring**
2. Click on any **Active Trip** row
3. Scroll to **"Student Attendance"** section
4. View real-time attendance with Present/Absent/Unmarked counts

### Override Student Attendance
1. Find the student in the attendance list
2. Click the **"Edit"** button (only visible for marked students)
3. Select new status: **Present** or **Absent**
4. Enter **reason** (minimum 10 characters) - **REQUIRED**
5. Click **"Update Attendance"**
6. ✅ Done! Changes are logged in audit trail

## 📊 Features at a Glance

### Live Attendance Dashboard
```
┌─────────────────────────────────────────────┐
│  Present: 15/20 (75%)                       │
│  Absent:   3/20 (15%)                       │
│  Unmarked: 2/20 (10%)                       │
└─────────────────────────────────────────────┘

Student List:
✅ John Doe        [Present]  [Edit]
✅ Jane Smith      [Present]  [Edit]
❌ Mike Johnson    [Absent]   [Edit]
⏱️  Sarah Williams [Unmarked]
```

### Override Modal
```
┌─────────────────────────────────────────────┐
│  Override Attendance                        │
│  Update attendance status for John Doe      │
├─────────────────────────────────────────────┤
│  Current Status: ✅ Present                 │
│  Marked at 9:15 AM                          │
│                                             │
│  New Status: *                              │
│  ○ Present  ● Absent                        │
│                                             │
│  Reason for Override: *                     │
│  ┌─────────────────────────────────────┐   │
│  │ Student was actually absent due to  │   │
│  │ medical appointment                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ⚠️  You are changing status from Present   │
│      to Absent. This will be logged.       │
│                                             │
│  [Cancel]  [Update Attendance]              │
└─────────────────────────────────────────────┘
```

## 🔧 API Endpoints

### Fetch Attendance
```typescript
GET /api/v1/attendance?trip_id={trip_id}

Response:
{
  tripId: "uuid",
  totalStudents: 20,
  presentCount: 15,
  absentCount: 3,
  unmarkedCount: 2,
  attendance: [
    {
      id: "attendance-uuid",
      studentId: "student-uuid",
      studentName: "John Doe",
      status: "PRESENT",
      markedAt: "2026-03-20T09:15:00Z",
      markedBy: "driver-uuid",
      locked: false
    }
  ]
}
```

### Override Attendance
```typescript
PATCH /api/v1/admin/attendance/{attendance_id}

Body:
{
  status: "ABSENT",
  reason: "Student was actually absent due to medical appointment"
}

Response:
{
  success: true,
  message: "Attendance updated successfully",
  attendance: { /* updated record */ }
}
```

## 🎨 Component Usage

### In Your Page
```typescript
import { TripAttendanceView } from '@/modules/admin/components/TripAttendanceView';

function MyTripPage() {
  const tripId = "your-trip-id";
  
  return (
    <AnimatedPage>
      <TripAttendanceView tripId={tripId} />
    </AnimatedPage>
  );
}
```

### Standalone Modal
```typescript
import { AttendanceOverrideModal } from '@/modules/admin/components/AttendanceOverrideModal';

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [attendance, setAttendance] = useState(null);
  
  return (
    <AttendanceOverrideModal
      open={open}
      onOpenChange={setOpen}
      attendance={attendance}
      tripId={tripId}
    />
  );
}
```

## 🔐 Security & Validation

### Access Control
- ✅ Admin role required
- ✅ JWT authentication
- ✅ Tenant isolation

### Validation Rules
- ✅ Reason is mandatory
- ✅ Minimum 10 characters for reason
- ✅ Status must be different from current
- ✅ Cannot edit locked records

### Audit Trail
Every override creates an audit log entry:
```typescript
{
  id: "audit-uuid",
  attendanceId: "attendance-uuid",
  tripId: "trip-uuid",
  studentId: "student-uuid",
  studentName: "John Doe",
  oldStatus: "PRESENT",
  newStatus: "ABSENT",
  reason: "Student was actually absent due to medical appointment",
  editedBy: "admin-uuid",
  editedByName: "Admin User",
  editedAt: "2026-03-20T10:30:00Z"
}
```

## 🎯 Status Indicators

| Status | Badge | Icon | Color |
|--------|-------|------|-------|
| Present | Present | ✅ | Green |
| Absent | Absent | ❌ | Red |
| Unmarked | Unmarked | ⏱️ | Amber |

## ⚡ Real-time Updates

- Auto-refresh every **10 seconds**
- Immediate update after override
- React Query cache invalidation
- Optimistic UI updates

## 🐛 Troubleshooting

### Attendance Not Loading
```bash
# Check API endpoint
curl http://localhost:8080/api/v1/attendance?trip_id={trip_id}

# Check browser console for errors
# Verify JWT token is valid
```

### Edit Button Not Showing
- ✅ Student must be marked (status not null)
- ✅ Record must not be locked
- ✅ User must have admin role

### Override Fails
- ✅ Check reason length (min 10 chars)
- ✅ Verify status is different
- ✅ Check network connection
- ✅ Verify admin permissions

## 📱 Mobile Support

- ✅ Responsive design
- ✅ Touch-optimized buttons
- ✅ Scrollable lists
- ✅ Mobile-friendly modal

## 🎬 Animation Details

### Page Load
- Stat cards fade in with stagger (0s, 0.1s, 0.2s)
- Student list animates sequentially
- Smooth transitions

### Interactions
- Hover effects on cards
- Modal slide-in animation
- Toast notifications
- Loading spinners

## 📝 Best Practices

### When to Override
- ✅ Driver marked incorrectly
- ✅ Late arrival after marking
- ✅ System error correction
- ✅ Parent verification

### Reason Examples
Good:
- "Student arrived late after attendance was marked"
- "Parent confirmed student was present but not marked"
- "Driver marked wrong student by mistake"

Bad:
- "Error" (too short)
- "Fix" (not descriptive)
- "" (empty)

## 🔄 Workflow

```
1. Driver marks attendance during trip
   ↓
2. Admin views live attendance
   ↓
3. Admin notices error
   ↓
4. Admin clicks "Edit" button
   ↓
5. Admin changes status
   ↓
6. Admin enters reason (mandatory)
   ↓
7. Admin submits override
   ↓
8. Backend creates audit log
   ↓
9. Frontend refreshes data
   ↓
10. Success notification shown
```

## 🎓 Training Tips

### For Admins
1. Always provide clear, detailed reasons
2. Double-check before submitting
3. Review audit logs regularly
4. Use override sparingly (only when needed)

### For Developers
1. Use TypeScript types for safety
2. Handle loading states properly
3. Show clear error messages
4. Test with various scenarios
5. Monitor API performance

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Review audit logs for patterns
4. Check user permissions
5. Contact development team

---

**Last Updated:** March 20, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
