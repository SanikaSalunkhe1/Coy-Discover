import { Router } from 'express';
import { handleSwipe } from '../controllers/swipe.controller.js';
import { validateSwipeRequest } from '../middleware/validateRequest.js';

const router = Router();

router.post('/', validateSwipeRequest, handleSwipe);

export default router;

