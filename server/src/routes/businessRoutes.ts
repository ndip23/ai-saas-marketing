import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getDashboardSummary, uploadLogo, createBusiness} from '../controllers/businessController';
const router = Router();

router.get('/dashboard-summary', protect, getDashboardSummary);
router.post('/upload-logo', protect, uploadLogo);
router.post('/create', protect, createBusiness);


export default router;