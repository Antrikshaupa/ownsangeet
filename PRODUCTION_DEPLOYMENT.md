# OwnSangeet Production Deployment Guide

## 🎯 Deployment Overview

This guide will help you deploy the updated OwnSangeet website to production at **ownsangeet.com**.

### What's New in This Deployment
- ✅ Updated admin credentials (hr@ownsangeet.com)
- ✅ Fixed password visibility issue in admin login
- ✅ Enhanced security with autocomplete disabled
- ✅ Production-ready builds for client and server
- ✅ Automated deployment script

---

## 📋 Pre-Deployment Checklist

### ✅ Already Completed
- [x] Client production build tested
- [x] Server production build tested
- [x] Admin credentials updated in seed.ts
- [x] Production environment file created
- [x] Deployment scripts created

### ⚠️ Before You Deploy
- [ ] Ensure you have SSH access to root@31.97.224.232
- [ ] Have your SSH passphrase ready
- [ ] Verify rsync is installed (`rsync --version`)
- [ ] Confirm you want to replace the current ownsangeet.com

---

## 🚀 Deployment Steps

### Method 1: Automated PowerShell Script (Recommended)

Simply run the deployment script:

```powershell
.\production-deploy.ps1
```

**What it does:**
1. Connects to the server
2. Creates backup of current deployment
3. Uploads all built files
4. Sets up production database
5. Updates admin credentials
6. Restarts backend service

You'll be prompted for SSH passphrase when connecting.

### Method 2: Manual Deployment

If you prefer manual control:

#### Step 1: Connect to Server
```powershell
ssh root@31.97.224.232
```

#### Step 2: Backup Current Deployment
```bash
mkdir -p /var/www/backups/ownsangeet
tar -czf /var/www/backups/ownsangeet/backup_$(date +"%Y%m%d_%H%M%S").tar.gz -C /var/www ownsangeet.com
```

#### Step 3: Upload Files
```powershell
# From your local machine
rsync -avz ./server/dist/ root@31.97.224.232:/var/www/ownsangeet.com/server/dist/
rsync -avz ./server/node_modules/ root@31.97.224.232:/var/www/ownsangeet.com/server/node_modules/
rsync -avz ./server/prisma/ root@31.97.224.232:/var/www/ownsangeet.com/server/prisma/
scp ./server/.env.production root@31.97.224.232:/var/www/ownsangeet.com/server/.env
rsync -avz ./client/build/ root@31.97.224.232:/var/www/ownsangeet.com/client/build/
```

#### Step 4: Setup Database (on server)
```bash
cd /var/www/ownsangeet.com/server
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npx ts-node scripts/update-admin-credentials.ts
```

#### Step 5: Restart Services (on server)
```bash
pm2 reload ownsangeet-backend
pm2 save
```

---

## 🔐 Admin Credentials

### New Credentials (After Deployment)
- **Email:** hr@ownsangeet.com
- **Password:** 9407361115@Hr

### Old Credentials (Will be Removed)
- **Email:** admin@ownsangeet.com
- **Password:** admin123

---

## ✅ Post-Deployment Verification

After deployment, verify everything is working:

### 1. Test Website
```
https://ownsangeet.com
```
- Should load the homepage
- Music player should work
- Contact form should submit

### 2. Test Admin Panel
```
https://ownsangeet.com/admin
```
- Login with: hr@ownsangeet.com / 9407361115@Hr
- Verify all admin features work
- Check that password is NOT visible/autofilled

### 3. Verify Other Websites
Check that other sites on the server are still working:
- https://hiring.ownsangeet.com
- https://social.ownsangeet.com
- https://n8n.ownsangeet.com

### 4. Monitor Logs
```bash
ssh root@31.97.224.232 'pm2 logs ownsangeet-backend'
```

---

## 🔧 Troubleshooting

### Issue: SSH Connection Failed
**Solution:** Verify you're using the correct passphrase

### Issue: rsync command not found
**Solution:** Install rsync on Windows:
```powershell
# Using Chocolatey
choco install rsync

# Or use WSL
wsl --install
```

### Issue: PM2 process won't start
**Solution:** Check logs and restart manually
```bash
ssh root@31.97.224.232
cd /var/www/ownsangeet.com/server  
pm2 delete ownsangeet-backend
pm2 start dist/index.js --name ownsangeet-backend
pm2 save
```

### Issue: Database errors
**Solution:** Reset the database
```bash
ssh root@31.97.224.232
cd /var/www/ownsangeet.com/server
rm -f prisma/production.db
npx prisma migrate deploy
npx prisma db seed
```

### Issue: Can't login with new credentials
**Solution:** Manually update credentials
```bash
ssh root@31.97.224.232
cd /var/www/ownsangeet.com/server
npx ts-node scripts/update-admin-credentials.ts
```

---

## 🔄 Rollback Procedure

If something goes wrong, you can rollback:

```bash
ssh root@31.97.224.232

# Find your backup
ls -lh /var/www/backups/ownsangeet/

# Stop current process
pm2 stop ownsangeet-backend

# Restore backup (replace TIMESTAMP with your backup time)
cd /var/www
tar -xzf backups/ownsangeet/ownsangeet_backup_TIMESTAMP.tar.gz

# Restart
pm2 restart ownsangeet-backend
```

---

## 📊 Deployment Files

### Created Files
- `production-deploy.ps1` - Main deployment script (PowerShell)
- `production-deploy.sh` - Alternative bash script
- `server/.env.production` - Production environment variables
- `server/scripts/update-admin-credentials.ts` - Credentials update script

### Modified Files
- `server/prisma/seed.ts` - Updated with new admin credentials
- `client/app/routes/admin/login.tsx` - Fixed password visibility

---

## 🎯 Success Criteria

Deployment is successful when:
- ✅ Website loads at https://ownsangeet.com
- ✅ Admin login works with hr@ownsangeet.com
- ✅ Password field does NOT show autofilled credentials
- ✅ Music player works
- ✅ Contact form works
- ✅ All other websites on server still work
- ✅ No errors in PM2 logs

---

## 📞 Support

If you encounter issues:
1. Check the logs: `pm2 logs ownsangeet-backend`
2. Verify Nginx config: `nginx -t`
3. Check server status: `pm2 list`
4. Review backup files in `/var/www/backups/ownsangeet/`

---

## 🔒 Security Notes

- The JWT_SECRET has been regenerated for production
- Admin credentials are now more secure
- Password autocomplete is disabled in login form
- All sensitive data is in .env files (not committed to git)
- Backups are created automatically before each deployment

---

Ready to deploy? Run:
```powershell
.\production-deploy.ps1
```
