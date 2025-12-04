import { Router } from 'express';
import {
    submitInquiry,
    getAllInquiries,
    getInquiry,
    updateInquiryStatus,
    deleteInquiry
} from '../controllers/inquiryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public endpoint - no auth required
router.post('/', submitInquiry);

// Admin endpoints - require authentication
router.get('/', authMiddleware, getAllInquiries);
router.get('/:id', authMiddleware, getInquiry);
router.put('/:id/status', authMiddleware, updateInquiryStatus);
router.delete('/:id', authMiddleware, deleteInquiry);

export default router;
