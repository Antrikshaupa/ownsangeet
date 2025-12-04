import { Request, Response } from 'express';
import { prisma } from '../index';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Generate new API key
export const generateApiKey = async (req: Request, res: Response) => {
    try {
        const { name, permissions } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Name is required' });
            return;
        }

        // Generate random API key
        const apiKey = crypto.randomBytes(32).toString('hex');
        const keyHash = await bcrypt.hash(apiKey, 10);

        const newKey = await prisma.apiKey.create({
            data: {
                name,
                keyHash,
                permissions: permissions || '',
                isActive: true
            }
        });

        // Return the plain key only once
        res.status(201).json({
            id: newKey.id,
            name: newKey.name,
            key: apiKey, // Only shown this one time
            createdAt: newKey.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// List all API keys
export const listApiKeys = async (req: Request, res: Response) => {
    try {
        const keys = await prisma.apiKey.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                permissions: true,
                isActive: true,
                lastUsedAt: true,
                createdAt: true
                // keyHash is intentionally excluded for security
            }
        });

        res.json(keys);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Revoke API key
export const revokeApiKey = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.apiKey.update({
            where: { id },
            data: { isActive: false }
        });

        res.json({ message: 'API key revoked successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'API key not found' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get activity log for a specific key
export const getKeyActivity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const key = await prisma.apiKey.findUnique({
            where: { id },
            select: {
                name: true,
                lastUsedAt: true,
                createdAt: true
            }
        });

        if (!key) {
            res.status(404).json({ message: 'API key not found' });
            return;
        }

        // In a full implementation, you'd query an activity log table here
        res.json({
            ...key,
            activity: [] // Placeholder for future activity tracking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
