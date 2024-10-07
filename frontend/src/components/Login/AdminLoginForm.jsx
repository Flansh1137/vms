import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, InputAdornment, Typography, Paper, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import adminImage from '../../assets/adminpage.jpg'; // Adjust the path based on your project structure

const AdminLoginForm = ({ onLogin }) => {
  const [bucketName, setBucketName] = useState('');
  const [cloudFrontDomain, setCloudFrontDomain] = useState('');
  const [cloudAccessKeyId, setCloudAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [regionName, setRegionName] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [showSecretAccessKey, setShowSecretAccessKey] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const adminDetails = {
      bucketName,
      cloudFrontDomain,
      cloudAccessKeyId,
      secretAccessKey,
      regionName,
      rtspUrl,
    };

    try {
      await axios.post('http://localhost:5000/save-admin-details', adminDetails);
      onLogin('/admin-dashboard');
    } catch (err) {
      setError('Error saving admin details');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          backgroundImage: `url(${adminImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="backdrop-blur-md bg-white bg-opacity-50 p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <Typography variant="h4" component="h2" className="mb-6 text-center text-gray-800">
            Admin Login
          </Typography>
          {error && (
            <Typography color="error" className="mb-4 text-center">
              {error}
            </Typography>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <Typography variant="h6" className="text-gray-700 text-center pt-10">
              Cloud Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bucket Name"
                  variant="outlined"
                  fullWidth
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  className="mb-4"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CloudFront Domain URL"
                  variant="outlined"
                  fullWidth
                  value={cloudFrontDomain}
                  onChange={(e) => setCloudFrontDomain(e.target.value)}
                  className="mb-4"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cloud Access Key ID"
                  variant="outlined"
                  fullWidth
                  value={cloudAccessKeyId}
                  onChange={(e) => setCloudAccessKeyId(e.target.value)}
                  className="mb-4"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Secret Access Key"
                  variant="outlined"
                  fullWidth
                  type={showSecretAccessKey ? 'text' : 'password'}
                  value={secretAccessKey}
                  onChange={(e) => setSecretAccessKey(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowSecretAccessKey(!showSecretAccessKey)}
                          edge="end"
                        >
                          {showSecretAccessKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  className="mb-4"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Region Name"
                  variant="outlined"
                  fullWidth
                  value={regionName}
                  onChange={(e) => setRegionName(e.target.value)}
                  className="mb-4"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="RTSP URL"
                  variant="outlined"
                  fullWidth
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  className="mb-4"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="py-2"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
