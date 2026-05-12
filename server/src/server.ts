import app from './app';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { prisma } from './lib/prisma';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 AI Marketing System Backend Running
  🏠 URL: http://localhost:${PORT}
  🛠️ Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const dueSchedules = await prisma.schedule.findMany({
    where: { status: 'PENDING', scheduledFor: { lte: now } }
  });

  for (const task of dueSchedules) {
    console.log(`[PIPELINE] Task ${task.id} is now due! Triggering notification...`);
    // Logic: Here you would send an email or WhatsApp to the user
    await prisma.schedule.update({
      where: { id: task.id },
      data: { status: 'SENT' }
    });
  }
});