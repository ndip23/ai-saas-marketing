import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

export default api;