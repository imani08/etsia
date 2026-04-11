// upload.routes.ts
import { Router } from "express";
import { upload } from "./upload.middleware";
import { uploadFile } from "./upload.controller";

const router = Router();

router.post("/", upload.single("file"), uploadFile);

export default router;