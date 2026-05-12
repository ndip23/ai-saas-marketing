import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import cloudinary from '../config/cloudinary';

export const createBusiness = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, description, industry, location, services, brandColors } = req.body;
    
    // Use upsert so it works regardless of whether the logo was uploaded first
    const business = await prisma.business.upsert({
      where: { userId: req.user.id },
      update: {
        name,
        description,
        industry,
        location,
        services,
        brandColors,
      },
      create: {
        userId: req.user.id,
        name,
        description,
        industry,
        location,
        services,
        brandColors,
      },
    });

    res.status(201).json({ status: 'success', data: business });
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req: any, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "No image provided" });

    // 1. Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: 'business_logos',
      eager: [
        { width: 200, height: 200, crop: "fit", format: "png" },
        { width: 800, height: 800, crop: "limit", gravity: "center" },
      ],
    });

    // 2. Use UPSERT instead of UPDATE
    // This creates the record if it's missing, or updates it if it exists.
    const business = await prisma.business.upsert({
      where: { userId: req.user.id },
      update: { logoUrl: uploadRes.secure_url },
      create: {
        userId: req.user.id,
        name: "My Business", // Temporary placeholder until Finalize
        logoUrl: uploadRes.secure_url,
      },
    });

    res.status(200).json({ 
      status: 'success', 
      logoUrl: uploadRes.secure_url 
    });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

export const getDashboardSummary = async (req: any, res: Response) => {
  try {
    const business = await prisma.business.findUnique({ 
      where: { userId: req.user.id } 
    });
    
    if (!business) return res.status(200).json({ stats: { contentCount: 0, flyerCount: 0 }, recent: [] });

    const contentCount = await prisma.generatedContent.count({ 
      where: { businessId: business.id, NOT: { platform: 'FLYER' } } 
    });
    
    const flyerCount = await prisma.generatedContent.count({ 
      where: { businessId: business.id, platform: 'FLYER' } 
    });

    const recent = await prisma.generatedContent.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      business, // This sends the name, industry, and logoUrl
      stats: { contentCount, flyerCount },
      recent
    });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};