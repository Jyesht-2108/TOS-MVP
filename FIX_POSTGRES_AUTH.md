# Fix PostgreSQL Authentication Error

**Error:** `FATAL: Peer authentication failed for user "postgres"`

This happens because PostgreSQL is configured to use "peer" authentication instead of password authentication.

---

## 🔧 SOLUTION OPTIONS

### Option 1: Use sudo (Quick Fix)

```bash
# Use sudo to connect as postgres user
sudo -u postgres psql -c "DROP DATABASE IF EXISTS tos_db;"
sudo -u postgres psql -c "CREATE DATABASE tos_db;"
sudo -u postgres psql -d tos_db -f backend/db/schema-unified.sql
sudo -u postgres psql -d tos_db -f backend/db/seeds-unified.sql
```

---

### Option 2: Change PostgreSQL Authentication (Permanent Fix)

**Step 1: Edit pg_hba.conf**

```bash
# Find pg_hba.conf location
sudo -u postgres psql -c "SHOW hba_file;"

# Edit the file (usually /etc/postgresql/*/main/pg_hba.conf)
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

**Step 2: Change this line:**
```
# FROM:
local   all             postgres                                peer

# TO:
local   all             postgres                                md5
```

**Step 3: Restart PostgreSQL**
```bash
sudo systemctl restart postgresql
```

**Step 4: Set postgres password**
```bash
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD '123456';
\q
```

**Step 5: Now you can use:**
```bash
psql -U postgres -d tos_db
# Enter password: 123456
```

---

### Option 3: Use Your Current User (Easiest)

**Step 1: Create database with your user**
```bash
# Check your current user
whoami

# Create database as your user
createdb tos_db

# Run schema
psql -d tos_db -f backend/db/schema-unified.sql

# Load seed data
psql -d tos_db -f backend/db/seeds-unified.sql
```

**Step 2: Update application-dev.yml**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tos_db
    username: YOUR_USERNAME  # Replace with output of 'whoami'
    password: ""  # Leave empty if no password
```

---

## ✅ RECOMMENDED: Option 1 (Quick Fix)

Use `sudo -u postgres` for all commands:

```bash
# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS tos_db;"
sudo -u postgres psql -c "CREATE DATABASE tos_db;"

# Run schema
sudo -u postgres psql -d tos_db -f backend/db/schema-unified.sql

# Load seed data
sudo -u postgres psql -d tos_db -f backend/db/seeds-unified.sql

# Verify driver exists
sudo -u postgres psql -d tos_db -c "SELECT u.name, u.phone FROM users u WHERE u.phone = '9876543210';"
```

**Expected Output:**
```
     name      |    phone    
---------------+-------------
 Michael Kumar | 9876543210
```

---

## 🧪 TEST CONNECTION

```bash
# Test connection
sudo -u postgres psql -d tos_db -c "SELECT COUNT(*) FROM users;"

# Should show: count = 6 (1 admin + 3 drivers + 2 parents)
```

---

## 📝 QUICK SETUP SCRIPT

Create a file `setup-db.sh`:

```bash
#!/bin/bash

echo "Dropping existing database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS tos_db;"

echo "Creating database..."
sudo -u postgres psql -c "CREATE DATABASE tos_db;"

echo "Running schema..."
sudo -u postgres psql -d tos_db -f backend/db/schema-unified.sql

echo "Loading seed data..."
sudo -u postgres psql -d tos_db -f backend/db/seeds-unified.sql

echo "Verifying driver 9876543210..."
sudo -u postgres psql -d tos_db -c "SELECT u.name, u.phone, r.name as route FROM users u JOIN drivers d ON d.user_id = u.id LEFT JOIN route_driver_assignment rda ON rda.driver_id = u.id AND rda.active_to IS NULL LEFT JOIN routes r ON r.id = rda.route_id WHERE u.phone = '9876543210';"

echo "Done! Database setup complete."
```

**Make it executable and run:**
```bash
chmod +x setup-db.sh
./setup-db.sh
```

---

## ✅ VERIFICATION

After setup, verify everything:

```bash
# Check all users
sudo -u postgres psql -d tos_db -c "SELECT name, phone, role FROM users;"

# Check drivers
sudo -u postgres psql -d tos_db -c "SELECT u.name, u.phone, d.vehicle_number FROM users u JOIN drivers d ON d.user_id = u.id;"

# Check routes
sudo -u postgres psql -d tos_db -c "SELECT name, status FROM routes;"
```

**Expected Output:**
- 6 users (1 admin, 3 drivers, 2 parents)
- 3 drivers with vehicles
- 3 routes (A, B, C)

---

## 🎉 YOU'RE READY!

Once the database is set up, start the backend:

```bash
cd backend
mvn spring-boot:run
```

The backend will connect to the database and be ready for the mobile app!

