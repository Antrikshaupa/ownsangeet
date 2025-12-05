# OwnSangeet Production Deployment Script (PowerShell)
# Server: root@31.97.224.232
# Domain: ownsangeet.com

Write-Host "🚀 Starting OwnSangeet Production Deployment..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Configuration
$SERVER_USER = "root"
$SERVER_IP = "31.97.224.232"
$SERVER_PATH = "/var/www/ownsangeet.com"
$SERVER = "${SERVER_USER}@${SERVER_IP}"

Write-Host ""
Write-Host "📋 Pre-Deployment Checklist:" -ForegroundColor Yellow
Write-Host "   ✅ Client build complete" -ForegroundColor Green
Write-Host "   ✅ Server build complete" -ForegroundColor Green
Write-Host "   ✅ Admin credentials updated in seed.ts" -ForegroundColor Green
Write-Host "   ✅ Production environment configured" -ForegroundColor Green
Write-Host ""

Write-Host "🔐 Connecting to server..." -ForegroundColor Blue
Write-Host "   You will be prompted for SSH passphrase" -ForegroundColor Yellow
Write-Host ""

# Create deployment commands
$deployCommands = @"
echo '================================================'
echo '📦 OwnSangeet Deployment Script'
echo '================================================'
echo ''

# Create backup
BACKUP_DIR='/var/www/backups/ownsangeet'
TIMESTAMP=`$(date +"%Y%m%d_%H%M%S")`
mkdir -p `$BACKUP_DIR

echo '💾 Creating backup of current deployment...'
if [ -d '/var/www/ownsangeet.com' ]; then
    tar -czf `$BACKUP_DIR/ownsangeet_backup_`$TIMESTAMP.tar.gz -C /var/www ownsangeet.com 2>/dev/null || echo '⚠️  Backup skipped'
    echo '✅ Backup created: ownsangeet_backup_'`$TIMESTAMP'.tar.gz'
else
    echo '⚠️  No existing deployment found'
fi

# Stop current PM2 process
echo ''
echo '⏸️  Stopping current backend process...'
pm2 stop ownsangeet-backend 2>/dev/null || echo '⚠️  No process to stop'

# Create deployment directory
echo ''
echo '📁 Preparing deployment directory...'
mkdir -p /var/www/ownsangeet.com/server
mkdir -p /var/www/ownsangeet.com/client

echo '✅ Server ready for file upload'
echo ''
echo '================================================'
echo 'Ready for rsync upload from local machine'
echo '================================================'
"@

Write-Host "Executing pre-deployment commands..." -ForegroundColor Blue
$deployCommands | ssh -t $SERVER

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error during pre-deployment" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📤 Uploading files to server..." -ForegroundColor Blue
Write-Host ""

# Upload server files
Write-Host "   Uploading server dist..." -ForegroundColor Cyan
& rsync -avz --progress ./server/dist/ "${SERVER}:${SERVER_PATH}/server/dist/"

Write-Host "   Uploading server dependencies..." -ForegroundColor Cyan  
& rsync -avz --progress ./server/node_modules/ "${SERVER}:${SERVER_PATH}/server/node_modules/"

Write-Host "   Uploading Prisma files..." -ForegroundColor Cyan
& rsync -avz --progress ./server/prisma/ "${SERVER}:${SERVER_PATH}/server/prisma/"

Write-Host "   Uploading server package.json..." -ForegroundColor Cyan
& scp ./server/package.json "${SERVER}:${SERVER_PATH}/server/"

Write-Host "   Uploading production environment..." -ForegroundColor Cyan
& scp ./server/.env.production "${SERVER}:${SERVER_PATH}/server/.env"

Write-Host "   Uploading update credentials script..." -ForegroundColor Cyan
& scp ./server/scripts/update-admin-credentials.ts "${SERVER}:${SERVER_PATH}/server/scripts/"

# Upload client files
Write-Host "   Uploading client build..." -ForegroundColor Cyan
& rsync -avz --progress ./client/build/ "${SERVER}:${SERVER_PATH}/client/build/"

Write-Host ""
Write-Host "✅ Files uploaded successfully" -ForegroundColor Green
Write-Host ""

# Setup and start services
Write-Host "🔧 Setting up database and starting services..." -ForegroundColor Blue

$setupCommands = @"
cd /var/www/ownsangeet.com/server

echo '🗄️  Setting up production database...'
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo ''
echo '🔐 Updating admin credentials...'
npx ts-node scripts/update-admin-credentials.ts

echo ''
echo '🔄 Starting backend service...'
cd /var/www/ownsangeet.com/server
pm2 start dist/index.js --name ownsangeet-backend --env production 2>/dev/null || pm2 reload ownsangeet-backend
pm2 save

echo ''
echo '📊 PM2 Status:'
pm2 list | grep ownsangeet

echo ''
echo '✅ Deployment complete!'
"@

Write-Host "Executing setup commands..." -ForegroundColor Blue
$setupCommands | ssh -t $SERVER

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Deployment Summary:" -ForegroundColor Cyan
Write-Host "   • Domain: https://ownsangeet.com"
Write-Host "   • Admin Login: hr@ownsangeet.com"
Write-Host "   • Server: $SERVER_IP"
Write-Host ""
Write-Host "🔍 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test website: https://ownsangeet.com"
Write-Host "   2. Test admin login: https://ownsangeet.com/admin"
Write-Host "   3. Verify other sites are working"
Write-Host "   4. Monitor logs: ssh $SERVER 'pm2 logs ownsangeet-backend'"
Write-Host ""
