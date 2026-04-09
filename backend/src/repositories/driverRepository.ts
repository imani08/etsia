import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createDriverProfile = async (data: any) => {
  return await prisma.driver.create({
    data: {
      userId: data.userId,
      licenseNumber: data.licenseNumber,
      vehicleType: data.vehicleType,
      plateNumber: data.plateNumber,
      status: 'PENDING'
    }
  });
};

export const updateUserInfo = async (userId: string, phone: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { phone }
  });
};