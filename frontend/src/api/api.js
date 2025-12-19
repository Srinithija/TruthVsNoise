import axios from "axios";

// Determine base URL based on environment
const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction 
  ? 'https://YOUR_BACKEND_SERVICE_NAME.onrender.com/api'  // Will update after backend deployment
  : 'http://localhost:5000/api';

const API = axios.create({
  baseURL: baseURL,
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;