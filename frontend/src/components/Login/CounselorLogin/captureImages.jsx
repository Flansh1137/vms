import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptureImages = ({ setImageData }) => {
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null); // Store a single captured image
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    // Capture a single image from the webcam
    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc); // Store the captured image
        setImageData(imageSrc); // Pass the captured image to parent component
    };

    // Handle image upload
    const handleUpload = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/upload-image', {
                id,
                name,
                image: capturedImage, // Upload only the captured image
            });
            console.log('Image uploaded successfully:', response.data);
            setMessage('Image uploaded successfully!');
            setIsError(false);
            setTimeout(() => {
                navigate('/Counselor-Login'); // Redirect after successful upload
            }, 2000);
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('Error uploading image. Please try again.');
            setIsError(true);
        }
    };

    // Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);
    };

    // Retake the image
    const handleRetake = () => {
        setCapturedImage(null); // Clear the captured image
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {!isFormSubmitted ? (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-4 md:mx-6 lg:mx-8">
                    <h1 className="text-2xl font-bold mb-4">Enter Details</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-4 md:mx-6 lg:mx-8">
                    <h1 className="text-2xl font-bold mb-4">Capture Image</h1>

                    {!capturedImage ? (
                        <div className="flex flex-col items-center">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="mb-4"
                            />
                            <button
                                onClick={capture}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Capture Image
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-bold mb-4">Captured Image</h2>
                            <img src={capturedImage} alt="Captured" className="w-full h-auto mb-4" />
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleRetake}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Retake Image
                                </button>
                                <button
                                    onClick={handleUpload}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Upload Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {message && (
                <div
                    className={`absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50`}
                >
                    <div
                        className={`p-6 rounded-lg text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                    >
                        <p className="text-lg font-bold mb-4">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaptureImages;
