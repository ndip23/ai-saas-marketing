import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAIDNA = async (req: any, res: Response) => {
  try {
    const business = await prisma.business.findUnique({ where: { userId: req.user.id } });
    if (!business) return res.status(404).json({ message: "Business not found" });

    const dna = await prisma.aIMemory.findUnique({
      where: { businessId: business.id }
    });

    // Return DNA or default values if not set yet
    res.status(200).json(dna || {
      preferredTone: "Professional",
      humorScore: 0.5,
      emojiDensity: 0.3,
      bannedWords: []
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch AI DNA" });
  }
};

export const updateAIDNA = async (req: any, res: Response) => {
  const { preferredTone, humorScore, emojiDensity } = req.body;
  try {
    const business = await prisma.business.findUnique({ where: { userId: req.user.id } });
    
    const updatedDNA = await prisma.aIMemory.upsert({
      where: { businessId: business!.id },
      update: { preferredTone, humorScore, emojiDensity },
      create: {
        businessId: business!.id,
        preferredTone,
        humorScore,
        emojiDensity,
      }
    });

    res.status(200).json(updatedDNA);
  } catch (error) {
    res.status(500).json({ message: "Failed to update AI DNA" });
  }
};