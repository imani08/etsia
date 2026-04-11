import { Request, Response } from "express";
import {
  getDashboardStats,
  promoteUserToAdmin,
  getAllUsers,
  deleteUser,
} from "./superadmin.service";

// 🔒 SAFE PARAM HELPER
const getParamString = (value: string | string[] | undefined): string | null => {
  if (!value || Array.isArray(value)) return null;
  return value;
};

// 📊 DASHBOARD
export const dashboard = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch {
    res.status(500).json({ message: "Erreur dashboard" });
  }
};

// 👑 PROMOTION ADMIN
export const promoteAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "userId requis" });
    }

    const updated = await promoteUserToAdmin(userId);

    res.json({
      message: "Utilisateur promu ADMIN",
      user: updated,
    });
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 👥 USERS LIST
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🗑 DELETE USER
export const removeUser = async (req: Request, res: Response) => {
  try {
    const userId = getParamString(req.params.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId invalide" });
    }

    await deleteUser(userId);

    res.json({ message: "Utilisateur supprimé" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};