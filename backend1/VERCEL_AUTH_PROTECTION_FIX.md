# Fix: Vercel Authentication Protection Blocking API Requests

## Problem

Your Vercel deployment has **Deployment Protection** enabled, which is blocking all API requests with a 401 "Authentication Required" error. This is a Vercel security feature that protects preview deployments.

## Solution Options

### Option 1: Disable Deployment Protection (Recommended for API)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Deployment Protection**
3. For your deployment/environment (Production or Preview):
   - **Disable** "Vercel Authentication"
   - Or set it to "Protect production deployment only" if you only want to protect production

4. Save the changes
5. Your API endpoints should now be accessible without authentication

### Option 2: Use Bypass Token (For Testing)

If you want to keep protection enabled but need to test the API:

1. Get a bypass token:
   - Go to **Settings** → **Deployment Protection** in your Vercel dashboard
   - Look for the "Protection Bypass Token" section
   - Copy the token

2. Use the token in API requests:
   - **Option A:** Add as query parameter:
     ```
     https://your-domain.com/api/auth/login?x-vercel-protection-bypass=YOUR_TOKEN
     ```
   
   - **Option B:** Add as header:
     ```
     X-Vercel-Protection-Bypass: YOUR_TOKEN
     ```

### Option 3: Protect Only Specific Routes

If you want to keep protection but allow API access:

1. Configure your `vercel.json` to exclude API routes from protection
2. Or use Vercel's route matching to apply protection selectively

## Verify Fix

After disabling protection, test the login endpoint:

```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

You should receive a JSON response with a token, not an HTML authentication page.

## Note

Deployment Protection is useful for preview deployments that shouldn't be publicly accessible. However, for API endpoints that need to be accessible to your frontend or other services, you should disable it or configure it appropriately.

