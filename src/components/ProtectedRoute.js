import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
