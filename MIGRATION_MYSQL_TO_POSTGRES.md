# Migration from MySQL to PostgreSQL

## ✅ Changes Made

The application has been migrated from MySQL to PostgreSQL. All necessary changes have been completed.

## What Changed

### 1. Database Driver
- **Before:** `mysql2` package
- **After:** `pg` and `pg-hstore` packages

### 2. Database Configuration
- **Port:** Changed from `3306` to `5432`
- **Default User:** Changed from `root` to `postgres`
- **Dialect:** Changed from `mysql` to `postgres`

### 3. Connection String
- **Before:** MySQL connection
- **After:** PostgreSQL connection with SSL support

### 4. Models
- **No changes needed** - Sequelize handles PostgreSQL automatically
- All data types are compatible

## Installation Steps

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install and remember your `postgres` user password

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Windows
psql -U postgres -c "CREATE DATABASE coupon_db;"

# macOS/Linux
sudo -u postgres psql -c "CREATE DATABASE coupon_db;"
```

### 3. Update Backend Dependencies

```bash
cd coupon-app/backend
npm install
```

This will install `pg` and `pg-hstore` instead of `mysql2`.

### 4. Update .env File

Change your `backend/.env` file:

```env
# OLD (MySQL)
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_mysql_password

# NEW (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coupon_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false
```

### 5. Test Connection

```bash
cd coupon-app/backend
npm run test-db
```

### 6. Start Backend

```bash
npm run dev
```

The backend will automatically create tables in PostgreSQL.

## Key Differences

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Port | 3306 | 5432 |
| Default User | root | postgres |
| Package | mysql2 | pg, pg-hstore |
| Dialect | mysql | postgres |

## Benefits of PostgreSQL

- ✅ More robust and feature-rich
- ✅ Better performance for complex queries
- ✅ Advanced data types
- ✅ Better JSON support
- ✅ No XAMPP dependency
- ✅ Easier to set up and manage

## Troubleshooting

### "psql: command not found"

**Windows:**
- Add PostgreSQL to PATH: `C:\Program Files\PostgreSQL\<version>\bin`
- Or use full path to psql.exe

**macOS/Linux:**
- Install PostgreSQL (see above)

### "Password Authentication Failed"

- Check password in `.env` file
- Reset password: `ALTER USER postgres WITH PASSWORD 'new_password';`

### "Database does not exist"

- Create database: `CREATE DATABASE coupon_db;`

### Connection Refused

- Check PostgreSQL service is running
- Verify port 5432 is not blocked
- Check firewall settings

## Need Help?

See `POSTGRESQL_SETUP.md` for detailed PostgreSQL setup guide.

