import { Request, Response } from "express";
import { createReportService } from "./report.service";
import { createReportSchema } from "./report.validation";

export const createReport = async (req: Request, res: Response) => {
  try {
    // Validation
    const { driverId, reason } = createReportSchema.parse(req.body);

    // ⚠️ injecté par authMiddleware
    if (!req.user) {
  return res.status(401).json({ message: "Non authentifié" });
}
    const userId = req.user.id;

    const report = await createReportService(userId, driverId, reason);

    res.status(201).json({
      message: "Signalement envoyé",
      data: report,
    });
  } catch (err: any) {
    // Zod error
    if (err?.errors) {
      return res.status(400).json({ errors: err.errors });
    }

    // Erreur métier
    if (err.message === "DRIVER_NOT_FOUND") {
      return res.status(404).json({
        message: "Chauffeur introuvable",
      });
    }

    // fallback
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};