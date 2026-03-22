# Attendance Polling - Testing Guide

## 🎯 Objective

Test that the Admin Dashboard automatically updates when driver marks attendance, simulating real-time polling behavior.

---

## ✅ What Was Fixed

### 1. Mock API Endpoints Added
- **GET /api/v1/attendance?trip_id={tripId}** - Fetches attendance from global mock state
- **PATCH /api/v1/admin/attendance/{attendanceId}** - Updates attendance in global mock state

### 2. Global Mock State
- Attendance data stored in `mockTripAttendance` object
- Updates persist across API calls
- Simulates real database behavior

### 3. Automatic Polling
- React Query `refetchInterval: 10000` (10 seconds)
- Admin UI automatically refetches data
- No manual refresh needed

### 4. Test Utilities
- Browser console commands to simulate driver updates
- Instant feedback in console
- Admin UI updates within 10 seconds

---

## 🧪 How to Test

### Step 1: Start the Application

```bash
# Terminal 1: Backend (if not already running)
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Step 2: Enable Mock Mode

Ensure your `.env` file has:
```env
VITE_USE_MOCK=true
VITE_USE_MOCK_API=true
```

### Step 3: Open Admin Dashboard

1. Navigate to http://localhost:3000
2. Login as admin
3. Go to **Live Monitoring** or **Trip Details**
4. Find a trip with attendance data (e.g., trip-1)

### Step 4: Open Browser Console

Press `F12` or `Ctrl+Shift+I` to open Developer Tools

You should see:
```
🧪 Test utilities loaded!
Available commands:
  window.testMarkAttendance("att-3", "PRESENT")
  window.testMarkAllPresent("trip-1")
  window.testMarkAllAbsent("trip-1")
```

### Step 5: Simulate Driver Marking Attendance

In the console, run:

```javascript
// Mark a single student as present
window.testMarkAttendance("att-3", "PRESENT")

// Expected output:
// ✅ Mock attendance marked by driver: Olivia Brown -> PRESENT
// 📊 New counts - Present: 3, Absent: 0, Unmarked: 0
// ✅ Attendance marked successfully!
// 🔄 Admin UI should update within 10 seconds...
```

### Step 6: Watch the Admin UI Update

Within 10 seconds, you should see:
- ✅ Student status badge changes from "Unmarked" to "Present"
- ✅ Present count increases
- ✅ Unmarked count decreases
- ✅ No page refresh needed!

---

## 🎮 Test Commands

### Mark Individual Student

```javascript
// Mark student as PRESENT
window.testMarkAttendance("att-3", "PRESENT")

// Mark student as ABSENT
window.testMarkAttendance("att-3", "ABSENT")
```

### Bulk Operations

```javascript
// Mark all unmarked students as PRESENT
window.testMarkAllPresent("trip-1")

// Mark all unmarked students as ABSENT
window.testMarkAllAbsent("trip-1")
```

### Available Attendance IDs

**Trip 1 (trip-1):**
- `att-1` - Emma Johnson (initially PRESENT)
- `att-2` - Liam Smith (initially PRESENT)
- `att-3` - Olivia Brown (initially UNMARKED) ⭐ Use this for testing

**Trip 2 (trip-2):**
- `att-4` - Noah Davis (initially PRESENT)
- `att-5` - Ava Wilson (initially ABSENT)

---

## 📊 Expected Behavior

### Initial State (Trip 1)
```
Present: 2/3 (67%)
Absent: 0/3 (0%)
Unmarked: 1/3 (33%)

Students:
✅ Emma Johnson [Present]
✅ Liam Smith [Present]
⏱️  Olivia Brown [Unmarked]
```

### After Marking Olivia as Present
```javascript
window.testMarkAttendance("att-3", "PRESENT")
```

**Wait 10 seconds...**

```
Present: 3/3 (100%)
Absent: 0/3 (0%)
Unmarked: 0/3 (0%)

Students:
✅ Emma Johnson [Present]
✅ Liam Smith [Present]
✅ Olivia Brown [Present]  ⭐ UPDATED!
```

---

## 🔍 Debugging

### Check if Polling is Active

In browser console:
```javascript
// Check React Query cache
window.__REACT_QUERY_DEVTOOLS__
```

### Check Mock Data State

```javascript
// View current attendance data
import('./src/lib/mockData').then(m => console.log(m.mockTripAttendance))
```

### Verify API Calls

1. Open Network tab in DevTools
2. Filter by "attendance"
3. You should see GET requests every 10 seconds
4. Check response data

### Console Logs

Look for these logs:
```
✅ Mock attendance marked by driver: [Student Name] -> [Status]
📊 New counts - Present: X, Absent: Y, Unmarked: Z
```

---

## 🎯 Test Scenarios

### Scenario 1: Single Update
1. Open Admin Dashboard on Trip 1
2. Note current counts
3. Run: `window.testMarkAttendance("att-3", "PRESENT")`
4. Wait 10 seconds
5. ✅ Verify UI updates automatically

### Scenario 2: Multiple Updates
1. Open Admin Dashboard on Trip 1
2. Run: `window.testMarkAttendance("att-3", "PRESENT")`
3. Wait 10 seconds (UI updates)
4. Run: `window.testMarkAttendance("att-3", "ABSENT")`
5. Wait 10 seconds (UI updates again)
6. ✅ Verify both updates reflected

### Scenario 3: Bulk Update
1. Reset trip data (refresh page)
2. Open Admin Dashboard on Trip 1
3. Run: `window.testMarkAllPresent("trip-1")`
4. Wait 10 seconds
5. ✅ Verify all students marked as present

### Scenario 4: Admin Override
1. Open Admin Dashboard on Trip 1
2. Click "Edit" on a marked student
3. Change status and enter reason
4. Submit
5. ✅ Verify immediate update (no 10-second wait)

### Scenario 5: Multiple Tabs
1. Open Admin Dashboard in two browser tabs
2. In Tab 1, run: `window.testMarkAttendance("att-3", "PRESENT")`
3. Wait 10 seconds
4. ✅ Verify both tabs update

---

## 🐛 Troubleshooting

### UI Not Updating

**Check 1: Is polling enabled?**
```typescript
// In TripAttendanceView.tsx
refetchInterval: 10000 // Should be present
```

**Check 2: Is mock API enabled?**
```bash
# Check .env file
VITE_USE_MOCK=true
VITE_USE_MOCK_API=true
```

**Check 3: Are test utilities loaded?**
```javascript
// Should see in console:
🧪 Test utilities loaded!
```

**Check 4: Is data actually changing?**
```javascript
// Before update
import('./src/lib/mockData').then(m => console.log(m.mockTripAttendance['trip-1']))

// Mark attendance
window.testMarkAttendance("att-3", "PRESENT")

// After update
import('./src/lib/mockData').then(m => console.log(m.mockTripAttendance['trip-1']))
```

### Polling Stopped

**Possible causes:**
- Component unmounted
- Modal is open (polling continues in background)
- Network error
- React Query cache issue

**Solution:**
- Refresh the page
- Close any open modals
- Check browser console for errors

### Mock Data Reset

If mock data resets on page refresh:
- This is expected behavior
- Mock data is in-memory only
- Refresh = fresh start

---

## 📈 Performance Notes

### Polling Interval
- **Current:** 10 seconds
- **Adjustable:** Change `refetchInterval` in `TripAttendanceView.tsx`
- **Recommendation:** 10-30 seconds for production

### Memory Management
- Polling stops when component unmounts
- No memory leaks
- React Query handles cleanup

### Network Efficiency
- Only fetches when data might have changed
- Uses React Query cache
- Minimal bandwidth usage

---

## 🎓 How It Works

### 1. Global Mock State
```typescript
// mockData.ts
export const mockTripAttendance = {
  'trip-1': {
    attendance: [...]
  }
}
```

### 2. Mock API Endpoint
```typescript
// mockApi.ts
if (url === '/attendance') {
  return getMockTripAttendance(tripId); // Returns current state
}
```

### 3. React Query Polling
```typescript
// TripAttendanceView.tsx
useQuery({
  queryKey: ['tripAttendance', tripId],
  queryFn: () => attendanceService.fetchTripAttendance(tripId),
  refetchInterval: 10000, // Poll every 10 seconds
})
```

### 4. Automatic Re-render
- React Query detects data change
- Component re-renders with new data
- UI updates automatically

---

## ✅ Success Criteria

- [ ] Test utilities load in console
- [ ] Can mark attendance via console commands
- [ ] Console shows success messages
- [ ] Admin UI updates within 10 seconds
- [ ] No manual refresh needed
- [ ] Counts update correctly
- [ ] Status badges change color
- [ ] Works across multiple tabs
- [ ] Admin override works instantly
- [ ] No console errors

---

## 📝 Notes

### Mock vs Real API
- **Mock:** Updates global JavaScript object
- **Real:** Updates PostgreSQL database
- **Behavior:** Identical from UI perspective

### Polling in Production
- Real API will have same polling behavior
- Backend handles concurrent updates
- Database ensures data consistency

### Testing Best Practices
1. Start with fresh page load
2. Use console commands to simulate driver
3. Wait full 10 seconds for update
4. Verify counts and status badges
5. Test multiple scenarios

---

## 🚀 Next Steps

After confirming polling works:
1. Test with real backend API
2. Adjust polling interval if needed
3. Add loading indicators during refetch
4. Implement optimistic updates
5. Add error retry logic

---

**Last Updated:** March 21, 2026  
**Status:** ✅ Ready for Testing  
**Polling Interval:** 10 seconds
