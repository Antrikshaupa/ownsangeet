import { Request, Response } from 'express';
import { prisma } from '../index';
import { sanitizeString, sanitizeEmail } from '../utils/sanitize';
import { sendInquiryNotification } from '../utils/emailService';

// Submit inquiry (public endpoint - no auth required)
export const submitInquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, eventType, serviceRequired, language, style, message } = req.body;

        // Validation
        if (!name || !email || !phone || !message) {
            res.status(400).json({ message: 'Name, email, phone, and message are required' });
            return;
        }

        // Create inquiry
        const inquiry = await prisma.inquiry.create({
            data: {
                name: sanitizeString(name),
                email: sanitizeEmail(email),
                phone: sanitizeString(phone),
                eventType: eventType ? sanitizeString(eventType) : null,
                serviceRequired: serviceRequired ? sanitizeString(serviceRequired) : null,
                language: language ? sanitizeString(language) : null,
                style: style ? sanitizeString(style) : null,
                message: sanitizeString(message),
                status: 'new'
            }
        });

        // Send email notifications (don't wait for it, send async)
        sendInquiryNotification({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            eventType: inquiry.eventType || undefined,
            serviceRequired: inquiry.serviceRequired || undefined,
            language: inquiry.language || undefined,
            style: inquiry.style || undefined,
            message: inquiry.message
        }).catch(err => console.error('Email notification error:', err));

        res.status(201).json({
            message: 'Inquiry submitted successfully! We will contact you soon.',
            id: inquiry.id
        });
    } catch (error) {
        console.error('Submit inquiry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all inquiries (admin only)
export const getAllInquiries = async (req: Request, res: Response) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;

        const where: any = {};

        if (status && status !== 'all') {
            where.status = status;
        }

        if (search && typeof search === 'string') {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [inquiries, total] = await Promise.all([
            prisma.inquiry.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.inquiry.count({ where })
        ]);

        res.json({
            data: inquiries,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Get inquiries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single inquiry (admin only)
export const getInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const inquiry = await prisma.inquiry.findUnique({
            where: { id }
        });

        if (!inquiry) {
            res.status(404).json({ message: 'Inquiry not found' });
            return;
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Get inquiry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update inquiry status (admin only)
export const updateInquiryStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'contacted', 'resolved'].includes(status)) {
            res.status(400).json({ message: 'Invalid status. Must be: new, contacted, or resolved' });
            return;
        }

        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: { status }
        });

        res.json(inquiry);
    } catch (error: any) {
        console.error('Update inquiry error:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Inquiry not found' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete inquiry (admin only)
export const deleteInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.inquiry.delete({
            where: { id }
        });

        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error: any) {
        console.error('Delete inquiry error:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Inquiry not found' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};
