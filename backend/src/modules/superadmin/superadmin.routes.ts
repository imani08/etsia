import { Router } from "express";
import {
  dashboard,
  promoteAdmin,
  listUsers,
  removeUser,
} from "./superadmin.controller";

import { isSuperAdmin } from "./superadmin.middleware";

const router = Router();

router.use(isSuperAdmin);

router.get("/dashboard", dashboard);
router.post("/promote", promoteAdmin);
router.get("/users", listUsers);
router.delete("/users/:userId", removeUser);

export default router;