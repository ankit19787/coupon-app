# Setting Environment Variables on Vercel

This guide shows you how to set environment variables for your Vercel deployment.

## Option 1: Using Vercel CLI (Recommended)

### Step 1: Make sure you're logged in
```bash
vercel login
```

### Step 2: Navigate to backend1 directory
```bash
cd backend1
```

### Step 3: Set environment variables one by one

#### For Production:
```bash
# Required variables
vercel env add POSTGRES_URL production
# Paste your PostgreSQL connection string when prompted

vercel env add JWT_SECRET production
# Paste your JWT secret when prompted

# Optional variables
vercel env add JWT_EXPIRES_IN production
# Enter: 7d (or press Enter for default)

vercel env add DB_SSL production
# Enter: false (or true if you need SSL)

vercel env add NODE_ENV production
# Enter: production (or press Enter for default)

vercel env add FRONTEND_URL production
# Enter your frontend URL (optional)
```

#### For Preview/Development:
Replace `production` with `preview` or `development` in the commands above.

### Step 4: Set for all environments at once
```bash
# Set for all environments (production, preview, development)
vercel env add POSTGRES_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add DB_SSL
vercel env add NODE_ENV
```

## Option 2: Using the Script

We have a helper script that reads from your `.env` file:

### Step 1: Create/edit your `.env` file in `backend1` directory:
```env
POSTGRES_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
DB_SSL=false
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Step 2: Run the script
```bash
cd backend1
node scripts/set-vercel-env.js
```

**Note:** This script currently sets variables for production. Modify it if you need preview/development.

## Option 3: Using Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Key: `POSTGRES_URL`
   - Value: Your PostgreSQL connection string
   - Environment: Select Production, Preview, and/or Development
4. Repeat for all variables
5. Save and redeploy

## Required Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `POSTGRES_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT tokens | `your-secret-key-change-in-production` |
| `JWT_EXPIRES_IN` | No | JWT token expiration time | `7d` |
| `DB_SSL` | No | Enable SSL for database | `false` or `true` |
| `NODE_ENV` | No | Node environment | `production` |
| `FRONTEND_URL` | No | Frontend URL for CORS | `https://your-frontend.com` |

## Verify Environment Variables

Check if variables are set:
```bash
vercel env ls
```

Pull environment variables (creates `.env.local`):
```bash
vercel env pull .env.local
```

## After Setting Variables

**Important:** After setting environment variables, you need to redeploy:

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## Example: Complete Setup

```bash
# 1. Login to Vercel
vercel login

# 2. Set required variables
vercel env add POSTGRES_URL production
# When prompted, paste: postgresql://user:pass@host:5432/dbname

vercel env add JWT_SECRET production
# When prompted, paste: your-super-secret-jwt-key-here

# 3. Set optional variables
echo "7d" | vercel env add JWT_EXPIRES_IN production
echo "false" | vercel env add DB_SSL production
echo "production" | vercel env add NODE_ENV production

# 4. List all environment variables to verify
vercel env ls

# 5. Redeploy
vercel --prod
```

## Troubleshooting

### Variable not found error
Make sure you've set the variable for the correct environment (production/preview/development).

### Changes not taking effect
1. Verify variables are set: `vercel env ls`
2. Redeploy your project: `vercel --prod`
3. Check Vercel function logs for errors

### Multiple environments
Set variables for each environment:
```bash
vercel env add POSTGRES_URL production
vercel env add POSTGRES_URL preview
vercel env add POSTGRES_URL development
```

Or use the dashboard to set for all environments at once.

