# Quick Commands to Set Environment Variables on Vercel

## Quick Setup (Copy & Paste These Commands)

Navigate to the `backend1` directory first:
```powershell
cd C:\Jynak\jynak\coupon-app\backend1
```

### Required Variables

```powershell
# 1. Set PostgreSQL URL
vercel env add POSTGRES_URL production
# When prompted, paste your PostgreSQL connection string
# Example: postgresql://user:password@host:port/database

# 2. Set JWT Secret
vercel env add JWT_SECRET production
# When prompted, paste your JWT secret
# Example: your-super-secret-key-here
```

### Optional Variables

```powershell
# JWT Expiration (default: 7d)
echo 7d | vercel env add JWT_EXPIRES_IN production

# Database SSL (default: false)
echo false | vercel env add DB_SSL production

# Node Environment (default: production)
echo production | vercel env add NODE_ENV production

# Frontend URL (for CORS)
vercel env add FRONTEND_URL production
# When prompted, enter your frontend URL (or press Enter to skip)
```

### Verify Variables Are Set

```powershell
vercel env ls
```

### After Setting Variables, Redeploy

```powershell
vercel --prod
```

## Alternative: Set for All Environments at Once

```powershell
# Set for all environments (production, preview, development)
vercel env add POSTGRES_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add DB_SSL
vercel env add NODE_ENV
```

## Using PowerShell with Variables from .env file

If you have a `.env` file, you can read values and set them:

```powershell
# Read .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^POSTGRES_URL=(.+)$') {
        $postgresUrl = $matches[1].Trim() -replace '^["'']|["'']$', ''
        echo $postgresUrl | vercel env add POSTGRES_URL production
    }
    if ($_ -match '^JWT_SECRET=(.+)$') {
        $jwtSecret = $matches[1].Trim() -replace '^["'']|["'']$', ''
        echo $jwtSecret | vercel env add JWT_SECRET production
    }
}
```

