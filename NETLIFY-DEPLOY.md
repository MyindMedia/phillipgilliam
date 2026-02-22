# Netlify Deployment Guide

## Option 1: Manual Deploy (Safest)

### Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Login (one-time)
```bash
netlify login
```

### Deploy
```bash
cd /root/.openclaw/workspace/pgilliam-website
netlify deploy --prod --dir=.
```

## Option 2: Auto-Deploy with GitHub Actions

### Step 1: Create Netlify Site
```bash
netlify sites:create
# Note the Site ID
```

### Step 2: Get Auth Token
```bash
netlify login
# Token saved in ~/.netlify/config.json
```

### Step 3: Add Secrets to GitHub
Go to: https://github.com/MyindMedia/phillipgilliam/settings/secrets/actions

Add these secrets:
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal token
- `NETLIFY_SITE_ID` - Your site ID (e.g., `xxx-yyy-zzz`)

### Step 4: Push to GitHub
GitHub Actions will auto-deploy on every push!

## Recommended: Option 2 (Auto-Deploy)

Once set up, just:
1. Edit files locally
2. `git commit`
3. Push to GitHub
4. GitHub Actions → Netlify deploys automatically

## Temporary Manual Deploy

If you're giving access to a specific Netlify site for testing:

**Netlify Settings:**
- Site: Add site → Import existing project → GitHub
- Repo: MyindMedia/phillipgilliam
- Branch: main
- Publish directory: / (root)

**OR via CLI:**
```bash
cd /path/to/website
netlify deploy --prod --dir=.
netlify sites:create --name phillipgilliam-noir
```