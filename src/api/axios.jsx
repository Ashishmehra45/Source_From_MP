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
    const sellerToken = localStorage.getItem('sellerToken');
    const buyerToken = localStorage.getItem('buyerToken');

    // 🕵️ Smart Token Selection:
    // Agar URL me '/buyers' hai toh buyerToken bhejo, warna sellerToken
    if (config.url.includes('/buyers') && buyerToken) {
        config.headers.Authorization = `Bearer ${buyerToken}`;
    } else if (sellerToken) {
        config.headers.Authorization = `Bearer ${sellerToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;