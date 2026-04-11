import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();

    const totalDrivers = await prisma.driver.count();

    const approvedDrivers = await prisma.driver.count({
      where: { status: "APPROVED" },
    });

    const pendingDrivers = await prisma.driver.count({
      where: { status: "PENDING" },
    });

    const totalReports = await prisma.report.count();

    const avgRating = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    res.json({
      totalUsers,
      totalDrivers,
      approvedDrivers,
      pendingDrivers,
      totalReports,
      averageRating: avgRating._avg.rating || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};