import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createSchedule = async (req: any, res: Response) => {
  const { contentId, scheduledFor } = req.body;
  try {
    const business = await prisma.business.findUnique({ where: { userId: req.user.id } });
    if (!business) return res.status(404).json({ message: "Business not found" });

    const schedule = await prisma.schedule.create({
      data: {
        businessId: business.id,
        contentId,
        scheduledFor: new Date(scheduledFor),
        platform: "SOCIAL_MEDIA", // Default
        status: "PENDING"
      }
    });
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Scheduling failed" });
  }
};

export const getMySchedules = async (req: any, res: Response) => {
  try {
    const business = await prisma.business.findUnique({ where: { userId: req.user.id } });
    const schedules = await prisma.schedule.findMany({
      where: { businessId: business?.id },
      include: { content: true },
      orderBy: { scheduledFor: 'asc' }
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pipeline" });
  }
};