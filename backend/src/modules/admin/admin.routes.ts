import { Router } from "express";
import { authenticateJWT } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { getDashboard, promoteToAdmin } from "./admin.controller";

const router = Router();

// 🔥 Dashboard réel
router.get(
  "/dashboard",
  authenticateJWT,
  authorize(["ADMIN", "SUPER_ADMIN"]),
  getDashboard
);

// 🔥 Promotion ADMIN (SUPER_ADMIN uniquement)
router.post(
  "/promote",
  authenticateJWT,
  authorize(["SUPER_ADMIN"]),
  promoteToAdmin
);

export default router;