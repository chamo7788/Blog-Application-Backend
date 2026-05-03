import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categories.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticateToken, createCategory);

export default router;
