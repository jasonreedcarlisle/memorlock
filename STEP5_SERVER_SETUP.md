# Step 5: Server Setup for Hippo Daily (Detailed)

This guide migrates the server from memorlock.com / memaday-* to hippomemory.com / hippomemory-*.

**Prerequisites:**
- DNS complete (Step 6): hippomemory.com, hippodaily.com, memfuel.com, memorlock.com all point to `100.22.228.18`
- SSH access: `ssh ubuntu@100.22.228.18`

**Estimated time:** 20–30 minutes

---

## 1. Connect to the server

From your laptop:

```bash
ssh ubuntu@100.22.228.18
```

You should land in the ubuntu user's home directory (`/home/ubuntu`). All commands below are run on the server unless noted.

---

## 2. Create new directories and clone

### 2a. Create directories

```bash
mkdir -p /home/ubuntu/hippomemory-production
mkdir -p /home/ubuntu/hippomemory-staging
```

The `-p` flag creates parent directories if needed and does nothing if they already exist. Logs and backups dirs may already exist; that's fine.

### 2b. Clone production

```bash
cd /home/ubuntu/hippomemory-production
git clone https://github.com/jasonreedcarlisle/hippomemory.git .
```

The trailing `.` clones into the current directory (instead of creating a `hippomemory` subfolder).

**Expected output:** Cloning into '.'... done. List of files.

**If you see "fatal: destination path '.' already exists" or the dir isn't empty:** Run `ls -la`. If there are leftover files, either `rm -rf *` (careful) or use a different empty directory.

### 2c. Clone staging branch

```bash
cd /home/ubuntu/hippomemory-staging
git clone -b staging https://github.com/jasonreedcarlisle/hippomemory.git .
```

`-b staging` checks out the `staging` branch. If you don't have a staging branch yet, this may fail; in that case use `-b main` instead and create the staging branch later.

### 2d. Install dependencies

```bash
cd /home/ubuntu/hippomemory-production
npm install --production

cd /home/ubuntu/hippomemory-staging
npm install --production
```

`--production` skips devDependencies.

---

## 3. Migrate data from old deployment

Copy `puzzles.json` so daily puzzle data is preserved:

```bash
cp /home/ubuntu/memaday-production/puzzles.json /home/ubuntu/hippomemory-production/puzzles.json 2>/dev/null || true
```

- If the old file exists, it's copied.
- If it doesn't, the command succeeds and does nothing (`|| true`).

Then fix ownership:

```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/hippomemory-production
sudo chown -R ubuntu:ubuntu /home/ubuntu/hippomemory-staging
```

---

## 4. Make deploy scripts executable

Do this before running them:

```bash
chmod +x /home/ubuntu/hippomemory-production/backup.sh
chmod +x /home/ubuntu/hippomemory-production/deploy-production.sh
chmod +x /home/ubuntu/hippomemory-production/deploy-staging.sh
```

---

## 5. Update PM2 (process manager)

PM2 runs your Node apps and restarts them on reboot.

### 5a. Stop and remove old processes

```bash
pm2 stop memorlock-production memorlock-staging 2>/dev/null || true
pm2 delete memorlock-production memorlock-staging 2>/dev/null || true
```

Errors if the processes don't exist can be ignored.

### 5b. Copy ecosystem config and start new processes

```bash
cp /home/ubuntu/hippomemory-production/ecosystem.config.js /home/ubuntu/
pm2 start /home/ubuntu/ecosystem.config.js
```

**Expected output:** Two apps started (hippomemory-production, hippomemory-staging).

### 5c. Save and enable startup on reboot

```bash
pm2 save
pm2 startup
```

`pm2 startup` prints a `sudo env PATH=... pm2 startup ...` command. Copy and run that exact command. It configures PM2 to start automatically on boot.

### 5d. Verify PM2

```bash
pm2 status
```

Both hippomemory-production and hippomemory-staging should show `online` with PID values.

---

## 6. Update nginx

Nginx sits in front of your Node apps and routes requests by domain.

### 6a. Create the config file

```bash
sudo nano /etc/nginx/sites-available/hippomemory
```

This opens a new (or empty) file. Paste the config below.

**Nano tips:** Paste with right-click or Cmd+V. Save with `Ctrl+O`, Enter. Exit with `Ctrl+X`.

### 6b. Full nginx configuration

Paste this entire block:

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

### 6c. Enable the site and disable the old one

```bash
sudo rm -f /etc/nginx/sites-enabled/memorlock
sudo ln -sf /etc/nginx/sites-available/hippomemory /etc/nginx/sites-enabled/
```

### 6d. Test and reload nginx

```bash
sudo nginx -t
```

**Expected:** `syntax is ok` and `test is successful`.

Then:

```bash
sudo systemctl reload nginx
```

---

## 7. Update cron (backup job)

Edit the ubuntu user's crontab:

```bash
crontab -e
```

If asked to choose an editor, pick nano (usually option 1).

Find the line that references `memaday-production` (or `memorlock-production`) and update it to:

```
0 2 * * * /home/ubuntu/hippomemory-production/backup.sh >> /home/ubuntu/logs/backup.log 2>&1
```

This runs the backup at 2:00 AM daily.

Save and exit (in nano: `Ctrl+O`, Enter, `Ctrl+X`).

---

## 8. SSL certificates (Lightsail)

1. Open **AWS Lightsail** → your instance.
2. Go to the **Networking** tab.
3. Under **SSL/TLS certificates**, click **Create certificate** (or similar).
4. Add domains:
   - `hippomemory.com`
   - `www.hippomemory.com`
   - `*.hippomemory.com` (covers staging.hippomemory.com)
5. Complete validation (DNS records, if required).
6. Attach the certificate to the instance.

Lightsail will then serve HTTPS for those domains. The redirect domains (hippodaily.com, memfuel.com, memorlock.com) may initially use HTTP for the 301 redirect; that's acceptable. If you later want HTTPS on them too, add them to the certificate.

---

## 9. Verification

On the server:

```bash
pm2 status
curl -I http://localhost:3001
curl -I http://localhost:3002
```

From your laptop:

- http://hippomemory.com — should load the app (or redirect to https once SSL is attached)
- http://staging.hippomemory.com — should load staging
- http://memorlock.com — should 301 redirect to https://hippomemory.com
- http://memfuel.com — should 301 redirect to https://hippomemory.com
- http://hippodaily.com — should 301 redirect to https://hippomemory.com

---

## Troubleshooting

| Problem | Check |
|--------|--------|
| `git clone` fails | Verify repo URL, SSH key, or use HTTPS |
| `npm install` fails | Run `node -v` and `npm -v`; ensure Node 18+ |
| PM2 apps not starting | `pm2 logs hippomemory-production` |
| nginx won't reload | `sudo nginx -t` for config errors; `sudo tail -f /var/log/nginx/error.log` |
| Site not loading | Confirm DNS, PM2 status, and that ports 80/443 are open in Lightsail |
