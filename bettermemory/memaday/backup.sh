#!/bin/bash

# Backup script for Memorlock
# This script backs up puzzles.json and other critical data
# Run this daily via cron job

set -e  # Exit on any error

# Configuration
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PRODUCTION_DIR="/home/ubuntu/memaday-production"
STAGING_DIR="/home/ubuntu/memaday-staging"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Starting backup at $(date)"

# Backup production puzzles.json
if [ -f "$PRODUCTION_DIR/puzzles.json" ]; then
    echo "📄 Backing up production puzzles.json..."
    cp "$PRODUCTION_DIR/puzzles.json" "$BACKUP_DIR/puzzles_production_$DATE.json"
    echo "✅ Production puzzles.json backed up"
else
    echo "⚠️  Production puzzles.json not found"
fi

# Backup staging puzzles.json
if [ -f "$STAGING_DIR/puzzles.json" ]; then
    echo "📄 Backing up staging puzzles.json..."
    cp "$STAGING_DIR/puzzles.json" "$BACKUP_DIR/puzzles_staging_$DATE.json"
    echo "✅ Staging puzzles.json backed up"
else
    echo "⚠️  Staging puzzles.json not found"
fi

# Keep only last 30 days of backups
echo "🧹 Cleaning up old backups (keeping last 30 days)..."
find "$BACKUP_DIR" -name "puzzles_*.json" -mtime +30 -delete

# Compress old backups (optional - saves space)
# Uncomment if you want to compress backups older than 7 days
# find "$BACKUP_DIR" -name "puzzles_*.json" -mtime +7 ! -name "*.gz" -exec gzip {} \;

echo "✅ Backup complete!"
echo "📁 Backup location: $BACKUP_DIR"
echo "📊 Backup files:"
ls -lh "$BACKUP_DIR"/puzzles_*.json 2>/dev/null | tail -5 || echo "No backup files found"

