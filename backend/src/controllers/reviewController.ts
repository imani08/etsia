import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';

export const submitReview = async (req: Request, res: Response) => {
  try {
    const { driverId, rating, comment } = req.body;
    const userId = (req as any).user.id; // Injecté par ton middleware authenticateJWT

    const review = await reviewService.addReview(userId, driverId, rating, comment);

    return res.status(201).json({
      message: "Merci pour votre avis !",
      review
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};