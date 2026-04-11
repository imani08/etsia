// qr.routes.ts
import { Router } from "express";
import { generateQRForDriver, scanDriverQR } from "./qr.controller";
import { authenticateJWT } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// 🔒 Seul ADMIN ou SUPER_ADMIN peut générer un QR
router.post(
  "/:driverId",
  authenticateJWT,
  authorize([ "ADMIN" ]),
  generateQRForDriver
);

router.get("/scan", scanDriverQR);

export default router;