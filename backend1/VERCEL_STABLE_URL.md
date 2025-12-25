# Getting a Stable Backend API URL on Vercel

## Problem

When deploying with `vercel` (without `--prod`), Vercel creates **preview deployments** with unique URLs like:
- `https://backend1-ij7ii715e-vinodpatelgroupteam.vercel.app`
- `https://backend1-5u44y5twq-vinodpatelgroupteam.vercel.app`

These URLs change with each deployment, making it difficult to configure your frontend.

## Solution: Use Production Deployment

### Option 1: Get Production URL from Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to your `backend1` project
3. Look for the **Production** deployment (not Preview)
4. Copy the production URL - it will be stable and won't change

The production URL format is usually:
- `https://[project-name]-[team].vercel.app` (without the hash)
- Or: `https://[project-name]-[hash]-[team].vercel.app` (with hash, but stable)

### Option 2: Deploy to Production Using CLI

Always use `--prod` flag to deploy to production:

```powershell
cd backend1
vercel --prod
```

This will:
- Deploy to production environment
- Use the same production URL every time
- The URL will be shown in the output

### Option 3: Find Production URL from CLI

```powershell
# List all deployments and find production
vercel ls

# Inspect production deployment
vercel inspect --prod
```

## Configure Frontend to Use Stable URL

### Step 1: Get Your Production Backend URL

From your deployments list, find the Production deployment URL. It should look like:
- `https://backend1-[stable-hash]-vinodpatelgroupteam.vercel.app`

Or check your Vercel dashboard → Project → Settings → Domains

### Step 2: Set Environment Variable for Frontend

#### Option A: Using Vercel Dashboard (Recommended for Frontend)

1. Go to your **frontend** project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://backend1-[your-production-url].vercel.app`
   - **Environment**: Production, Preview, Development (as needed)
4. Save and redeploy frontend

#### Option B: Using .env File (For Local Development)

Create `.env` file in your frontend root:

```env
VITE_API_URL=https://backend1-[your-production-url].vercel.app
```

#### Option C: Using CLI for Frontend

```powershell
cd C:\Jynak\jynak\coupon-app
vercel env add VITE_API_URL production
# When prompted, enter: https://backend1-[your-production-url].vercel.app
```

### Step 3: Update Frontend Code (if needed)

Your `src/services/api.js` should already handle this:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://backend1-ij7ii715e-vinodpatelgroupteam.vercel.app'
```

If you want to hardcode a fallback, update it to your production URL:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://backend1-[your-production-url].vercel.app'
```

## Best Practice Workflow

### For Production Deployments:

```powershell
# 1. Deploy backend to production
cd backend1
vercel --prod

# 2. Note the production URL from output

# 3. Set frontend environment variable
cd ..
vercel env add VITE_API_URL production
# Enter the production backend URL

# 4. Deploy frontend
vercel --prod
```

### For Development/Preview:

```powershell
# Backend preview deployment
cd backend1
vercel  # Creates preview deployment

# Get preview URL from output, then:
cd ..
vercel env add VITE_API_URL preview
# Enter the preview backend URL
```

## Custom Domain (Most Stable Solution)

For the most stable URL, you can:

1. Add a custom domain to your backend project in Vercel
2. Use that custom domain as your API URL
3. It will never change regardless of deployments

Example:
- Custom domain: `api.yourdomain.com`
- Use in frontend: `https://api.yourdomain.com`

## Quick Commands Reference

```powershell
# List all deployments
vercel ls

# Deploy to production (stable URL)
vercel --prod

# Get production URL
vercel inspect --prod

# Set environment variable
vercel env add VITE_API_URL production

# List environment variables
vercel env ls
```

