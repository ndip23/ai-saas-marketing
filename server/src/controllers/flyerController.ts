import { Request, Response } from 'express';
import { createFlyer } from '../ai/image-engine';
import { prisma } from '../lib/prisma';

export const generateFlyer = async (req: any, res: Response) => {
  const { topic, intent, emotion } = req.body;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: req.user.id }
    });

    if (!business) {
      return res.status(404).json({ message: "Business profile not found. Please complete onboarding." });
    }

    // Call the fixed Pollinations engine (the one that strips newlines)
    const imageUrl = await createFlyer({ 
      business, 
      intent, 
      topic, 
      emotion: emotion || "Professional" 
    });

    // Save to GeneratedContent table for History and Dashboard Stats
    const flyerRecord = await prisma.generatedContent.create({
      data: {
        businessId: business.id,
        platform: 'FLYER',
        mode: intent,
        topic,
        content: { intent, topic, emotion: emotion || "Professional" },
        imageUrl: imageUrl
      }
    });

    res.status(200).json(flyerRecord);
  } catch (error) {
    console.error("Flyer Gen Error:", error);
    res.status(500).json({ error: "Visual engine failed. Please try a simpler description." });
  }
};