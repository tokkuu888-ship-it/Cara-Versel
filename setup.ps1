# Setup script for Windows PowerShell

Write-Host "🚀 Setting up PhD Seminar Management System" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Check Node.js version
    $majorVersion = [int]($nodeVersion -replace 'v(\d+).*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "📦 Installing API dependencies..." -ForegroundColor Yellow
Set-Location apps/api
npm install
Set-Location ../..

Write-Host "📦 Installing Web dependencies..." -ForegroundColor Yellow
Set-Location apps/web
npm install
Set-Location ../..

Write-Host "📦 Installing shared types dependencies..." -ForegroundColor Yellow
Set-Location packages/shared-types
npm install
Set-Location ../..

# Setup environment files
Write-Host "🔧 Setting up environment files..." -ForegroundColor Yellow

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "📝 Created .env file from template" -ForegroundColor Green
}

if (-not (Test-Path apps/api/.env)) {
    Copy-Item apps/api/.env.example apps/api/.env
    Write-Host "📝 Created apps/api/.env file from template" -ForegroundColor Green
}

if (-not (Test-Path apps/web/.env)) {
    Copy-Item apps/web/.env.example apps/web/.env
    Write-Host "📝 Created apps/web/.env file from template" -ForegroundColor Green
}

# Build shared types
Write-Host "🔨 Building shared types package..." -ForegroundColor Yellow
Set-Location packages/shared-types
npm run build
Set-Location ../..

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update your database URL in apps/api/.env" -ForegroundColor White
Write-Host "2. Run 'cd apps/api && npm run db:generate' to generate Prisma client" -ForegroundColor White
Write-Host "3. Run 'cd apps/api && npm run db:migrate' to run database migrations" -ForegroundColor White
Write-Host "4. Run 'cd apps/api && npm run db:seed' to seed sample data" -ForegroundColor White
Write-Host "5. Run 'npm run dev' from the root to start both servers" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more information, see README.md" -ForegroundColor Cyan

# Keep window open for user to read
Write-Host "Press Enter to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
