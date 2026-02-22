#!/bin/bash
# Download Black Leather Apron cover from pgilliam.com

IMAGE_DIR="/root/.openclaw/workspace/pgilliam-website/images"
mkdir -p "$IMAGE_DIR"

cd "$IMAGE_DIR"

echo "🚀 Downloading Black Leather Apron cover..."

# Try multiple possible URLs
URLS=(
    "https://pgilliam.com/wp-content/uploads/2025/04/black-leather-apron-cover.png"
    "https://pgilliam.com/wp-content/uploads/2025/04/Black-Leather-Apron-Cover.png"
    "https://pgilliam.com/wp-content/uploads/2025/04/black_leather_apron_cover.png"
    "https://pgilliam.com/wp-content/uploads/2025/03/black-leather-apron-cover.png"
)

for url in "${URLS[@]}"; do
    echo "Trying: $url"
    if curl -fsSL "$url" -o "black-leather-apron-cover-temp.png" 2>/dev/null; then
        mv "black-leather-apron-cover-temp.png" "black-leather-apron-cover.png"
        echo "✅ Downloaded successfully!"
        break
    fi
done

if [ ! -f "black-leather-apron-cover.png" ]; then
    echo "❌ Could not download automatically. Manual URL needed."
fi

echo "📁 Images in: $IMAGE_DIR"
ls -la