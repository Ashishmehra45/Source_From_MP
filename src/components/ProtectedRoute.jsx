import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  
  // --- SELLER CHECK ---
  if (role === 'seller') {
    const sellerToken = localStorage.getItem('sellerToken');
    
    if (!sellerToken) {
      console.warn("Access Denied: No Seller Token found.");
      return <Navigate to="/seller/login" replace />;
    }
  }

  // --- BUYER CHECK ---
  if (role === 'buyer') {
    const buyerToken = localStorage.getItem('buyerToken');
    const buyerInfoRaw = localStorage.getItem('buyerInfo');
    
    let buyerInfo = null;
    try {
      buyerInfo = buyerInfoRaw ? JSON.parse(buyerInfoRaw) : null;
    } catch (e) {
      console.error("Error parsing buyerInfo:", e);
    }

    if (!buyerToken || !buyerInfo || buyerInfo.role !== 'buyer') {
      console.warn("Access Denied: Invalid Buyer Session.");
      // Galat data saaf kar do taaki loop na bane
      localStorage.removeItem('buyerToken');
      localStorage.removeItem('buyerInfo');
      return <Navigate to="/buyer/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;