import { Router } from 'express';
import { submitReview } from '../controllers/reviewController';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();


router.post('/submit', authenticateJWT, submitReview);

export default router;