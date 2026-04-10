import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Une erreur interne est survenue";

  // Ici, on uniformise la réponse JSON pour ton application mobile
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};