// import React, { Suspense, lazy } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Lazy load the DataAnalysis component
// const DataAnalysis = lazy(() => import('./SmalldataAnalysis')); // Adjust the import based on your project structure

// function CounselorLogin() {
//   const navigate = useNavigate();

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       {/* Main container to display two sections in 35% and 65% ratio */}
//       <div className="flex flex-col lg:flex-row w-full justify-between px-6">
//         {/* Section 1: 35% width on large screens, full width on smaller screens */}
//         <div className="w-full lg:w-[35%] h-screen bg-white shadow-md rounded-lg overflow-y-auto mb-6 lg:mb-0">
//           {/* <h2 className="text-xl font-bold mb-4">Data Analysis</h2> */}
//           {/* Lazy load Data Analysis content */}
//           <Suspense fallback={<div>Loading...</div>}>
//             <DataAnalysis />
//           </Suspense>
//         </div>

//         {/* Section 2: 65% width on large screens, full width on smaller screens */}
//         <div className="w-full lg:w-[65%] p-4 bg-white shadow-md rounded-lg">
//           <h2 className="text-xl font-bold mb-4">Live Video</h2>
//           <p>This is where live video content would go. You can replace this with an embedded video component or iframe if needed.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CounselorLogin;







import React, { useEffect, useRef } from 'react';
import { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';

// Lazy load the DataAnalysis component
const DataAnalysis = lazy(() => import('./SmalldataAnalysis')); // Adjust the import based on your project structure

function CounselorLogin() {
  const navigate = useNavigate();
  const videoPlayerRef = useRef(null);

  // Array of video file URLs
  const videoFiles = [
    "https://d1hxsynrm0sbko.cloudfront.net/video_2024-10-08_12-31-38.mp4",
    "https://d1hxsynrm0sbko.cloudfront.net/video_2024-10-08_12-32-42.mp4",
    "https://d1hxsynrm0sbko.cloudfront.net/video_2024-10-08_12-33-07.mp4",
    "https://d1hxsynrm0sbko.cloudfront.net/video_2024-10-08_12-33-42.mp4",
    "https://d1hxsynrm0sbko.cloudfront.net/video_2024-10-08_12-34-17.mp4",
    "https://d1hxsynrm0sbko.cloudfront.net/video_2024-10-08_12-34-52.mp4"
  ];

  // Index to keep track of the current video
  let currentIndex = 0;

  // Function to play the next video
  const playNextVideo = () => {
    if (currentIndex < videoFiles.length) {
      videoPlayerRef.current.src = videoFiles[currentIndex];
      videoPlayerRef.current.play();
      currentIndex++;
    } else {
      // Reset to first video to loop
      currentIndex = 0;
      videoPlayerRef.current.src = videoFiles[currentIndex];
      videoPlayerRef.current.play();
    }
  };

  useEffect(() => {
    const videoPlayer = videoPlayerRef.current;

    // Add event listener to play next video when current video ends
    videoPlayer.addEventListener('ended', playNextVideo);

    // Start playing the first video
    playNextVideo();

    // Clean up event listener on component unmount
    return () => {
      videoPlayer.removeEventListener('ended', playNextVideo);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Main container to display two sections in 35% and 65% ratio */}
      <div className="flex flex-col lg:flex-row w-full justify-between px-6">
        {/* Section 1: 35% width on large screens, full width on smaller screens */}
        <div className="w-full lg:w-[35%] h-screen bg-white shadow-md rounded-lg overflow-y-auto mb-6 lg:mb-0">
          <Suspense fallback={<div>Loading...</div>}>
            <DataAnalysis />
          </Suspense>
        </div>

        {/* Section 2: 65% width on large screens, full width on smaller screens */}
        <div className="w-full lg:w-[65%] p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Live Video</h2>
          <video 
            ref={videoPlayerRef} 
            controls 
            style={{ width: '100%', height: 'auto' }} // Adjusts to fit the container
          >
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default CounselorLogin;
