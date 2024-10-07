import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0
import NavBar from './navbar'; // Full NavBar
import MinimalNavBar from './MinimalNavBar'; // Minimal NavBar for login-options

const AppNavBar = () => {
  const location = useLocation(); // Hook to get current location
  const { isAuthenticated } = useAuth0(); // Get authentication status

  // Show MinimalNavBar if user is logged in, otherwise show full NavBar
  return isAuthenticated || location.pathname === '/login-options' ? <MinimalNavBar /> : <NavBar />;
};

export default AppNavBar;
