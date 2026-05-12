import { Router } from 'express';
import { createFlyer } from '../ai/image-engine';
import { prisma } from '../lib/prisma';
import { protect } from '../middleware/auth';
import { generate } from '../controllers/flyerController';

const router = Router();

router.post('/generate', protect, generate);
export default router;