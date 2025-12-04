import { Router } from 'express';
import { getBlogPosts, getBlogPostBySlug, searchBlogPosts, getTrendingPosts } from '../controllers/blogController';

const router = Router();

router.get('/', getBlogPosts);
router.get('/search', searchBlogPosts);
router.get('/trending', getTrendingPosts);
router.get('/:slug', getBlogPostBySlug);

export default router;
