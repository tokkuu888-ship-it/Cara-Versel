#!/bin/bash

echo "🚀 Setting up Next.js + Express.js + Vercel Postgres Monorepo"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing API dependencies..."
cd apps/api && npm install
cd ../..

echo "📦 Installing Web dependencies..."
cd apps/web && npm install
cd ../..

echo "📦 Installing shared types dependencies..."
cd packages/shared-types && npm install
cd ../..

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from template"
fi

if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
    echo "📝 Created apps/api/.env file from template"
fi

if [ ! -f apps/web/.env ]; then
    cp apps/web/.env.example apps/web/.env
    echo "📝 Created apps/web/.env file from template"
fi

# Build shared types
echo "🔨 Building shared types package..."
cd packages/shared-types && npm run build
cd ../..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your database URL in apps/api/.env"
echo "2. Run 'cd apps/api && npm run db:generate' to generate Prisma client"
echo "3. Run 'cd apps/api && npm run db:migrate' to run database migrations"
echo "4. Run 'cd apps/api && npm run db:seed' to seed sample data"
echo "5. Run 'npm run dev' from the root to start both servers"
echo ""
echo "📚 For more information, see README.md"
