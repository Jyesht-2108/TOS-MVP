# Troubleshooting Guide - TOS MVP

## Common Issues and Solutions

### 1. Cannot Start Trip - Duplicate Key Constraint Error

**Error Message:**
```
StartTrip ERROR: pq: duplicate key value violates unique constraint "idx_one_active_trip_per_route_type"
```

**Cause:** 
There's already an ACTIVE trip for that route and trip type in the database. This happens when:
- A previous trip wasn't properly ended
- The app crashed during an active trip
- Testing left trips in ACTIVE state

**Solution:**
Run the cleanup script:
```bash
./cleanup-active-trips.sh
```

This will end all active trips and allow you to start new ones.

**Manual Solution:**
```bash
# Connect to database
PGPASSWORD=tos_password psql -h localhost -U tos_user -d tos_db

# View active trips
SELECT id, route_id, trip_type, start_time FROM trips WHERE status = 'ACTIVE';

# End all active trips
UPDATE trips SET status = 'ENDED', end_time = NOW() WHERE status = 'ACTIVE';
```

---

### 2. Live GPS Tracking Not Updating

**Symptoms:**
- Map shows "Stale" status
- Last updated time is old
- No GPS coordinates updating

**Possible Causes & Solutions:**

**A. Backend Not Running**
```bash
# Check if backend is running
curl http://localhost:8080/health

# If not running, start it
cd backend && mvn spring-boot:run
```

**B. GPS Service Not Sending Data**
- Check if the mobile app has location permissions
- Verify GPS is enabled on the device
- Check backend logs for GPS update requests

**C. Wrong API Endpoint**
- Frontend expects: `GET /api/v1/tracking/live?route_id=...`
- Verify the endpoint exists in your backend

---

### 3. Routes Showing as ACTIVE but No Driver Assigned

**Cause:** 
Route status is independent of driver assignment.

**Solution:**
Assign a driver to the route:
1. Go to Admin Dashboard → Routes
2. Click on the route
3. Click "Assign Driver"
4. Select a driver from the list

---

### 4. Database Connection Failed

**Error Message:**
```
connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed
```

**Solutions:**

**A. PostgreSQL Not Running**
```bash
# Check status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

**B. Wrong Connection Details**
Verify in your backend configuration:
- Database: `tos_db`
- User: `tos_user`
- Password: `tos_password`
- Host: `localhost`
- Port: `5432`

**C. Database Doesn't Exist**
```bash
# Reset database
./setup-db.sh
```

---

### 5. Frontend Not Loading / Blank Page

**Solutions:**

**A. Dependencies Not Installed**
```bash
cd frontend
npm install
```

**B. Backend Not Running**
```bash
# Start backend first
cd backend && mvn spring-boot:run

# Then start frontend
cd frontend && npm run dev
```

**C. Port Already in Use**
```bash
# Check what's using port 5173
lsof -i :5173

# Kill the process or change port in vite.config.ts
```

---

### 6. Mobile App Cannot Connect to Backend

**Error:** Network request failed or timeout

**Solutions:**

**A. Using Wrong URL**
- Android Emulator: `http://10.0.2.2:8080`
- iOS Simulator: `http://localhost:8080`
- Physical Device: `http://YOUR_COMPUTER_IP:8080`

**B. Firewall Blocking**
```bash
# Allow port 8080 (Linux)
sudo ufw allow 8080

# Check if backend is accessible
curl http://YOUR_IP:8080/health
```

**C. Backend Not Listening on All Interfaces**
Ensure backend is configured to listen on `0.0.0.0` not just `localhost`

---

### 7. Attendance Not Saving

**Possible Causes:**

**A. Trip Not Active**
- Attendance can only be marked during an ACTIVE trip
- Start the trip first from the driver app

**B. Student Not Assigned to Route**
- Verify student is assigned to the route
- Check in Admin Dashboard → Routes → Students

---

### 8. Live Map Shows Wrong Location (Bangladesh/New York)

**Cause:** 
No GPS data available, showing default fallback coordinates.

**Solution:**
- The map now defaults to Bangalore coordinates [12.9716, 77.5946]
- Start a trip and send GPS updates from the mobile app
- GPS data will update every 10 seconds

---

### 9. "Stale" GPS Status Even Though Trip is Active

**Cause:** 
GPS updates haven't been received in over 90 seconds.

**Health Status Logic:**
- **Healthy:** GPS updated < 30 seconds ago (green)
- **Warning:** GPS updated 30-90 seconds ago (yellow)
- **Stale:** GPS updated > 90 seconds ago (red)

**Solutions:**
- Check mobile app is sending GPS updates
- Verify location permissions are granted
- Check network connectivity
- Review backend logs for GPS update requests

---

### 10. Cannot Delete Route with Active Assignments

**Error:** Foreign key constraint violation

**Solution:**
1. End any active trips on the route
2. Unassign students from the route
3. Unassign the driver from the route
4. Then delete the route

Or use CASCADE delete (be careful - this deletes all related data)

---

## Quick Diagnostic Commands

```bash
# Check all services
curl http://localhost:8080/health          # Backend health
curl http://localhost:5173                 # Frontend running

# Check database
./test-database-connection.sh

# Check active trips
PGPASSWORD=tos_password psql -h localhost -U tos_user -d tos_db -c \
  "SELECT COUNT(*) FROM trips WHERE status = 'ACTIVE';"

# Check routes and drivers
PGPASSWORD=tos_password psql -h localhost -U tos_user -d tos_db -c \
  "SELECT r.name, u.name as driver FROM routes r 
   LEFT JOIN route_driver_assignment rda ON r.id = rda.route_id AND rda.active_to IS NULL
   LEFT JOIN users u ON rda.driver_id = u.id;"
```

---

## Getting Help

If you're still experiencing issues:

1. Check the logs:
   - Backend: Console output where `mvn spring-boot:run` is running
   - Frontend: Browser console (F12)
   - Mobile: Device logs

2. Verify your setup:
   ```bash
   ./test-database-connection.sh
   ./test-driver-student-sync.sh
   ```

3. Reset everything:
   ```bash
   ./setup-db.sh
   ./cleanup-active-trips.sh
   ```

4. Review documentation:
   - `README.md` - Project overview
   - `QUICK_REFERENCE.txt` - Quick commands
   - `backend/db/README.md` - Database details
