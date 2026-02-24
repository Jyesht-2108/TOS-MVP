# Getting Started with Mock Data

This guide will help you quickly start the application with sample data to see the implemented route details functionality.

## Prerequisites

- Node.js installed
- Dependencies installed (`npm install`)

## Quick Start (3 steps)

### Step 1: Enable Mock Data

The `.env` file should already have:
```env
VITE_USE_MOCK_API=true
```

If not, add this line to your `.env` file.

### Step 2: Start Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
🎭 Mock API enabled - Using sample data
```

### Step 3: View the Application

1. Open your browser to `http://localhost:5173`
2. Login (if authentication is implemented)
3. Navigate to **Routes** page
4. Click **"View Details"** on any route

## What You'll See

### Routes List Page (`/admin/routes`)

You'll see 4 sample routes:
- **North District Route** - Active, with driver and 3 students
- **South District Route** - Active, with driver and 2 students  
- **East District Route** - Inactive, no driver, no students
- **West District Route** - Active, with driver and 1 inactive student

### Route Details Page (`/admin/routes/:routeId`)

Click "View Details" on any route to see:

#### ✅ Route Information Card
- Route name
- Status badge (ACTIVE/INACTIVE)
- Created date with calendar icon

#### ✅ Assigned Driver Card
- Driver name and avatar (if assigned)
- Assignment date
- "Track Location" button (if driver assigned)
- "Unassigned" state (if no driver)
- "Assign Driver" button

#### ✅ Assigned Students Card
- Table with student names and statuses
- Remove button for each student
- Empty state (if no students)
- "Assign Students" button

#### ✅ Header Actions
- "Track Live Route" button - Monitor route in real-time
- "Edit Route" button - Modify route details
- "Back" button - Return to routes list

## Testing Features

### Test 1: View Route with Full Data
```
Route: North District Route
Expected: See driver (John Anderson) with "Track Location" button and 3 students
Actions: Test "Track Live Route" and "Track Location" buttons
```

### Test 2: View Route without Driver
```
Route: East District Route
Expected: See "No Driver Assigned" message
Actions: Test "Assign Driver" button
```

### Test 3: Remove Student
```
1. Go to North District Route
2. Click "Remove" on Emma Johnson
3. Confirm the dialog
4. Student should be removed from list
```

### Test 4: Track Live Route
```
1. Click "View Details" on any active route
2. Click "Track Live Route" button in header
3. Toast notification should appear
```

### Test 5: Track Driver Location
```
1. Go to North District Route (has assigned driver)
2. Click "Track Location" button next to driver
3. Toast notification should appear
```

### Test 6: Assign Students
```
1. Click "View Details" on any route
2. Click "Assign Students" button
3. Toast notification should appear (dialog coming in Task 13)
```

### Test 7: Navigation
```
1. Click "View Details" on any route
2. Click "Back" button
3. Should return to routes list
```

### Test 8: Status Badges
```
- ACTIVE routes show default badge (blue)
- INACTIVE routes show secondary badge (gray)
- INACTIVE students show secondary badge
```

## Sample Data Summary

| Route | Status | Driver | Students |
|-------|--------|--------|----------|
| North District | ACTIVE | John Anderson | 3 |
| South District | ACTIVE | Sarah Thompson | 2 |
| East District | INACTIVE | Unassigned | 0 |
| West District | ACTIVE | Michael Chen | 1 |

## Troubleshooting

### Mock data not loading?

Check the browser console for:
```
🎭 Mock API enabled - Using sample data
```

If you don't see this:
1. Verify `.env` has `VITE_USE_MOCK_API=true`
2. Restart the dev server
3. Clear browser cache

### API errors?

If you see API errors:
1. Check that `VITE_USE_MOCK_API=true` is set
2. Verify the mock API is intercepting requests
3. Check browser console for errors

### Empty routes list?

If routes list is empty:
1. Check browser console for errors
2. Verify mock data is loaded
3. Try refreshing the page

## File Locations

```
frontend/
├── .env                          # Environment config (enable mock here)
├── src/
│   ├── lib/
│   │   ├── mockData.ts          # Sample data definitions
│   │   ├── mockApi.ts           # Mock API interceptor
│   │   └── api.ts               # API client
│   └── modules/
│       └── admin/
│           └── pages/
│               ├── Routes.tsx    # Routes list page
│               └── RouteDetails.tsx  # Route details page (NEW!)
└── MOCK_DATA_GUIDE.md           # Detailed mock data guide
```

## Next Steps

After exploring the mock data:

1. **Review the implementation** - Check `RouteDetails.tsx` to see how it's built
2. **Customize mock data** - Edit `mockData.ts` to add your own test cases
3. **Implement dialogs** - Add "Assign Driver" and "Assign Students" dialogs (Tasks 12-13)
4. **Connect to backend** - Set `VITE_USE_MOCK_API=false` when backend is ready

## Additional Resources

- `MOCK_DATA_GUIDE.md` - Comprehensive guide to mock data system
- `SAMPLE_ROUTES.md` - Visual overview of all sample routes
- `.env.example` - Environment variable reference

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure the dev server is running
4. Review the mock data files for any syntax errors

---

**Happy Testing! 🚀**
