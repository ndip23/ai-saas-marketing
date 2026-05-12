import { Router } from 'express';
import { contentOrchestrator } from '../ai/orchestrator';
import { prisma } from '../lib/prisma';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/generate', protect, async (req: any, res) => {
  try {
    const { platform, topic, mode } = req.body;

    // 1. Get the user's business context
    const business = await prisma.business.findUnique({
      where: { userId: req.user.id }
    });

    if (!business) {
      return res.status(400).json({ message: "Please complete your business profile first." });
    }

    // 2. Call the Gemini Engine
    const aiContent = await contentOrchestrator({
      business,
      platform,
      topic,
      mode: mode || 'AUTHORITY'
    });

    // 3. Save to History
    const savedPost = await prisma.generatedContent.create({
      data: {
        businessId: business.id,
        platform,
        mode: mode || 'AUTHORITY',
        topic,
        content: aiContent
      }
    });

    res.status(200).json(savedPost);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: "Gemini was unable to generate content. Check your API key." });
  }
});

export default router;