# GitHub Setup Guide for Memorlock

This guide will walk you through setting up GitHub and pushing your code from your laptop.

---

## Step 1: Install Git (if not already installed)

### Check if Git is installed:
Open Terminal on your Mac and run:
```bash
git --version
```

### If Git is NOT installed:
```bash
# Install Homebrew first (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Git
brew install git
```

### If Git IS installed:
You'll see something like `git version 2.39.0` - you're good to go!

---

## Step 2: Create GitHub Account

1. Go to https://github.com/
2. Click **"Sign up"** (top right)
3. Enter:
   - Username (e.g., `yourname` or `memorlock`)
   - Email address
   - Password
4. Verify your email address
5. Complete the setup (you can skip the optional questions)

**Write down your GitHub username** - you'll need it!

---

## Step 3: Create GitHub Repository

1. Log into GitHub
2. Click the **"+"** icon in the top right corner
3. Click **"New repository"**
4. Fill in:
   - **Repository name**: `memorlock` (or `memorlock-game`)
   - **Description**: "Daily Memory Challenge Game"
   - **Visibility**: Choose **Private** (recommended) or **Public**
   - **DO NOT** check "Add a README file" (we'll push existing code)
   - **DO NOT** add .gitignore or license (we already have these)
5. Click **"Create repository"**

**Copy the repository URL** - it will look like:
- `https://github.com/YOUR_USERNAME/memorlock.git`
- Or: `git@github.com:YOUR_USERNAME/memorlock.git`

---

## Step 4: Create Personal Access Token (for authentication)

GitHub requires a token instead of a password for authentication.

1. In GitHub, click your profile picture (top right) → **Settings**
2. Scroll down in the left sidebar → **Developer settings**
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **"Generate new token"** → **"Generate new token (classic)"**
5. Fill in:
   - **Note**: "Memorlock Development"
   - **Expiration**: Choose 90 days or 1 year (or "No expiration" if you prefer)
   - **Select scopes**: Check **`repo`** (this gives full repository access)
6. Click **"Generate token"** at the bottom
7. **COPY THE TOKEN IMMEDIATELY** - you won't be able to see it again!
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Save this token somewhere safe** (password manager, notes app, etc.)

---

## Step 5: Initialize Git in Your Project (if not already done)

Open Terminal and navigate to your project:

```bash
cd /Users/jasoncarlisle/bettermemory/memaday
```

### Check if Git is already initialized:
```bash
git status
```

### If you see "fatal: not a git repository", initialize Git:
```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Memorlock game"
```

### If Git is already initialized:
Just make sure all your files are committed:
```bash
git add .
git commit -m "Pre-deployment commit"
```

---

## Step 6: Connect to GitHub and Push Code

### Add GitHub as remote:
```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/memorlock.git
```

### Verify the remote was added:
```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/memorlock.git (fetch)
origin  https://github.com/YOUR_USERNAME/memorlock.git (push)
```

### Push to GitHub:
```bash
# Push to main branch
git branch -M main
git push -u origin main
```

**When prompted:**
- **Username**: Enter your GitHub username
- **Password**: Enter your **Personal Access Token** (NOT your GitHub password!)

If it works, you'll see something like:
```
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
Writing objects: 100% (50/50), done.
To https://github.com/YOUR_USERNAME/memorlock.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Step 7: Create Staging Branch

```bash
# Create and switch to staging branch
git checkout -b staging

# Push staging branch to GitHub
git push -u origin staging

# Switch back to main branch
git checkout main
```

---

## Troubleshooting

### Problem: "remote origin already exists"
**Solution**: Remove and re-add:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/memorlock.git
```

### Problem: "Authentication failed"
**Solution**: 
- Make sure you're using the **Personal Access Token**, not your password
- The token needs `repo` scope
- Try generating a new token if it expired

### Problem: "Permission denied"
**Solution**:
- Check that your GitHub username is correct
- Verify the repository name matches
- Make sure the token has `repo` permissions

### Problem: "Large file" error
**Solution**: 
- Check `.gitignore` is working (should ignore `node_modules/`, etc.)
- If you have large image files, we might need to adjust `.gitignore`

---

## Daily Workflow (After Initial Setup)

### Making Changes Locally:

```bash
# 1. Make sure you're on the main branch
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

# 6. Test on staging.memorlock.com (after I set it up)

# 7. If everything looks good, push to production
git checkout main
git merge staging
git push origin main
```

### Pulling Changes (if I make changes):

```bash
# Pull latest changes from GitHub
git pull origin main
```

---

## What to Send Me

After completing the setup, send me:

1. **GitHub repository URL**: `https://github.com/YOUR_USERNAME/memorlock`
2. **Your GitHub username**
3. **Confirmation**: Code has been pushed successfully

---

## Quick Reference Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push origin main

# Switch branches
git checkout main
git checkout staging

# Pull latest changes
git pull origin main

# View commit history
git log --oneline
```

---

## Next Steps

Once you've:
1. ✅ Created GitHub account
2. ✅ Created repository
3. ✅ Pushed code to GitHub
4. ✅ Sent me the repository URL

I will:
1. Update all code to use `memorlock.com` instead of `memaday.com`
2. Add Google Analytics (G-NWLB6G6E2S)
3. Make all production-ready code changes
4. Set up the server
5. Configure deployment scripts
6. Deploy to staging and production

---

## Questions?

If you run into any issues, let me know and I'll help troubleshoot!

