# Admin Attendance Monitoring - Testing Examples

## Manual Testing Scenarios

### Scenario 1: View Live Attendance
**Steps:**
1. Login as admin
2. Navigate to Live Monitoring
3. Click on an active trip
4. Scroll to "Student Attendance" section

**Expected Results:**
- ✅ Three stat cards show Present/Absent/Unmarked counts
- ✅ Percentages are calculated correctly
- ✅ Student list displays with correct status badges
- ✅ Edit buttons appear only for marked students
- ✅ Data refreshes every 10 seconds

### Scenario 2: Override Attendance (Present → Absent)
**Steps:**
1. Find a student marked as "Present"
2. Click "Edit" button
3. Select "Absent" radio button
4. Enter reason: "Student left early due to emergency"
5. Click "Update Attendance"

**Expected Results:**
- ✅ Modal opens with current status displayed
- ✅ Warning message appears when status changes
- ✅ Submit button is enabled
- ✅ API call succeeds
- ✅ Success toast appears
- ✅ Modal closes
- ✅ Student list refreshes
- ✅ Student now shows "Absent" badge
- ✅ Counts update correctly

### Scenario 3: Validation - Empty Reason
**Steps:**
1. Click "Edit" on a marked student
2. Change status
3. Leave reason field empty
4. Click "Update Attendance"

**Expected Results:**
- ✅ Error message appears: "Reason is required for attendance override"
- ✅ Reason field highlighted in red
- ✅ Form does not submit
- ✅ Modal stays open

### Scenario 4: Validation - Short Reason
**Steps:**
1. Click "Edit" on a marked student
2. Change status
3. Enter reason: "Error" (5 characters)
4. Click "Update Attendance"

**Expected Results:**
- ✅ Error message appears: "Reason must be at least 10 characters"
- ✅ Form does not submit
- ✅ Modal stays open

### Scenario 5: No Status Change
**Steps:**
1. Click "Edit" on a student marked as "Present"
2. Keep "Present" selected
3. Enter valid reason
4. Click "Update Attendance"

**Expected Results:**
- ✅ Info toast appears: "The attendance status has not been changed"
- ✅ No API call made
- ✅ Modal stays open

### Scenario 6: Locked Record
**Steps:**
1. Find a student with locked attendance
2. Observe the UI

**Expected Results:**
- ✅ No "Edit" button appears
- ✅ "Locked" badge is displayed
- ✅ Cannot modify the record

### Scenario 7: Network Error
**Steps:**
1. Disconnect network
2. Click "Edit" on a student
3. Change status and enter reason
4. Click "Update Attendance"

**Expected Results:**
- ✅ Error toast appears with network error message
- ✅ Modal stays open
- ✅ User can retry after reconnecting

### Scenario 8: Real-time Updates
**Steps:**
1. Open trip details in two browser tabs
2. In tab 1, override a student's attendance
3. Wait 10 seconds
4. Observe tab 2

**Expected Results:**
- ✅ Tab 2 automatically refreshes
- ✅ Updated status appears in tab 2
- ✅ Counts update in tab 2

## API Testing with cURL

### Fetch Attendance
```bash
# Get attendance for a trip
curl -X GET "http://localhost:8080/api/v1/attendance?trip_id=YOUR_TRIP_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Expected Response:
{
  "tripId": "trip-uuid",
  "totalStudents": 20,
  "presentCount": 15,
  "absentCount": 3,
  "unmarkedCount": 2,
  "attendance": [
    {
      "id": "attendance-uuid",
      "tripId": "trip-uuid",
      "studentId": "student-uuid",
      "studentName": "John Doe",
      "status": "PRESENT",
      "markedAt": "2026-03-20T09:15:00Z",
      "markedBy": "driver-uuid",
      "locked": false
    }
  ]
}
```

### Override Attendance
```bash
# Override attendance status
curl -X PATCH "http://localhost:8080/api/v1/admin/attendance/ATTENDANCE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ABSENT",
    "reason": "Student was actually absent due to medical appointment"
  }'

# Expected Response:
{
  "success": true,
  "message": "Attendance updated successfully",
  "attendance": {
    "id": "attendance-uuid",
    "tripId": "trip-uuid",
    "studentId": "student-uuid",
    "studentName": "John Doe",
    "status": "ABSENT",
    "markedAt": "2026-03-20T10:30:00Z",
    "markedBy": "admin-uuid",
    "locked": false
  }
}
```

### Validation Errors
```bash
# Test with empty reason
curl -X PATCH "http://localhost:8080/api/v1/admin/attendance/ATTENDANCE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ABSENT",
    "reason": ""
  }'

# Expected Response (400):
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Reason is required",
    "timestamp": "2026-03-20T10:30:00Z"
  }
}

# Test with short reason
curl -X PATCH "http://localhost:8080/api/v1/admin/attendance/ATTENDANCE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ABSENT",
    "reason": "Error"
  }'

# Expected Response (400):
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Reason must be at least 10 characters",
    "timestamp": "2026-03-20T10:30:00Z"
  }
}
```

## Unit Test Examples

### Testing AttendanceService
```typescript
// attendanceService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { attendanceService } from '@/services/attendance.service';
import api from '@/lib/api';

vi.mock('@/lib/api');

describe('AttendanceService', () => {
  describe('fetchTripAttendance', () => {
    it('should fetch attendance data successfully', async () => {
      const mockData = {
        tripId: 'trip-123',
        totalStudents: 20,
        presentCount: 15,
        absentCount: 3,
        unmarkedCount: 2,
        attendance: [],
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockData });

      const result = await attendanceService.fetchTripAttendance('trip-123');

      expect(api.get).toHaveBeenCalledWith('/attendance', {
        params: { trip_id: 'trip-123' },
      });
      expect(result).toEqual(mockData);
    });

    it('should handle errors', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

      await expect(
        attendanceService.fetchTripAttendance('trip-123')
      ).rejects.toThrow('Network error');
    });
  });

  describe('adminOverrideAttendance', () => {
    it('should override attendance successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Attendance updated',
        attendance: { id: 'att-123', status: 'ABSENT' },
      };

      vi.mocked(api.patch).mockResolvedValue({ data: mockResponse });

      const result = await attendanceService.adminOverrideAttendance('att-123', {
        status: 'ABSENT',
        reason: 'Student was absent due to illness',
      });

      expect(api.patch).toHaveBeenCalledWith(
        '/admin/attendance/att-123',
        {
          status: 'ABSENT',
          reason: 'Student was absent due to illness',
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
```

### Testing AttendanceOverrideModal
```typescript
// AttendanceOverrideModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AttendanceOverrideModal } from './AttendanceOverrideModal';

const queryClient = new QueryClient();

const mockAttendance = {
  id: 'att-123',
  tripId: 'trip-123',
  studentId: 'student-123',
  studentName: 'John Doe',
  status: 'PRESENT' as const,
  markedAt: '2026-03-20T09:15:00Z',
  markedBy: 'driver-123',
  locked: false,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('AttendanceOverrideModal', () => {
  it('should render modal with attendance details', () => {
    render(
      <AttendanceOverrideModal
        open={true}
        onOpenChange={vi.fn()}
        attendance={mockAttendance}
        tripId="trip-123"
      />,
      { wrapper }
    );

    expect(screen.getByText('Override Attendance')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Present/)).toBeInTheDocument();
  });

  it('should validate reason field', async () => {
    const onOpenChange = vi.fn();
    
    render(
      <AttendanceOverrideModal
        open={true}
        onOpenChange={onOpenChange}
        attendance={mockAttendance}
        tripId="trip-123"
      />,
      { wrapper }
    );

    // Select Absent
    const absentRadio = screen.getByLabelText('Absent');
    fireEvent.click(absentRadio);

    // Try to submit without reason
    const submitButton = screen.getByText('Update Attendance');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Reason is required/)).toBeInTheDocument();
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should validate minimum reason length', async () => {
    render(
      <AttendanceOverrideModal
        open={true}
        onOpenChange={vi.fn()}
        attendance={mockAttendance}
        tripId="trip-123"
      />,
      { wrapper }
    );

    // Select Absent
    const absentRadio = screen.getByLabelText('Absent');
    fireEvent.click(absentRadio);

    // Enter short reason
    const reasonInput = screen.getByPlaceholderText(/Enter the reason/);
    fireEvent.change(reasonInput, { target: { value: 'Error' } });

    // Try to submit
    const submitButton = screen.getByText('Update Attendance');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 10 characters/)).toBeInTheDocument();
    });
  });

  it('should show warning when status changes', () => {
    render(
      <AttendanceOverrideModal
        open={true}
        onOpenChange={vi.fn()}
        attendance={mockAttendance}
        tripId="trip-123"
      />,
      { wrapper }
    );

    // Select Absent
    const absentRadio = screen.getByLabelText('Absent');
    fireEvent.click(absentRadio);

    expect(screen.getByText(/Attendance Override/)).toBeInTheDocument();
    expect(screen.getByText(/from Present to Absent/)).toBeInTheDocument();
  });
});
```

### Testing TripAttendanceView
```typescript
// TripAttendanceView.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TripAttendanceView } from './TripAttendanceView';
import { attendanceService } from '@/services/attendance.service';

vi.mock('@/services/attendance.service');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('TripAttendanceView', () => {
  it('should display attendance statistics', async () => {
    const mockData = {
      tripId: 'trip-123',
      totalStudents: 20,
      presentCount: 15,
      absentCount: 3,
      unmarkedCount: 2,
      attendance: [],
    };

    vi.mocked(attendanceService.fetchTripAttendance).mockResolvedValue(mockData);

    render(<TripAttendanceView tripId="trip-123" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument(); // Present count
      expect(screen.getByText('3')).toBeInTheDocument(); // Absent count
      expect(screen.getByText('2')).toBeInTheDocument(); // Unmarked count
    });
  });

  it('should display student list', async () => {
    const mockData = {
      tripId: 'trip-123',
      totalStudents: 2,
      presentCount: 1,
      absentCount: 1,
      unmarkedCount: 0,
      attendance: [
        {
          id: 'att-1',
          tripId: 'trip-123',
          studentId: 'student-1',
          studentName: 'John Doe',
          status: 'PRESENT' as const,
          markedAt: '2026-03-20T09:15:00Z',
          markedBy: 'driver-123',
          locked: false,
        },
        {
          id: 'att-2',
          tripId: 'trip-123',
          studentId: 'student-2',
          studentName: 'Jane Smith',
          status: 'ABSENT' as const,
          markedAt: '2026-03-20T09:16:00Z',
          markedBy: 'driver-123',
          locked: false,
        },
      ],
    };

    vi.mocked(attendanceService.fetchTripAttendance).mockResolvedValue(mockData);

    render(<TripAttendanceView tripId="trip-123" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should show edit buttons for marked students', async () => {
    const mockData = {
      tripId: 'trip-123',
      totalStudents: 1,
      presentCount: 1,
      absentCount: 0,
      unmarkedCount: 0,
      attendance: [
        {
          id: 'att-1',
          tripId: 'trip-123',
          studentId: 'student-1',
          studentName: 'John Doe',
          status: 'PRESENT' as const,
          markedAt: '2026-03-20T09:15:00Z',
          markedBy: 'driver-123',
          locked: false,
        },
      ],
    };

    vi.mocked(attendanceService.fetchTripAttendance).mockResolvedValue(mockData);

    render(<TripAttendanceView tripId="trip-123" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    vi.mocked(attendanceService.fetchTripAttendance).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<TripAttendanceView tripId="trip-123" />, { wrapper });

    expect(screen.getAllByRole('status')).toHaveLength(3); // Skeleton loaders
  });

  it('should handle error state', async () => {
    vi.mocked(attendanceService.fetchTripAttendance).mockRejectedValue(
      new Error('Failed to load')
    );

    render(<TripAttendanceView tripId="trip-123" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Failed to Load Attendance')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });
});
```

## Integration Test Example

```typescript
// attendance.integration.test.tsx
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TripAttendanceView } from './TripAttendanceView';

const server = setupServer(
  rest.get('http://localhost:8080/api/v1/attendance', (req, res, ctx) => {
    return res(
      ctx.json({
        tripId: 'trip-123',
        totalStudents: 1,
        presentCount: 1,
        absentCount: 0,
        unmarkedCount: 0,
        attendance: [
          {
            id: 'att-123',
            tripId: 'trip-123',
            studentId: 'student-123',
            studentName: 'John Doe',
            status: 'PRESENT',
            markedAt: '2026-03-20T09:15:00Z',
            markedBy: 'driver-123',
            locked: false,
          },
        ],
      })
    );
  }),
  rest.patch('http://localhost:8080/api/v1/admin/attendance/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: 'Attendance updated',
        attendance: {
          id: 'att-123',
          status: 'ABSENT',
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Attendance Integration', () => {
  it('should complete full override workflow', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <TripAttendanceView tripId="trip-123" />
      </QueryClientProvider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Wait for modal
    await waitFor(() => {
      expect(screen.getByText('Override Attendance')).toBeInTheDocument();
    });

    // Select Absent
    const absentRadio = screen.getByLabelText('Absent');
    fireEvent.click(absentRadio);

    // Enter reason
    const reasonInput = screen.getByPlaceholderText(/Enter the reason/);
    fireEvent.change(reasonInput, {
      target: { value: 'Student was absent due to illness' },
    });

    // Submit
    const submitButton = screen.getByText('Update Attendance');
    fireEvent.click(submitButton);

    // Wait for success
    await waitFor(() => {
      expect(screen.queryByText('Override Attendance')).not.toBeInTheDocument();
    });
  });
});
```

## Performance Testing

### Load Testing Script
```bash
#!/bin/bash
# load-test-attendance.sh

# Test concurrent attendance fetches
echo "Testing concurrent attendance fetches..."
for i in {1..10}; do
  curl -X GET "http://localhost:8080/api/v1/attendance?trip_id=trip-123" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -w "\nTime: %{time_total}s\n" &
done
wait

# Test concurrent overrides
echo "Testing concurrent overrides..."
for i in {1..5}; do
  curl -X PATCH "http://localhost:8080/api/v1/admin/attendance/att-$i" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"status\":\"ABSENT\",\"reason\":\"Load test reason number $i\"}" \
    -w "\nTime: %{time_total}s\n" &
done
wait
```

## Accessibility Testing

### Keyboard Navigation
```
Test Steps:
1. Tab to "Edit" button
2. Press Enter to open modal
3. Tab through form fields
4. Use arrow keys for radio buttons
5. Tab to "Update Attendance" button
6. Press Enter to submit
7. Press Escape to close modal

Expected: All interactive elements are keyboard accessible
```

### Screen Reader Testing
```
Test with NVDA/JAWS:
1. Navigate to attendance view
2. Verify stat cards are announced correctly
3. Verify student list is announced with status
4. Open modal and verify all labels are read
5. Verify error messages are announced
6. Verify success toast is announced
```

---

**Testing Guide Version:** 1.0.0  
**Last Updated:** March 20, 2026  
**Coverage Target:** 80%+
