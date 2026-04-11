import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as driverService from "../services/driverService";

const prisma = new PrismaClient();

/**
 * 🔥 INSCRIPTION CHAUFFEUR
 */
export const registerDriver = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      name,
      phone,
      licenseNumber,
      vehicleType,
      plateNumber,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId requis" });
    }

    // 1. update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
      },
    });

    // 2. create driver profile
    const newDriver = await prisma.driver.create({
      data: {
        userId: updatedUser.id,
        licenseNumber,
        vehicleType,
        plateNumber,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      message: "Demande d'inscription chauffeur envoyée",
      data: newDriver,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Doublon détecté (permis ou plaque déjà utilisée)",
      });
    }

    return res.status(500).json({
      error: "Erreur lors de l'inscription chauffeur",
    });
  }
};

/**
 * 📱 SCAN CHAUFFEUR (QR CODE)
 */
export const scanDriver = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const driverData = await driverService.getDriverForScan(id);

    return res.status(200).json(driverData);
  } catch (error: any) {
    return res.status(404).json({
      error: error.message || "Chauffeur introuvable",
    });
  }
};