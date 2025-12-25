# Fix SSL Certificate Error - Step by Step

## The Error
```
self-signed certificate in certificate chain
ConnectionError [SequelizeConnectionError]: self-signed certificate in certificate chain
```

## Root Cause
PostgreSQL is trying to connect with SSL enabled, but your database doesn't have a valid SSL certificate or you're using a local database that doesn't need SSL.

## Solution

### Step 1: Check Your .env File Location

Make sure you have a `.env` file in the `backend1` folder (same directory as `package.json`).

### Step 2: Add DB_SSL=false to .env File

**Open your `.env` file** (or `.env.12`, `.env.13`, etc.) and add this line:

```env
DB_SSL=false
```

### Step 3: If Using POSTGRES_URL

**If your .env file has POSTGRES_URL**, make sure it does NOT include SSL parameters:

**❌ WRONG:**
```env
POSTGRES_URL=postgresql://user:pass@host:port/db?sslmode=require
```

**✅ CORRECT:**
```env
POSTGRES_URL=postgresql://user:pass@host:port/db
DB_SSL=false
```

Or remove SSL parameters from the URL entirely.

### Step 4: Complete .env File Example

Your `.env` file should look like this:

```env
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coupon_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# OR use POSTGRES_URL (without SSL)
# POSTGRES_URL=postgresql://postgres:password@localhost:5432/coupon_db

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Step 5: Verify Your .env File

**Check that DB_SSL is set correctly:**

```bash
# Windows (CMD)
type .env | findstr DB_SSL

# Windows (PowerShell)
Select-String -Path .env -Pattern "DB_SSL"

# Linux/macOS
grep DB_SSL .env
```

**Expected output:**
```
DB_SSL=false
```

### Step 6: Restart/Rerun

After updating `.env`, run the migration again:

```bash
node scripts/run-migrations-simple.js
```

## If It Still Doesn't Work

### Check 1: Verify .env File is Being Loaded

Add this temporary debug line at the start of `run-migrations-simple.js`:

```javascript
console.log('DB_SSL value:', process.env.DB_SSL);
console.log('All DB vars:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_SSL: process.env.DB_SSL
});
```

### Check 2: If Using Custom .env File Name

If you're using `.env.12` or `.env.13`, set the ENV_FILE variable:

```bash
# Windows (CMD)
set ENV_FILE=.env.12
node scripts/run-migrations-simple.js

# Windows (PowerShell)
$env:ENV_FILE=".env.12"
node scripts/run-migrations-simple.js

# Linux/macOS
ENV_FILE=.env.12 node scripts/run-migrations-simple.js
```

### Check 3: Verify POSTGRES_URL Format

If using POSTGRES_URL, ensure it doesn't have SSL in it:

```env
# Remove any of these from your URL:
# ?sslmode=require
# ?ssl=true
# &sslmode=require
# &ssl=true
```

### Check 4: Test Connection First

Test the database connection separately:

```bash
npm run test-db
```

This will show you the exact SSL configuration being used.

## Quick Checklist

- [ ] `.env` file exists in `backend1` folder
- [ ] `DB_SSL=false` is in `.env` file
- [ ] No SSL parameters in `POSTGRES_URL` (if using)
- [ ] Restarted/rerun the script after changing `.env`
- [ ] Verified .env file is being loaded (check debug output)

## Common Mistakes

1. **Setting DB_SSL=true** when using local database
   - Fix: Set `DB_SSL=false`

2. **POSTGRES_URL includes sslmode=require**
   - Fix: Remove SSL parameters from URL

3. **Typo in .env file**
   - Fix: Check spelling: `DB_SSL` not `DB_SSl` or `DBSSL`

4. **Forgot to save .env file**
   - Fix: Make sure file is saved

5. **Wrong .env file location**
   - Fix: Must be in `backend1` folder, same level as `package.json`

