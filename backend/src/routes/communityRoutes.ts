import { Router } from 'express';
import { createCommunity, getAllCommunities } from '../controllers/communityController';
import { authenticateJWT, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

// On suppose que authorizeAdmin vérifie le rôle
router.post('/', authenticateJWT, authorizeAdmin, createCommunity);
router.get('/', authenticateJWT, getAllCommunities);

export default router;