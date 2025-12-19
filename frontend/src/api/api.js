import axios from "axios";

// Use your actual Render backend URL
const baseURL = 'https://truth-vs-noise-backend.onrender.com/api';

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