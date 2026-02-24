# Mock Data Guide

This guide explains how to use the mock data feature for frontend development and testing.

## Overview

The mock data system allows you to develop and test the frontend without a running backend server. It intercepts API calls and returns realistic sample data.

## Enabling Mock Data

Set the following environment variable in your `.env` file:

```env
VITE_USE_MOCK_API=true
```

When enabled, you'll see a console message: `🎭 Mock API enabled - Using sample data`

## Sample Data

### Routes (4 routes)

1. **North District Route** (ACTIVE)
   - Driver: John Anderson
   - Students: 3 (Emma Johnson, Liam Smith, Olivia Brown)
   - Created: Jan 15, 2024

2. **South District Route** (ACTIVE)
   - Driver: Sarah Thompson
   - Students: 2 (Noah Davis, Ava Wilson)
   - Created: Jan 16, 2024

3. **East District Route** (INACTIVE)
   - Driver: Unassigned
   - Students: 0
   - Created: Jan 10, 2024

4. **West District Route** (ACTIVE)
   - Driver: Michael Chen
   - Students: 1 (Ethan Martinez - INACTIVE)
   - Created: Jan 18, 2024

### Students (6 students)

- Emma Johnson (ACTIVE)
- Liam Smith (ACTIVE)
- Olivia Brown (ACTIVE)
- Noah Davis (ACTIVE)
- Ava Wilson (ACTIVE)
- Ethan Martinez (INACTIVE)

### Drivers (3 drivers)

- John Anderson (+1-555-0101)
- Sarah Thompson (+1-555-0102)
- Michael Chen (+1-555-0103)

## Features Demonstrated

### Route Details Page

The mock data demonstrates all features of the route details page:

1. **Route with Driver and Students** - View "North District Route" to see:
   - Route information with status badge
   - Assigned driver with details and "Track Location" button
   - Multiple students in the table
   - Remove student functionality
   - "Track Live Route" action in header

2. **Route without Driver** - View "East District Route" to see:
   - Unassigned driver state
   - Empty students list
   - Call-to-action buttons

3. **Route with Inactive Student** - View "West District Route" to see:
   - Student with INACTIVE status badge

### Available Actions

The route details page includes the following actions:

1. **Track Live Route** - Monitor the real-time location of the route (header button)
2. **Edit Route** - Modify route name and status (header button)
3. **Assign Driver** - Assign or reassign a driver to the route
4. **Track Location** - Track the assigned driver's current location (when driver is assigned)
5. **Assign Students** - Add multiple students to the route
6. **Remove Student** - Remove individual students from the route (with confirmation)

### Supported Operations

The mock API supports the following operations:

- ✅ GET `/routes` - List all routes
- ✅ GET `/routes/:routeId` - Get route details
- ✅ GET `/routes/:routeId/students` - Get route students
- ✅ GET `/routes/:routeId/drivers` - Get driver assignments
- ✅ POST `/routes` - Create new route
- ✅ DELETE `/routes/:routeId` - Delete route
- ✅ DELETE `/routes/:routeId/students/:studentId` - Remove student from route

## Testing the Implementation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Login with admin credentials (if authentication is implemented)

3. Navigate to the Routes page (`/admin/routes`)

4. Click "View Details" on any route to see the route details page

5. Test the following features:
   - View route information
   - See assigned driver (or unassigned state)
   - Click "Track Live Route" to see live tracking notification
   - Click "Track Location" on assigned driver to track driver location
   - Click "Edit Route" to edit route details
   - Click "Assign Driver" to assign a driver
   - View students list
   - Click "Assign Students" to add students
   - Remove a student (with confirmation)
   - Navigate back to routes list

## Customizing Mock Data

To add or modify mock data, edit the following file:

```
frontend/src/lib/mockData.ts
```

You can:
- Add more routes
- Add more students
- Add more drivers
- Modify route assignments
- Change statuses

## Disabling Mock Data

To use the real backend API, set in your `.env` file:

```env
VITE_USE_MOCK_API=false
```

Or remove the variable entirely.

## Development Tips

1. **Console Logging**: The mock API logs when it's enabled, making it easy to verify the mode
2. **Data Persistence**: Mock data changes (like removing students) persist during the session but reset on page reload
3. **Error Testing**: You can modify the mock API to return error responses for testing error handling
4. **Network Tab**: API calls still appear in the browser's Network tab, making debugging easier

## File Structure

```
frontend/src/lib/
├── api.ts          # Main API client with interceptors
├── mockApi.ts      # Mock API interceptor logic
└── mockData.ts     # Sample data definitions
```
