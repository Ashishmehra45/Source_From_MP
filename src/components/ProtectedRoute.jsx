import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  
  // --- CASE 1: AGAR ROUTE SELLER KE LIYE HAI ---
  if (role === 'seller') {
    // 🚨 FIX: 'token' ki jagah 'sellerToken' check karo
    const sellerToken = localStorage.getItem('sellerToken');
    
    if (!sellerToken) {
      console.log("Seller not logged in, redirecting...");
      return <Navigate to="/seller/login" replace />;
    }
  }

  // --- CASE 2: AGAR ROUTE BUYER KE LIYE HAI ---
  if (role === 'buyer') {
    // 🚨 FIX: 'buyerToken' check karo (jo humne Login me set kiya tha)
    const buyerToken = localStorage.getItem('buyerToken');
    const buyerInfo = JSON.parse(localStorage.getItem('buyerInfo'));

    // Check karo token hai ya nahi, aur role 'buyer' hai ya nahi
    if (!buyerToken || !buyerInfo || buyerInfo.role !== 'buyer') {
      console.log("Buyer not logged in, redirecting...");
      return <Navigate to="/buyer/login" replace />;
    }
  }

  // Agar sab sahi hai, toh Dashboard dikhao
  return children;
};

export default ProtectedRoute;