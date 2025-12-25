# Quick Fix: Vercel "pg package" Error

## The Problem

You're getting this error:
```
Error: Please install pg package manually
```

This happens because Vercel can't find your `package.json` file to install dependencies.

## The Solution

**Set the Root Directory in Vercel Dashboard:**

1. Go to your Vercel project dashboard
2. Click on **Settings** (top navigation)
3. Go to **General** tab
4. Find **Root Directory** section
5. Click **Edit**
6. Enter: `backend1`
7. Click **Save**

## Why This Works

- Your `package.json` is in the `backend1` folder
- By default, Vercel looks for `package.json` in the repo root
- Setting Root Directory to `backend1` tells Vercel to use that folder as the project root
- Vercel will then find `backend1/package.json` and install all dependencies (including `pg`)

## After Setting Root Directory

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger a new deployment

The deployment should now succeed!

## Alternative: Move vercel.json

If you prefer not to set Root Directory, you can also:
1. Move `vercel.json` to the `backend1` folder
2. Update paths in `vercel.json` to be relative (remove `backend1/` prefix)
3. Deploy from the `backend1` folder

But the Root Directory method is recommended as it's simpler.

