import * as driverRepo from '../repositories/driverRepository';

export const registerNewDriver = async (driverData: any) => {
  // 1. Mettre à jour le téléphone de l'utilisateur
  await driverRepo.updateUserInfo(driverData.userId, driverData.phone);
  
  // 2. Créer le profil chauffeur
  return await driverRepo.createDriverProfile(driverData);
};

export const getDriverForScan = async (driverId: string) => {
  const driver = await driverRepo.getPublicDriverProfile(driverId);
  
  if (!driver) {
    throw new Error("Chauffeur non trouvé");
  }
  
  return driver;
};

