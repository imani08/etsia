import { Router } from 'express';
import { scanDriver } from '../controllers/driverController';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

// Endpoint pour approuver un chauffeur
// Seuls ADMIN et SUPER_ADMIN y ont accès
router.patch(
  '/drivers/:id/approve',
  authenticateJWT,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    
  }
);
router.get('/scan/:id', authenticateJWT, scanDriver);