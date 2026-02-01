# Memorlock Deployment Guide

This document provides instructions for deploying Memorlock to Amazon Lightsail.

## Prerequisites

- Lightsail instance running Ubuntu 24.04 LTS
- Static IP attached: `100.22.228.18`
- Domain configured: `memorlock.com`
- GitHub repository: `https://github.com/jasonreedcarlisle/memorlock`
- SSH access to the Lightsail instance

## Initial Server Setup

### 1. Connect to Server

```bash
# Use Lightsail browser-based SSH or connect via terminal:
ssh ubuntu@100.22.228.18
```

### 2. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Install Node.js

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Install PM2

```bash
sudo npm install -g pm2
```

### 5. Install Git

```bash
sudo apt install git -y
```

### 6. Install nginx (Optional but Recommended)

```bash
sudo apt install nginx -y
```

### 7. Create Directory Structure

```bash
# Create directories
mkdir -p /home/ubuntu/memaday-production
mkdir -p /home/ubuntu/memaday-staging
mkdir -p /home/ubuntu/logs
mkdir -p /home/ubuntu/backups

# Set permissions
chown -R ubuntu:ubuntu /home/ubuntu/memaday-production
chown -R ubuntu:ubuntu /home/ubuntu/memaday-staging
chown -R ubuntu:ubuntu /home/ubuntu/logs
chown -R ubuntu:ubuntu /home/ubuntu/backups
```

### 8. Clone Repository

```bash
# Clone to production
cd /home/ubuntu/memaday-production
git clone https://github.com/jasonreedcarlisle/memorlock.git .

# Clone to staging
cd /home/ubuntu/memaday-staging
git clone -b staging https://github.com/jasonreedcarlisle/memorlock.git .
```

### 9. Install Dependencies

```bash
# Production
cd /home/ubuntu/memaday-production
npm install --production

# Staging
cd /home/ubuntu/memaday-staging
npm install --production
```

### 10. Copy PM2 Config

```bash
# Copy ecosystem.config.js to home directory (or keep in repo)
cp /home/ubuntu/memaday-production/ecosystem.config.js /home/ubuntu/
```

### 11. Start PM2 Processes

```bash
# Start both production and staging
pm2 start /home/ubuntu/ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Follow the instructions it provides (usually involves running a sudo command)
```

### 12. Set Up Automated Backups

```bash
# Make backup script executable
chmod +x /home/ubuntu/memaday-production/backup.sh

# Add to crontab (runs daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * /home/ubuntu/memaday-production/backup.sh >> /home/ubuntu/logs/backup.log 2>&1
```

### 13. Configure nginx (Optional)

Create nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/memorlock
```

Add this configuration:

```nginx
# Production (memorlock.com)
server {
    listen 80;
    server_name memorlock.com www.memorlock.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Staging (staging.memorlock.com)
server {
    listen 80;
    server_name staging.memorlock.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/memorlock /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 14. Set Up SSL Certificate (Lightsail Managed)

1. Go to Lightsail console
2. Navigate to your instance
3. Go to "Networking" tab
4. Click "Create certificate"
5. Enter domain: `memorlock.com` and `*.memorlock.com` (for staging)
6. Attach certificate to your instance
7. Lightsail will automatically configure HTTPS

## Deployment Workflow

### Deploy to Staging

```bash
# SSH into server
ssh ubuntu@100.22.228.18

# Run staging deployment script
cd /home/ubuntu/memaday-staging
./deploy-staging.sh
```

Or manually:

```bash
cd /home/ubuntu/memaday-staging
git pull origin staging
pm2 restart memorlock-staging
```

### Deploy to Production

```bash
# SSH into server
ssh ubuntu@100.22.228.18

# Run production deployment script
cd /home/ubuntu/memaday-production
./deploy-production.sh
```

Or manually:

```bash
cd /home/ubuntu/memaday-production
git pull origin main
pm2 restart memorlock-production
```

## Monitoring

### View Logs

```bash
# Production logs
pm2 logs memorlock-production

# Staging logs
pm2 logs memorlock-staging

# All logs
pm2 logs
```

### Monitor Processes

```bash
# Real-time monitoring
pm2 monit

# Status
pm2 status

# Detailed info
pm2 info memorlock-production
```

### Check Server Resources

```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Process list
ps aux | grep node
```

## Troubleshooting

### PM2 Process Not Starting

```bash
# Check logs
pm2 logs memorlock-production --lines 50

# Check if port is in use
sudo netstat -tulpn | grep 3001

# Restart PM2
pm2 restart all
```

### nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

- Check certificate status in Lightsail console
- Verify DNS records are correct
- Wait for DNS propagation (can take up to 48 hours)

## Backup and Restore

### Manual Backup

```bash
./backup.sh
```

### Restore from Backup

```bash
# List backups
ls -lh /home/ubuntu/backups/

# Restore a backup
cp /home/ubuntu/backups/puzzles_production_20260120_020000.json /home/ubuntu/memaday-production/puzzles.json
pm2 restart memorlock-production
```

## Maintenance

### Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Update Node.js (if needed)

```bash
# Check current version
node --version

# Update via nvm or reinstall from NodeSource
```

### Rotate Logs

PM2 logs can grow large. To rotate:

```bash
pm2 flush  # Clear all logs
```

Or set up log rotation in PM2 ecosystem config.

## Security

### Firewall

Only ports 80, 443, and 22 should be open. Verify:

```bash
sudo ufw status
```

### SSH Security

- Use SSH keys instead of passwords
- Consider restricting SSH to your IP
- Keep system packages updated

## Support

For issues or questions, check:
- PM2 logs: `pm2 logs`
- nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u nginx`

