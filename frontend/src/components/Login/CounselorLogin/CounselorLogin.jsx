import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';


// Lazy load the DataAnalysis component
const DataAnalysis = lazy(() => import('./dataAnalysis')); // Adjust the import based on your project structure

function CounselorLogin() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Main container to display two sections in 35% and 65% ratio */}
      <div className="flex w-full justify-between px-6">
        {/* Section 1: 35% width */}
        <div className="w-[35%] h-screen p-4 bg-white shadow-md rounded-lg overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Data Analysis</h2>
          {/* Lazy load Data Analysis content */}
          <Suspense fallback={<div>Loading...</div>}>
            <DataAnalysis />
          </Suspense>
        </div>

        {/* Section 2: 65% width */}
        <div className="w-[65%] p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Live Video</h2>
          <p>This is where live video content would go. You can replace this with an embedded video component or iframe if needed.</p>
        </div>
      </div>
    </div>
  );
}

export default CounselorLogin;
