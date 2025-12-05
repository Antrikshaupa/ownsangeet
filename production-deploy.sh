#!/bin/bash

# OwnSangeet Production Deployment Script
# Server: root@31.97.224.232
# Domain: ownsangeet.com

set -e  # Exit on any error

echo "🚀 Starting OwnSangeet Production Deployment..."
echo "================================================"

# Configuration
SERVER_USER="root"
SERVER_IP="31.97.224.232"
SERVER_PATH="/var/www/ownsangeet.com"
BACKUP_DIR="/var/www/backups/ownsangeet"
PM2_APP_NAME="ownsangeet-backend"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Building Client (Frontend)${NC}"
cd client
npm run build
echo -e "${GREEN}✅ Client build complete${NC}"
cd ..

echo -e "${BLUE}Step 2: Building Server (Backend)${NC}"
cd server
npm run build
echo -e "${GREEN}✅ Server build complete${NC}"
cd ..

echo -e "${BLUE}Step 3: Preparing deployment package${NC}"
# Create a temporary deployment directory
DEPLOY_TEMP="./deploy_temp"
rm -rf $DEPLOY_TEMP
mkdir -p $DEPLOY_TEMP

# Copy client build
mkdir -p $DEPLOY_TEMP/client/build
cp -r client/build/* $DEPLOY_TEMP/client/build/

# Copy server files
mkdir -p $DEPLOY_TEMP/server
cp -r server/dist $DEPLOY_TEMP/server/
cp -r server/node_modules $DEPLOY_TEMP/server/
cp -r server/prisma $DEPLOY_TEMP/server/
cp server/package.json $DEPLOY_TEMP/server/
cp server/.env.production $DEPLOY_TEMP/server/.env

# Copy public assets (music, photos, etc.)
if [ -d "server/public" ]; then
    cp -r server/public $DEPLOY_TEMP/server/
fi

echo -e "${GREEN}✅ Deployment package prepared${NC}"

echo -e "${BLUE}Step 4: Connecting to server and deploying${NC}"
echo -e "${YELLOW}⚠️  You will be prompted for SSH passphrase${NC}"

# Execute deployment on server via SSH
ssh -t ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'

echo "📦 Connected to production server"

# Create backup directory
BACKUP_DIR="/var/www/backups/ownsangeet"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

echo "💾 Creating backup of current deployment..."
if [ -d "/var/www/ownsangeet.com" ]; then
    tar -czf $BACKUP_DIR/ownsangeet_backup_$TIMESTAMP.tar.gz -C /var/www ownsangeet.com
    echo "✅ Backup created: ownsangeet_backup_$TIMESTAMP.tar.gz"
else
    echo "⚠️  No existing deployment found, skipping backup"
fi

# Create deployment directory
mkdir -p /var/www/ownsangeet.com

ENDSSH

echo -e "${BLUE}Step 5: Uploading files to server${NC}"
rsync -avz --progress $DEPLOY_TEMP/ ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo -e "${BLUE}Step 6: Setting up database and starting services${NC}"
ssh -t ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'

cd /var/www/ownsangeet.com/server

echo "🗄️  Setting up production database..."
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo "🔐 Updating admin credentials..."
npx ts-node ../scripts/update-admin-credentials.ts || echo "⚠️  Credentials already updated"

echo "🔄 Restarting PM2 process..."
# Check if PM2 process exists
if pm2 list | grep -q "ownsangeet-backend"; then
    echo "Reloading existing PM2 process..."
    pm2 reload ownsangeet-backend
else
    echo "Starting new PM2 process..."
    pm2 start dist/index.js --name ownsangeet-backend --env production
    pm2 save
fi

echo "📊 PM2 Status:"
pm2 list | grep ownsangeet

ENDSSH

# Cleanup
echo -e "${BLUE}Step 7: Cleaning up${NC}"
rm -rf $DEPLOY_TEMP
echo -e "${GREEN}✅ Cleanup complete${NC}"

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "📝 Deployment Summary:"
echo "   • Domain: https://ownsangeet.com"
echo "   • Admin Login: hr@ownsangeet.com"
echo "   • Server: ${SERVER_IP}"
echo ""
echo "🔍 Next Steps:"
echo "   1. Test website: https://ownsangeet.com"
echo "   2. Test admin login: https://ownsangeet.com/admin"
echo "   3. Verify other sites are working"
echo "   4. Monitor logs: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs ownsangeet-backend'"
echo ""
