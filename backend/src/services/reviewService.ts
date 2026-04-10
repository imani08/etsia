import * as reviewRepo from '../repositories/reviewRepository';

export const addReview = async (userId: string, driverId: string, rating: number, comment?: string) => {
  // Validation : la note doit être entre 1 et 5
  if (rating < 1 || rating > 5) {
    throw new Error("La note doit être un nombre entier entre 1 et 5.");
  }

  return await reviewRepo.createReview(userId, driverId, rating, comment);
};