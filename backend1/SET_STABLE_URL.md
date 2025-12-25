# How to Get a Stable Backend API URL

## The Problem

When you run `vercel` (without `--prod`), it creates **preview deployments** with different URLs each time:
- ❌ `https://backend1-ij7ii715e-vinodpatelgroupteam.vercel.app` (changes each time)
- ❌ `https://backend1-5u44y5twq-vinodpatelgroupteam.vercel.app` (changes each time)

## The Solution: Always Deploy to Production

### Step 1: Deploy to Production (Stable URL)

```powershell
cd backend1
vercel --prod
```

This command:
- ✅ Deploys to **production** environment
- ✅ Uses the **same URL** every time
- ✅ The URL is shown in the deployment output

### Step 2: Find Your Production URL

**Option A: From Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click on your `backend1` project
3. Look at the **Production** deployment
4. Copy the URL (it's stable and won't change)

**Option B: From CLI Output**
When you run `vercel --prod`, it shows:
```
🔗  Production: https://backend1-[stable-url].vercel.app [Xms]
```

**Option C: List Deployments**
```powershell
vercel ls
```
Look for deployments marked as "Production" - use that URL.

### Step 3: Configure Frontend to Use Stable URL

#### Method 1: Set Environment Variable on Vercel (Recommended)

```powershell
# Navigate to frontend root
cd C:\Jynak\jynak\coupon-app

# Set environment variable for production
vercel env add VITE_API_URL production
# When prompted, paste your stable production backend URL
# Example: https://backend1-5u44y5twq-vinodpatelgroupteam.vercel.app
```

#### Method 2: Update Code with Fallback

Edit `src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://backend1-5u44y5twq-vinodpatelgroupteam.vercel.app'
```

Replace with your actual stable production URL.

## Complete Workflow

### For Production (Stable URL):

```powershell
# 1. Deploy backend to production
cd backend1
vercel --prod
# ✅ Note the production URL from output

# 2. Set frontend environment variable
cd ..
vercel env add VITE_API_URL production
# Paste the production backend URL when prompted

# 3. Deploy frontend
vercel --prod
```

### For Development/Testing (Preview):

```powershell
# Backend preview (temporary URL for testing)
cd backend1
vercel  # Creates preview with unique URL

# Frontend will use VITE_API_URL from environment
# Or you can set a preview-specific URL:
vercel env add VITE_API_URL preview
# Paste the preview backend URL
```

## Quick Reference

| Command | What It Does | URL Type |
|---------|-------------|----------|
| `vercel` | Creates preview deployment | ❌ Changes each time |
| `vercel --prod` | Creates production deployment | ✅ **STABLE - Same URL** |

## Recommended Setup

1. **Always use `vercel --prod` for backend** to get stable URL
2. **Set `VITE_API_URL` environment variable** on Vercel for frontend
3. **Use production URL** in your frontend environment variable

This way:
- ✅ Backend URL stays the same
- ✅ Frontend automatically uses the correct URL
- ✅ No need to update code each time

