// src/components/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if user is authenticated and has the required role
  const isAuthorized = currentUser && allowedRoles.includes(currentUser.role);

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // Redirect to appropriate dashboard if authenticated but wrong role
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;