import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Card, CardContent, Typography, FormControlLabel, Checkbox } from '@mui/material';
import loginBackground from '../../assets/login man.jpg'; // Path to your uploaded image

const LoginOptions = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is authenticated, redirect to /counselor-login
    if (isAuthenticated) {
      navigate('/counselor-login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex w-full h-screen relative">
      {/* Full Screen Background Image */}
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        {/* Overlay for a dimming effect */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Right Side: Login Form with Blur Background */}
      <div className="absolute inset-y-0 right-0 flex justify-center items-center p-8">
        {/* Blurred Background for Form */}
        <div className=" backdrop-blur-md bg-white/30 rounded-lg p-8 shadow-lg w-full max-w-md">
          <CardContent>
            <Typography variant="h4" component="h1" className="text-white text-center mb-4">
              Secure Login
            </Typography>
            <Typography variant="body1" className="text-white text-center pb-6">
              Log into your XAIBIT account and start monitoring.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => loginWithRedirect()} // Redirects to Auth0 login
              className="w-full my-10"
            >
              Log in with XAIBIT VMS.
            </Button>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default LoginOptions;
