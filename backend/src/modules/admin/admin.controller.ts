import { Request, Response } from "express";
import prisma from "../../config/prisma";

// 🔥 Dashboard réel
export const getDashboard = async (_req: Request, res: Response) => {
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
      _avg: { rating: true },
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

// 🔥 Promotion ADMIN
export const promoteToAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId requis" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });

    res.json({
      message: "Utilisateur promu ADMIN",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};