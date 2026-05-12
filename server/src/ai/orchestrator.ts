import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const contentOrchestrator = async (config: {
  business: any,
  mode: 'PROBLEM' | 'AUTHORITY' | 'TREND',
  platform: string,
  topic: string
}) => {
  const { business, mode, platform, topic } = config;

  // 1. Fetch AI DNA (Brand Personality Memory)
  const dna = await prisma.aIMemory.findUnique({
    where: { businessId: business.id }
  });

  // 2. Fetch Real Customer Insights (Phase 5 integration)
  // We take the latest 3 insights to inject real "Pain Points" into the prompt
  const insights = await prisma.customerInsight.findMany({
    where: { businessId: business.id },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const painPointsContext = insights.length > 0 
    ? insights.map(i => i.rawContent).join(", ") 
    : "General industry challenges";

  // 3. Initialize Gemini 1.5 Flash with JSON Mode
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  // 4. Construct the Global Intelligence Prompt
  const prompt = `
    You are a world-class Marketing Strategist and Copywriter.
    
    BUSINESS IDENTITY:
    - Business: ${business.name}
    - Industry: ${business.industry}
    - Mission: ${business.description}

    BRAND DNA (Write in this exact voice):
    - Base Tone: ${dna?.preferredTone || "Professional"}
    - Humor Level: ${dna?.humorScore || 0.5} (0: Dry, 1: Hilarious)
    - Emoji Density: ${dna?.emojiDensity || 0.3} (0: None, 1: Frequent)

    CUSTOMER INTELLIGENCE (Real Pain Points):
    - Use these insights to make the content relatable: ${painPointsContext}

    STRATEGY:
    - Platform: ${platform}
    - Mode: ${mode} (If PROBLEM mode, agitate the customer insights above)
    - Goal: Conversion-focused, Apple-inspired minimalist style.
    - Topic: ${topic}

    Return a JSON object exactly in this format:
    {
      "hook": "Grabbing attention using the Brand DNA",
      "body": "Value-driven message addressing the topic and pain points",
      "cta": "Compelling call to action",
      "hashtags": ["tag1", "tag2", "tag3"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Production-grade Safety: Strip markdown backticks
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("CRITICAL ORCHESTRATION ERROR:", error);
    
    // Fallback professional response if API fails
    return {
      hook: `Elevating the standard of ${business.industry}.`,
      body: `At ${business.name}, we understand the complexity of ${topic}. Our solution is designed to bring you clarity and results.`,
      cta: `Experience the difference with ${business.name}.`,
      hashtags: ["#excellence", "#brand", "#innovation"]
    };
  }
};