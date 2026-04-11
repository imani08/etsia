import prisma from "../../config/prisma";

// 📊 DASHBOARD GLOBAL
export const getDashboardStats = async () => {
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

  return {
    totalUsers,
    totalDrivers,
    approvedDrivers,
    pendingDrivers,
    totalReports,
    averageRating: avgRating._avg.rating || 0,
  };
};

// 👑 PROMOTE USER TO ADMIN
export const promoteUserToAdmin = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });

  return updated;
};

// 👥 LIST USERS
export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

// 🗑 DELETE USER (option admin power)
export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};