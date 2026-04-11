import { z } from "zod";

export const createReportSchema = z.object({
  driverId: z.string().uuid("Driver ID invalide"),
  reason: z
    .string()
    .min(5, "La raison doit contenir au moins 5 caractères")
    .max(255, "La raison est trop longue"),
});