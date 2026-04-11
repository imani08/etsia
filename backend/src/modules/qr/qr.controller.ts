import { Request, Response } from "express";
import prisma from "../../config/prisma";
import jwt from "jsonwebtoken";
import { generateDriverQR } from "./qr.service";

/**
 * 🧠 helper safe param
 */
const getParam = (v: string | string[] | undefined): string | null =>
  Array.isArray(v) ? null : v ?? null;

//
// ==============================
// 🔥 GENERATE QR (ADMIN ONLY)
// ==============================
//
export const generateQRForDriver = async (req: Request, res: Response) => {
  try {
    const driverId = getParam(req.params.driverId);

    if (!driverId) {
      return res.status(400).json({ message: "driverId invalide" });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return res.status(404).json({ message: "Chauffeur introuvable" });
    }

    if (driver.status !== "APPROVED") {
      return res.status(403).json({
        message: "Chauffeur non validé",
      });
    }

    const { qrCode, token } = await generateDriverQR(driverId);

    await prisma.driver.update({
      where: { id: driverId },
      data: { qrCode },
    });

    return res.json({
      message: "QR généré",
      qrCode,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

//
// ==============================
// 📲 SCAN QR (PUBLIC - CLIENT)
// ==============================
//
export const scanDriverQR = async (req: Request, res: Response) => {
  try {
    // 📌 token venant du QR code
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({
        message: "QR invalide (token manquant)",
      });
    }

    // 🔐 vérification JWT (anti-fake QR)
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const driver = await prisma.driver.findUnique({
      where: { id: decoded.driverId },
      include: {
        user: true,
      },
    });

    if (!driver) {
      return res.status(404).json({
        message: "Chauffeur introuvable",
      });
    }

    if (driver.status !== "APPROVED") {
      return res.status(403).json({
        message: "Chauffeur non validé",
      });
    }

    // 📦 réponse publique SAFE (ce que le client voit)
    return res.json({
      verified: true,
      name: driver.user.name,
      vehicleType: driver.vehicleInfo,
      plateNumber: driver.licenseNumber,
      status: driver.status,
    });
  } catch (err) {
    return res.status(401).json({
      message: "QR invalide ou expiré",
    });
  }
};