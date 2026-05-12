import { OpenAI } from 'openai';
import { prisma } from '../lib/prisma';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const updateAIMemory = async (businessId: string, userEdits: string) => {
  // Use GPT to analyze the style of the user's edits
  const analysis = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Analyze the writing style of this text. 
                  Extract: tone, emoji usage (low/high), and sentence structure. 
                  Compare it to standard marketing copy and return a JSON style profile.`
      },
      { role: "user", content: userEdits }
    ],
    response_format: { type: "json_object" }
  });

  const styleProfile = JSON.parse(analysis.choices[0].message.content || '{}');

  // Update memory in DB
  return await prisma.aIMemory.upsert({
    where: { businessId },
    update: {
      preferredTone: styleProfile.tone,
      emojiDensity: styleProfile.emojiUsage === 'high' ? 0.8 : 0.2,
    },
    create: {
      businessId,
      preferredTone: styleProfile.tone,
    }
  });
};