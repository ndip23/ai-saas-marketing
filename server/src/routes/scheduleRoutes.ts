import { Router } from 'express';
import { createSchedule, getMySchedules } from '../controllers/scheduleController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/create', protect, createSchedule);
router.get('/', protect, getMySchedules);

export default router;