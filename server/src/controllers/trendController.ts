import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import axios from 'axios';

export const getTrends = async (req: any, res: Response) => {
  try {
    // 1. Get user business context
    const business = await prisma.business.findUnique({
      where: { userId: req.user.id }
    });

    const location = business?.location || "United States";
    const industry = business?.industry || "Marketing";

    // 2. Call REAL SerpApi (Google Trends Engine)
    // We search for "Industry" trends in "Location"
    const serpResponse = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: "google_trends",
        q: industry,
        geo: "US", // You can map business.location to country codes later
        data_type: "RELATED_QUERIES",
        api_key: process.env.SERPAPI_KEY
      }
    });

    // 3. Extract the "Rising" queries (Real viral topics)
    const risingTrends = serpResponse.data.related_queries?.rising || [];

    // 4. Format for Frontend
    const formattedTrends = risingTrends.slice(0, 3).map((item: any) => ({
      topic: item.query,
      growth: `+${item.value}%`,
      extracted_from: "Google Search",
    }));

    // Fallback if Google Trends returns nothing for a very niche industry
    if (formattedTrends.length === 0) {
      formattedTrends.push({ 
        topic: `${industry} latest innovations`, 
        growth: "Trending", 
        extracted_from: "Market Analysis" 
      });
    }

    res.status(200).json({
      location,
      industry,
      trends: formattedTrends
    });
  } catch (error: any) {
    console.error("SerpApi Error:", error.message);
    res.status(500).json({ message: "Failed to fetch live trends" });
  }
};