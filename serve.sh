#!/bin/bash
# Serve the website locally

PORT=${1:-8888}

echo "🌐 Starting local server on port $PORT..."
echo "📁 Serving from: $(pwd)"
echo "🌐 Open: http://localhost:$PORT"
echo "⏹️  Press Ctrl+C to stop"
echo ""

# Try Python first
if command -v python3 > /dev/null; then
    python3 -m http.server $PORT
elif command -v python > /dev/null; then
    python -m http.server $PORT
# Try PHP
elif command -v php > /dev/null; then
    php -S 0.0.0.0:$PORT
# Try Node
elif command -v npx > /dev/null; then
    npx serve -p $PORT
# Fallback to busybox httpd
elif command -v busybox > /dev/null; then
    busybox httpd -f -p $PORT
else
    echo "❌ No suitable server found. Install Python, PHP, or Node."
    echo "   Or use Docker: docker-compose up"
    exit 1
fi