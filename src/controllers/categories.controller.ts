import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  try {
    const { name } = req.body;
    const cat = await prisma.category.create({ data: { name } });
    res.status(201).json(cat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
