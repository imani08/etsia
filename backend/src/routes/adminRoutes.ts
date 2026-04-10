import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

// Admin routes will be defined here
// Example protected route for admins only
router.get(
  '/dashboard',
  authenticateJWT,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    res.json({ message: 'Admin dashboard' });
  }
);

export default router;
