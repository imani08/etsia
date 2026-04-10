import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as driverService from '../services/driverService';
const prisma = new PrismaClient();
const id = req.params.id as string;
export const registerDriver = async (req: Request, res: Response) => {
  try {
    const { userId, name, email, phone, licenseNumber, vehicleType, plateNumber } = req.body;

    // 1. Création/Mise à jour de l'utilisateur avec son téléphone
    // On part du principe que l'utilisateur peut déjà exister
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        phone: phone,
        name: name 
      }
    });

    // 2. Création du profil Chauffeur
    const newDriver = await prisma.driver.create({
      data: {
        userId: updatedUser.id,
        licenseNumber: licenseNumber,
        vehicleType: vehicleType,
        plateNumber: plateNumber,
        status: 'PENDING' // Défini par ton énumération DriverStatus
      }
    });

    return res.status(201).json({
      message: "Demande d'inscription chauffeur reçue",
      data: newDriver
    });

  } catch (error: any) {
    // Gestion des erreurs d'unicité (P2002) pour la plaque ou le permis
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Le numéro de permis ou la plaque existe déjà." });
    }
    return res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
};

export const scanDriver = async (req: Request, res: Response) => {
  try {
    // On force le type en string pour lever l'ambiguïté
    const id = req.params.id as string; 

    if (!id) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const driverData = await driverService.getDriverForScan(id);
    return res.status(200).json(driverData);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};