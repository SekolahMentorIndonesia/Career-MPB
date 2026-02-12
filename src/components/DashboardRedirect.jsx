import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (user && user.role?.toUpperCase() === 'ADMIN') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user && user.role?.toUpperCase() === 'USER') {
    return <Navigate to="/dashboard/user" replace />;
  }

  // If not authenticated or role not recognized, redirect to login
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;
