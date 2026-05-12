import { Router } from 'express';
import multer from 'multer';
import { processVoiceInsight } from '../ai/insight-engine';
import { protect } from '../middleware/auth';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/voice', protect, upload.single('audio'), async (req: any, res) => {
  if (!req.file) return res.status(400).send('No audio uploaded.');

  try {
    const result = await processVoiceInsight(req.file.path, req.user.id);
    // Cleanup file after processing
    // fs.unlinkSync(req.file.path); 
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Voice processing failed" });
  }
});

export default router;