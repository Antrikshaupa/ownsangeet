import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
    getAllPages,
    createPage,
    updatePage,
    deletePage
} from '../controllers/adminPageController';
import {
    getAllTracks,
    getTrack,
    createTrack,
    updateTrack,
    deleteTrack,
    reorderTracks
} from '../controllers/adminMusicController';
import {
    getAllBlogs,
    getBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
} from '../controllers/adminBlogController';
import {
    getStats,
    getRecentActivity
} from '../controllers/dashboardController';

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// Dashboard routes
router.get('/dashboard/stats', getStats);
router.get('/dashboard/activity', getRecentActivity);

// Page routes
router.get('/pages', getAllPages);
router.post('/pages', createPage);
router.put('/pages/:id', updatePage);
router.delete('/pages/:id', deletePage);

// Music routes
router.get('/music', getAllTracks);
router.get('/music/:id', getTrack);
router.post('/music', createTrack);
router.put('/music/:id', updateTrack);
router.delete('/music/:id', deleteTrack);
router.post('/music/reorder', reorderTracks);

// Blog routes
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogPost);
router.post('/blogs', createBlogPost);
router.put('/blogs/:id', updateBlogPost);
router.delete('/blogs/:id', deleteBlogPost);

// API Key routes
import {
    generateApiKey,
    listApiKeys,
    revokeApiKey,
    getKeyActivity
} from '../controllers/apiKeyController';

router.get('/api-keys', listApiKeys);
router.post('/api-keys', generateApiKey);
router.delete('/api-keys/:id', revokeApiKey);
router.get('/api-keys/:id/activity', getKeyActivity);

export default router;

