# Fix: "Please install pg package manually" Error

## The Problem

Vercel is not installing the `pg` package even though it's in `package.json`.

## Root Cause

Vercel needs to know where your `package.json` is located. If Root Directory is not set correctly, Vercel won't install dependencies.

## Solution: Set Root Directory in Vercel Dashboard

**CRITICAL STEP - Do this first:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** (top navigation)
4. Click **General** tab
5. Scroll down to **Root Directory**
6. Click **Edit**
7. Enter: `backend1`
8. Click **Save**

## Why This Fixes It

- Your `package.json` is in the `backend1` folder
- By default, Vercel looks for `package.json` in the repository root
- Setting Root Directory to `backend1` tells Vercel:
  - "This is my project root"
  - "Install dependencies from `backend1/package.json`"
  - "All paths are relative to `backend1`"

## After Setting Root Directory

1. **Redeploy:**
   - Go to **Deployments** tab
   - Click **...** (three dots) on the latest deployment
   - Click **Redeploy**
   - OR push a new commit to trigger deployment

2. **Verify:**
   - Check deployment logs
   - Should see: "Installing dependencies..."
   - Should see: "Installed X packages"
   - Should NOT see: "Please install pg package manually"

## Alternative: Deploy from backend1 folder directly

If you prefer not to use Root Directory:

1. Deploy only the `backend1` folder:
   ```bash
   cd backend1
   vercel
   ```

2. Or use Vercel CLI from root:
   ```bash
   vercel --cwd backend1
   ```

But the **Root Directory method is recommended** because:
- Works with GitHub integration
- Easier to manage
- Single source of truth

## Verification Checklist

After setting Root Directory and redeploying:

- [ ] Deployment shows "Installing dependencies..." in logs
- [ ] No "Please install pg package manually" error
- [ ] Function logs show database connection attempts (even if they fail)
- [ ] `/health` endpoint returns 200
- [ ] `/debug/env` endpoint shows environment variables

## Still Getting the Error?

If you've set Root Directory and still getting the error:

1. **Double-check Root Directory:**
   - Settings → General → Root Directory should be exactly `backend1` (not `./backend1` or `/backend1`)

2. **Check package.json exists:**
   - Verify `backend1/package.json` exists in your repository
   - Verify `pg` is in `dependencies` (not `devDependencies`)

3. **Clear Vercel cache:**
   - Go to Settings → General
   - Scroll to "Clear Build Cache"
   - Click "Clear"

4. **Check build logs:**
   - Go to deployment → "Build Logs" tab
   - Look for npm install output
   - Should see `pg@8.11.3` being installed

