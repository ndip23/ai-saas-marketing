import axios from 'axios';
import cloudinary from '../config/cloudinary';

export const createFlyer = async (config: {
  business: any;
  intent: string;
  topic: string;
}) => {
  const { business, intent, topic } = config;

  const prompt = `Premium minimalist Apple-style marketing flyer for ${business.name}. Industry: ${business.industry}. Topic: ${topic}. High-end studio lighting, 8k resolution, professional photography.`;

  try {
    // 1. Call Hugging Face Flux (Free)
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` },
        responseType: 'arraybuffer',
      }
    );

    // 2. Convert to Base64
    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;

    // 3. Upload to YOUR Cloudinary so it's permanent and has NO CORS issues
    const uploadRes = await cloudinary.uploader.upload(base64Image, {
      folder: 'generated_flyers',
    });

    return uploadRes.secure_url;
  } catch (error) {
    console.error("HuggingFace Error:", error);
    // Fallback image if API is busy
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";
  }
};