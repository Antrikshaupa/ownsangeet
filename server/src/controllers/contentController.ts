import { Request, Response } from 'express';
import { prisma } from '../index';

export const getPage = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const page = await prisma.page.findUnique({
            where: { slug }
        });
        if (!page) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        // Parse content if it's a string (SQLite workaround)
        const content = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
        res.json({ ...page, content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMusicTracks = async (req: Request, res: Response) => {
    try {
        const tracks = await prisma.musicTrack.findMany({
            where: { isActive: true },
            orderBy: { orderPosition: 'asc' }
        });
        res.json(tracks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMusicTrackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const track = await prisma.musicTrack.findUnique({
            where: { id }
        });

        if (!track) {
            res.status(404).json({ message: 'Track not found' });
            return;
        }

        res.json(track);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const incrementPlayCount = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.musicTrack.update({
            where: { id },
            data: { playCount: { increment: 1 } }
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};