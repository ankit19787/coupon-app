# Fix PostgreSQL SSL Certificate Error

## Error
```
self-signed certificate in certificate chain
ConnectionError [SequelizeConnectionError]: self-signed certificate in certificate chain
```

## Solution

The database configuration has been updated to handle self-signed SSL certificates. However, you need to configure your `.env` file correctly.

### Option 1: Disable SSL (For Development)

If you're using a local PostgreSQL database without SSL:

**Update your `.env` file:**
```env
DB_SSL=false
```

Or if using `POSTGRES_URL`, don't include SSL parameters:
```env
POSTGRES_URL=postgresql://user:password@host:port/database
```

### Option 2: Enable SSL with Self-Signed Certificate (For Production/Remote DB)

If your PostgreSQL server requires SSL with a self-signed certificate:

**Update your `.env` file:**
```env
DB_SSL=true
```

Or if using `POSTGRES_URL`, the configuration will automatically detect SSL and set `rejectUnauthorized: false` to accept self-signed certificates.

**With POSTGRES_URL:**
```env
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require
DB_SSL=true
```

### Option 3: Use POSTGRES_URL with SSL Parameters

You can also include SSL parameters directly in the URL:
```env
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require
```

## What Was Fixed

The database configuration now:
1. ✅ Properly detects when SSL is required
2. ✅ Sets `rejectUnauthorized: false` to accept self-signed certificates
3. ✅ Works with both `POSTGRES_URL` and individual DB variables
4. ✅ Handles SSL detection from URL parameters

## Quick Fix

**For most cases, add this to your `.env` file:**
```env
DB_SSL=false
```

Then restart your server:
```bash
npm run dev
```

## Verify Configuration

After updating `.env`, test the connection:
```bash
npm run test-db
```

If you still get SSL errors, make sure:
1. ✅ `DB_SSL=false` is set (for local/non-SSL databases)
2. ✅ Or `DB_SSL=true` is set (for SSL databases)
3. ✅ Server was restarted after changing `.env`
4. ✅ `.env` file is in the correct location (`backend1/.env`)

