import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

// Create csrf middleware
export const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict'
    }
});

// Endpoint to get CSRF token
export const getCsrfToken = (req: Request, res: Response) => {
    res.json({ csrfToken: (req as any).csrfToken() });
};

export { cookieParser };
