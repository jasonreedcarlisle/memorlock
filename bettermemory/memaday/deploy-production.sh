#!/bin/bash

# Deployment script for Memorlock Production
# This script pulls the latest code from GitHub and restarts the PM2 process

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Navigate to production directory
cd /home/ubuntu/memaday-production

# Pull latest code from main branch
echo "📥 Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/main

# Install dependencies (if package.json changes)
if [ -f package.json ]; then
    echo "📦 Installing dependencies..."
    npm install --production
fi

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 restart memorlock-production

# Show status
echo "✅ Deployment complete!"
pm2 status memorlock-production

echo ""
echo "📊 View logs with: pm2 logs memorlock-production"
echo "📈 Monitor with: pm2 monit"

