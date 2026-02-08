# Hippo Daily Deployment Guide

This document provides instructions for deploying Hippo Daily (Hippomemory) to Amazon Lightsail.

## Prerequisites

- Lightsail instance running Ubuntu 24.04 LTS
- Static IP attached: `100.22.228.18`
- Domains: hippomemory.com (primary), hippodaily.com, memfuel.com, memorlock.com (redirect to hippomemory.com)
- GitHub repository: `https://github.com/jasonreedcarlisle/hippomemory`
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

### 6. Install nginx

```bash
sudo apt install nginx -y
```

### 7. Create Directory Structure

```bash
# Create directories
mkdir -p /home/ubuntu/hippomemory-production
mkdir -p /home/ubuntu/hippomemory-staging
mkdir -p /home/ubuntu/logs
mkdir -p /home/ubuntu/backups

# Set permissions
chown -R ubuntu:ubuntu /home/ubuntu/hippomemory-production
chown -R ubuntu:ubuntu /home/ubuntu/hippomemory-staging
chown -R ubuntu:ubuntu /home/ubuntu/logs
chown -R ubuntu:ubuntu /home/ubuntu/backups
```

### 8. Clone Repository

```bash
# Clone to production
cd /home/ubuntu/hippomemory-production
git clone https://github.com/jasonreedcarlisle/hippomemory.git .

# Clone to staging
cd /home/ubuntu/hippomemory-staging
git clone -b staging https://github.com/jasonreedcarlisle/hippomemory.git .
```

### 9. Install Dependencies

```bash
# Production
cd /home/ubuntu/hippomemory-production
npm install --production

# Staging
cd /home/ubuntu/hippomemory-staging
npm install --production
```

### 10. Copy PM2 Config

```bash
# Copy ecosystem.config.js to home directory (or keep in repo)
cp /home/ubuntu/hippomemory-production/ecosystem.config.js /home/ubuntu/
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
chmod +x /home/ubuntu/hippomemory-production/backup.sh

# Add to crontab (runs daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * /home/ubuntu/hippomemory-production/backup.sh >> /home/ubuntu/logs/backup.log 2>&1
```

### 13. Configure nginx

Create nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/hippomemory
```

Add this configuration (paste only the nginx directives, not markdown code fences):

```nginx
# Primary: hippomemory.com (production)
server {
    listen 80;
    server_name hippomemory.com www.hippomemory.com;

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

# Staging
server {
    listen 80;
    server_name staging.hippomemory.com;

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

# Redirect: hippodaily.com -> hippomemory.com
server {
    listen 80;
    server_name hippodaily.com www.hippodaily.com;
    return 301 https://hippomemory.com$request_uri;
}

# Redirect: memfuel.com -> hippomemory.com
server {
    listen 80;
    server_name memfuel.com www.memfuel.com;
    return 301 https://hippomemory.com$request_uri;
}

# Redirect: memorlock.com -> hippomemory.com
server {
    listen 80;
    server_name memorlock.com www.memorlock.com staging.memorlock.com;
    return 301 https://hippomemory.com$request_uri;
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/hippomemory /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 14. Set Up SSL (Certbot / Let's Encrypt)

For a basic Lightsail instance, SSL is configured on the server using Certbot:

```bash
# Install Certbot and nginx plugin
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificates (Certbot will configure nginx)
sudo certbot --nginx -d hippomemory.com -d www.hippomemory.com -d staging.hippomemory.com
```

Certbot will obtain certificates from Let's Encrypt and automatically configure HTTPS. Choose "Yes" when asked to redirect HTTP to HTTPS. Certificates renew automatically.

## Deployment Workflow

### Deploy to Staging (from local machine)

```bash
cd hippomemory
node deploy.js staging
```

Or manually on the server:

```bash
# SSH into server
ssh ubuntu@100.22.228.18

# Run staging deployment script
cd /home/ubuntu/hippomemory-staging
./deploy-staging.sh
```

Or manually with git:

```bash
cd /home/ubuntu/hippomemory-staging
git pull origin staging
pm2 restart hippomemory-staging
```

### Deploy to Production (from local machine)

```bash
cd hippomemory
node deploy.js production
```

Or manually on the server:

```bash
# SSH into server
ssh ubuntu@100.22.228.18

# Run production deployment script
cd /home/ubuntu/hippomemory-production
./deploy-production.sh
```

Or manually with git:

```bash
cd /home/ubuntu/hippomemory-production
git pull origin main
pm2 restart hippomemory-production
```

## Monitoring

### View Logs

```bash
# Production logs
pm2 logs hippomemory-production

# Staging logs
pm2 logs hippomemory-staging

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
pm2 info hippomemory-production
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
pm2 logs hippomemory-production --lines 50

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

- Certbot certificates auto-renew; verify with `sudo certbot certificates`
- Ensure DNS for hippomemory.com and staging.hippomemory.com points to `100.22.228.18`
- Wait for DNS propagation (up to 48 hours)

## Backup and Restore

### Manual Backup

```bash
cd /home/ubuntu/hippomemory-production
./backup.sh
```

### Restore from Backup

```bash
# List backups
ls -lh /home/ubuntu/backups/

# Restore a backup (adjust filename as needed)
cp /home/ubuntu/backups/puzzles_production_YYYYMMDD_HHMMSS.json /home/ubuntu/hippomemory-production/puzzles.json
pm2 restart hippomemory-production
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

## Project Structure

The hippomemory project lives in `/home/ubuntu/hippomemory-production` (production) and `/home/ubuntu/hippomemory-staging` (staging). Key paths:

- **App root:** `/home/ubuntu/hippomemory-production/`
- **Logs:** `/home/ubuntu/logs/` (PM2 and backup logs)
- **Backups:** `/home/ubuntu/backups/`
- **PM2 config:** `/home/ubuntu/ecosystem.config.js`

## Support

For issues or questions, check:
- PM2 logs: `pm2 logs`
- nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u nginx`
- Detailed server setup: `STEP5_SERVER_SETUP.md`
