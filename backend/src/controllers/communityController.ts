import { Request, Response } from 'express';
import * as communityRepo from '../repositories/communityRepository';

export const createCommunity = async (req: Request, res: Response) => {
    try {
        const { name, city } = req.body;
        if (!name || !city) {
            return res.status(400).json({ error: "Le nom et la ville sont requis." });
        }
        const community = await communityRepo.create(name, city);
        return res.status(201).json(community);
    } catch (error: any) {
        return res.status(500).json({ error: "Erreur lors de la création" });
    }
};


export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const list = await communityRepo.findAll();
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};