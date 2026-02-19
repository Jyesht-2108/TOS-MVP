# Requirements Document

## Introduction

This document defines the requirements for Sprint 1 of the School Transport Operations System (TOS) MVP backend. Sprint 1 focuses on implementing the Admin Dashboard and Route Management modules using a Modular Monolith architecture. The system enables school administrators to configure transport routes, assign students and drivers, and establish the foundational infrastructure for the transport operations system.

## Glossary

- **TOS**: Transport Operations System
- **Admin**: School administrator or transport operations manager with full system access
- **Route**: A transport route representing a collection of students assigned to a specific path
- **Driver**: A user with the DRIVER role who operates vehicles and manages trips
- **Student**: A student entity that can be assigned to routes
- **Tenant**: A school or organization boundary in the ERP system
- **RBAC**: Role-Based Access Control
- **Modular Monolith**: An architectural pattern where the system is organized into modules with clear boundaries within a single deployable unit

## Requirements

### Requirement 1: Authentication and Authorization Foundation

**User Story:** As a system architect, I want a robust authentication and authorization foundation, so that all users can securely access the system with appropriate permissions.

#### Acceptance Criteria

1. WHEN a driver provides valid credentials, THE System SHALL authenticate the driver and issue a signed JWT token
2. WHEN a user attempts to access a protected endpoint, THE System SHALL validate the JWT token and verify the user role
3. WHEN a user attempts to access a resource outside their tenant, THE System SHALL deny access and return an authorization error
4. WHEN an admin accesses admin-only endpoints, THE System SHALL verify the ADMIN role before processing the request
5. WHEN a driver accesses driver-only endpoints, THE System SHALL verify the DRIVER role and ensure route assignment before processing the request

### Requirement 2: Route Creation and Management

**User Story:** As an admin, I want to create and manage transport routes, so that I can organize the school's transportation system.

#### Acceptance Criteria

1. WHEN an admin creates a route with a valid name, THE System SHALL persist the route with tenant isolation and return the route identifier
2. WHEN an admin retrieves routes for their tenant, THE System SHALL return only routes belonging to that tenant
3. WHEN an admin updates a route name, THE System SHALL persist the change and maintain audit trail
4. WHEN an admin attempts to create a route without required fields, THE System SHALL reject the request with validation errors
5. THE System SHALL store route status as ACTIVE or INACTIVE

### Requirement 3: Student Assignment to Routes

**User Story:** As an admin, I want to assign students to routes, so that I can define which students use which transport routes.

#### Acceptance Criteria

1. WHEN an admin assigns students to a route, THE System SHALL create route-student mappings in the database
2. WHEN an admin assigns a student already on another route, THE System SHALL allow the assignment (students can be on multiple routes)
3. WHEN an admin removes a student from a route, THE System SHALL delete the route-student mapping
4. WHEN an admin retrieves students for a route, THE System SHALL return all assigned students with their details
5. WHEN a route has no students assigned, THE System SHALL return an empty list without errors

### Requirement 4: Driver Assignment to Routes

**User Story:** As an admin, I want to assign drivers to routes, so that each route has a designated driver responsible for trips.

#### Acceptance Criteria

1. WHEN an admin assigns a driver to a route, THE System SHALL create a route-driver assignment with active_from timestamp
2. WHEN an admin assigns a new driver to a route with an existing active driver, THE System SHALL set active_to on the previous assignment and create a new active assignment
3. WHEN a driver queries their assigned routes, THE System SHALL return only routes where they are the active driver
4. WHEN an admin retrieves driver assignments for a route, THE System SHALL return the assignment history including active and past drivers
5. THE System SHALL enforce that only one driver can be actively assigned to a route at any given time

### Requirement 5: Driver Route Access

**User Story:** As a driver, I want to view my assigned routes, so that I know which routes I am responsible for operating.

#### Acceptance Criteria

1. WHEN a driver requests their assigned routes, THE System SHALL return only routes where they are the active driver
2. WHEN a driver requests route details, THE System SHALL include the list of students assigned to that route
3. WHEN a driver has no assigned routes, THE System SHALL return an empty list
4. WHEN a driver attempts to access routes not assigned to them, THE System SHALL deny access with authorization error
5. THE System SHALL include route name and status in the driver's route list

### Requirement 6: Admin Dashboard - Route Overview

**User Story:** As an admin, I want to view all routes in my school, so that I can monitor and manage the transport system.

#### Acceptance Criteria

1. WHEN an admin accesses the route overview, THE System SHALL return all routes for their tenant
2. WHEN displaying routes, THE System SHALL include route name, status, assigned driver name, and student count
3. WHEN a route has no assigned driver, THE System SHALL display the driver field as unassigned
4. WHEN a route has no students, THE System SHALL display student count as zero
5. THE System SHALL support filtering routes by status (ACTIVE/INACTIVE)

### Requirement 7: Data Model and Database Constraints

**User Story:** As a system architect, I want proper database schema and constraints, so that data integrity is maintained at the database level.

#### Acceptance Criteria

1. THE System SHALL use UUID as primary keys for all entities
2. THE System SHALL enforce foreign key constraints between routes, students, and drivers
3. THE System SHALL index tenant_id on all tenant-scoped tables for query performance
4. THE System SHALL use snake_case naming for all database tables and columns
5. THE System SHALL include created_at timestamps on all primary entities

### Requirement 8: API Design and Module Boundaries

**User Story:** As a backend developer, I want clear API contracts and module boundaries, so that the system is maintainable and follows the modular monolith pattern.

#### Acceptance Criteria

1. THE System SHALL expose all APIs under the /api/v1 prefix
2. THE System SHALL organize code into modules: auth, routes, admin with clear boundaries
3. WHEN processing requests, THE System SHALL keep controllers thin and delegate business logic to services
4. THE System SHALL use dot.case for file names (routes.service.ts, routes.controller.ts)
5. THE System SHALL use kebab-case for folder names (admin-dashboard, route-management)

### Requirement 9: Error Handling and Validation

**User Story:** As a developer, I want consistent error handling and input validation, so that the API provides clear feedback and prevents invalid data.

#### Acceptance Criteria

1. WHEN validation fails, THE System SHALL return HTTP 400 with structured error messages
2. WHEN authorization fails, THE System SHALL return HTTP 403 with appropriate error message
3. WHEN a resource is not found, THE System SHALL return HTTP 404 with resource identifier
4. WHEN a server error occurs, THE System SHALL return HTTP 500 and log the error with context
5. THE System SHALL validate all input DTOs before processing business logic

### Requirement 10: Logging and Observability

**User Story:** As a DevOps engineer, I want structured logging for all critical operations, so that I can monitor system health and debug issues.

#### Acceptance Criteria

1. WHEN a route is created, THE System SHALL log the event with tenant_id, route_id, and admin_id
2. WHEN a driver is assigned to a route, THE System SHALL log the assignment with route_id, driver_id, and timestamp
3. WHEN students are assigned to a route, THE System SHALL log the operation with route_id and student count
4. WHEN authentication fails, THE System SHALL log the attempt with user identifier and reason
5. THE System SHALL use structured JSON logging format for all log entries
