import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import CaptureImages from './captureImages'; // Import the Capture Images component

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
    const [imageData, setImageData] = useState(null); // State for single image data
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
            const response = await axios.post('http://localhost:5000/new-registration', { ...formData, image: imageData });
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

    const handleImageCaptured = (image) => {
        setImageData(image); // Store the captured image
        setShowCapture(false); // Close capture dialog
    };

    const handleRetakeImage = () => {
        setImageData(null); // Clear the captured image
        setShowCapture(true); // Open capture dialog again
    };

    return (
        <div className="flex flex-row min-h-screen">
            {/* Form Section (80%) */}
            <div className="flex flex-col w-4/5 p-8">
                <div className="flex flex-col items-center mb-4">
                    <PersonAddIcon sx={{ fontSize: 50, color: '#007FFF' }} />
                    <Typography variant="h4" className="font-bold mb-4">
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
                            />
                        </Grid>
                    </Grid>
                    <div className="flex justify-center mt-4 space-x-4">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                        >
                            Submit
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CameraAltIcon />}
                            onClick={handleCaptureImage}
                        >
                            Capture Image
                        </Button>
                    </div>

                    {/* Display captured image if available */}
                    {imageData && (
                        <div className="mt-4">
                            <Typography variant="body1" className="text-center">
                                Image Captured Successfully!
                            </Typography>
                            <img src={imageData} alt="Captured" className="mx-auto mt-2" style={{ maxWidth: '100%', height: 'auto' }} />
                            <Button variant="outlined" color="secondary" onClick={handleRetakeImage} className="mt-2">
                                Retake Image
                            </Button>
                        </div>
                    )}
                </form>
            </div>

            {/* Note Section (20%) */}
            <div className="w-1/5 p-8 bg-gray-100 flex items-center justify-center">
                <Typography variant="body1" className="text-center text-red-600">
                    Please ensure all information entered is accurate and complete. This data will be stored securely but may be used for important health-related decisions. Providing incorrect or false information can lead to serious consequences.
                </Typography>
            </div>

            {/* Capture Images Modal */}
            <Dialog
                open={showCapture}
                onClose={handleCloseCapture}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Capture Image</DialogTitle>
                <DialogContent>
                    <CaptureImages onImageCaptured={handleImageCaptured} />
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
                    <div className={`p-6 rounded-lg text-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        <p className="text-lg font-bold mb-4">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewRegistrationForm;
