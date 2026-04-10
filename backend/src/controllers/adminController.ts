import { Request, Response } from 'express';
import * as adminService from '../services/adminServices';

export const validateDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.body;
    const adminId = (req as any).user.id; 

    const result = await adminService.approveDriver(driverId, adminId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur de validation" });
  }
};