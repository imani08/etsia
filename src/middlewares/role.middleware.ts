// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Vérification de l'existence de l'utilisateur injecté par l'Auth Middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Interdit : Accès réservé aux rôles : " + roles.join(', ') 
      });
    }
    next();
  };
};