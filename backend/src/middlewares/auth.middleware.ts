import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// --- TON CODE ACTUEL (ne change pas, il est bon) ---
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) return res.sendStatus(403);
      (req as any).user = user; 
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// --- LA MODIFICATION À AJOUTER POUR L'INTERFACE ADMIN ---
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  // IMPORTANT : On vérifie le rôle stocké dans le JWT
  if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
    next(); // L'admin est autorisé, on passe à la suite
  } else {
    // Pour le mobile, on renvoie un JSON clair pour que l'app affiche une alerte
    res.status(403).json({ 
      error: "Forbidden", 
      message: "Seul un administrateur peut valider un chauffeur." 
    });
  }
};