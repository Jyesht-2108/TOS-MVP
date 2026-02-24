# Sample Routes Overview

This document provides a visual overview of the sample routes available in mock mode.

## Quick Start

1. Ensure `VITE_USE_MOCK_API=true` in your `.env` file
2. Run `npm run dev`
3. Navigate to `/admin/routes`
4. Click "View Details" on any route

---

## Route 1: North District Route ✅

**Status:** ACTIVE  
**Created:** January 15, 2024  
**Driver:** John Anderson (+1-555-0101)  
**Students:** 3

### Assigned Students:
- ✅ Emma Johnson (ACTIVE)
- ✅ Liam Smith (ACTIVE)
- ✅ Olivia Brown (ACTIVE)

**What to test:**
- View route with full data
- See assigned driver information
- View multiple students in table
- Test remove student functionality

---

## Route 2: South District Route ✅

**Status:** ACTIVE  
**Created:** January 16, 2024  
**Driver:** Sarah Thompson (+1-555-0102)  
**Students:** 2

### Assigned Students:
- ✅ Noah Davis (ACTIVE)
- ✅ Ava Wilson (ACTIVE)

**What to test:**
- Another active route with driver
- Different driver assignment
- Smaller student list

---

## Route 3: East District Route ⚠️

**Status:** INACTIVE  
**Created:** January 10, 2024  
**Driver:** Unassigned  
**Students:** 0

**What to test:**
- Inactive route status badge
- Unassigned driver state
- Empty students list
- Call-to-action buttons for assignment

---

## Route 4: West District Route ✅

**Status:** ACTIVE  
**Created:** January 18, 2024  
**Driver:** Michael Chen (+1-555-0103)  
**Students:** 1

### Assigned Students:
- ⚠️ Ethan Martinez (INACTIVE)

**What to test:**
- Route with inactive student
- Status badge variations
- Single student in list

---

## Testing Scenarios

### Scenario 1: View Complete Route
1. Go to Routes page
2. Click "View Details" on "North District Route"
3. Verify all information displays correctly
4. Check driver section shows John Anderson with "Track Location" button
5. Verify 3 students appear in table
6. Test "Track Live Route" button in header
7. Test "Edit Route" button in header

### Scenario 2: View Empty Route
1. Go to Routes page
2. Click "View Details" on "East District Route"
3. Verify "No Driver Assigned" message
4. Verify "No Students Assigned" message
5. Check call-to-action buttons are present

### Scenario 3: Remove Student
1. Go to "North District Route" details
2. Click "Remove" on any student
3. Confirm the removal dialog
4. Verify student is removed from list
5. Verify student count updates

### Scenario 4: Track Live Route
1. From any route details page
2. Click "Track Live Route" button in header
3. Verify toast notification appears
4. (Feature placeholder for future implementation)

### Scenario 5: Track Driver Location
1. Go to "North District Route" details
2. Click "Track Location" button next to driver
3. Verify toast notification appears
4. (Feature placeholder for future implementation)

### Scenario 6: Assign Students
1. From any route details page
2. Click "Assign Students" button
3. Verify toast notification appears
4. (Dialog will be implemented in Task 13)

### Scenario 7: Assign Driver
1. From any route details page
2. Click "Assign Driver" button
3. Verify toast notification appears
4. (Dialog will be implemented in Task 12)

### Scenario 8: Navigation
1. From any route details page
2. Click "Back" button
3. Verify return to routes list
4. Verify routes list still shows all routes

### Scenario 9: Status Badges
1. View "North District Route" - see ACTIVE badge (default variant)
2. View "East District Route" - see INACTIVE badge (secondary variant)
3. View "West District Route" - see INACTIVE student badge

---

## Mock Data Statistics

- **Total Routes:** 4
- **Active Routes:** 3
- **Inactive Routes:** 1
- **Total Students:** 6
- **Active Students:** 5
- **Inactive Students:** 1
- **Total Drivers:** 3
- **Assigned Drivers:** 3
- **Unassigned Routes:** 1

---

## API Endpoints Mocked

All the following endpoints return realistic data:

```
GET    /routes                              → List all routes
GET    /routes/:routeId                     → Get route details
GET    /routes/:routeId/students            → Get route students
GET    /routes/:routeId/drivers             → Get driver assignments
POST   /routes                              → Create new route
DELETE /routes/:routeId                     → Delete route
DELETE /routes/:routeId/students/:studentId → Remove student
```

---

## Visual Reference

### Routes List View
```
┌─────────────────────────────────────────────────────────────┐
│ Route Name              Status    Driver           Students │
├─────────────────────────────────────────────────────────────┤
│ North District Route    ACTIVE    John Anderson    👥 3     │
│ South District Route    ACTIVE    Sarah Thompson   👥 2     │
│ East District Route     INACTIVE  Unassigned       👥 0     │
│ West District Route     ACTIVE    Michael Chen     👥 1     │
└─────────────────────────────────────────────────────────────┘
```

### Route Details View (North District Route)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back                    [Track Live Route] [Edit Route]                   │
│                                                                              │
│ North District Route                                                         │
│ Route details and assignments                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Route Information                                                            │
│ ┌──────────────┬──────────────┬──────────────────────────────────────────┐ │
│ │ Route Name   │ Status       │ Created Date                             │ │
│ │ North Dist.. │ ACTIVE       │ 📅 Jan 15, 2024                         │ │
│ └──────────────┴──────────────┴──────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ Assigned Driver                                        [Assign Driver]      │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 John Anderson                              [Track Location]         │ │
│ │    Assigned since Jan 15, 2024                                         │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ Assigned Students                                      [Assign Students]    │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Name            Status    Actions                                      │ │
│ ├────────────────────────────────────────────────────────────────────────┤ │
│ │ Emma Johnson    ACTIVE    [Remove]                                     │ │
│ │ Liam Smith      ACTIVE    [Remove]                                     │ │
│ │ Olivia Brown    ACTIVE    [Remove]                                     │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

After testing with mock data, you can:

1. Implement the "Assign Driver" dialog (Task 12)
2. Implement the "Assign Students" dialog (Task 13)
3. Implement the "Edit Route" functionality
4. Connect to real backend API by setting `VITE_USE_MOCK_API=false`
