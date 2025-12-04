import { Request, Response } from 'express';
import { prisma } from '../index';
import { sanitizeString, sanitizeSlug, sanitizeUrl, sanitizeJsonContent } from '../utils/sanitize';

// Get all blogs (admin view with filters)
export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const { status, authorType, tags, page = 1, limit = 20 } = req.query;

        const where: any = {};

        if (status) where.status = status;
        if (authorType) where.authorType = authorType;
        if (tags) {
            where.tags = {
                contains: tags as string
            };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [blogs, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.blogPost.count({ where })
        ]);

        res.json({
            data: blogs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single blog post by ID (for editing)
export const getBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const blog = await prisma.blogPost.findUnique({
            where: { id }
        });

        if (!blog) {
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create blog post
export const createBlogPost = async (req: Request, res: Response) => {
    try {
        const { slug, title, excerpt, content, featuredImageUrl, authorType, status, publishedAt, tags } = req.body;

        if (!slug || !title || !content) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const blog = await prisma.blogPost.create({
            data: {
                slug: sanitizeSlug(slug),
                title: sanitizeString(title),
                excerpt: excerpt ? sanitizeString(excerpt) : null,
                content: sanitizeJsonContent(content),
                featuredImageUrl: featuredImageUrl ? sanitizeUrl(featuredImageUrl) : null,
                authorType: authorType || 'human',
                status: status || 'draft',
                publishedAt: status === 'published' && !publishedAt ? new Date() : publishedAt,
                tags: tags ? sanitizeString(tags) : ''
            }
        });

        res.status(201).json(blog);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'Blog post with this slug already exists' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Update blog post
export const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { slug, title, excerpt, content, featuredImageUrl, authorType, status, publishedAt, tags } = req.body;

        const updateData: any = {};

        if (slug) updateData.slug = sanitizeSlug(slug);
        if (title) updateData.title = sanitizeString(title);
        if (excerpt !== undefined) updateData.excerpt = excerpt ? sanitizeString(excerpt) : excerpt;
        if (content) updateData.content = sanitizeJsonContent(content);
        if (featuredImageUrl !== undefined) updateData.featuredImageUrl = featuredImageUrl ? sanitizeUrl(featuredImageUrl) : featuredImageUrl;
        if (authorType) updateData.authorType = authorType;
        if (status) {
            updateData.status = status;
            // Auto-set publishedAt when publishing
            if (status === 'published' && !publishedAt) {
                updateData.publishedAt = new Date();
            }
        }
        if (publishedAt !== undefined) updateData.publishedAt = publishedAt;
        if (tags !== undefined) updateData.tags = tags ? sanitizeString(tags) : tags;

        const blog = await prisma.blogPost.update({
            where: { id },
            data: updateData
        });

        res.json(blog);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'Blog post with this slug already exists' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete blog post
export const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.blogPost.delete({
            where: { id }
        });

        res.json({ message: 'Blog post deleted successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};
