#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Deployment Process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

# 1. Server Setup
echo "-----------------------------------"
echo "📦 Installing Server Dependencies..."
echo "-----------------------------------"
cd server
npm install
cd ..

# 2. Client Setup & Build
echo "-----------------------------------"
echo "📦 Installing Client Dependencies..."
echo "-----------------------------------"
cd client
npm install

echo "-----------------------------------"
echo "🏗️  Building React Client..."
echo "-----------------------------------"
npm run build
cd ..

echo "-----------------------------------"
echo "✅ Deployment Setup Complete!"
echo "-----------------------------------"
echo "To start the application:"
echo "1. Ensure MongoDB is running."
echo "2. Check server/.env configuration."
echo "3. Run: cd server && npm start"
