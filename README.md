# Transport Operations System (TOS) - MVP

School Transport Operations System for managing routes, drivers, students, and real-time bus tracking.

## 🏗️ Architecture

**Multi-App System:**
- **Web Portal** (This repo) - Admin & Parent portals (React + Spring Boot)
- **Driver Mobile App** - Driver application (Flutter + Go)
- **Shared Database** - PostgreSQL with unified schema

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.1
- PostgreSQL
- Maven
- Hibernate/JPA

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS + shadcn/ui

## 📁 Project Structure

```
TOS-MVP/
├── backend/                    # Spring Boot backend
│   ├── db/
│   │   ├── schema-unified.sql  # Database schema (shared with Driver App)
│   │   └── seeds-unified.sql   # Seed data
│   └── src/main/java/com/school/transport/
│       ├── common/             # Common utilities
│       ├── config/             # Configuration
│       ├── controller/         # REST controllers
│       └── module/             # Feature modules
│           ├── attendance/     # Attendance management
│           ├── auth/           # Authentication
│           ├── notifications/  # Notifications
│           ├── routes/         # Route management
│           ├── tracking/       # GPS tracking
│           └── trips/          # Trip management
└── frontend/                   # React frontend
    └── src/
        ├── components/         # Reusable components
        ├── modules/            # Feature modules
        │   ├── admin/          # Admin portal
        │   └── parent/         # Parent portal
        ├── services/           # API services
        └── stores/             # State management
```

## 🗄️ Database Setup

### Prerequisites
- PostgreSQL 12+
- Database user with CREATE privileges

### Setup Steps

1. **Create Database:**
```bash
createdb tos_db
```

2. **Run Schema:**
```bash
psql -d tos_db -U postgres -f backend/db/schema-unified.sql
```

3. **Load Seed Data:**
```bash
psql -d tos_db -U postgres -f backend/db/seeds-unified.sql
```

### Database Configuration

Update `backend/src/main/resources/application-dev.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tos_db
    username: postgres
    password: your_password
```

## 🚀 Running the Application

### Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Server runs on: http://localhost:8080

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

App runs on: http://localhost:5173

## 📡 API Endpoints

### Routes API
```
GET    /api/v1/routes                           # Get all routes
GET    /api/v1/routes/{id}                      # Get route by ID
POST   /api/v1/routes                           # Create route
PUT    /api/v1/routes/{id}                      # Update route
DELETE /api/v1/routes/{id}                      # Delete route
POST   /api/v1/routes/{id}/assign-driver        # Assign driver
POST   /api/v1/routes/{id}/assign-students      # Assign students
DELETE /api/v1/routes/{id}/students/{studentId} # Remove student
```

### Health Checks
```
GET /health        # Basic health check
GET /health/ready  # Database connectivity check
```

## 🔑 Default Users (Seed Data)

**Admin:**
- Email: admin@school.com
- Password: admin123

**Parent:**
- Email: parent@school.com
- Password: parent123

**Driver:**
- Email: driver1@school.com
- Password: driver123

## 📊 Database Schema

### User Management
- `tenants` - Schools/Organizations
- `users` - System users (Admin, Parent, Driver)
- `students` - Student information
- `drivers` - Driver details
- `student_parents` - Student-parent relationships

### Route Management
- `routes` - Transport routes
- `route_students` - Student-route assignments
- `route_driver_assignment` - Driver-route assignments

### Operations
- `trips` - Trip instances
- `attendance` - Student attendance
- `attendance_audit` - Attendance change history

### Tracking
- `gps_logs` - Historical GPS data
- `latest_bus_location` - Current bus location

### Notifications
- `notification_log` - WhatsApp notifications

## 🤝 Coordination with Driver App

This web portal shares the database with the Driver Mobile App:
- **Schema Owner:** Driver App maintains `schema-unified.sql`
- **Coordination:** Schema changes must be coordinated between both teams
- **Compatibility:** All entities are compatible with unified schema

## 🔧 Development

### Build Backend
```bash
cd backend
mvn clean compile
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Run Tests
```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

## 📝 Implementation Status

### ✅ Completed
- Database schema (14 tables)
- JPA entities (9 entities)
- Repositories (9 repositories)
- Routes API (8 endpoints)
- Security configuration
- Exception handling
- Frontend UI (all pages)

### 🔄 In Progress
- Authentication/JWT
- Trips API
- Attendance API

### ⏳ Planned
- GPS Tracking API
- Notification Service
- Driver Management API
- Student Management API
- Reports & Analytics

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `application-dev.yml`
- Ensure database `tos_db` exists

### Build Failures
```bash
# Clean and rebuild
cd backend
mvn clean install
```

## 📄 License

Proprietary - All rights reserved

## 👥 Team

- Web Portal: Spring Boot + React
- Driver App: Flutter + Go
- Shared Database: PostgreSQL

---

**Last Updated:** 2026-03-09  
**Version:** 1.0.0-MVP
