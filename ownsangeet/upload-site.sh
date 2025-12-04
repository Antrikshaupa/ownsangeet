#!/bin/bash

# Upload script for ownsangeet.com deployment
# Run this script on your local machine to upload files to the server

SERVER_IP="31.97.224.232"
DOMAIN="ownsangeet.com"
WEB_ROOT="/var/www/$DOMAIN"

echo "Uploading website files to server..."

# Upload the simple deployment HTML file
scp simple-deploy.html root@$SERVER_IP:$WEB_ROOT/index.html

# Upload any additional assets if they exist
if [ -d "assets" ]; then
    scp -r assets root@$SERVER_IP:$WEB_ROOT/
fi

# Set proper permissions on the server
ssh root@$SERVER_IP "chown -R www-data:www-data $WEB_ROOT && chmod -R 755 $WEB_ROOT"

echo "Upload complete!"
echo "Your website should now be accessible at http://$DOMAIN"
