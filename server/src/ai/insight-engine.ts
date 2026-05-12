import { OpenAI } from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const processVoiceInsight = async (audioFilePath: string, businessId: string) => {
  // 1. Transcribe audio using Whisper
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: "whisper-1",
  });

  // 2. Extract Insights using GPT-4
  const extraction = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Analyze this business transcript. Extract: 
                  1. Top 3 customer pain points. 
                  2. One testimonial-worthy quote.
                  3. Overall sentiment.
                  Return JSON format.`
      },
      { role: "user", content: transcription.text }
    ],
    response_format: { type: "json_object" }
  });

  const insightData = JSON.parse(extraction.choices[0].message.content || '{}');

  // 3. Store in DB (Simulated)
  return {
    transcript: transcription.text,
    insights: insightData
  };
};