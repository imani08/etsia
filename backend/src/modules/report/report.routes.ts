import { Router } from "express";
import { createReport } from "./report.controller";
import { authenticateJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateJWT, createReport);

export default router;