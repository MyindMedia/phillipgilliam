# Quick Start

## Local Development (No Docker)

```bash
cd pgilliam-website
python3 -m http.server 8888
# Open http://localhost:8888
```

## Docker (Recommended for Testing)

### Option 1: Docker Compose (Easiest)

```bash
cd pgilliam-website
docker-compose up -d
# Site runs at http://localhost:8888
docker-compose down  # Stop when done
```

### Option 2: Build and Run Docker Manually

```bash
cd pgilliam-website

# Build
docker build -t pgilliam-website .

# Run
docker run -d -p 8888:80 --name pgilliam-test pgilliam-website

# View
curl http://localhost:8888

# Stop
docker stop pgilliam-test
docker rm pgilliam-test
```

### Option 3: Live Editing with Volume Mount

```bash
# Edit files locally, see changes instantly
docker run -d -p 8888:80 -v $(pwd):/usr/share/nginx/html:ro --name pgilliam-dev nginx:alpine
```

## Deploy to Production

### Netlify
```bash
# Install netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
Already configured in `.github/workflows/deploy.yml`

## Files in this Project

- `index.html` - Main website
- `animations.css` - Noireffects
- `noir-design-research.md` - Design documentation
- `at-all-times-book-design.md` - New book concept
- `Dockerfile` - Docker image definition
- `docker-compose.yml` - Easy Docker setup
- `.github/workflows/deploy.yml` - Auto-deploy to GitHub Pages

## Preview Changes

1. Make edits to `index.html`
2. Refresh browser to see changes
3. If using Docker: `docker-compose restart`

## Contact

Phillip Gilliam | Noir Author
The John Talion Mysteries