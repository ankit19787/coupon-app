# Vercel Deployment Guide

This guide explains how to deploy the Coupon Management API to Vercel as serverless functions.

## Prerequisites

- Vercel account
- PostgreSQL database (can be from Vercel Postgres, Supabase, or any PostgreSQL provider)
- GitHub repository (recommended) or manual deployment

## Deployment Steps

### 1. Environment Variables

Add the following environment variables in Vercel Dashboard (Settings → Environment Variables):

#### Required:
- `POSTGRES_URL` - Your PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database`
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (e.g., `7d`)
- `FRONTEND_URL` - Your frontend URL for CORS (e.g., `https://your-frontend.vercel.app`)

#### Optional:
- `DB_SSL` - Set to `true` if your database requires SSL (default: `false`)
- `NODE_ENV` - Set to `production` (automatically set by Vercel)

### 2. Vercel Configuration

The `vercel.json` file is already configured. It routes all `/api/*` requests to the serverless function.

### 3. Database Migrations

**Important:** Run database migrations before deploying or use Vercel's build command:

```json
{
  "scripts": {
    "build": "npm run migrate && echo 'Build complete'"
  }
}
```

Or run migrations manually:
```bash
cd backend1
npm run migrate
```

### 4. Deploy

#### Option A: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Option B: Via GitHub
1. Push your code to GitHub
2. Import project in Vercel Dashboard
3. Configure build settings:
   - Framework Preset: Other
   - Root Directory: `backend1` ⚠️ **IMPORTANT: Set this to `backend1`**
   - Build Command: (leave empty - dependencies will install automatically)
   - Output Directory: (leave empty)
   - Install Command: `npm install` (should auto-detect from package.json)
4. Add environment variables (see below)
5. Deploy

**⚠️ Critical:** Make sure to set **Root Directory** to `backend1` in Vercel project settings, otherwise Vercel won't find your `package.json` and dependencies won't install.

### 5. Update Frontend API URL

Update your frontend's API URL to point to your Vercel deployment:
```
VITE_API_URL=https://your-project.vercel.app
```

## Important Notes

### Database Connection Pooling

- Pool size is set to 1 connection per serverless function (optimized for Vercel)
- Each function instance maintains its own connection pool
- Connections are reused within the same function instance

### Serverless Considerations

1. **Cold Starts**: First request may be slower due to cold start
2. **Database Connections**: Each function instance creates its own connection
3. **Migrations**: Run migrations separately, not on every function invocation
4. **Timeouts**: Vercel has execution time limits (10s for Hobby, 60s for Pro)

### Health Check

The health endpoint is available at:
```
GET https://your-project.vercel.app/health
```

### API Endpoints

All API endpoints are available at:
```
https://your-project.vercel.app/api/*
```

For example:
- `https://your-project.vercel.app/api/auth/login`
- `https://your-project.vercel.app/api/coupons`
- `https://your-project.vercel.app/api/users`

## Troubleshooting

### 500 Internal Server Error

1. **Check Environment Variables**: Ensure `POSTGRES_URL` is set correctly
2. **Check Database Connection**: Verify your database is accessible from Vercel
3. **Check Logs**: View function logs in Vercel Dashboard
4. **Check SSL Settings**: If using SSL, set `DB_SSL=true`

### Connection Timeout

1. **Check Database Firewall**: Ensure Vercel IPs are whitelisted (if using firewall)
2. **Check Connection String**: Verify `POSTGRES_URL` format is correct
3. **Check SSL**: Some databases require SSL in production

### Function Timeout

1. **Optimize Database Queries**: Ensure queries are efficient
2. **Reduce Initialization**: Minimize code in server.js startup
3. **Upgrade Plan**: Consider Vercel Pro for longer timeouts (60s)

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `POSTGRES_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Yes | JWT secret key | `your-secret-key` |
| `JWT_EXPIRES_IN` | Yes | JWT expiration | `7d` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS | `https://app.vercel.app` |
| `DB_SSL` | No | Enable SSL (true/false) | `false` |
| `NODE_ENV` | No | Environment | `production` |

## Example .env for Vercel

```env
POSTGRES_URL=postgresql://user:password@db.example.com:5432/coupon_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
DB_SSL=false
NODE_ENV=production
```

