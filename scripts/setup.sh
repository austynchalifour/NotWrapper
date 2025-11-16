#!/bin/bash

# NotWrapper MVP Setup Script
# This script sets up the development environment

set -e

echo "🔍 NotWrapper MVP Setup Script"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

echo "✅ Python $(python3 --version) detected"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install web dependencies
echo ""
echo "📦 Installing web app dependencies..."
cd apps/web
npm install
cd ../..

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd apps/backend
npm install
cd ../..

# Install Python analyzer dependencies
echo ""
echo "📦 Installing Python analyzer dependencies..."
cd apps/analyzer

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

pip install -r requirements.txt

cd ../..

# Create .env files if they don't exist
echo ""
echo "📝 Setting up environment files..."

if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.local.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local (please fill in your credentials)"
fi

if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Created apps/backend/.env (please fill in your credentials)"
fi

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up Supabase:"
echo "   - Create project at https://supabase.com"
echo "   - Run SQL from supabase/schema.sql"
echo "   - Create storage buckets: videos, badges, scan-results, avatars"
echo ""
echo "2. Add credentials to .env files:"
echo "   - apps/web/.env.local"
echo "   - apps/backend/.env"
echo ""
echo "3. Start development servers (in separate terminals):"
echo "   Terminal 1: cd apps/backend && npm run dev"
echo "   Terminal 2: cd apps/analyzer && source venv/bin/activate && python app.py"
echo "   Terminal 3: cd apps/web && npm run dev"
echo ""
echo "4. Access the app:"
echo "   Web: http://localhost:3000"
echo ""
echo "📖 See DEVELOPMENT.md for detailed instructions"
echo ""

