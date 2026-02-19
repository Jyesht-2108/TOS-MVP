# Transport Operations System (TOS) - Backend

School Transport Operations System backend implementing Admin Dashboard and Route Management modules using Spring Boot.

## Architecture

This project follows a **Modular Monolith** architecture pattern with clear module boundaries:

- `auth/` - Authentication and authorization
- `routes/` - Route management
- `admin/` - Admin dashboard operations

## Project Structure

```
src/main/java/com/school/transport/
├── config/                    # Configuration classes
├── common/                    # Shared utilities, types, exceptions
├── controller/                # Global controllers (health checks)
└── module/
    ├── auth/                  # Authentication module
    ├── routes/                # Route management module
    └── admin/                 # Admin dashboard module
```

## Naming Conventions

- **Packages**: lowercase (e.g., `com.school.transport.module.routes`)
- **Classes**: PascalCase (e.g., `RoutesService`, `RoutesController`)
- **Methods/Variables**: camelCase (e.g., `createRoute`, `assignDriver`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_STUDENTS_PER_ROUTE`)
- **Database Tables**: snake_case plural (e.g., `routes`, `route_students`)
- **Database Columns**: snake_case (e.g., `tenant_id`, `created_at`)

## Setup

### Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
mvn clean install
```

2. Configure database:
```bash
# Create database
createdb transport_ops
```

3. Update `src/main/resources/application.properties` with your database credentials

4. Run the application:
```bash
mvn spring-boot:run
```

Or with dev profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Testing

Run all tests:
```bash
mvn test
```

Run only property-based tests:
```bash
mvn test -Dtest="*PropertyTest"
```

## API Endpoints

### Health Checks
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check (includes database connectivity)

### API Base Path
All API endpoints are under `/api/v1`

## Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: PostgreSQL with JPA/Hibernate
- **Authentication**: JWT with Spring Security
- **Validation**: Spring Validation
- **Testing**: JUnit 5 + JQwik (property-based testing)
- **Build Tool**: Maven

## Development

Build the project:
```bash
mvn clean package
```

Run tests:
```bash
mvn test
```

Run with specific profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
