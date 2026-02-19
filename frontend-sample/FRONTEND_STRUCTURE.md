# School ERP Frontend - Complete Structure

## Overview
Single React + Vite application with role-based routing for all user types.

## Technology Stack
- React 18 + TypeScript
- Vite 5
- React Router v6
- Tailwind CSS + shadcn/ui
- Zustand + React Query
- Axios

## Module Structure

### 1. Admin Module (`/admin`)
**Pages:**
- Dashboard - Overview with stats and quick actions
- Users - User management (teachers, staff, etc.)
- Classes - Class and section management
- Gallery - Photo gallery management

**Routes:**
- `/admin` - Dashboard
- `/admin/users` - User management
- `/admin/classes` - Class management
- `/admin/gallery` - Gallery management

### 2. Teacher Module (`/teacher`)
**Pages:**
- Dashboard - Teacher overview with schedule
- Attendance - Mark student attendance
- Marks - Enter and manage student marks
- Diary - Create homework and class notes

**Routes:**
- `/teacher` - Dashboard
- `/teacher/attendance` - Attendance marking
- `/teacher/marks` - Marks entry
- `/teacher/diary` - Class diary

### 3. Student Module (`/student`)
**Pages:**
- Dashboard - Student overview with upcoming tasks
- Syllabus - View subject syllabus and progress
- Progress - Academic performance and reports
- AITutor - AI-powered tutoring chatbot

**Routes:**
- `/student` - Dashboard
- `/student/syllabus` - Syllabus viewer
- `/student/progress` - Progress reports
- `/student/ai-tutor` - AI Tutor chat

### 4. Parent Module (`/parent`)
**Pages:**
- Dashboard - Child's overview
- Attendance - View child's attendance
- Progress - View academic progress
- Payments - Fee payments and history

**Routes:**
- `/parent` - Dashboard
- `/parent/attendance` - Attendance view
- `/parent/progress` - Progress reports
- `/parent/payments` - Fee management

### 5. Accountant Module (`/accountant`)
**Pages:**
- Dashboard - Financial overview
- Invoices - Invoice management
- Payments - Payment tracking and reconciliation

**Routes:**
- `/accountant` - Dashboard
- `/accountant/invoices` - Invoice management
- `/accountant/payments` - Payment history

### 6. Admissions Module (`/admissions`)
**Pages:**
- Dashboard - Applications overview
- ApplicationDetail - View and process applications
- PublicForm - Public admission application form

**Routes:**
- `/admissions` - Dashboard
- `/admissions/applications/:id` - Application details
- `/apply` - Public application form (no auth required)

## Shared Components

### UI Components (`/components/ui`)
- button.tsx - Button component
- input.tsx - Input field
- card.tsx - Card container
- table.tsx - Data table
- select.tsx - Dropdown select
- dialog.tsx - Modal dialog
- sidebar.tsx - Sidebar primitives

### Layout Components (`/components/layout`)
- Header.tsx - Top navigation bar
- AppSidebar.tsx - Role-based sidebar navigation
- MainLayout.tsx - Main layout wrapper

### Auth Components (`/components/auth`)
- ProtectedRoute.tsx - Authentication guard
- RoleRoute.tsx - Role-based access control

## Layouts (`/layouts`)
- AdminLayout.tsx - Admin module layout
- TeacherLayout.tsx - Teacher module layout
- StudentLayout.tsx - Student module layout
- ParentLayout.tsx - Parent module layout
- AccountantLayout.tsx - Accountant module layout
- PublicLayout.tsx - Public pages layout

## Services (`/services`)
- auth.service.ts - Authentication API calls
- student.service.ts - Student management
- admissions.service.ts - Admissions workflow
- attendance.service.ts - Attendance tracking
- payment.service.ts - Fee and payment management
- chatbot.service.ts - AI chatbot integration

## Context & State
- AuthContext.tsx - Authentication state management
- Zustand stores for global state
- React Query for server state

## Routing Strategy
- Role-based routing with nested routes
- Protected routes requiring authentication
- Public routes for admission forms
- Automatic redirection based on user role

## Key Features
✅ Single unified frontend application
✅ Role-based access control (RBAC)
✅ Responsive design with Tailwind CSS
✅ Modern UI with shadcn/ui components
✅ Type-safe with TypeScript
✅ Optimized with Vite
✅ State management with Zustand + React Query
✅ API integration with Axios

## Next Steps
1. Install dependencies: `npm install`
2. Configure environment variables
3. Connect to backend API gateway
4. Test all module routes
5. Add authentication flow
6. Implement API integrations
