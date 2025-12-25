# PowerShell script to set environment variables to Vercel
# Usage: .\scripts\set-vercel-env-manual.ps1

Write-Host "🚀 Setting Environment Variables to Vercel" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if logged in
try {
    vercel whoami | Out-Null
} catch {
    Write-Host "❌ Not logged in to Vercel. Please run: vercel login" -ForegroundColor Red
    exit 1
}

# Set environment (production, preview, or development)
$envType = if ($args[0]) { $args[0] } else { "production" }
Write-Host "📦 Environment: $envType" -ForegroundColor Yellow
Write-Host ""

# Read .env file if it exists
$envPath = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envPath) {
    Write-Host "📖 Reading .env file..." -ForegroundColor Green
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.+)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim() -replace '^["'']|["'']$', ''
            Set-Variable -Name $key -Value $value -Scope Script
        }
    }
}

Write-Host ""
Write-Host "📝 You can now set environment variables using these commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Required variables:" -ForegroundColor Yellow
Write-Host "  vercel env add POSTGRES_URL $envType" -ForegroundColor White
Write-Host "  vercel env add JWT_SECRET $envType" -ForegroundColor White
Write-Host ""
Write-Host "Optional variables:" -ForegroundColor Yellow
Write-Host "  vercel env add JWT_EXPIRES_IN $envType" -ForegroundColor White
Write-Host "  vercel env add DB_SSL $envType" -ForegroundColor White
Write-Host "  vercel env add NODE_ENV $envType" -ForegroundColor White
Write-Host "  vercel env add FRONTEND_URL $envType" -ForegroundColor White
Write-Host ""
Write-Host "💡 After setting, verify with: vercel env ls" -ForegroundColor Green
Write-Host "💡 Redeploy with: vercel --prod" -ForegroundColor Green

