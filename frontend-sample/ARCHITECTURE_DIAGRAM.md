# School ERP Frontend Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SCHOOL ERP FRONTEND                          │
│                    Single React + Vite Application                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          PUBLIC ROUTES                               │
├─────────────────────────────────────────────────────────────────────┤
│  /login              → Login Page                                    │
│  /apply              → Public Admission Form                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       PROTECTED ROUTES (RBAC)                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│   ADMIN MODULE       │  │  TEACHER MODULE      │  │ STUDENT MODULE  │
├──────────────────────┤  ├──────────────────────┤  ├─────────────────┤
│ /admin               │  │ /teacher             │  │ /student        │
│  ├─ Dashboard        │  │  ├─ Dashboard        │  │  ├─ Dashboard   │
│  ├─ Users            │  │  ├─ Attendance       │  │  ├─ Syllabus    │
│  ├─ Classes          │  │  ├─ Marks            │  │  ├─ Progress    │
│  └─ Gallery          │  │  └─ Diary            │  │  └─ AI Tutor    │
└──────────────────────┘  └──────────────────────┘  └─────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│   PARENT MODULE      │  │ ACCOUNTANT MODULE    │  │ ADMISSIONS      │
├──────────────────────┤  ├──────────────────────┤  ├─────────────────┤
│ /parent              │  │ /accountant          │  │ /admissions     │
│  ├─ Dashboard        │  │  ├─ Dashboard        │  │  ├─ Dashboard   │
│  ├─ Attendance       │  │  ├─ Invoices         │  │  └─ Apps/:id    │
│  ├─ Progress         │  │  └─ Payments         │  └─────────────────┘
│  └─ Payments         │  └──────────────────────┘
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        SHARED COMPONENTS                             │
├─────────────────────────────────────────────────────────────────────┤
│  UI Components:                                                      │
│  ├─ Button, Input, Card, Table, Select, Dialog                      │
│  └─ Sidebar primitives                                               │
│                                                                       │
│  Layout Components:                                                  │
│  ├─ Header (Top navigation)                                          │
│  ├─ AppSidebar (Role-based navigation)                               │
│  └─ MainLayout (Wrapper)                                             │
│                                                                       │
│  Auth Components:                                                    │
│  ├─ ProtectedRoute (Auth guard)                                      │
│  └─ RoleRoute (RBAC guard)                                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          LAYOUTS                                     │
├─────────────────────────────────────────────────────────────────────┤
│  AdminLayout, TeacherLayout, StudentLayout                           │
│  ParentLayout, AccountantLayout, PublicLayout                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       API SERVICES                                   │
├─────────────────────────────────────────────────────────────────────┤
│  auth.service.ts        → Authentication                             │
│  student.service.ts     → Student management                         │
│  admissions.service.ts  → Admissions workflow                        │
│  attendance.service.ts  → Attendance tracking                        │
│  payment.service.ts     → Fee management                             │
│  chatbot.service.ts     → AI chatbot                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                                  │
├─────────────────────────────────────────────────────────────────────┤
│  AuthContext          → User authentication state                    │
│  Zustand Stores       → Global app state                             │
│  React Query          → Server state & caching                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                     │
├─────────────────────────────────────────────────────────────────────┤
│  API Gateway (Port 8000)                                             │
│  ├─ Auth Service (8001)                                              │
│  ├─ Academic Service (8002)                                          │
│  ├─ Student Service (8003)                                           │
│  ├─ Attendance Service (8004)                                        │
│  ├─ Assessment Service (8005)                                        │
│  ├─ Communication Service (8006)                                     │
│  ├─ Admissions Service (8007)                                        │
│  ├─ Fee Service (8008)                                               │
│  └─ ... (other microservices)                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                         │
└─────────────────────────────────────────────────────────────────────┘

User → Login → AuthContext → Role Detection → Role-based Redirect
                    ↓
              Protected Route
                    ↓
              Role-based Layout (Sidebar + Header)
                    ↓
              Module Pages (Dashboard, Features)
                    ↓
              API Services (Axios)
                    ↓
              API Gateway → Microservices
                    ↓
              PostgreSQL Database

┌─────────────────────────────────────────────────────────────────────┐
│                    ROLE-BASED ACCESS                                 │
└─────────────────────────────────────────────────────────────────────┘

Admin/Principal    → Full access to admin module
Teacher            → Access to teaching tools
Student            → Access to learning resources
Parent             → View child's progress & payments
Accountant         → Financial management
Admissions Staff   → Application processing

┌─────────────────────────────────────────────────────────────────────┐
│                    KEY FEATURES                                      │
└─────────────────────────────────────────────────────────────────────┘

✅ Single Unified Frontend
✅ Role-Based Access Control (RBAC)
✅ Responsive Design (Mobile-first)
✅ Modern UI (Tailwind + shadcn/ui)
✅ Type-Safe (TypeScript)
✅ Fast Build (Vite)
✅ State Management (Zustand + React Query)
✅ API Integration (Axios)
✅ Authentication (JWT)
✅ Real-time Updates
✅ AI-Powered Features
```

## Component Hierarchy

```
App.tsx
├── AuthProvider
│   └── BrowserRouter
│       └── Routes
│           ├── PublicLayout
│           │   ├── /login → Login
│           │   └── /apply → PublicForm
│           │
│           └── ProtectedRoute
│               ├── AdminLayout (RoleRoute: admin)
│               │   ├── AppSidebar
│               │   ├── Header
│               │   └── Outlet
│               │       ├── Dashboard
│               │       ├── Users
│               │       ├── Classes
│               │       └── Gallery
│               │
│               ├── TeacherLayout (RoleRoute: teacher)
│               │   ├── AppSidebar
│               │   ├── Header
│               │   └── Outlet
│               │       ├── Dashboard
│               │       ├── Attendance
│               │       ├── Marks
│               │       └── Diary
│               │
│               ├── StudentLayout (RoleRoute: student)
│               │   ├── AppSidebar
│               │   ├── Header
│               │   └── Outlet
│               │       ├── Dashboard
│               │       ├── Syllabus
│               │       ├── Progress
│               │       └── AITutor
│               │
│               ├── ParentLayout (RoleRoute: parent)
│               │   ├── AppSidebar
│               │   ├── Header
│               │   └── Outlet
│               │       ├── Dashboard
│               │       ├── Attendance
│               │       ├── Progress
│               │       └── Payments
│               │
│               ├── AccountantLayout (RoleRoute: accountant)
│               │   ├── AppSidebar
│               │   ├── Header
│               │   └── Outlet
│               │       ├── Dashboard
│               │       ├── Invoices
│               │       └── Payments
│               │
│               └── AdmissionsLayout (RoleRoute: admissions_staff)
│                   ├── AppSidebar
│                   ├── Header
│                   └── Outlet
│                       ├── Dashboard
│                       └── ApplicationDetail
```

## File Structure

```
frontend/
├── src/
│   ├── modules/
│   │   ├── admin/pages/
│   │   ├── teacher/pages/
│   │   ├── student/pages/
│   │   ├── parent/pages/
│   │   ├── accountant/pages/
│   │   └── admissions/pages/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── auth/
│   ├── layouts/
│   ├── services/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── App.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```
