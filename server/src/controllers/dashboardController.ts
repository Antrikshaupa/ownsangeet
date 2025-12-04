import { Request, Response } from 'express';
import { prisma } from '../index';

// Get dashboard statistics
export const getStats = async (req: Request, res: Response) => {
    try {
        const [pagesCount, tracksCount, blogsCount, totalViews] = await Promise.all([
            prisma.page.count(),
            prisma.musicTrack.count(),
            prisma.blogPost.count(),
            prisma.blogPost.aggregate({
                _sum: {
                    viewCount: true
                }
            })
        ]);

        const totalPlayCount = await prisma.musicTrack.aggregate({
            _sum: {
                playCount: true
            }
        });

        res.json({
            pages: pagesCount,
            musicTracks: tracksCount,
            blogs: blogsCount,
            totalBlogViews: totalViews._sum.viewCount || 0,
            totalMusicPlays: totalPlayCount._sum.playCount || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recent activity (simplified - just recent updates)
export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;

        // Get recent blog posts
        const recentBlogs = await prisma.blogPost.findMany({
            orderBy: { updatedAt: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                updatedAt: true,
                status: true
            }
        });

        // Get recent music tracks
        const recentTracks = await prisma.musicTrack.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                createdAt: true
            }
        });

        // Combine and format
        const activity = [
            ...recentBlogs.map(blog => ({
                type: 'blog',
                id: blog.id,
                title: blog.title,
                timestamp: blog.updatedAt,
                status: blog.status
            })),
            ...recentTracks.map(track => ({
                type: 'music',
                id: track.id,
                title: track.title,
                timestamp: track.createdAt
            }))
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);

        res.json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
