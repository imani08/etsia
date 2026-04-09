import { Request, Response } from "express";
import prisma from "../../config/prisma";
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
} from "./auth.service";
import { z } from "zod";

// 🔐 Schemas de validation
const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Token manquant"),
});

// 🔐 Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, password: hashed },
    });

    const tokens = generateTokens(user.id);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    });
  } catch (err: any) {
    if (err?.errors) return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: "Erreur serveur", error: err.message || err });
  }
};

// 🔑 Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const tokens = generateTokens(user.id);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    });
  } catch (err: any) {
    if (err?.errors) return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: "Erreur serveur", error: err.message || err });
  }
};

// 🔄 Refresh
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return res.status(401).json({ message: "Token invalide" });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Token invalide" });

    const tokens = generateTokens(user.id);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err: any) {
    if (err?.errors) return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: "Erreur serveur", error: err.message || err });
  }
};