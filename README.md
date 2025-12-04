# OwnSangeet - Custom Music & Songwriting Platform

A full-stack platform for creating custom songs for weddings, sangeet ceremonies, birthdays, and special occasions. Features an AI-powered blog system, admin dashboard, and secure API.

## 🎵 Features

- **Custom Song Creation** - Personalized songs for special events
- **AI Blog System** - Automated content generation via n8n workflow
- **Admin Dashboard** - Complete CMS for managing content
- **Music Player** - Dynamic music playback with track management
- **Contact System** - Inquiry management with email notifications
- **Security** - CSRF protection, rate limiting, JWT authentication

## 🛠️ Tech Stack

### Frontend
- **React 19** with React Router
- **Vite** for build tooling
- **Framer Motion** for animations
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express
- **Prisma ORM** with SQLite
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet.js** for security headers
- **Rate limiting** for API protection

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone repository**
```bash
git clone https://github.com/YOUR_USERNAME/ownsangeet.git
cd ownsangeet
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env` file in the `server` directory:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret_here
DATABASE_URL="file:./dev.db"

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@ownsangeet.com

# n8n Webhook (optional)
N8N_WEBHOOK_SECRET=your_webhook_secret
```

4. **Initialize database**
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

5. **Run development server**
```bash
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
ownsangeet/
├── client/                 # Frontend React application
│   ├── app/
│   │   ├── routes/        # Page routes
│   │   ├── components/    # Reusable components
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema & migrations
│   └── scripts/           # Utility scripts
└── server/n8n-workflows/  # n8n automation workflows
```

## 🔐 Security Features

- ✅ **CSRF Protection** - Token-based with secure cookies
- ✅ **Rate Limiting** - 5 login attempts per 15 minutes
- ✅ **Input Sanitization** - XSS prevention using validator
- ✅ **Helmet.js** - Security headers configured
- ✅ **bcrypt** - Password hashing with salt
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **CORS** - Restricted to frontend origin only

**Security Grade: A-** (See security audit in `/docs`)

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/v1/blogs` - List all published blogs
- `GET /api/v1/blogs/:slug` - Get single blog post
- `GET /api/v1/music` - List active music tracks
- `POST /api/v1/inquiries` - Submit contact inquiry

### Admin Endpoints (Requires Authentication)
- `POST /api/v1/auth/login` - Admin login
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/blogs` - Manage blog posts
- `GET /api/v1/admin/music` - Manage music tracks
- `GET /api/v1/admin/pages` - Manage CMS pages

### Webhook Endpoints (Requires API Key)
- `POST /api/v1/webhooks/blog-generation` - AI blog creation

## 🤖 AI Blog Automation

The platform includes an n8n workflow for automated blog generation:

1. **Daily Schedule** - Runs at 9 AM IST
2. **Perplexity AI** - Researches music releases
3. **Google Gemini** - Writes SEO-optimized content
4. **Unsplash/Pexels** - Fetches featured images
5. **Auto-publish** - Posts directly to the blog

Setup: See `server/n8n-workflows/SETUP-GUIDE.md`

## 👥 Default Admin Credentials

**Email:** `admin@ownsangeet.com`  
**Password:** `admin123`

⚠️ **Change these immediately in production!**

## 🧪 Testing

Security audit completed with 5 comprehensive test plans:
- Authentication & Authorization ✅
- API Security & Data Leakage ✅
- Input Validation & Injection ✅
- Session & CSRF Security ✅
- Browser Data Exposure ✅

See full report: `docs/security-audit.md`

## 📸 Screenshots

![Admin Dashboard](docs/screenshots/admin-dashboard.png)
![Blog System](docs/screenshots/blog-system.png)
![Music Player](docs/screenshots/music-player.png)

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT_SECRET to a strong random value
- [ ] Update admin credentials
- [ ] Configure SMTP for email
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure production database
- [ ] Set up backup system

### Environment Variables
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://ownsangeet.com
JWT_SECRET=your_production_secret
DATABASE_URL="file:./prod.db"
```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues or questions:
- Email: support@ownsangeet.com
- GitHub Issues: Create an issue in this repository

---

**Built with ❤️ for creating memorable custom songs**
