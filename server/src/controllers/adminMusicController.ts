import { Request, Response } from 'express';
import { prisma } from '../index';
import { sanitizeString, sanitizeUrl } from '../utils/sanitize';

// Get all tracks (admin view)
export const getAllTracks = async (req: Request, res: Response) => {
    try {
        const tracks = await prisma.musicTrack.findMany({
            orderBy: { orderPosition: 'asc' }
        });
        res.json(tracks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single track by ID
export const getTrack = async (req: Request, res: Response) => {
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

// Create new track
export const createTrack = async (req: Request, res: Response) => {
    try {
        const { title, artist, audioUrl, coverImageUrl, duration, orderPosition, isActive } = req.body;

        if (!title || !audioUrl || !coverImageUrl) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const track = await prisma.musicTrack.create({
            data: {
                title: sanitizeString(title),
                artist: artist ? sanitizeString(artist) : null,
                audioUrl: sanitizeUrl(audioUrl),
                coverImageUrl: sanitizeUrl(coverImageUrl),
                duration,
                orderPosition: orderPosition || 0,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        res.status(201).json(track);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update track
export const updateTrack = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, artist, audioUrl, coverImageUrl, duration, orderPosition, isActive } = req.body;

        const track = await prisma.musicTrack.update({
            where: { id },
            data: {
                ...(title && { title: sanitizeString(title) }),
                ...(artist !== undefined && { artist: artist ? sanitizeString(artist) : artist }),
                ...(audioUrl && { audioUrl: sanitizeUrl(audioUrl) }),
                ...(coverImageUrl && { coverImageUrl: sanitizeUrl(coverImageUrl) }),
                ...(duration !== undefined && { duration }),
                ...(orderPosition !== undefined && { orderPosition }),
                ...(isActive !== undefined && { isActive })
            }
        });

        res.json(track);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Track not found' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete track
export const deleteTrack = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.musicTrack.delete({
            where: { id }
        });

        res.json({ message: 'Track deleted successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Track not found' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Reorder tracks
export const reorderTracks = async (req: Request, res: Response) => {
    try {
        const { tracks } = req.body; // Array of { id, orderPosition }

        if (!Array.isArray(tracks)) {
            res.status(400).json({ message: 'Invalid request format' });
            return;
        }

        // Update each track's position
        await Promise.all(
            tracks.map((track: { id: string; orderPosition: number }) =>
                prisma.musicTrack.update({
                    where: { id: track.id },
                    data: { orderPosition: track.orderPosition }
                })
            )
        );

        res.json({ message: 'Tracks reordered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
