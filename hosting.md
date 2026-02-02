# Memaday Hosting Plan - Amazon Lightsail
## Approved Plan with Your Decisions

---

## Executive Summary

This document outlines the approved plan for deploying Memaday to Amazon Lightsail. Based on your preferences, we'll use:
- **Domain**: memaday.com (purchased from GoDaddy)
- **Server**: Linux Ubuntu 22.04 LTS, $3.50/month plan
- **SSL**: Lightsail managed certificate (works with custom domain)
- **Analytics**: Google Analytics
- **Backups**: Automated daily backups
- **Deployment**: Git/GitHub with staging and production environments
- **Database**: Will be added seamlessly later (PostgreSQL recommended)

---

## What You Need to Do vs. What I'll Do

### **PHASE 1: Lightsail Account Setup** (YOU DO THIS)

#### Step 1: Create AWS Account (if you don't have one)
1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the signup process (you'll need a credit card, but won't be charged until you create resources)
4. Complete email verification

#### Step 2: Navigate to Lightsail
1. Once logged into AWS, search for "Lightsail" in the top search bar
2. Click on "Amazon Lightsail" service
3. You should see the Lightsail dashboard

#### Step 3: Create Your First Instance
1. Click the **"Create instance"** button (big orange button)
2. **Choose a platform**: Select **"Linux/Unix"**
3. **Choose a blueprint**: Select **"OS Only"** → **"Ubuntu 22.04 LTS"**
4. **Choose your instance plan**: Select **"$3.50 USD/month"** (512 MB RAM, 1 vCPU, 20 GB SSD)
5. **Identify your instance**: Name it `memaday-production` (or just `memaday`)
6. **Add launch script** (optional, I can do this later): Leave blank for now
7. Click **"Create instance"**

#### Step 4: Configure Networking (Firewall)
1. Once your instance is created, click on it
2. Click the **"Networking"** tab
3. Under **"Firewall"**, click **"Add rule"** for each of these:
   - **HTTP** (port 80) - Allow from anywhere
   - **HTTPS** (port 443) - Allow from anywhere
   - **SSH** (port 22) - Allow from anywhere (or restrict to your IP later)
4. Click **"Save"**

#### Step 5: Get Your Instance Information
After the instance is created, you'll see:
- **Static IP address** (something like `3.123.45.67`) - **WRITE THIS DOWN!**
- **SSH access** - You can click "Connect using SSH" to open a browser terminal

**What to send me:**
- Your instance's **Static IP address**
- The **instance name** you chose
- Confirmation that ports 80, 443, and 22 are open

---

### **PHASE 2: Domain Purchase** (YOU DO THIS)

#### Step 1: Purchase memaday.com
1. Go to https://www.godaddy.com/ (or your preferred registrar)
2. Search for "memaday.com"
3. Purchase the domain (usually $10-15/year)
4. Complete the purchase

**Note**: GoDaddy is fine, but alternatives include:
- **Namecheap** (often cheaper, less upsells)
- **Google Domains** (simple, no upsells)
- **AWS Route 53** (if you want everything in AWS)

#### Step 2: Get Domain Access
You'll need access to your domain's DNS settings. In GoDaddy:
1. Go to "My Products" → "Domains"
2. Click on "memaday.com"
3. Click "DNS" or "Manage DNS"

**What to send me:**
- Confirmation that domain is purchased
- Access to DNS settings (or I'll guide you through the DNS changes)

---

### **PHASE 3: GitHub Setup** (YOU DO THIS, WITH MY HELP)

I'll provide step-by-step instructions below, but here's the overview:
1. Create GitHub account (if needed)
2. Create a repository
3. Push your code
4. I'll help you set up the workflow

---

### **PHASE 4: Code Changes & Server Setup** (I DO THIS)

Once you give me the Lightsail IP and domain info, I will:
1. Make all necessary code changes
2. Set up Git repository structure
3. Configure the server (SSH in, install Node.js, PM2, etc.)
4. Set up staging and production environments
5. Configure automated backups
6. Set up Google Analytics
7. Configure SSL certificate
8. Deploy the application

---

## Your Decisions Summary

✅ **Domain**: memaday.com from GoDaddy  
✅ **Server**: Linux Ubuntu 22.04 LTS, $3.50/month  
✅ **SSL**: Lightsail managed certificate  
✅ **Analytics**: Google Analytics  
✅ **Backups**: Automated daily backups  
✅ **Deployment**: Git/GitHub with staging + production  
✅ **Database**: Add later (PostgreSQL recommended)  
✅ **Memory Mastery**: Not included yet (future)  
✅ **Security**: Standard security (no user accounts in v1)  

---

## Git/GitHub Workflow for Beginners

### Overview: Three Environments

1. **Local (Your Laptop)**: Where you develop and test
2. **Staging (staging.memaday.com)**: Where you test before going live
3. **Production (memaday.com)**: The live website everyone sees

### The Simple Workflow

```
1. Develop on your laptop → Test locally
2. Push to GitHub → "staging" branch
3. Test on staging.memaday.com
4. If good, merge to "main" branch → Goes live to memaday.com
```

---

### Step-by-Step: Setting Up Git/GitHub

#### Step 1: Install Git (if not already installed)

**On Mac:**
```bash
# Check if Git is installed
git --version

# If not installed, install via Homebrew:
brew install git
```

**Or download from**: https://git-scm.com/downloads

#### Step 2: Create GitHub Account

1. Go to https://github.com/
2. Click "Sign up"
3. Choose a username (e.g., `yourname` or `memaday`)
4. Verify your email

#### Step 3: Create GitHub Repository

1. Log into GitHub
2. Click the **"+"** icon in top right → **"New repository"**
3. **Repository name**: `memaday` (or `memaday-game`)
4. **Description**: "Daily Memory Challenge Game"
5. **Visibility**: Choose **Private** (recommended) or **Public**
6. **DO NOT** check "Initialize with README" (we'll push existing code)
7. Click **"Create repository"**

#### Step 4: Initialize Git in Your Project

**On your laptop, in the memaday folder:**

```bash
cd /Users/jasoncarlisle/bettermemory/memaday

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Memaday game"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/memaday.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: GitHub will ask for your username and password. Use a **Personal Access Token** instead of password:
- Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token with `repo` permissions
- Use this token as your password

#### Step 5: Create Staging Branch

```bash
# Create and switch to staging branch
git checkout -b staging

# Push staging branch to GitHub
git push -u origin staging
```

---

### Daily Development Workflow

#### **Scenario A: Making Changes Locally**

```bash
# 1. Make sure you're on the main branch (or create a feature branch)
git checkout main

# 2. Make your code changes in your editor

# 3. Test locally (run npm start, test in browser)

# 4. When ready, commit your changes
git add .
git commit -m "Description of what you changed"

# 5. Push to staging first
git checkout staging
git merge main
git push origin staging

# 6. Test on staging.memaday.com

# 7. If everything looks good, push to production
git checkout main
git merge staging
git push origin main
```

#### **Scenario B: I Made Code Changes for You**

If I make code changes and you need to pull them:

```bash
# Pull latest changes from GitHub
git pull origin main

# If you have local changes, you might need to:
git stash  # Save your changes temporarily
git pull origin main
git stash pop  # Reapply your changes
```

---

### Branch Strategy (Simple)

- **`main`** branch = Production (memaday.com)
- **`staging`** branch = Staging (staging.memaday.com)

**Optional (for later):**
- Create feature branches for big changes: `git checkout -b feature/new-feature`
- Merge feature branches into staging first, then to main

---

## Staging Environment Setup

### What is Staging?

Staging is a **copy of your production site** where you can test changes before they go live. It's like a practice run.

- **Production**: `https://memaday.com` (everyone sees this)
- **Staging**: `https://staging.memaday.com` (only you see this)

### How It Works

1. **Two separate directories** on the server:
   - `/home/ubuntu/memaday-production/` (production)
   - `/home/ubuntu/memaday-staging/` (staging)

2. **Two separate PM2 processes**:
   - `memaday-production` (runs on port 3001)
   - `memaday-staging` (runs on port 3002)

3. **Two separate domains**:
   - `memaday.com` → production
   - `staging.memaday.com` → staging

### DNS Setup for Staging

In your GoDaddy DNS settings, you'll add:
- **A Record**: `@` → Your Lightsail IP (for memaday.com)
- **A Record**: `staging` → Your Lightsail IP (for staging.memaday.com)

---

## Database Setup (Future - Seamless Addition)

### Plan: Add Database Later Without Breaking Anything

**Current**: All data in `localStorage` (client-side)

**Future**: Add PostgreSQL database while keeping `localStorage` as fallback

### Strategy:

1. **Phase 1 (Now)**: Keep everything in `localStorage`
2. **Phase 2 (Later)**: Add database, but check `localStorage` first for backward compatibility
3. **Phase 3 (Migration)**: Gradually migrate users to database

### What We'll Do When Adding Database:

1. Install PostgreSQL on Lightsail (or use AWS RDS)
2. Create database schema
3. Update code to:
   - Try database first
   - Fall back to `localStorage` if database unavailable
   - Sync `localStorage` data to database when user logs in
4. No breaking changes - existing users keep working

**Recommended**: PostgreSQL (free, reliable, works great with Node.js)

---

## Google Analytics Setup

### Step 1: Create Google Analytics Account (YOU DO THIS)

1. Go to https://analytics.google.com/
2. Sign in with your Google account
3. Click "Start measuring"
4. **Account name**: "Memaday" (or your choice)
5. **Property name**: "Memaday Website"
6. **Property time zone**: Your timezone
7. **Currency**: USD (or your preference)
8. Click "Create"
9. Accept terms
10. **Choose platform**: "Web"
11. **Website URL**: `https://memaday.com`
12. **Stream name**: "Memaday Production"
13. Click "Create stream"
14. **Copy the Measurement ID** (looks like `G-XXXXXXXXXX`) - **SEND THIS TO ME**

### Step 2: I'll Add the Code

I'll add the Google Analytics tracking code to your HTML files. It will:
- Track page views
- Track user interactions (button clicks, game completions)
- Track custom events (game wins, difficulty levels, etc.)

---

## Automated Backup Strategy

### What Gets Backed Up:

1. **`puzzles.json`** - All puzzle data (daily backup)
2. **User statistics** (when database is added)
3. **Server configuration files** (weekly backup)
4. **Code repository** (already backed up in GitHub)

### Backup Implementation:

1. **Daily automated script** that:
   - Backs up `puzzles.json` to AWS S3 (or Lightsail object storage)
   - Keeps last 30 days of backups
   - Sends email notification if backup fails

2. **Weekly server snapshot**:
   - Lightsail can automatically snapshot your instance
   - Keeps last 4 snapshots (1 month of weekly backups)

3. **GitHub as code backup**:
   - All code is in GitHub (automatic backup)

### Cost: ~$0.50-1/month for S3 storage

---

## Required Code Changes (I'll Do This)

### 1. Environment Variables

**File**: `index.js`
- Make port configurable via `process.env.PORT`
- Add `NODE_ENV` support
- Add security headers

### 2. Remove Localhost References

**File**: `game.js`
- Remove `localhost:8000` references
- Make Memory Mastery URL configurable (for future)

### 3. Google Analytics Integration

**Files**: `index.html`, `game.js`
- Add GA4 tracking code
- Track custom events (game starts, completions, shares)

### 4. PM2 Configuration

**File**: `ecosystem.config.js` (new)
- Configure production and staging processes
- Set environment variables
- Configure auto-restart

### 5. Backup Script

**File**: `backup.sh` (new)
- Automated daily backup script
- Uploads to S3

### 6. Deployment Scripts

**Files**: `deploy-production.sh`, `deploy-staging.sh` (new)
- Automated deployment scripts
- Pull from GitHub, install dependencies, restart PM2

### 7. nginx Configuration (Optional)

**File**: `nginx.conf` (new)
- Reverse proxy configuration
- SSL termination
- Static file serving

---

## Server Architecture

### Production Setup:

```
Internet
  ↓
memaday.com (DNS → Lightsail IP)
  ↓
Lightsail Instance (Ubuntu 22.04)
  ├── nginx (port 80/443) → SSL termination
  │   └── Lightsail managed SSL certificate
  ├── Node.js Production (port 3001)
  │   └── PM2: memaday-production
  ├── Node.js Staging (port 3002)
  │   └── PM2: memaday-staging
  └── PostgreSQL (future, port 5432)
```

### Directory Structure:

```
/home/ubuntu/
├── memaday-production/     # Production code
│   ├── index.html
│   ├── game.js
│   ├── daily.js
│   └── ...
├── memaday-staging/        # Staging code
│   ├── index.html
│   ├── game.js
│   ├── daily.js
│   └── ...
└── backups/                # Backup scripts and logs
```

---

## Step-by-Step Deployment Plan

### Phase 1: Pre-Deployment (I DO)

1. ✅ Update code for environment variables
2. ✅ Remove localhost references
3. ✅ Add Google Analytics integration
4. ✅ Create PM2 configuration
5. ✅ Create deployment scripts
6. ✅ Create backup scripts
7. ✅ Update README with instructions
8. ✅ Set up Git repository structure

### Phase 2: Server Initial Setup (I DO, after you give me access)

1. SSH into Lightsail instance
2. Update system packages: `sudo apt update && sudo apt upgrade -y`
3. Install Node.js (v20 LTS): `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`
4. Install PM2 globally: `sudo npm install -g pm2`
5. Install Git: `sudo apt install git -y`
6. Install nginx: `sudo apt install nginx -y`
7. Create directory structure
8. Clone repository to staging and production directories
9. Install dependencies
10. Configure PM2 processes
11. Set up PM2 auto-start

### Phase 3: Domain & SSL Setup (WE DO TOGETHER)

1. **You**: Point DNS in GoDaddy:
   - Add A record: `@` → Your Lightsail IP
   - Add A record: `staging` → Your Lightsail IP
2. **Wait**: 1-2 hours for DNS propagation
3. **I**: Set up Lightsail SSL certificate:
   - Create certificate in Lightsail console
   - Attach to instance
   - Configure nginx to use certificate

### Phase 4: Google Analytics (I DO)

1. Add GA4 tracking code to HTML
2. Set up custom event tracking
3. Test tracking in staging

### Phase 5: Backup Setup (I DO)

1. Create AWS S3 bucket (or use Lightsail object storage)
2. Set up backup script
3. Configure cron job for daily backups
4. Test backup process

### Phase 6: Testing (WE DO TOGETHER)

1. Test staging environment
2. Test production environment
3. Verify SSL certificate
4. Verify Google Analytics tracking
5. Test backup process
6. Test deployment workflow

### Phase 7: Go Live! 🚀

1. Final production deployment
2. Monitor for issues
3. Celebrate! 🎉

---

## Cost Breakdown

### Monthly Costs:

- **Lightsail Instance**: $3.50/month (512 MB RAM)
- **Domain (memaday.com)**: ~$1/month ($10-15/year)
- **SSL Certificate**: **FREE** (Lightsail managed)
- **Google Analytics**: **FREE**
- **Backup Storage (S3)**: ~$0.50/month (for backups)
- **Total**: **~$5/month**

### Optional Future Costs:

- **Database (PostgreSQL)**: $0 (can run on same instance) or $15/month (AWS RDS)
- **CDN (CloudFront)**: $0-5/month (depending on traffic)
- **Monitoring**: $0-10/month (optional)

---

## What Information I Need From You

### After Lightsail Setup:
1. ✅ Static IP address of your instance
2. ✅ Instance name
3. ✅ Confirmation that ports 80, 443, 22 are open
4. ✅ SSH access (I'll need you to add my SSH key, or you can share temporary access)

### After Domain Purchase:
1. ✅ Confirmation domain is purchased
2. ✅ Access to DNS settings (or I'll guide you through changes)
3. ✅ Domain registrar (GoDaddy, etc.)

### After GitHub Setup:
1. ✅ GitHub repository URL
2. ✅ Your GitHub username
3. ✅ Confirmation that code is pushed to GitHub

### For Google Analytics:
1. ✅ Google Analytics Measurement ID (G-XXXXXXXXXX)

---

## Timeline

### Your Tasks (1-2 hours total):
- **Lightsail setup**: 15-30 minutes
- **Domain purchase**: 10-15 minutes
- **GitHub setup**: 30-60 minutes (first time, then 5 minutes for future updates)
- **Google Analytics**: 10-15 minutes

### My Tasks (4-6 hours total):
- **Code changes**: 1-2 hours
- **Server configuration**: 1-2 hours
- **SSL & DNS setup**: 30 minutes (plus waiting for DNS)
- **Testing & verification**: 1-2 hours

### Total Timeline:
- **Setup & Deployment**: 1-2 days (mostly waiting for DNS propagation)
- **Testing**: 1 day
- **Go Live**: Day 3-4

---

## Security Considerations

### What We're Implementing:

1. **HTTPS/SSL**: All traffic encrypted
2. **Security Headers**: 
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security (HSTS)
3. **Firewall**: Only necessary ports open (80, 443, 22)
4. **SSH Security**: 
   - Use SSH keys instead of passwords
   - Restrict SSH access to your IP (optional)
5. **Regular Updates**: Keep system packages updated

### Future Security (when adding user accounts):
- Password hashing (bcrypt)
- Session management
- CSRF protection
- Rate limiting

---

## Maintenance & Support

### Regular Tasks (Automated):
- ✅ Daily backups (automated)
- ✅ Weekly server snapshots (automated)
- ✅ Code in GitHub (automatic backup)

### Regular Tasks (Manual - Monthly):
- Review Google Analytics reports
- Check server logs for errors
- Update system packages: `sudo apt update && sudo apt upgrade`
- Review backup logs

### When to Contact Me:
- Server is down
- Errors in production
- Need to add new features
- Database migration (when ready)

---

## Next Steps - Action Items

### **YOU DO NOW:**

1. **Create Lightsail Instance** (15-30 min)
   - Follow "PHASE 1: Lightsail Account Setup" above
   - Send me: Static IP, instance name, port confirmation

2. **Purchase Domain** (10-15 min)
   - Purchase memaday.com from GoDaddy
   - Send me: Confirmation + DNS access

3. **Set Up GitHub** (30-60 min)
   - Follow "Git/GitHub Workflow for Beginners" above
   - Send me: Repository URL, your username

4. **Set Up Google Analytics** (10-15 min)
   - Follow "Google Analytics Setup" above
   - Send me: Measurement ID (G-XXXXXXXXXX)

### **I DO AFTER YOU COMPLETE ABOVE:**

1. Make all code changes
2. Set up server configuration
3. Deploy to staging
4. Configure SSL
5. Deploy to production
6. Set up backups
7. Test everything

---

## Questions or Issues?

If you run into any problems during setup:
1. **Lightsail issues**: Check AWS documentation or ask me
2. **Git/GitHub issues**: I can provide more detailed help
3. **Domain/DNS issues**: I'll guide you through DNS changes
4. **Anything else**: Just ask!

---

## Ready to Start?

Once you've completed the "YOU DO NOW" tasks above, send me:
1. Lightsail Static IP address
2. Domain purchase confirmation
3. GitHub repository URL
4. Google Analytics Measurement ID

Then I'll take over and get everything deployed! 🚀
