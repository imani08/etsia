import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async (name: string, city: string) => {
  return await prisma.community.create({
    data: { 
      name: name,
      city: city 
    }
  });
};
export const findAll = async () => await prisma.community.findMany();
export const remove = async (id: string) => await prisma.community.delete({ where: { id } });