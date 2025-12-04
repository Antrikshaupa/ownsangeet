# Own Sangeet Website Deployment Guide

## Server Information
- **Domain**: ownsangeet.com
- **Server IP**: 31.97.224.232
- **SSH User**: root
- **Password**: 9302316688An@150504

## Deployment Steps

### Step 1: Connect to Server and Run Initial Setup
```bash
# Connect to server
ssh root@31.97.224.232

# Upload and run the deployment script
chmod +x deploy.sh
./deploy.sh
```

### Step 2: Upload Website Files
```bash
# From your local machine, upload the website
chmod +x upload-site.sh
./upload-site.sh
```

### Step 3: Set Up SSL Certificate
```bash
# On the server, run SSL setup
chmod +x ssl-setup.sh
./ssl-setup.sh
```

### Step 4: Verify Deployment
- Visit http://ownsangeet.com to test HTTP access
- Visit https://ownsangeet.com to test HTTPS access
- Check SSL certificate validity

## Server Optimizations Included

### Security
- UFW firewall configured
- Security headers added
- SSL/TLS encryption with Let's Encrypt
- Hidden file access denied

### Performance
- Gzip compression enabled
- Static asset caching (1 year)
- Optimized SSL configuration
- CDN-ready setup

### SEO & Accessibility
- Proper meta tags
- Semantic HTML structure
- Mobile-responsive design
- Fast loading times

## Files Created

1. **deploy.sh** - Server setup and Nginx configuration
2. **ssl-setup.sh** - SSL certificate installation and optimization
3. **upload-site.sh** - Website file upload script
4. **simple-deploy.html** - Optimized website ready for deployment

## Troubleshooting

### If SSL setup fails:
```bash
# Check DNS propagation first
nslookup ownsangeet.com

# Manually run certbot
certbot --nginx -d ownsangeet.com -d www.ownsangeet.com
```

### If website doesn't load:
```bash
# Check Nginx status
systemctl status nginx

# Check Nginx configuration
nginx -t

# View error logs
tail -f /var/log/nginx/error.log
```

### DNS Configuration Required
Make sure your domain DNS points to the server:
- A record: ownsangeet.com → 31.97.224.232
- A record: www.ownsangeet.com → 31.97.224.232

## Next Steps After Deployment

1. **Monitor Performance**: Set up monitoring tools
2. **Backup Strategy**: Implement regular backups
3. **Content Updates**: Plan for content management
4. **Analytics**: Add Google Analytics or similar
5. **SEO Optimization**: Submit sitemap to search engines

## Support

If you encounter any issues during deployment, check the server logs and ensure all prerequisites are met. The deployment is designed to be robust and handle most common scenarios automatically.
