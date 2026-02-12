#!/bin/bash

# Quick Deployment Script for Cambridge to Vercel
# This script helps you deploy to cam-bridge.vercel.app

set -e

echo "🚀 Cambridge Vercel Deployment Helper"
echo "======================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo ""
    echo "Install it with: npm i -g vercel"
    echo ""
    exit 1
fi

echo "✅ Vercel CLI is installed"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Error: This script must be run from the Cambridge project root directory"
    exit 1
fi

echo "✅ You're in the correct directory"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Build the project to verify it works
echo "🔨 Building project to verify..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "Ready to deploy! Choose an option:"
echo ""
echo "1) Deploy to production (cam-bridge.vercel.app)"
echo "2) Deploy preview (temporary URL)"
echo "3) Exit"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to production..."
        vercel --prod
        echo ""
        echo "✅ Deployment complete! Visit: https://cam-bridge.vercel.app"
        ;;
    2)
        echo ""
        echo "🚀 Deploying preview..."
        vercel
        echo ""
        echo "✅ Preview deployment complete!"
        ;;
    3)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Exiting..."
        exit 1
        ;;
esac
