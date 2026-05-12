import api from '@/lib/api-client';

export const generateAIContent = async (data: { platform: string; topic: string; mode: string }) => {
  const response = await api.post('/content/generate', data);
  return response.data;
};