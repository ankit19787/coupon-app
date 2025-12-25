# Debug SSL Issue - Step by Step

The error shows SSL is disabled in config, but PostgreSQL still tries SSL. This usually means:

1. **POSTGRES_URL has SSL parameters** that pg library reads directly
2. **PostgreSQL server requires SSL** (server-side configuration)

## Quick Fix Attempt

### Step 1: Check if you're using POSTGRES_URL

Check your `.env` file - do you have `POSTGRES_URL` set?

If YES, the URL might have SSL parameters. The code now strips them, but verify:

```bash
# Check your .env file
# Windows
type .env | findstr POSTGRES_URL

# Linux/macOS
grep POSTGRES_URL .env
```

### Step 2: If Using POSTGRES_URL, Check for SSL Parameters

Look for these in your URL:
- `?sslmode=require`
- `?ssl=true`
- `&sslmode=require`
- `&ssl=true`

**Fix:** Remove ALL SSL parameters from POSTGRES_URL:

```env
# ❌ WRONG
POSTGRES_URL=postgresql://user:pass@host:port/db?sslmode=require

# ✅ CORRECT
POSTGRES_URL=postgresql://user:pass@host:port/db
DB_SSL=false
```

### Step 3: Use Individual Variables Instead

If POSTGRES_URL keeps causing issues, **switch to individual variables**:

```env
# Comment out or remove POSTGRES_URL
# POSTGRES_URL=postgresql://...

# Use individual variables instead
DB_HOST=your_host
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_SSL=false
```

### Step 4: Check PostgreSQL Server Configuration

If you control the PostgreSQL server, check if it's forcing SSL:

**Check `postgresql.conf`:**
```conf
ssl = on  # This forces SSL connections
```

**To disable SSL on server (for local development):**
```conf
ssl = off
```

Then restart PostgreSQL.

### Step 5: Alternative - Force Non-SSL Connection String

If nothing else works, you can explicitly tell PostgreSQL to NOT use SSL in the connection:

**For individual variables, add to dialectOptions:**
The code now explicitly sets `ssl: false` when DB_SSL is false.

**For POSTGRES_URL, make sure it doesn't have SSL and add `?sslmode=disable`:**
```env
POSTGRES_URL=postgresql://user:pass@host:port/db?sslmode=disable
DB_SSL=false
```

## What the Updated Code Does

1. ✅ Strips ALL SSL parameters from POSTGRES_URL when DB_SSL=false
2. ✅ Explicitly sets `ssl: false` in dialectOptions when SSL is disabled
3. ✅ Only enables SSL when DB_SSL=true is explicitly set

## Test After Changes

Run the migration again:
```bash
node scripts/run-migrations-simple.js
```

You should see:
```
Database SSL Configuration:
  DB_SSL env var: false
  useSSL: false
  sslConfig: disabled
Connecting to database...
DB_SSL setting: false
✅ Database connection established.
```

## Still Having Issues?

If it STILL tries SSL after all this, the PostgreSQL server itself might be forcing SSL. In that case:

1. **Check PostgreSQL server logs** - they'll show why SSL is required
2. **Use `?sslmode=disable` explicitly** in your connection string
3. **Configure PostgreSQL server** to allow non-SSL connections for localhost

