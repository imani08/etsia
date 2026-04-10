import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createReview = async (userId: string, driverId: string, rating: number, comment?: string) => {
  return await prisma.review.create({
    data: {
      userId,
      driverId,
      rating,
      comment
    }
  });
};