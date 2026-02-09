import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (user && user.role === 'HR') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user && user.role === 'CANDIDATE') {
    return <Navigate to="/dashboard/user" replace />;
  }

  // If not authenticated or role not recognized, redirect to login
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;
