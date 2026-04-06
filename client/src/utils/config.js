// Central config — reads from Render env var in production, falls back to localhost for dev
// In Render frontend service, set: VITE_API_URL = https://your-backend.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
