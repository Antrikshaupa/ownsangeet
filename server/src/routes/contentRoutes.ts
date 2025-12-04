import { Router } from 'express';
import { getPage, getMusicTracks, getMusicTrackById, incrementPlayCount } from '../controllers/contentController';

const router = Router();

router.get('/pages/:slug', getPage);
router.get('/music', getMusicTracks);
router.get('/music/:id', getMusicTrackById);
router.post('/music/:id/play', incrementPlayCount);

export default router;
