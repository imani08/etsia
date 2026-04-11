import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller";
import { authenticateJWT } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// 🔒 ADMIN + SUPER_ADMIN
router.get(
  "/",
  authenticateJWT,
  authorize([ "ADMIN" ]),
  getDashboardStats
);

export default router;