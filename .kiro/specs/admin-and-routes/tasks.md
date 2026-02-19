# Implementation Plan

**IMPORTANT NOTE**: This implementation focuses ONLY on Admin and Parent portals. Driver functionality will be handled by a separate mobile application and is NOT part of this web portal implementation.

## Frontend (React TypeScript) - Priority Implementation

- [x] 1. Set up React TypeScript project with modern stack
  - Create React app with Vite 5 and TypeScript
  - Install core dependencies: React Router v6, Axios, Zustand, React Query
  - Install UI dependencies: shadcn/ui, Tailwind CSS, Lucide React, Framer Motion, Sonner
  - Install form dependencies: React Hook Form, Zod
  - Set up Tailwind CSS configuration matching frontend-sample design system
  - Configure path aliases (@/) in tsconfig and vite.config
  - Set up folder structure: components, modules, layouts, services, contexts, stores, lib, types
  - Create index.css with Tailwind imports and custom CSS variables
  - _Requirements: 8.1_

- [x] 2. Set up shadcn/ui component library
  - Initialize shadcn/ui in the project
  - Install base UI components: button, input, card, label, select, dialog, dropdown-menu
  - Install additional components: table, tabs, toast, avatar, separator, switch, checkbox
  - Install sidebar components for navigation
  - Configure components/ui folder structure
  - Set up Tailwind theme with CSS variables (primary, secondary, accent, etc.)
  - _Requirements: 8.1_

- [x] 3. Implement authentication context and services
  - Create AuthContext with login, logout, and user state
  - Create authStore using Zustand for global auth state
  - Create auth.service.ts with API methods (login, logout, getCurrentUser)
  - Set up Axios instance in lib/api.ts with base URL and interceptors
  - Add JWT token interceptor to attach token to requests
  - Add 401 response interceptor for automatic logout
  - Create types for User, LoginRequest, LoginResponse
  - _Requirements: 1.1, 1.2_

- [x] 4. Create authentication guards and routing
  - Create ProtectedRoute component for authentication guard
  - Create RoleRoute component for role-based access control
  - Set up React Router with role-based routing structure (Admin and Parent only)
  - Create PublicLayout for login page
  - Create AdminLayout with sidebar and header
  - Create ParentLayout with sidebar and header
  - Configure route structure: /login, /admin/*, /parent/* (NO driver routes)
  - _Requirements: 1.2, 1.4, 1.5_

- [x] 5. Implement login page
  - Create Login page component with modern card design
  - Add email and password input fields with validation
  - Implement login form submission with loading states
  - Add error handling with toast notifications
  - Add role-based redirection after successful login
  - Style with Tailwind CSS matching frontend-sample aesthetic
  - Add demo credentials quick login buttons (Admin, Parent)
  - _Requirements: 1.1_

- [x] 6. Create shared layout components
  - Create Header component with user profile dropdown and logout
  - Create AppSidebar component with role-based navigation
  - Add navigation items for Admin: Dashboard, Routes, Drivers, Students
  - Add navigation items for Parent: Dashboard, My Children, Transport Info
  - NO driver navigation items (driver portal not implemented in web app)
  - Implement sidebar collapse/expand functionality
  - Add icons using Lucide React
  - Style with dark sidebar theme matching frontend-sample
  - _Requirements: 8.1_

- [x] 7. Implement routes service and types
  - Create routes.service.ts with API methods
  - Implement fetchRoutes, createRoute, updateRoute, deleteRoute methods
  - Implement assignDriver, assignStudents, removeStudent methods
  - Create TypeScript types: Route, RouteStatus, CreateRouteRequest, RouteResponse
  - Create types for Student, Driver, RouteStudent, RouteDriverAssignment
  - Add proper error handling and type safety
  - _Requirements: 2.1, 2.2, 3.1, 4.1_

- [x] 8. Create admin dashboard page
  - Create AdminDashboard page component
  - Add welcome header with user name
  - Create stat cards showing: Total Routes, Active Routes, Total Drivers, Total Students
  - Add recent activity section
  - Add quick actions cards (Create Route, Assign Driver, View Reports)
  - Use shadcn/ui Card components with modern styling
  - Add loading states and error handling
  - Implement with React Query for data fetching
  - _Requirements: 6.1, 6.2_

- [x] 8.1 Clean up driver portal code
  - Remove DriverLayout component from layouts
  - Remove driver module folder (modules/driver)
  - Remove driver routes from App.tsx
  - Remove driver navigation items from AppSidebar
  - Update types to remove driver-specific types if not needed by admin
  - Update login redirect logic to only handle ADMIN and PARENT roles
  - _Requirements: 8.1_

- [ ] 9. Create routes list page for admin
  - Create Routes page component in admin module
  - Implement data table with columns: Route Name, Status, Driver, Student Count, Actions
  - Add filter dropdown for status (All, Active, Inactive)
  - Add search functionality for route names
  - Add "Create Route" button opening a dialog
  - Implement row actions: View Details, Edit, Assign Driver, Assign Students, Delete
  - Use shadcn/ui Table, Button, Badge components
  - Add loading skeleton and empty state
  - Integrate with React Query for data fetching and mutations
  - _Requirements: 2.2, 6.1, 6.2, 6.5_

- [ ] 10. Create route creation dialog
  - Create CreateRouteDialog component
  - Implement form with React Hook Form and Zod validation
  - Add fields: Route Name (required), Status (Active/Inactive)
  - Add form validation with error messages
  - Implement submit handler calling routes.service.createRoute
  - Add loading state during submission
  - Show success toast on creation
  - Close dialog and refresh routes list on success
  - Style with shadcn/ui Dialog, Form, Input, Select components
  - _Requirements: 2.1, 2.4_

- [ ] 11. Create route details page
  - Create RouteDetails page component
  - Display route information: Name, Status, Created Date
  - Show assigned driver section with driver details or "Unassigned" state
  - Show students list table with columns: Name, Status, Actions (Remove)
  - Add "Assign Driver" button opening assignment dialog
  - Add "Assign Students" button opening multi-select dialog
  - Add "Edit Route" button for updating route name/status
  - Implement remove student functionality with confirmation
  - Use shadcn/ui Card, Table, Button, Badge components
  - _Requirements: 2.2, 3.4, 4.4, 6.2_

- [ ] 12. Create driver assignment dialog
  - Create AssignDriverDialog component
  - Fetch available drivers list from API
  - Implement driver selection dropdown with search
  - Show current driver if exists with reassignment warning
  - Implement submit handler calling routes.service.assignDriver
  - Handle driver reassignment logic (setting active_to on previous)
  - Add loading state and success/error toasts
  - Close dialog and refresh route details on success
  - Style with shadcn/ui Dialog, Select, Button components
  - _Requirements: 4.1, 4.2_

- [ ] 13. Create student assignment dialog
  - Create AssignStudentsDialog component
  - Fetch available students list from API
  - Implement multi-select checkbox list for students
  - Show currently assigned students as pre-selected
  - Add search/filter functionality for students
  - Implement submit handler calling routes.service.assignStudents
  - Add loading state and success/error toasts
  - Close dialog and refresh route details on success
  - Style with shadcn/ui Dialog, Checkbox, ScrollArea components
  - _Requirements: 3.1, 3.2_

- [ ] 14. Create parent dashboard page
  - Create ParentDashboard page component
  - Add welcome header with parent name
  - Create stat cards: My Children, Active Routes, Upcoming Trips
  - Show "My Children" section with child cards
  - Display child name, assigned route, pickup/drop times for each child
  - Add "View Route Details" button on each child card
  - Use shadcn/ui Card components with modern styling
  - Add loading states and empty state for no children
  - Integrate with React Query for data fetching
  - _Requirements: 5.1, 5.5_

- [ ] 15. Create parent children list page
  - Create MyChildren page component in parent module
  - Display list of parent's children in card grid layout
  - Show child name, grade, assigned route, status on each card
  - Add "View Transport Details" button to see route and schedule
  - Implement authorization check (parent can only see their children)
  - Add empty state when parent has no children registered
  - Use shadcn/ui Card, Badge components
  - Add loading skeleton
  - _Requirements: 5.1, 5.3_

- [ ] 16. Create parent transport details page
  - Create TransportDetails page component
  - Display child information: Name, Grade, Section
  - Show assigned route information: Route Name, Driver Name, Vehicle Number
  - Show pickup and drop-off schedule with times and locations
  - Display route status (Active/Inactive)
  - Implement authorization check (parent can only access their children's info)
  - Add back button to return to children list
  - Show error message if parent tries to access unauthorized data
  - Use shadcn/ui Card, Table components
  - _Requirements: 5.2, 5.4, 5.5_

- [ ] 17. Add global error handling and loading states
  - Create ErrorBoundary component for catching React errors
  - Create LoadingSpinner component for loading states
  - Create EmptyState component for no data scenarios
  - Implement global error toast notifications
  - Add error handling in React Query with onError callbacks
  - Create NotFound page for 404 errors
  - Style error states with appropriate messaging and actions
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 18. Implement responsive design and animations
  - Ensure all pages are responsive (mobile, tablet, desktop)
  - Add Framer Motion animations for page transitions
  - Add hover effects on cards and buttons
  - Implement smooth transitions for dialogs and dropdowns
  - Test responsive sidebar collapse on mobile
  - Add loading animations using Framer Motion
  - Ensure touch-friendly UI elements on mobile
  - _Requirements: 8.1_

- [ ] 19. Add environment configuration
  - Create .env.example file with VITE_API_URL
  - Create .env file for local development
  - Configure API base URL from environment variables
  - Add environment-specific configurations
  - Document environment setup in README
  - _Requirements: 8.1_

- [ ] 20. Frontend testing setup
  - Set up Vitest for unit testing
  - Configure React Testing Library
  - Write tests for authentication context
  - Write tests for auth guards (ProtectedRoute, RoleRoute)
  - Write tests for key components (Login, Dashboard)
  - Write tests for services (auth.service, routes.service)
  - Add test scripts to package.json
  - Aim for 70%+ coverage on critical paths

- [ ] 21. Create README and documentation
  - Create comprehensive README.md for frontend
  - Document project structure and folder organization
  - Add setup instructions (install, run, build)
  - Document environment variables
  - Add component usage examples
  - Document routing structure
  - Add troubleshooting section
  - _Requirements: 8.1_

- [ ] 22. Final frontend polish and optimization
  - Optimize bundle size with code splitting
  - Add lazy loading for route components
  - Optimize images and assets
  - Add meta tags for SEO
  - Test all user flows (admin and parent only)
  - Fix any UI/UX issues
  - Ensure consistent styling across all pages
  - Test error scenarios and edge cases
  - Remove any driver-related code/components/routes from the codebase

## Backend (Spring Boot Java) - Future Implementation

**IMPORTANT NOTE**: Backend driver-related endpoints are for ADMIN management of drivers (assigning drivers to routes, viewing driver info), NOT for driver portal access. Drivers will use a separate mobile application.

- [x] 1. Set up Spring Boot project structure and core infrastructure
  - Create Spring Boot project with Maven/Gradle (Java 17+)
  - Set up package structure: com.school.tos.{config, common, modules}
  - Configure application.yml with PostgreSQL connection
  - Set up Logback for structured JSON logging
  - Configure Spring profiles (dev, test, prod)
  - Add dependencies: Spring Web, Spring Data JPA, Spring Security, PostgreSQL driver, Lombok
  - _Requirements: 7.3, 8.2, 10.5_

- [x] 1.1 Write property test for structured logging format
  - **Property 32: Structured Logging Format**
  - **Validates: Requirements 10.5**
  - Use jqwik for property-based testing

- [ ] 2. Implement database schema and migrations
  - Set up Flyway or Liquibase for database migrations
  - Create migration for routes table with UUID primary keys and indexes
  - Create migration for route_students junction table
  - Create migration for route_driver_assignment table with temporal constraints
  - Add unique constraint for single active driver per route
  - Add foreign key constraints and indexes
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 2.1 Write property test for UUID primary keys
  - **Property 21: UUID Primary Key Constraint**
  - **Validates: Requirements 7.1**

- [ ] 2.2 Write property test for foreign key integrity
  - **Property 22: Foreign Key Integrity**
  - **Validates: Requirements 7.2**

- [ ] 2.3 Write property test for timestamp presence
  - **Property 23: Timestamp Presence**
  - **Validates: Requirements 7.5**

- [ ] 3. Implement JPA entities
  - Create Route entity with @Entity, @Table annotations
  - Create RouteStudent entity for junction table
  - Create RouteDriverAssignment entity with temporal fields
  - Add @CreatedDate, @LastModifiedDate audit fields
  - Configure UUID generation strategy
  - Add proper indexes using @Table(indexes = {...})
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 4. Implement authentication and security configuration
  - Create JwtTokenProvider for JWT generation and validation
  - Create JwtAuthenticationFilter for request filtering
  - Create SecurityConfig with Spring Security configuration
  - Implement UserDetailsService for loading user details
  - Create AuthController with login endpoints (Admin and Parent only)
  - Create AuthService with authentication business logic
  - Create LoginRequest, LoginResponse DTOs
  - Note: Driver authentication NOT needed (mobile app handles this separately)
  - _Requirements: 1.1, 1.2, 8.1_

- [ ] 4.1 Write property test for authentication token issuance
  - **Property 1: Authentication Token Issuance**
  - **Validates: Requirements 1.1**

- [ ] 4.2 Write property test for authentication failure logging
  - **Property 31: Authentication Failure Logging**
  - **Validates: Requirements 10.4**

- [ ] 5. Implement RBAC and tenant isolation
  - Add @PreAuthorize annotations for role-based access control
  - Create TenantContext for thread-local tenant storage
  - Create TenantFilter to extract and set tenant from JWT
  - Implement custom AccessDeniedHandler for 403 responses
  - Implement custom AuthenticationEntryPoint for 401 responses
  - Focus on ADMIN and PARENT roles (driver role managed by mobile app)
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 9.2_

- [ ] 5.1 Write property test for protected endpoint authorization
  - **Property 2: Protected Endpoint Authorization**
  - **Validates: Requirements 1.2, 1.4, 1.5**

- [ ] 5.2 Write property test for tenant isolation
  - **Property 3: Tenant Isolation**
  - **Validates: Requirements 1.3, 2.2, 6.1**

- [ ] 5.3 Write property test for authorization error response
  - **Property 24: Authorization Error Response**
  - **Validates: Requirements 9.2**

- [ ] 6. Implement routes module - repository layer
  - Create RoutesRepository interface extending JpaRepository
  - Add custom query methods: findByTenantId, findByIdAndTenantId
  - Add query for filtering by status
  - Create RouteStudentRepository for junction table operations
  - Create RouteDriverAssignmentRepository with temporal queries
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 7. Implement routes module - service layer
  - Create RoutesService with @Service annotation
  - Implement createRoute with @Transactional and tenant validation
  - Implement updateRoute with audit trail logging
  - Implement findRoutesByTenant with tenant filtering
  - Implement findRouteById with tenant validation
  - Add structured logging using SLF4J
  - _Requirements: 2.1, 2.2, 2.3, 10.1_

- [ ] 7.1 Write property test for route creation persistence
  - **Property 4: Route Creation Persistence**
  - **Validates: Requirements 2.1**

- [ ] 7.2 Write property test for route update persistence
  - **Property 5: Route Update Persistence**
  - **Validates: Requirements 2.3**

- [ ] 7.3 Write property test for route status invariant
  - **Property 7: Route Status Invariant**
  - **Validates: Requirements 2.5**

- [ ] 7.4 Write property test for route creation logging
  - **Property 28: Route Creation Logging**
  - **Validates: Requirements 10.1**

- [ ] 8. Implement routes module - controller layer
  - Create RoutesController with @RestController
  - Implement POST /api/v1/routes endpoint with @Valid
  - Implement GET /api/v1/routes endpoint
  - Implement GET /api/v1/routes/{routeId} endpoint
  - Create CreateRouteRequest, UpdateRouteRequest, RouteResponse DTOs
  - Add @PreAuthorize("hasRole('ADMIN')") to admin endpoints
  - Add Jakarta Bean Validation annotations to DTOs
  - _Requirements: 2.1, 2.2, 8.1_

- [ ] 8.1 Write property test for input validation rejection
  - **Property 6: Input Validation Rejection**
  - **Validates: Requirements 2.4, 9.1**

- [ ] 8.2 Write property test for not found error response
  - **Property 25: Not Found Error Response**
  - **Validates: Requirements 9.3**

- [ ] 9. Implement student assignment functionality
  - Add assignStudents method to RoutesService
  - Add removeStudent method to RoutesService
  - Add getStudentsByRoute method to RoutesService
  - Implement @Transactional business logic with logging
  - Create POST /api/v1/routes/{routeId}/assign-students endpoint
  - Create DELETE /api/v1/routes/{routeId}/students/{studentId} endpoint
  - Create AssignStudentsRequest DTO
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 10.3_

- [ ] 9.1 Write property test for student assignment creation
  - **Property 8: Student Assignment Creation**
  - **Validates: Requirements 3.1**

- [ ] 9.2 Write property test for multiple route assignment
  - **Property 9: Multiple Route Assignment**
  - **Validates: Requirements 3.2**

- [ ] 9.3 Write property test for student assignment removal
  - **Property 10: Student Assignment Removal**
  - **Validates: Requirements 3.3**

- [ ] 9.4 Write property test for student query completeness
  - **Property 11: Student Query Completeness**
  - **Validates: Requirements 3.4**

- [ ] 9.5 Write property test for student assignment logging
  - **Property 30: Student Assignment Logging**
  - **Validates: Requirements 10.3**

- [ ] 10. Implement driver assignment functionality
  - Add assignDriver method to RoutesService with temporal logic
  - Add getActiveDriverForRoute method to RoutesService
  - Add getDriverAssignmentHistory method to RoutesService
  - Implement driver reassignment logic (set active_to on previous, create new)
  - Create POST /api/v1/routes/{routeId}/assign-driver endpoint
  - Create AssignDriverRequest DTO
  - Add structured logging for driver assignments
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 10.2_

- [ ] 10.1 Write property test for driver assignment creation
  - **Property 12: Driver Assignment Creation**
  - **Validates: Requirements 4.1**

- [ ] 10.2 Write property test for driver reassignment temporal constraint
  - **Property 13: Driver Reassignment Temporal Constraint**
  - **Validates: Requirements 4.2**

- [ ] 10.3 Write property test for driver assignment history completeness
  - **Property 15: Driver Assignment History Completeness**
  - **Validates: Requirements 4.4**

- [ ] 10.4 Write property test for single active driver invariant
  - **Property 16: Single Active Driver Invariant**
  - **Validates: Requirements 4.5**

- [ ] 10.5 Write property test for driver assignment logging
  - **Property 29: Driver Assignment Logging**
  - **Validates: Requirements 10.2**

- [ ] 11. Implement driver management endpoints (for Admin use)
  - Add getDrivers method to retrieve all drivers for admin
  - Add getDriverById method for driver details
  - Create GET /api/v1/admin/drivers endpoint with @PreAuthorize("hasRole('ADMIN')")
  - Create GET /api/v1/admin/drivers/{driverId} endpoint
  - Create DriverResponse DTO
  - Note: These are for ADMIN to manage drivers, not for driver portal access
  - _Requirements: 4.3, 5.1, 5.2, 5.4, 5.5_

- [ ] 11.1 Write property test for driver query filtering
  - **Property 14: Active Driver Query Filtering**
  - **Validates: Requirements 4.3, 5.1**

- [ ] 11.2 Write property test for driver details completeness
  - **Property 17: Driver Details Completeness**
  - **Validates: Requirements 5.2, 5.5**

- [ ] 12. Implement admin dashboard module
  - Create AdminService with dashboard data aggregation logic
  - Implement getRouteOverview with JPQL joins for driver and student counts
  - Create AdminController with @PreAuthorize("hasRole('ADMIN')")
  - Implement GET /api/v1/admin/routes endpoint with filtering
  - Implement GET /api/v1/admin/routes/{routeId}/details endpoint
  - Create RouteOverviewResponse, RouteDetailResponse DTOs
  - _Requirements: 6.1, 6.2, 6.5, 8.1_

- [ ] 12.1 Write property test for admin dashboard data completeness
  - **Property 19: Admin Dashboard Data Completeness**
  - **Validates: Requirements 6.2**

- [ ] 12.2 Write property test for route status filtering
  - **Property 20: Route Status Filtering**
  - **Validates: Requirements 6.5**

- [ ] 13. Implement global exception handling
  - Create @ControllerAdvice class for global exception handling
  - Create custom exceptions: ResourceNotFoundException, ValidationException, UnauthorizedException
  - Implement @ExceptionHandler methods for each exception type
  - Create ErrorResponse DTO with consistent structure
  - Add error logging with MDC context
  - Handle MethodArgumentNotValidException for validation errors (400)
  - Handle AccessDeniedException for authorization errors (403)
  - Handle ResourceNotFoundException for not found errors (404)
  - Handle generic Exception for server errors (500)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 13.1 Write property test for server error handling
  - **Property 26: Server Error Handling**
  - **Validates: Requirements 9.4**

- [ ] 13.2 Write property test for validation before business logic
  - **Property 27: Validation Before Business Logic**
  - **Validates: Requirements 9.5**

- [ ] 14. Checkpoint - Ensure all backend tests pass
  - Run all unit tests with Maven/Gradle
  - Ensure all property-based tests pass
  - Verify code coverage meets targets
  - Ask the user if questions arise

- [ ] 15. Integration testing setup (Backend)
  - Set up Testcontainers for PostgreSQL
  - Create @SpringBootTest integration test base class
  - Write integration tests for route creation workflow
  - Write integration tests for driver assignment workflow (admin assigning drivers)
  - Write integration tests for student assignment workflow
  - Write integration tests for admin dashboard endpoints
  - Write integration tests for parent endpoints
  - Write integration tests for tenant isolation
  - Write integration tests for RBAC enforcement (Admin and Parent roles)
  - Use MockMvc or TestRestTemplate for API testing

- [ ] 16. End-to-end testing
  - Set up REST Assured for backend E2E tests
  - Write E2E test for admin creating route and assigning driver/students
  - Write E2E test for parent viewing their children's transport details
  - Write E2E test for cross-tenant access prevention
  - Write E2E test for authorization failures
  - Optional: Set up Playwright/Cypress for full-stack E2E with React (Admin and Parent portals only)

- [ ] 17. Documentation and deployment preparation
  - Generate API documentation using Springdoc OpenAPI
  - Document environment variables in application.yml and .env.example
  - Create Docker Compose file for local development
  - Add health check endpoints using Spring Actuator
  - Create README with setup instructions for both backend and frontend
  - Document API endpoints with request/response examples
  - _Requirements: 8.1_

- [ ] 18. Final Checkpoint - Ensure all tests pass
  - Run all backend tests (unit, integration, E2E)
  - Run all frontend tests
  - Verify end-to-end workflows
  - Ask the user if questions arise
