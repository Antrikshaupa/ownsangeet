#!/bin/bash

# Deployment script for ownsangeet.com
# Server: 31.97.224.232
# Domain: ownsangeet.com

echo "Starting deployment for ownsangeet.com..."

# Server configuration
SERVER_IP="31.97.224.232"
DOMAIN="ownsangeet.com"
WEB_ROOT="/var/www/$DOMAIN"

# Update system packages
echo "Updating system packages..."
apt update && apt upgrade -y

# Install required software
echo "Installing web server and dependencies..."
apt install -y nginx nodejs npm git ufw certbot python3-certbot-nginx

# Configure firewall
echo "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Create web directory
echo "Setting up web directory..."
mkdir -p $WEB_ROOT
chown -R www-data:www-data $WEB_ROOT
chmod -R 755 $WEB_ROOT

# Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name ownsangeet.com www.ownsangeet.com;
    root /var/www/ownsangeet.com;
    index index.html index.htm;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location block
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security - deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Start and enable services
systemctl start nginx
systemctl enable nginx

echo "Basic server setup complete!"
echo "Next steps:"
echo "1. Upload website files to $WEB_ROOT"
echo "2. Run SSL certificate setup"
echo "3. Test the deployment"
