import { Router } from 'express';
import { getTrends } from '../controllers/trendController'; // Keeping it in business controller for simplicity
import { protect } from '../middleware/auth';

const router = Router();

// This maps to GET /api/v1/trends
router.get('/', protect, getTrends);

export default router;