import { Request, Response } from 'express';
import { prisma } from '../index';
import { sanitizeString, sanitizeSlug, sanitizeUrl } from '../utils/sanitize';

export const createBlogPostWebhook = async (req: Request, res: Response) => {
    const { title, content, tags, featuredImageUrl, slug, excerpt } = req.body;

    if (!title || !content) {
        res.status(400).json({ message: 'Title and content are required' });
        return;
    }

    try {
        // Generate slug if not provided
        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const newPost = await prisma.blogPost.create({
            data: {
                title: sanitizeString(title),
                content: sanitizeString(content),
                slug: sanitizeSlug(finalSlug),
                excerpt: excerpt ? sanitizeString(excerpt) : sanitizeString(content.substring(0, 150) + '...'),
                featuredImageUrl: featuredImageUrl ? sanitizeUrl(featuredImageUrl) : null,
                tags: tags ? sanitizeString(tags) : '',
                authorType: 'ai',
                status: 'published', // Auto-publish for now
                publishedAt: new Date()
            }
        });

        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
