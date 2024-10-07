import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0(); // Get authentication state

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  return isAuthenticated ? children : <Navigate to="/login-options" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
