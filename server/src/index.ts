import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { apiLimiter } from './middleware/rateLimiter';
import { cookieParser, csrfProtection, getCsrfToken } from './middleware/csrfMiddleware';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS - Only allow frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting - Apply to all API routes
app.use('/api/', apiLimiter);

// Cookie parser for CSRF
app.use(cookieParser());

app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CSRF token endpoint (before CSRF protection to allow token fetching)
app.get('/api/v1/csrf-token', csrfProtection, getCsrfToken);

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import contentRoutes from './routes/contentRoutes';
import blogRoutes from './routes/blogRoutes';
import webhookRoutes from './routes/webhookRoutes';
import inquiryRoutes from './routes/inquiryRoutes';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', csrfProtection, adminRoutes); // CSRF protection on admin routes
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/inquiries', inquiryRoutes); // Public submit + admin management
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1', contentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app };
