import cron from 'node-cron';
import { prisma } from '../lib/prisma';

export const initScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    const now = new Date();

    const pendingSchedules = await prisma.schedule.findMany({
      where: {
        status: 'PENDING',
        scheduledFor: { lte: now }
      },
      include: { content: true }
    });

    for (const task of pendingSchedules) {
      try {
        console.log(`[Scheduler] Triggering content for: ${task.platform}`);
        
        // Logic: Here you would integrate with Meta API or send a Push Notification
        // For now, we mark as SENT.
        
        await prisma.schedule.update({
          where: { id: task.id },
          data: { status: 'SENT' }
        });
      } catch (error) {
        console.error(`[Scheduler Error] Task ${task.id}:`, error);
      }
    }
  });
};