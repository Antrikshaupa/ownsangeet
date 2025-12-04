import { Request, Response } from 'express';
import { prisma } from '../index';
import { sanitizeString, sanitizeSlug, sanitizeJsonContent } from '../utils/sanitize';

// Get all pages (admin view)
export const getAllPages = async (req: Request, res: Response) => {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json(pages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new page
export const createPage = async (req: Request, res: Response) => {
    try {
        const { slug, title, content, metaTitle, metaDescription, isPublished } = req.body;

        if (!slug || !title || !content) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const page = await prisma.page.create({
            data: {
                slug: sanitizeSlug(slug),
                title: sanitizeString(title),
                content: sanitizeJsonContent(typeof content === 'string' ? content : JSON.stringify(content)),
                metaTitle: metaTitle ? sanitizeString(metaTitle) : null,
                metaDescription: metaDescription ? sanitizeString(metaDescription) : null,
                isPublished: isPublished || false
            }
        });

        res.status(201).json(page);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'Page with this slug already exists' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Update existing page
export const updatePage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { slug, title, content, metaTitle, metaDescription, isPublished } = req.body;

        const page = await prisma.page.update({
            where: { id },
            data: {
                ...(slug && { slug: sanitizeSlug(slug) }),
                ...(title && { title: sanitizeString(title) }),
                ...(content && { content: sanitizeJsonContent(typeof content === 'string' ? content : JSON.stringify(content)) }),
                ...(metaTitle !== undefined && { metaTitle: metaTitle ? sanitizeString(metaTitle) : metaTitle }),
                ...(metaDescription !== undefined && { metaDescription: metaDescription ? sanitizeString(metaDescription) : metaDescription }),
                ...(isPublished !== undefined && { isPublished })
            }
        });

        res.json(page);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'Page with this slug already exists' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete page
export const deletePage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.page.delete({
            where: { id }
        });

        res.json({ message: 'Page deleted successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};
