import axios from 'axios';

// 1. Better Environment Check
// window.location.hostname production par "source-from-mp.onrender.com" jaisa hoga
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocal 
    ? "http://localhost:5000/api"                       // Jab tum laptop pe ho
    : "https://source-from-mp-backend.onrender.com/api"; // Jab site live hai (Render)

console.log("Current API URL:", API_BASE_URL); // Debugging ke liye, console mein dikhega

const api = axios.create({
    baseURL: API_BASE_URL,
});

// 2. Token auto-add interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;