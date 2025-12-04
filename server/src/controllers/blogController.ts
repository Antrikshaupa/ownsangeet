import { Request, Response } from 'express';
import { prisma } from '../index';

export const getBlogPosts = async (req: Request, res: Response) => {
    try {
        const { search, tag, limit, offset } = req.query;

        const where: any = { status: 'published' };

        // Add search filter
        if (search && typeof search === 'string') {
            where.OR = [
                { title: { contains: search } },
                { excerpt: { contains: search } },
                { content: { contains: search } }
            ];
        }

        // Add tag filter
        if (tag && typeof tag === 'string') {
            where.tags = { contains: tag };
        }

        const posts = await prisma.blogPost.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            take: limit ? parseInt(limit as string) : undefined,
            skip: offset ? parseInt(offset as string) : undefined,
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                featuredImageUrl: true,
                publishedAt: true,
                authorType: true,
                tags: true,
                viewCount: true
            }
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const searchBlogPosts = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query required' });
        }

        const posts = await prisma.blogPost.findMany({
            where: {
                status: 'published',
                OR: [
                    { title: { contains: q } },
                    { excerpt: { contains: q } },
                    { content: { contains: q } },
                    { tags: { contains: q } }
                ]
            },
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                featuredImageUrl: true,
                publishedAt: true,
                authorType: true,
                tags: true,
                viewCount: true
            }
        });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTrendingPosts = async (req: Request, res: Response) => {
    try {
        const { limit = '5' } = req.query;

        const posts = await prisma.blogPost.findMany({
            where: { status: 'published' },
            orderBy: { viewCount: 'desc' },
            take: parseInt(limit as string),
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                featuredImageUrl: true,
                publishedAt: true,
                authorType: true,
                tags: true,
                viewCount: true
            }
        });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getBlogPostBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        // Increment view count
        await prisma.blogPost.update({
            where: { id: post.id },
            data: { viewCount: { increment: 1 } }
        });

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
