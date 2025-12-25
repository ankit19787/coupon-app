#!/bin/bash

# Quick script to set environment variables to Vercel
# Usage: ./scripts/quick-set-vercel-env.sh

echo "🚀 Setting Environment Variables to Vercel"
echo "============================================"
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

# Set environment (production, preview, or development)
ENV=${1:-production}
echo "📦 Environment: $ENV"
echo ""

# Read .env file
if [ ! -f .env ]; then
    echo "❌ .env file not found in current directory"
    exit 1
fi

echo "📖 Reading .env file..."
source .env

# Required variables
echo ""
echo "📝 Setting required environment variables:"
echo ""

if [ -z "$POSTGRES_URL" ]; then
    echo "❌ POSTGRES_URL is not set in .env file"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET is not set in .env file"
    exit 1
fi

echo "POSTGRES_URL" | vercel env add POSTGRES_URL $ENV <<< "$POSTGRES_URL"
echo "JWT_SECRET" | vercel env add JWT_SECRET $ENV <<< "$JWT_SECRET"

# Optional variables
echo ""
echo "📝 Setting optional environment variables:"
echo ""

[ ! -z "$JWT_EXPIRES_IN" ] && echo "$JWT_EXPIRES_IN" | vercel env add JWT_EXPIRES_IN $ENV <<< "${JWT_EXPIRES_IN:-7d}"
[ ! -z "$DB_SSL" ] && echo "$DB_SSL" | vercel env add DB_SSL $ENV <<< "${DB_SSL:-false}"
[ ! -z "$NODE_ENV" ] && echo "$NODE_ENV" | vercel env add NODE_ENV $ENV <<< "${NODE_ENV:-production}"
[ ! -z "$FRONTEND_URL" ] && echo "$FRONTEND_URL" | vercel env add FRONTEND_URL $ENV <<< "$FRONTEND_URL"

echo ""
echo "✅ Done!"
echo ""
echo "💡 Verify with: vercel env ls"
echo "💡 Redeploy with: vercel --prod"

