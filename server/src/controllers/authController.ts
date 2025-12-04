import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { sanitizeEmail } from '../utils/sanitize';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const sanitizedEmail = sanitizeEmail(email);
        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
        if (!user || !user.isActive) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id, user.role);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
