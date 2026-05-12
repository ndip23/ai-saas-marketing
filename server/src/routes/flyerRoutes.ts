import { Router } from 'express';
import { createFlyer } from '../ai/image-engine';
import { prisma } from '../lib/prisma';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/generate', protect, async (req: any, res) => {
  try {
    const { topic, intent } = req.body;

    const business = await prisma.business.findUnique({
      where: { userId: req.user.id }
    });

    if (!business) return res.status(400).json({ message: "Business profile required" });

    // Call our free Pollinations engine
    const imageUrl = await createFlyer({ business, intent, topic });

    // Save to history
    const savedFlyer = await prisma.generatedContent.create({
      data: {
        businessId: business.id,
        platform: 'FLYER',
        mode: intent,
        topic,
        content: { intent, topic },
        imageUrl: imageUrl
      }
    });

    res.status(200).json(savedFlyer);
  } catch (error) {
    res.status(500).json({ message: "Visual engine failed." });
  }
});

export default router;