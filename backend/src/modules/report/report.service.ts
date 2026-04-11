import prisma from "../../config/prisma";

export const createReportService = async (
  userId: string,
  driverId: string,
  reason: string
) => {
  // Vérifier si le chauffeur existe
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
  });

  if (!driver) {
    throw new Error("DRIVER_NOT_FOUND");
  }

  // Créer le signalement
  return await prisma.report.create({
    data: {
      userId,
      driverId,
      reason,
    },
  });
};