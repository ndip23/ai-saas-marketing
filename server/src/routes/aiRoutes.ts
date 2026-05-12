import { Router } from 'express';
import { getAIDNA, updateAIDNA } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/dna', protect, getAIDNA);
router.put('/dna', protect, updateAIDNA);

export default router;