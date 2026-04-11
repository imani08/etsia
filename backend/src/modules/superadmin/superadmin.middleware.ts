import { Request, Response, NextFunction } from "express";

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Accès refusé (SUPER_ADMIN uniquement)" });
  }

  next();
};