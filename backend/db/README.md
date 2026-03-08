# Database Schema Documentation

## Overview

This directory contains the PostgreSQL database schema, migrations, and seed data for the School Transport Operations System MVP.

## Directory Structure

```
backend/db/
├── schema.sql                      # Complete database schema
├── migrations/
│   └── 001_initial_schema.sql     # Initial migration with up/down scripts
├── seeds/
│   └── 001_initial_seed.sql       # Initial seed data
└── README.md                       # This file
```

## Database Setup

### Prerequisites

- PostgreSQL 12 or higher
- Database user with CREATE DATABASE and CREATE EXTENSION privileges

### Initial Setup

1. Create the database:
```bash
createdb transport_ops
```

2. Run the schema migration:
```bash
psql -d transport_ops -f backend/db/migrations/001_initial_schema.sql
```

3. Load seed data:
```bash
psql -d transport_ops -f backend/db/seeds/001_initial_seed.sql
```

### Alternative: Run schema directly

```bash
psql -d transport_ops -f backend/db/schema.sql
psql -d transport_ops -f backend/db/seeds/001_initial_seed.sql
```

## Schema Overview

### Tables

1. **routes** - Transport routes configured by admin
2. **route_students** - Junction table mapping students to routes
3. **route_driver_assignment** - Driver assignments with temporal tracking
4. **trips** - Individual trip instances
5. **attendance** - Student attendance records
6. **attendance_audit** - Audit trail for attendance corrections
7. **latest_bus_location** - Current GPS location for active trips
8. **gps_logs** - Historical GPS tracking data
9. **notification_log** - WhatsApp notification delivery tracking

### ENUM Types

- `trip_type_enum`: PICKUP, DROP
- `trip_status_enum`: ACTIVE, ENDED
- `attendance_status_enum`: PRESENT, ABSENT
- `notification_type_enum`: TRIP_START
- `notification_status_enum`: QUEUED, SENT, FAILED

### Key Constraints

1. **One Active Driver Per Route**: Only one driver can be actively assigned to a route at any time
   - Implemented via partial unique index on `route_driver_assignment(route_id)` WHERE `active_to IS NULL`

2. **One Active Trip Per Route Per Type**: Only one active trip per route per trip type (PICKUP/DROP)
   - Implemented via partial unique index on `trips(route_id, trip_type)` WHERE `status='ACTIVE'`

3. **WhatsApp Batch Idempotency**: One notification per trip per type
   - Implemented via unique index on `notification_log(trip_id, type)`

## Seed Data

The seed data includes:
- 6 routes (4 active, 1 inactive)
- 10 student assignments across routes
- 5 driver assignments (John Anderson assigned to 3 routes)
- 2 active trips (North and South District Routes)
- 1 completed trip from yesterday
- Attendance records for all trips
- Sample attendance audit record
- GPS location data for active trips
- Notification logs including one failed notification

### Hardcoded UUIDs

The seed data uses hardcoded UUIDs that match the frontend mock data for consistency:

- Tenant ID: `550e8400-e29b-41d4-a716-446655440000`
- Admin User: `550e8400-e29b-41d4-a716-446655440001`
- Parent User: `550e8400-e29b-41d4-a716-446655440002`
- Routes: `550e8400-e29b-41d4-a716-44665544001X`
- Students: `550e8400-e29b-41d4-a716-44665544002X`
- Drivers: `550e8400-e29b-41d4-a716-44665544004X`

## Verification Queries

After loading the seed data, verify the setup:

```sql
-- Count records in each table
SELECT 'routes' as table_name, COUNT(*) as count FROM routes
UNION ALL
SELECT 'route_students', COUNT(*) FROM route_students
UNION ALL
SELECT 'route_driver_assignment', COUNT(*) FROM route_driver_assignment
UNION ALL
SELECT 'trips', COUNT(*) FROM trips
UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance
UNION ALL
SELECT 'gps_logs', COUNT(*) FROM gps_logs
UNION ALL
SELECT 'notification_log', COUNT(*) FROM notification_log;

-- Verify active trips
SELECT 
    t.id,
    r.name as route_name,
    t.trip_type,
    t.status,
    t.start_time
FROM trips t
JOIN routes r ON t.route_id = r.id
WHERE t.status = 'ACTIVE';

-- Verify driver assignments
SELECT 
    r.name as route_name,
    rda.driver_id,
    rda.active_from,
    rda.active_to
FROM route_driver_assignment rda
JOIN routes r ON rda.route_id = r.id
WHERE rda.active_to IS NULL;
```

## Rollback

To rollback the initial migration, uncomment and run the DOWN section in `migrations/001_initial_schema.sql`:

```bash
psql -d transport_ops -c "DROP TABLE IF EXISTS notification_log CASCADE;"
psql -d transport_ops -c "DROP TABLE IF EXISTS gps_logs CASCADE;"
# ... etc
```

Or simply drop and recreate the database:

```bash
dropdb transport_ops
createdb transport_ops
```

## Notes

- All primary keys use UUIDs generated via `uuid_generate_v4()`
- All tables use `snake_case` naming convention
- Timestamps use PostgreSQL's `TIMESTAMP` type (UTC recommended)
- Foreign keys include `ON DELETE CASCADE` for referential integrity
- Indexes are created on all foreign keys and frequently queried columns
- The schema follows the design specified in the Coding SOP
