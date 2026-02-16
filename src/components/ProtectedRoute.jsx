// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Token check karo
  const token = localStorage.getItem('token');

  // 2. Agar token nahi hai, to Login par dhakka maaro
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Agar token hai, to Dashboard dikhao
  return children;
};

export default ProtectedRoute;