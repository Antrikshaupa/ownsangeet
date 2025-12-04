#!/bin/bash

# SSL Certificate setup for ownsangeet.com
DOMAIN="ownsangeet.com"

echo "Setting up SSL certificate for $DOMAIN..."

# Obtain SSL certificate using Let's Encrypt
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Set up automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

# Update Nginx configuration for SSL optimization
cat > /etc/nginx/snippets/ssl-params.conf << 'EOF'
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_dhparam /etc/nginx/dhparam.pem;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_ecdh_curve secp384r1;
ssl_session_timeout 10m;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
EOF

# Generate strong DH parameters
openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Restart Nginx to apply SSL configuration
systemctl restart nginx

echo "SSL setup complete!"
echo "Your website should now be accessible via HTTPS at https://$DOMAIN"
