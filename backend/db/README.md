# Database Scripts

This directory contains database schema, seed data, and utility scripts for the TOS (Transport Operations System).

## Files

### Schema & Seeds
- `schema-unified.sql` - Complete database schema with all tables, indexes, and constraints
- `seeds-unified.sql` - Initial seed data for testing (1 tenant, 3 drivers, 4 students, 3 routes)

### Utilities
- `cleanup-active-trips.sql` - SQL script to end all active trips

## Common Issues & Solutions

### Issue: "duplicate key value violates unique constraint idx_one_active_trip_per_route_type"

**Cause:** There's already an ACTIVE trip for that route and trip type in the database.

**Solution:** Run the cleanup script from the project root:
```bash
./cleanup-active-trips.sh
```

This will:
1. Show all currently active trips
2. Ask for confirmation
3. End all active trips by setting their status to 'ENDED'
4. Allow you to start new trips

### Manual Cleanup (if needed)

If you prefer to manually clean up, connect to the database and run:

```sql
-- View active trips
SELECT id, route_id, trip_type, start_time 
FROM trips 
WHERE status = 'ACTIVE';

-- End all active trips
UPDATE trips 
SET status = 'ENDED', end_time = NOW() 
WHERE status = 'ACTIVE';
```

## Database Constraints

The system has several important constraints:

1. **One Active Driver Per Route** (`idx_one_active_driver_per_route`)
   - Only one driver can be actively assigned to a route at a time
   
2. **One Active Trip Per Route Type** (`idx_one_active_trip_per_route_type`)
   - Only one ACTIVE trip per route per trip type (PICKUP/DROP)
   - This prevents duplicate trips from being started
   
3. **Trip End Time Validation** (`chk_trips_end_after_start`)
   - End time must be after start time

## Resetting the Database

To completely reset the database:

```bash
# From project root
./setup-db.sh
```

This will:
1. Drop and recreate the database
2. Apply the schema
3. Load seed data
4. Verify the setup

## Seed Data Summary

- **Tenant:** Springfield Elementary School
- **Users:** 1 Admin, 3 Drivers, 2 Parents
- **Drivers:**
  - John Anderson (+1234567891) → Route A - Morning
  - Sarah Thompson (+1234567892) → Route B - Evening  
  - Michael Kumar (9876543210) → Route C - Afternoon
- **Students:** 4 students (2 per parent)
- **Routes:** 3 active routes with driver assignments
