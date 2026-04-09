import * as driverRepo from '../repositories/driverRepository';

export const approveDriver = async (driverId: string, adminId: string) => {
  // Logique métier : on demande au repository de mettre à jour le statut
  return await driverRepo.updateDriverStatus(driverId, 'APPROVED', adminId);
};