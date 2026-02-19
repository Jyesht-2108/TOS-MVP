# Transport Operations System (TOS) - Sprint 1 MVP

School Transport Operations System implementing Admin Dashboard and Route Management modules.

## Project Structure

This project is organized as separate frontend and backend applications for easy integration with existing ERP systems:

```
.
├── backend/          # Spring Boot (Java) backend
├── frontend/         # React (TypeScript) frontend
└── .kiro/           # Kiro specs and documentation
```

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: PostgreSQL
- **Authentication**: JWT with Spring Security
- **Testing**: JUnit 5 + JQwik (property-based testing)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Testing**: Vitest

## Quick Start

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

See [backend/README.md](backend/README.md) for detailed setup instructions.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

See [frontend/README.md](frontend/README.md) for detailed setup instructions.

## Architecture

This project follows a **Modular Monolith** architecture pattern with clear module boundaries:

- `auth/` - Authentication and authorization
- `routes/` - Route management
- `admin/` - Admin dashboard operations

## API Documentation

All API endpoints are under `/api/v1`:

- `GET /health` - Health check
- `GET /health/ready` - Readiness check with database connectivity

Additional endpoints will be documented as they are implemented.

## Development Workflow

1. Start the backend server (port 8080)
2. Start the frontend development server (port 3000)
3. Frontend automatically proxies API requests to backend

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Requirements

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

## License

Proprietary - School Transport Operations System
