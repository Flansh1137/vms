// import React from 'react';

// import CustomerLoginForm from './CustomerLoginForm'; // Corrected import statement

// // Add the route back into your routes section
// <Route 
//   path="/customer-login" 
//   element={<CustomerLoginForm />} 
// />

// export default CustomerLoginForm ;









import React from 'react';
import { Button, TextField, Typography } from '@mui/material'; 

const CustomerLoginForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <Typography variant="h6" className="text-black mb-4">Customer Login</Typography>
      <TextField 
        label="Email" 
        variant="outlined" 
        type="email" 
        fullWidth 
        margin="normal" 
        InputLabelProps={{ style: { color: 'black' } }} // Change label color
        InputProps={{ style: { color: 'black' } }} // Change input text color
        className="bg-gray-200" // Background for input
      />
      <TextField 
        label="Password" 
        variant="outlined" 
        type="password" 
        fullWidth 
        margin="normal" 
        InputLabelProps={{ style: { color: 'black' } }} // Change label color
        InputProps={{ style: { color: 'black' } }} // Change input text color
        className="bg-gray-200" // Background for input
      />
      <Button 
        variant="contained" 
        color="primary" 
        type="submit" 
        className="mt-4" 
        style={{ backgroundColor: '#1976d2', borderRadius: '25px' }} // Rounded button
      >
        Log in
      </Button>
    </form>
  );
};

export default CustomerLoginForm;
