# Debugging Vercel Deployment Issues

## How to Check Logs

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click on **Deployments** tab
   - Click on the failed deployment
   - Click on **Functions** tab
   - Click on the function that's failing (usually `api/index.js`)
   - View the **Logs** tab

2. **Look for these common errors:**

### Error: "Please install pg package manually"
- **Cause**: Root Directory not set to `backend1`
- **Fix**: Settings → General → Root Directory → Set to `backend1`

### Error: "Cannot find module"
- **Cause**: Missing dependencies or wrong paths
- **Fix**: Check that all files exist and dependencies are in `package.json`

### Error: Database connection failed
- **Cause**: Missing or incorrect `POSTGRES_URL` environment variable
- **Fix**: 
  1. Go to Settings → Environment Variables
  2. Verify `POSTGRES_URL` is set correctly
  3. Format: `postgresql://username:password@host:port/database`
  4. Check `DB_SSL` if your database requires SSL

### Error: "JWT_SECRET is not defined"
- **Cause**: Missing JWT_SECRET environment variable
- **Fix**: Add `JWT_SECRET` in Settings → Environment Variables

## Quick Debug Checklist

- [ ] Root Directory set to `backend1` in Vercel settings
- [ ] All environment variables are set:
  - [ ] `POSTGRES_URL` or individual DB variables
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `FRONTEND_URL`
  - [ ] `DB_SSL` (if needed)
- [ ] Database is accessible from Vercel's IPs
- [ ] Database migrations have been run
- [ ] All dependencies are in `dependencies` (not `devDependencies`)

## Test Locally Before Deploying

```bash
# Test database connection
cd backend1
npm run test-db

# Test the server locally
npm start

# Test health endpoint
curl http://localhost:3001/health
```

## Common Environment Variable Issues

### POSTGRES_URL Format
Correct format:
```
postgresql://username:password@host:port/database
```

If password contains special characters, URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`

### SSL Configuration
If your database requires SSL:
```
DB_SSL=true
```

If your database doesn't require SSL:
```
DB_SSL=false
```
(or leave it unset)

## Getting More Detailed Logs

Add this to your function to see what's happening:

```javascript
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
  JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
});
```

## Still Having Issues?

1. Check the **exact error message** in Vercel logs
2. Verify all environment variables are set
3. Test database connection from your local machine using the same `POSTGRES_URL`
4. Check if database firewall allows connections from anywhere (for testing)

