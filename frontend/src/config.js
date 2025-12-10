const API_URL = import.meta.env.PROD
    ? 'https://artisanflo-appli-backend.onrender.com/api'
    : (import.meta.env.VITE_API_URL || '/api');

export default API_URL;
