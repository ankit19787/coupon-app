# PostgreSQL Setup Guide

## Installation

### Windows

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Or use installer: https://www.postgresql.org/download/windows/installer/
   - Download the latest version (15.x or 16.x recommended)

2. **Install PostgreSQL:**
   - Run the installer
   - **Remember the password** you set for the `postgres` user
   - Default port: `5432`
   - Default installation path: `C:\Program Files\PostgreSQL\<version>`

3. **Verify Installation:**
   - Open **pgAdmin 4** (installed with PostgreSQL)
   - Or use Command Line:
   ```cmd
   psql -U postgres
   ```

### macOS

**Using Homebrew:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or download installer:**
- Visit: https://www.postgresql.org/download/macosx/

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Create Database

### Method 1: Using pgAdmin (GUI - Easiest)

1. **Open pgAdmin 4**
2. **Connect to server** (enter your postgres password)
3. **Right-click "Databases"** → **Create** → **Database**
4. **Name:** `coupon_db`
5. **Owner:** `postgres`
6. **Click "Save"**

### Method 2: Using Command Line (psql)

**Windows:**
```cmd
# Open Command Prompt
psql -U postgres

# Then in PostgreSQL:
CREATE DATABASE coupon_db;
\q
```

**macOS/Linux:**
```bash
sudo -u postgres psql

# Then in PostgreSQL:
CREATE DATABASE coupon_db;
\q
```

### Method 3: Using SQL Command Directly

```cmd
# Windows
psql -U postgres -c "CREATE DATABASE coupon_db;"

# macOS/Linux
sudo -u postgres psql -c "CREATE DATABASE coupon_db;"
```

---

## Update Backend Configuration

### 1. Install PostgreSQL Dependencies

```bash
cd coupon-app/backend
npm install
```

This will install `pg` and `pg-hstore` packages.

### 2. Update .env File

Create or update `backend/.env`:

```env
PORT=3001
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coupon_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `your_postgres_password` with the password you set during PostgreSQL installation.

---

## Verify Connection

### Test Database Connection

```bash
cd coupon-app/backend
npm run test-db
```

This will test the connection and show any errors.

### Manual Test

```cmd
# Windows
psql -U postgres -d coupon_db

# macOS/Linux
sudo -u postgres psql -d coupon_db
```

If you can connect, PostgreSQL is working! ✅

---

## Common Issues

### Issue 1: "psql: command not found"

**Windows:**
- Add PostgreSQL to PATH:
  - `C:\Program Files\PostgreSQL\<version>\bin`
- Or use full path:
  ```cmd
  "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
  ```

**macOS/Linux:**
- Install PostgreSQL (see above)
- Or add to PATH

### Issue 2: "Password Authentication Failed"

**Solution:**
1. Check your password in `.env` file
2. Reset password:
   ```cmd
   # Windows
   psql -U postgres
   
   # Then:
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```
3. Update `.env` with new password

### Issue 3: "Database does not exist"

**Solution:**
- Create database (see "Create Database" section above)

### Issue 4: "Connection Refused"

**Check if PostgreSQL is running:**

**Windows:**
- Open **Services** (Win + R → `services.msc`)
- Find "postgresql-x64-15" (or your version)
- Ensure it's "Running"

**macOS:**
```bash
brew services list
# Should show postgresql@15 started
```

**Linux:**
```bash
sudo systemctl status postgresql
# Should show active (running)
```

### Issue 5: Port 5432 Already in Use

**Check what's using port 5432:**

**Windows:**
```cmd
netstat -ano | findstr :5432
```

**macOS/Linux:**
```bash
lsof -i :5432
```

**Solution:**
- Stop the conflicting service
- Or change PostgreSQL port in `postgresql.conf`

---

## PostgreSQL vs MySQL Differences

### Port
- **PostgreSQL:** 5432 (default)
- **MySQL:** 3306

### Connection String
- **PostgreSQL:** `postgresql://user:password@host:port/database`
- **MySQL:** `mysql://user:password@host:port/database`

### Data Types
- PostgreSQL uses different types, but Sequelize handles this automatically
- No changes needed in models

---

## Quick Start Checklist

- [ ] PostgreSQL installed
- [ ] PostgreSQL service running
- [ ] Database `coupon_db` created
- [ ] `.env` file updated with PostgreSQL credentials
- [ ] Backend dependencies installed (`npm install`)
- [ ] Connection tested (`npm run test-db`)
- [ ] Backend server starts successfully

---

## Useful PostgreSQL Commands

```sql
-- List all databases
\l

-- Connect to database
\c coupon_db

-- List all tables
\dt

-- Describe table structure
\d coupons

-- Exit psql
\q
```

---

## Next Steps

After PostgreSQL is set up:

1. ✅ Database created
2. ✅ `.env` configured
3. ✅ Test connection: `npm run test-db`
4. ✅ Start backend: `npm run dev`
5. ✅ Backend should connect to PostgreSQL automatically

---

## Need Help?

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **pgAdmin Help:** Built-in help in pgAdmin 4
- **Check backend logs** for connection errors

