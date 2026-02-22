FROM nginx:alpine

# Copy all website files to nginx default location
COPY . /usr/share/nginx/html

# Update nginx config to support SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/css application/javascript text/html; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    \
    # Cache static assets \
    location ~* \.(css|js|png|jpg|jpeg|gif|ico)$ { \
        expires 1M; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Serve index.html for all routes \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]