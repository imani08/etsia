import { Router } from "express";
import { register, login, refresh } from "./auth.controller";

const router = Router();

// Création d’un compte
router.post("/register", register);

// Connexion
router.post("/login", login);

// Renouvellement du token
router.post("/refresh", refresh);

export default router;