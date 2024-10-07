import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Paper, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material'; // Icon for Capture Images
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import CaptureImages from './captureImages'; // Import the Capture Images component
import registrationImage from '../../../assets/registration.jpg'; // Background image

const NewRegistrationForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        phone: '',
        emergencyContact: '',
        height: '',
        weight: '',
        age: '',
        bloodGroup: '',
        email: '',
        address: '',
    });
    const [showCapture, setShowCapture] = useState(false); // State to toggle Capture Images
    const [imageData, setImageData] = useState([]); // State for image data
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/new-registration', formData);
            console.log('Form submitted successfully:', response.data);
            setMessage('Registration successful!');
            setIsError(false);
            setTimeout(() => {
                setMessage('');
                setShowCapture(true); // Show capture images after form submission
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage('Error submitting registration. Please try again.');
            setIsError(true);
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }
    };

    const handleBack = () => {
        navigate('/Counselor-Login');
    };

    const handleCaptureImage = () => {
        setShowCapture(true); // Show modal for image capture
    };

    const handleCloseCapture = () => {
        setShowCapture(false); // Close modal for image capture
    };

    return (
        <div
            className={`relative flex flex-col items-center justify-center min-h-screen ${
                showCapture ? 'blur-md' : ''
            }`} // Apply blur effect when modal is open
            style={{
                backgroundImage: `url(${registrationImage})`,
                backgroundSize: 'cover',
            }}
        >
            <Paper
                elevation={3}
                className="p-4 w-full max-w-4xl mx-4 md:mx-6 lg:mx-8 backdrop-filter backdrop-blur-lg"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent white background
                }}
            >
                <div className="flex flex-col items-center mb-4">
                    <PersonAddIcon sx={{ fontSize: 50, color: '#007FFF' }} />
                    <Typography
                        variant="h4"
                        className="font-bold mb-4"
                        style={{ fontFamily: 'Arial, sans-serif', color: 'white' }}
                    >
                        New Registration Form
                    </Typography>
                </div>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* First Column */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="ID"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>

                        {/* Second Column */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Emergency Contact"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Blood Group"
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                    </Grid>
                    <div className="flex justify-center mt-4 space-x-4">
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                        >
                            Submit
                        </Button>

                        {/* Capture Image Button */}
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CameraAltIcon />}
                            onClick={handleCaptureImage}
                        >
                            Capture Images
                        </Button>
                    </div>
                </form>
            </Paper>

            {/* Capture Images Modal */}
            <Dialog
                open={showCapture}
                onClose={handleCloseCapture}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.85)' },
                }}
            >
                <DialogTitle>Capture Images</DialogTitle>
                <DialogContent>
                    <CaptureImages setImageData={setImageData} />
                    <div className="mt-4 flex justify-center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCloseCapture}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {message && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div
                        className={"p-6 rounded-lg text-center " + (isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}
                    >
                        <p className="text-lg font-bold mb-4">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewRegistrationForm;
