// upload.controller.ts
import { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier envoyé" });
  }

  res.json({
    message: "Upload réussi",
    filePath: req.file.path,
  });
};