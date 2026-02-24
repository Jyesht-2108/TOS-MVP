# Route Actions Guide

This guide explains all the available actions on the Route Details page.

## Action Buttons Overview

### Header Actions (Top Right)

#### 1. Track Live Route 🗺️
**Location:** Header (top right)  
**Icon:** Navigation  
**Purpose:** Monitor the real-time location and progress of the route  
**Status:** Placeholder (shows toast notification)  
**Future Implementation:** Will open a live map view showing:
- Current route position
- Driver location
- Student pickup/drop-off points
- Estimated arrival times
- Route progress

**Use Cases:**
- Monitor route progress during active trips
- Verify driver is following the designated route
- Track delays or deviations
- Provide real-time updates to parents

---

#### 2. Edit Route ✏️
**Location:** Header (top right)  
**Icon:** Edit  
**Purpose:** Modify route name and status  
**Status:** Placeholder (shows toast notification)  
**Future Implementation:** Will open a dialog to edit:
- Route name
- Route status (ACTIVE/INACTIVE)
- Other route properties

**Use Cases:**
- Rename routes for better organization
- Activate or deactivate routes
- Update route information

---

### Driver Section Actions

#### 3. Assign Driver 👤➕
**Location:** Assigned Driver card (top right)  
**Icon:** UserPlus  
**Purpose:** Assign or reassign a driver to the route  
**Status:** Placeholder (shows toast notification)  
**Future Implementation:** Task 12 - Will open a dialog to:
- Select from available drivers
- View driver details
- Handle driver reassignment
- Set assignment date

**Use Cases:**
- Assign a driver to a new route
- Replace a driver (reassignment)
- View available drivers
- Manage driver workload

---

#### 4. Track Location 📍
**Location:** Assigned Driver card (when driver is assigned)  
**Icon:** MapPin  
**Purpose:** Track the current location of the assigned driver  
**Status:** Placeholder (shows toast notification)  
**Visibility:** Only shown when a driver is assigned  
**Future Implementation:** Will show:
- Driver's current GPS location
- Movement history
- Current speed and direction
- Last update timestamp

**Use Cases:**
- Locate driver during active trip
- Verify driver is on route
- Coordinate with driver
- Emergency situations

---

### Students Section Actions

#### 5. Assign Students 👥➕
**Location:** Assigned Students card (top right)  
**Icon:** Users  
**Purpose:** Add multiple students to the route  
**Status:** Placeholder (shows toast notification)  
**Future Implementation:** Task 13 - Will open a dialog to:
- Select multiple students
- Search/filter students
- View student details
- Bulk assign students

**Use Cases:**
- Add students to a new route
- Bulk assign students
- Reorganize route assignments
- Balance student distribution

---

#### 6. Remove Student 🗑️
**Location:** Students table (Actions column)  
**Icon:** Trash2  
**Purpose:** Remove individual student from the route  
**Status:** ✅ Fully Implemented  
**Behavior:**
- Shows confirmation dialog
- Removes student on confirmation
- Updates student count
- Shows success toast

**Use Cases:**
- Remove student who no longer needs transport
- Reassign student to different route
- Correct assignment errors
- Manage route capacity

---

## Action Flow Diagrams

### Assign Driver Flow
```
[Assign Driver Button] 
    ↓
[Driver Selection Dialog] (Task 12)
    ↓
[Select Driver from List]
    ↓
[Confirm Assignment]
    ↓
[Driver Assigned Successfully]
    ↓
[Track Location Button Appears]
```

### Assign Students Flow
```
[Assign Students Button]
    ↓
[Student Selection Dialog] (Task 13)
    ↓
[Search/Filter Students]
    ↓
[Select Multiple Students]
    ↓
[Confirm Assignment]
    ↓
[Students Added to Table]
```

### Remove Student Flow
```
[Remove Button on Student Row]
    ↓
[Confirmation Dialog]
    ↓
[User Confirms]
    ↓
[API Call to Remove]
    ↓
[Student Removed from Table]
    ↓
[Success Toast Shown]
```

### Track Live Route Flow
```
[Track Live Route Button]
    ↓
[Live Map View Opens] (Future)
    ↓
[Real-time Location Updates]
    ↓
[Route Progress Displayed]
```

---

## Action Availability Matrix

| Action | Route Active | Route Inactive | Driver Assigned | No Driver | Has Students | No Students |
|--------|--------------|----------------|-----------------|-----------|--------------|-------------|
| Track Live Route | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Route | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assign Driver | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Track Location | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Assign Students | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Remove Student | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## Testing Actions with Mock Data

### Test Track Live Route
1. Navigate to any route details page
2. Click "Track Live Route" button in header
3. Verify toast notification: "Live route tracking feature coming soon!"

### Test Track Location
1. Navigate to "North District Route" (has assigned driver)
2. Click "Track Location" button next to John Anderson
3. Verify toast notification appears

### Test Assign Driver
1. Navigate to any route details page
2. Click "Assign Driver" button
3. Verify toast notification: "Assign driver dialog coming soon!"

### Test Assign Students
1. Navigate to any route details page
2. Click "Assign Students" button
3. Verify toast notification: "Assign students dialog coming soon!"

### Test Remove Student
1. Navigate to "North District Route"
2. Click "Remove" on Emma Johnson
3. Confirm the dialog
4. Verify student is removed
5. Verify success toast appears

### Test Edit Route
1. Navigate to any route details page
2. Click "Edit Route" button in header
3. Verify toast notification: "Edit route dialog coming soon!"

---

## Implementation Status

| Action | Status | Task | Notes |
|--------|--------|------|-------|
| Track Live Route | 🟡 Placeholder | Future | Button added, shows toast |
| Edit Route | 🟡 Placeholder | Future | Button added, shows toast |
| Assign Driver | 🟡 Placeholder | Task 12 | Button added, dialog pending |
| Track Location | 🟡 Placeholder | Future | Button added, shows toast |
| Assign Students | 🟡 Placeholder | Task 13 | Button added, dialog pending |
| Remove Student | ✅ Complete | Task 11 | Fully functional |

---

## Next Steps

1. **Task 12:** Implement "Assign Driver" dialog
   - Driver selection dropdown
   - Driver search/filter
   - Reassignment handling
   - Success/error handling

2. **Task 13:** Implement "Assign Students" dialog
   - Multi-select student list
   - Student search/filter
   - Bulk assignment
   - Success/error handling

3. **Future:** Implement live tracking features
   - Real-time GPS integration
   - Map view component
   - Location updates
   - Route visualization

---

## UI/UX Guidelines

### Button Placement
- **Primary actions** (Assign Driver, Assign Students): Top right of respective cards
- **Secondary actions** (Track Location): Inline with content
- **Destructive actions** (Remove): Right-aligned in table rows
- **Navigation actions** (Track Live Route, Edit Route): Header area

### Visual Hierarchy
1. Track Live Route (primary action, header)
2. Edit Route (secondary action, header)
3. Assign Driver/Students (primary actions, cards)
4. Track Location (secondary action, inline)
5. Remove Student (destructive action, table)

### Feedback
- All actions show toast notifications
- Destructive actions require confirmation
- Loading states during API calls
- Success/error messages
- Disabled states when appropriate

---

## Accessibility

All action buttons include:
- ✅ Descriptive labels
- ✅ Icon + text for clarity
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Appropriate ARIA labels

---

## Mobile Responsiveness

On mobile devices:
- Header buttons stack vertically
- "Track Location" button remains visible
- Table actions remain accessible
- Touch-friendly button sizes
- Responsive dialogs (future)
