# Design Document

## Overview

This design document outlines the technical implementation for Sprint 1 of the School Transport Operations System (TOS) MVP backend. The implementation follows a Modular Monolith architecture pattern, organizing the system into distinct modules (Auth, Routes, Admin) with clear boundaries while maintaining a single deployable unit.

The design emphasizes:
- Thin controllers with business logic in services
- Strict naming conventions (kebab-case folders, dot.case files)
- RBAC enforcement at the API level
- Tenant isolation for multi-school support
- Database-level constraints for data integrity

## Architecture

### Architectural Style

**Modular Monolith**: The system is organized into modules with clear boundaries, avoiding cross-module dependencies except through common abstractions. This approach provides:
- Low complexity for MVP development
- Clear separation of concerns
- Easy transition to microservices if needed
- Simplified deployment and testing

### Module Structure

**Backend (Spring Boot):**
```
backend/
├── src/main/java/com/school/tos/
│   ├── config/          # Configuration (Security, DB, Logging)
│   ├── common/          # Shared utilities, exceptions, DTOs
│   │   ├── exception/   # Custom exceptions and handlers
│   │   ├── security/    # JWT utilities, RBAC
│   │   └── util/        # Common utilities
│   └── modules/
│       ├── auth/        # Authentication and authorization
│       │   ├── controller/
│       │   ├── service/
│       │   ├── dto/
│       │   └── filter/  # JWT filters
│       ├── routes/      # Route management
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   ├── entity/
│       │   └── dto/
│       └── admin/       # Admin dashboard operations
│           ├── controller/
│           ├── service/
│           └── dto/
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/    # Flyway or Liquibase migrations
└── src/test/java/       # Unit and integration tests

**Frontend (React TypeScript):**
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── auth/        # Auth guards (ProtectedRoute, RoleRoute)
│   │   ├── layout/      # Layout components (Header, AppSidebar)
│   │   └── ui/          # shadcn/ui components (button, card, input, etc.)
│   ├── modules/         # Feature modules by role
│   │   ├── admin/       # Admin module
│   │   │   ├── pages/   # Admin pages (Dashboard, Routes, etc.)
│   │   │   └── components/ # Admin-specific components
│   │   └── parent/      # Parent module
│   │       ├── pages/   # Parent pages (Dashboard, MyChildren, TransportDetails)
│   │       └── components/ # Parent-specific components
│   ├── layouts/         # Layout wrappers
│   │   ├── AdminLayout.tsx
│   │   ├── ParentLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── services/        # API service layer
│   │   ├── auth.service.ts
│   │   ├── routes.service.ts
│   │   ├── admin.service.ts
│   │   └── parent.service.ts
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx
│   ├── stores/          # Zustand stores
│   │   └── authStore.ts
│   ├── lib/             # Utilities
│   │   ├── api.ts       # Axios instance with interceptors
│   │   └── utils.ts     # Helper functions
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx          # Main app with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── public/
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

### Technology Stack

**Backend (Spring Boot Java):**
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL with UUID primary keys
- **ORM**: Spring Data JPA with Hibernate
- **Authentication**: Spring Security with JWT
- **Validation**: Jakarta Bean Validation (javax.validation)
- **Build Tool**: Maven or Gradle
- **Testing**: JUnit 5, Mockito, Spring Boot Test

**Frontend (React TypeScript):**
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite 5
- **UI Library**: shadcn/ui + Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand + React Query (@tanstack/react-query)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast notifications)
- **Testing**: Vitest, React Testing Library

## Components and Interfaces

### Auth Module

**Responsibilities:**
- Driver OTP login flow
- JWT token generation and validation
- RBAC enforcement via Spring Security
- Tenant isolation enforcement

**Key Components:**
- `AuthController.java`: Handles login endpoints
- `AuthService.java`: Business logic for authentication
- `JwtTokenProvider.java`: JWT token generation and validation
- `JwtAuthenticationFilter.java`: JWT validation filter
- `LoginRequest.java`, `LoginResponse.java`: Request/response DTOs

**APIs:**
- `POST /api/v1/auth/driver/login` - Initiate driver login with mobile number
- `POST /api/v1/auth/verify-otp` - Verify OTP and issue JWT
- `GET /api/v1/auth/me` - Get current user profile

### Routes Module

**Responsibilities:**
- Route CRUD operations
- Student assignment to routes
- Driver assignment to routes
- Route queries for drivers

**Key Components:**
- `RoutesController.java`: REST controller for route endpoints
- `RoutesService.java`: Business logic for route operations
- `RoutesRepository.java`: Spring Data JPA repository
- `Route.java`, `RouteStudent.java`, `RouteDriverAssignment.java`: JPA entities
- `CreateRouteRequest.java`, `RouteResponse.java`: Request/response DTOs

**APIs:**
- `POST /api/v1/routes` - Create new route (ADMIN)
- `GET /api/v1/routes` - List routes (ADMIN)
- `GET /api/v1/routes/{routeId}` - Get route details (ADMIN)
- `POST /api/v1/routes/{routeId}/assign-driver` - Assign driver to route (ADMIN)
- `POST /api/v1/routes/{routeId}/assign-students` - Assign students to route (ADMIN)
- `DELETE /api/v1/routes/{routeId}/students/{studentId}` - Remove student from route (ADMIN)
- `GET /api/v1/driver/routes` - Get driver's assigned routes (DRIVER)

### Admin Module

**Responsibilities:**
- Admin dashboard data aggregation
- Route overview with statistics
- Cross-module queries for monitoring

**Key Components:**
- `AdminController.java`: Admin dashboard endpoints
- `AdminService.java`: Dashboard business logic
- `RouteOverviewResponse.java`: Dashboard response DTOs

**APIs:**
- `GET /api/v1/admin/routes` - Get route overview with stats (ADMIN)
- `GET /api/v1/admin/routes/{routeId}/details` - Get detailed route info (ADMIN)

## Data Models

### Database Schema

#### routes
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  INDEX idx_routes_tenant (tenant_id)
);
```

#### route_students
```sql
CREATE TABLE route_students (
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (route_id, student_id),
  INDEX idx_route_students_student (student_id)
);
```

#### route_driver_assignment
```sql
CREATE TABLE route_driver_assignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL,
  active_from TIMESTAMP NOT NULL DEFAULT NOW(),
  active_to TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  INDEX idx_route_driver_route (route_id),
  INDEX idx_route_driver_driver (driver_id),
  INDEX idx_route_driver_active (route_id, active_to) WHERE active_to IS NULL
);
```

#### users (assumed from ERP integration)
```sql
-- Assumed to exist from ERP
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL, -- ADMIN, DRIVER, PARENT
  phone VARCHAR(20),
  name VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### students (assumed from ERP integration)
```sql
-- Assumed to exist from ERP
CREATE TABLE students (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_user_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Entity Relationships

- A Route belongs to one Tenant
- A Route can have many Students (many-to-many via route_students)
- A Route can have one active Driver at a time (one-to-many with temporal constraint)
- A Driver can be assigned to multiple Routes
- A Student can be assigned to multiple Routes

### Key Constraints

1. **Tenant Isolation**: All queries must filter by tenant_id
2. **Active Driver Uniqueness**: Only one driver per route can have active_to = NULL
3. **Referential Integrity**: Foreign keys enforce relationships
4. **Soft Deletes**: Consider using status flags instead of hard deletes

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Authentication Token Issuance
*For any* valid driver credentials, authenticating should result in a valid signed JWT token being issued
**Validates: Requirements 1.1**

### Property 2: Protected Endpoint Authorization
*For any* protected endpoint and JWT token, access should be granted only when the token is valid and the user role matches the endpoint's required role
**Validates: Requirements 1.2, 1.4, 1.5**

### Property 3: Tenant Isolation
*For any* resource and user, access should be denied when the resource belongs to a different tenant than the user's tenant
**Validates: Requirements 1.3, 2.2, 6.1**

### Property 4: Route Creation Persistence
*For any* valid route data, creating a route should result in a persisted route with the correct tenant_id and a valid UUID identifier returned
**Validates: Requirements 2.1**

### Property 5: Route Update Persistence
*For any* existing route and valid update data, updating the route should result in the changes being persisted in the database
**Validates: Requirements 2.3**

### Property 6: Input Validation Rejection
*For any* invalid input (missing required fields, invalid formats), the system should reject the request with HTTP 400 and structured error messages
**Validates: Requirements 2.4, 9.1**

### Property 7: Route Status Invariant
*For any* route in the database, the status field should be either 'ACTIVE' or 'INACTIVE'
**Validates: Requirements 2.5**

### Property 8: Student Assignment Creation
*For any* route and student, assigning the student to the route should create a route-student mapping in the database
**Validates: Requirements 3.1**

### Property 9: Multiple Route Assignment
*For any* student and multiple routes, the student can be assigned to all routes simultaneously without conflicts
**Validates: Requirements 3.2**

### Property 10: Student Assignment Removal
*For any* existing route-student assignment, removing the assignment should result in the mapping no longer existing in the database
**Validates: Requirements 3.3**

### Property 11: Student Query Completeness
*For any* route with assigned students, querying the route should return all assigned students
**Validates: Requirements 3.4**

### Property 12: Driver Assignment Creation
*For any* route and driver, assigning the driver should create a route-driver assignment with active_from timestamp and active_to as NULL
**Validates: Requirements 4.1**

### Property 13: Driver Reassignment Temporal Constraint
*For any* route with an active driver, assigning a new driver should set active_to on the previous assignment and create a new active assignment
**Validates: Requirements 4.2**

### Property 14: Active Driver Query Filtering
*For any* driver, querying their assigned routes should return only routes where they have an active assignment (active_to IS NULL)
**Validates: Requirements 4.3, 5.1**

### Property 15: Driver Assignment History Completeness
*For any* route, querying driver assignments should return all assignments including both active and historical (with active_to set)
**Validates: Requirements 4.4**

### Property 16: Single Active Driver Invariant
*For any* route at any point in time, there should be at most one driver assignment with active_to = NULL
**Validates: Requirements 4.5**

### Property 17: Route Details Completeness
*For any* route queried by an assigned driver, the response should include all students assigned to that route
**Validates: Requirements 5.2, 5.5**

### Property 18: Cross-Driver Authorization
*For any* driver and route not assigned to them, attempting to access the route should result in an authorization error
**Validates: Requirements 5.4**

### Property 19: Admin Dashboard Data Completeness
*For any* route in the admin dashboard, the response should include route name, status, assigned driver name (or unassigned), and student count
**Validates: Requirements 6.2**

### Property 20: Route Status Filtering
*For any* status filter (ACTIVE/INACTIVE), querying routes with that filter should return only routes matching the specified status
**Validates: Requirements 6.5**

### Property 21: UUID Primary Key Constraint
*For any* created entity (route, assignment), the primary key should be a valid UUID
**Validates: Requirements 7.1**

### Property 22: Foreign Key Integrity
*For any* attempt to create a reference to a non-existent entity, the database should reject the operation
**Validates: Requirements 7.2**

### Property 23: Timestamp Presence
*For any* created primary entity, the entity should have a created_at timestamp
**Validates: Requirements 7.5**

### Property 24: Authorization Error Response
*For any* unauthorized access attempt, the system should return HTTP 403 with an appropriate error message
**Validates: Requirements 9.2**

### Property 25: Not Found Error Response
*For any* request for a non-existent resource, the system should return HTTP 404 with the resource identifier
**Validates: Requirements 9.3**

### Property 26: Server Error Handling
*For any* unexpected server error, the system should return HTTP 500 and log the error with context
**Validates: Requirements 9.4**

### Property 27: Validation Before Business Logic
*For any* invalid input, the system should reject the request before executing any business logic or causing side effects
**Validates: Requirements 9.5**

### Property 28: Route Creation Logging
*For any* route creation, the system should log the event with tenant_id, route_id, and admin_id
**Validates: Requirements 10.1**

### Property 29: Driver Assignment Logging
*For any* driver assignment, the system should log the operation with route_id, driver_id, and timestamp
**Validates: Requirements 10.2**

### Property 30: Student Assignment Logging
*For any* student assignment operation, the system should log the operation with route_id and student count
**Validates: Requirements 10.3**

### Property 31: Authentication Failure Logging
*For any* failed authentication attempt, the system should log the attempt with user identifier and failure reason
**Validates: Requirements 10.4**

### Property 32: Structured Logging Format
*For any* log entry, the log should be in valid JSON format with consistent structure
**Validates: Requirements 10.5**

## Error Handling

### Error Categories

1. **Validation Errors (400)**
   - Missing required fields
   - Invalid data formats
   - Business rule violations (e.g., invalid status values)

2. **Authentication Errors (401)**
   - Missing JWT token
   - Invalid or expired JWT token
   - Invalid OTP

3. **Authorization Errors (403)**
   - Insufficient role permissions
   - Tenant isolation violations
   - Route access violations for drivers

4. **Not Found Errors (404)**
   - Route not found
   - Student not found
   - Driver not found

5. **Server Errors (500)**
   - Database connection failures
   - Unexpected exceptions
   - External service failures

### Error Response Format

All errors should follow a consistent structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Route name is required"
      }
    ],
    "timestamp": "2026-02-18T10:30:00Z",
    "path": "/api/v1/routes"
  }
}
```

### Error Handling Strategy

1. **Controller Level**: Catch and transform exceptions into HTTP responses
2. **Service Level**: Throw domain-specific exceptions
3. **Repository Level**: Throw data access exceptions
4. **Middleware**: Global error handler for unhandled exceptions

## Testing Strategy

### Unit Testing

Unit tests will focus on:
- Service layer business logic in isolation
- Input validation logic
- DTO transformations
- Utility functions

**Framework**: JUnit 5 with Mockito

**Coverage Goals**:
- Service methods: 90%+ coverage
- Critical business rules: 100% coverage
- Validation logic: 100% coverage

**Example Unit Tests**:
- Route creation with valid data
- Route creation with missing required fields
- Driver assignment with existing active driver
- Tenant isolation in queries
- JWT token validation

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs.

**Framework**: jqwik (for Java property-based testing)

**Configuration**: Each property test should run a minimum of 100 iterations

**Tagging Convention**: Each property-based test must include a comment with the format:
```java
// Feature: admin-and-routes, Property 3: Tenant Isolation
@Property
void testTenantIsolation(@ForAll UUID tenantId, @ForAll UUID resourceId) {
    // Test implementation
}
```

**Key Properties to Test**:
1. Authentication always returns valid JWT for valid credentials
2. Tenant isolation prevents cross-tenant access
3. Route creation always persists with correct tenant_id
4. Driver reassignment always maintains single active driver invariant
5. Student assignments are idempotent
6. Authorization checks prevent unauthorized access
7. Validation rejects all invalid inputs before business logic
8. Error responses always follow consistent structure

### Integration Testing

Integration tests will verify:
- API endpoints with database
- Spring Security with protected routes
- Multi-step workflows (create route → assign driver → assign students)
- Database constraints enforcement
- Transaction rollback on errors

**Framework**: Spring Boot Test with @SpringBootTest, MockMvc, TestRestTemplate

**Test Database**: Use Testcontainers with PostgreSQL for isolated testing

**Example Integration Tests**:
- Complete route creation workflow
- Driver assignment and reassignment flow
- Student assignment and removal flow
- Admin dashboard data aggregation
- Cross-tenant access prevention

### End-to-End Testing

E2E tests will verify complete user workflows:
- Admin creates route, assigns driver and students, views dashboard
- Driver logs in and views assigned routes
- Authorization failures for cross-tenant access

**Framework**: REST Assured for API E2E testing, or Selenium/Playwright for full-stack E2E with React frontend

## Implementation Notes

### Naming Conventions (Strict Enforcement)

**Backend (Java):**
- **Packages**: lowercase (e.g., `com.school.tos.modules.routes`)
- **Classes**: PascalCase (e.g., `RoutesService`, `RoutesController`)
- **Methods/Variables**: camelCase (e.g., `createRoute`, `assignDriver`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_STUDENTS_PER_ROUTE`)
- **Database Tables**: snake_case plural (e.g., `routes`, `route_students`)
- **Database Columns**: snake_case (e.g., `tenant_id`, `created_at`)

**Frontend (React TypeScript):**
- **Folders**: kebab-case (e.g., `admin-dashboard`, `route-management`)
- **Files**: PascalCase for components (e.g., `RouteList.tsx`), camelCase for utilities (e.g., `authService.ts`)
- **Components**: PascalCase (e.g., `RouteCard`, `AdminDashboard`)
- **Functions/Variables**: camelCase (e.g., `fetchRoutes`, `isAuthenticated`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Controller Pattern (Thin Controllers)

Controllers must remain thin and only:
1. Extract and validate request parameters
2. Call service methods
3. Transform service responses to HTTP responses
4. Handle HTTP-specific concerns (status codes, headers)

**Example (Spring Boot)**:
```java
// RoutesController.java
@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
public class RoutesController {
    private final RoutesService routesService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteResponse> createRoute(
            @Valid @RequestBody CreateRouteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Route route = routesService.createRoute(
            request,
            getCurrentTenantId(userDetails),
            getCurrentUserId(userDetails)
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(RouteResponse.from(route));
    }
}
```

### Service Pattern (Business Logic)

Services contain all business logic:
1. Business rule enforcement
2. Data validation beyond basic input validation
3. Orchestration of repository calls
4. Transaction management
5. Logging of business events

**Example (Spring Boot)**:
```java
// RoutesService.java
@Service
@RequiredArgsConstructor
@Slf4j
public class RoutesService {
    private final RoutesRepository routesRepository;
    
    @Transactional
    public Route createRoute(CreateRouteRequest request, UUID tenantId, UUID adminId) {
        // Business logic
        Route route = Route.builder()
            .name(request.getName())
            .tenantId(tenantId)
            .status(RouteStatus.ACTIVE)
            .build();
        
        route = routesRepository.save(route);
        
        // Logging
        log.info("Route created: routeId={}, tenantId={}, adminId={}", 
            route.getId(), tenantId, adminId);
        
        return route;
    }
}
```

### Repository Pattern (Data Access)

Repositories handle all database operations:
1. CRUD operations
2. Query building
3. Transaction handling
4. Database-specific error handling

**Example (Spring Data JPA)**:
```java
// RoutesRepository.java
@Repository
public interface RoutesRepository extends JpaRepository<Route, UUID> {
    List<Route> findByTenantId(UUID tenantId);
    
    Optional<Route> findByIdAndTenantId(UUID id, UUID tenantId);
    
    @Query("SELECT r FROM Route r WHERE r.tenantId = :tenantId AND r.status = :status")
    List<Route> findByTenantIdAndStatus(@Param("tenantId") UUID tenantId, 
                                        @Param("status") RouteStatus status);
}
```

### RBAC with Spring Security

```java
// SecurityConfig.java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/driver/**").hasRole("DRIVER")
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Tenant Isolation Middleware

```typescript
// tenant.middleware.ts
export const enforceTenantIsolation = (req: Request, res: Response, next: NextFunction) => {
  // Inject tenant_id into all queries
  req.tenantId = req.user.tenantId;
  next();
};
```

## Database Migrations

### Migration Strategy

1. Use migration tool (TypeORM migrations or Prisma migrate)
2. Version control all migrations
3. Test migrations on staging before production
4. Include rollback scripts for each migration

### Initial Schema Migration

```sql
-- 001_create_routes_tables.sql

CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routes_tenant ON routes(tenant_id);
CREATE INDEX idx_routes_status ON routes(status);

CREATE TABLE route_students (
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (route_id, student_id)
);

CREATE INDEX idx_route_students_student ON route_students(student_id);

CREATE TABLE route_driver_assignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL,
  active_from TIMESTAMP NOT NULL DEFAULT NOW(),
  active_to TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_route_driver_route ON route_driver_assignment(route_id);
CREATE INDEX idx_route_driver_driver ON route_driver_assignment(driver_id);
CREATE INDEX idx_route_driver_active ON route_driver_assignment(route_id, active_to) WHERE active_to IS NULL;

-- Constraint: Only one active driver per route
CREATE UNIQUE INDEX idx_one_active_driver_per_route 
  ON route_driver_assignment(route_id) 
  WHERE active_to IS NULL;
```

## Security Considerations

1. **JWT Security**
   - Use strong secret keys (minimum 256 bits)
   - Set appropriate token expiration (15-30 minutes for access tokens)
   - Implement refresh token mechanism
   - Store secrets in environment variables, never in code

2. **Tenant Isolation**
   - Always filter by tenant_id in queries
   - Validate tenant_id in JWT claims
   - Use database row-level security if available
   - Audit cross-tenant access attempts

3. **Input Validation**
   - Validate all inputs at controller level
   - Sanitize inputs to prevent SQL injection
   - Use parameterized queries
   - Implement rate limiting on authentication endpoints

4. **Logging**
   - Never log sensitive data (passwords, tokens)
   - Log all authentication attempts
   - Log all authorization failures
   - Include correlation IDs for request tracing

## Performance Considerations

1. **Database Indexes**
   - Index all foreign keys
   - Index tenant_id on all tenant-scoped tables
   - Index frequently queried fields (status, active_to)
   - Use partial indexes for active driver constraint

2. **Query Optimization**
   - Use eager loading for related entities when needed
   - Implement pagination for list endpoints
   - Use database connection pooling
   - Monitor slow queries and optimize

3. **Caching Strategy** (Future Enhancement)
   - Cache route details for drivers
   - Cache admin dashboard statistics
   - Use Redis for session storage
   - Implement cache invalidation on updates

## Deployment Considerations

1. **Environment Variables**
   - DATABASE_URL
   - JWT_SECRET
   - JWT_EXPIRATION
   - LOG_LEVEL
   - NODE_ENV

2. **Health Checks**
   - `/health` endpoint for liveness probe
   - `/health/ready` endpoint for readiness probe
   - Check database connectivity
   - Check external service availability

3. **Monitoring**
   - Log aggregation (ELK stack or similar)
   - Metrics collection (Prometheus)
   - Error tracking (Sentry)
   - Performance monitoring (APM)

## Future Enhancements (Out of Scope for Sprint 1)

1. Route ordering and optimization
2. Student pickup sequence
3. Real-time notifications
4. GPS tracking integration
5. Trip management
6. Attendance tracking
7. Parent portal
8. Advanced reporting and analytics
