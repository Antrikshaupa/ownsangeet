import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcryptjs';

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
        res.status(401).json({ message: 'API Key required' });
        return;
    }

    try {
        // Check against env variable first for backward compatibility
        if (apiKey === process.env.N8N_WEBHOOK_SECRET) {
            next();
            return;
        }

        // Find all active API keys and check against each one
        const activeKeys = await prisma.apiKey.findMany({
            where: { isActive: true }
        });

        let validKey = null;
        for (const keyRecord of activeKeys) {
            const isValid = await bcrypt.compare(apiKey, keyRecord.keyHash);
            if (isValid) {
                validKey = keyRecord;
                break;
            }
        }

        if (!validKey) {
            res.status(403).json({ message: 'Invalid API Key' });
            return;
        }

        // Update last used
        await prisma.apiKey.update({
            where: { id: validKey.id },
            data: { lastUsedAt: new Date() }
        });

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
