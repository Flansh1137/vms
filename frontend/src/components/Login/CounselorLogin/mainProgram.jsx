import React, { useState, useEffect } from 'react';

const MainProgram = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/main-program');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.text(); // Since the endpoint returns a string
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Main Program Data</h1>
      <p className="text-gray-700">{data}</p>
    </div>
  );
};

export default MainProgram;
