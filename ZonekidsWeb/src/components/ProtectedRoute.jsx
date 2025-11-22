import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.rol !== 'super-admin' && user.email !== 'admin@zonekids.com') {
    return <Navigate to="/" replace />;
  }

  return children;
};