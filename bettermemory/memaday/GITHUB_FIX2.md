# Fix the Incorrect Remote URL

The remote URL has an `@` symbol in the wrong place. Here's how to fix it:

## Run These Commands (One at a Time):

```bash
# 1. Remove the incorrect remote
git remote remove origin

# 2. Add the correct remote URL (note: forward slash / not @)
git remote add origin https://github.com/jasonreedcarlisle/memorlock.git

# 3. Verify it's correct
git remote -v
```

After step 3, you should see:
```
origin  https://github.com/jasonreedcarlisle/memorlock.git (fetch)
origin  https://github.com/jasonreedcarlisle/memorlock.git (push)
```

## Then Push:

```bash
# 4. Push to GitHub
git push -u origin main
```

This will:
- Ask for your GitHub username (enter: `jasonreedcarlisle`)
- Ask for password (enter your **Personal Access Token**)

## If You Still Get "Not Found" Error:

Make sure:
1. The repository exists at: https://github.com/jasonreedcarlisle/memorlock
2. The repository name is exactly `memorlock` (check for typos)
3. The repository is not private (or your token has access to private repos)

