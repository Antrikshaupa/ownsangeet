import { Router } from 'express';
import { createBlogPostWebhook } from '../controllers/webhookController';
import { validateApiKey } from '../middleware/apiKeyMiddleware';

const router = Router();

router.post('/blog-generation', validateApiKey, createBlogPostWebhook);

export default router;
