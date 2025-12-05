# Manual Deployment Steps - OwnSangeet

## ✅ Already Completed
- [x] Server dist files uploaded to /var/www/ownsangeet.com/server/dist/
- [x] Backup created
- [x] PM2 process stopped

## 📋 Remaining Steps

### Step 1: Upload Remaining Server Files

Run these commands one at a time (you'll need to enter SSH passphrase for each):

```powershell
# Upload Prisma files  
scp -r ./server/prisma root@31.97.224.232:/var/www/ownsangeet.com/server/

# Upload package.json
scp ./server/package.json root@31.97.224.232:/var/www/ownsangeet.com/server/

# Upload production environment
scp ./server/.env.production root@31.97.224.232:/var/www/ownsangeet.com/server/.env

# Upload credentials update script
scp -r ./server/scripts root@31.97.224.232:/var/www/ownsangeet.com/server/

# Upload client build
scp -r ./client/build root@31.97.224.232:/var/www/ownsangeet.com/client/
```

### Step 2: Install Node Modules on Server

Connect to server and install dependencies:

```powershell
ssh root@31.97.224.232
```

Then on the server, run:

```bash
cd /var/www/ownsangeet.com/server
npm install --production
```

### Step 3: Setup Database

Still on the server:

```bash
cd /var/www/ownsangeet.com/server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database with new admin credentials
npx prisma db seed
```

### Step 4: Start PM2 Process

```bash
cd /var/www/ownsangeet.com/server
pm2 start dist/index.js --name ownsangeet-backend --env production
pm2 save
```

### Step 5: Verify Deployment

```bash
# Check PM2 status
pm2 list

# Check logs
pm2 logs ownsangeet-backend --lines 50
```

### Step 6: Test Website

From your browser:
1. Visit: https://ownsangeet.com
2. Visit: https://ownsangeet.com/admin
3. Login with: hr@ownsangeet.com / 9407361115@Hr

---

## 🚀 Quick All-in-One Commands

If you want to run all remaining upload commands at once:

```powershell
scp -r ./server/prisma root@31.97.224.232:/var/www/ownsangeet.com/server/
scp ./server/package.json root@31.97.224.232:/var/www/ownsangeet.com/server/
scp ./server/.env.production root@31.97.224.232:/var/www/ownsangeet.com/server/.env
scp -r ./server/scripts root@31.97.224.232:/var/www/ownsangeet.com/server/
scp -r ./client/build root@31.97.224.232:/var/www/ownsangeet.com/client/
```

Then connect to server:

```powershell
ssh root@31.97.224.232
```

And run on server:

```bash
cd /var/www/ownsangeet.com/server
npm install --production
npx prisma generate
npx prisma migrate deploy  
npx prisma db seed
pm2 start dist/index.js --name ownsangeet-backend --env production
pm2 save
pm2 list
```

That's it! 🎉
