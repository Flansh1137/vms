// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DateRangePicker } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import { format } from 'date-fns';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// import ExcelJS from 'exceljs';

// ChartJS.register(Title, Tooltip, Legend, ArcElement);

// const DataAnalysis = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [data, setData] = useState({});
//   const [unknownData, setUnknownData] = useState({});
//   const [names, setNames] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [excelData, setExcelData] = useState([]);

//   useEffect(() => {
//     const today = new Date();
//     const oneWeekAgo = new Date(today);
//     oneWeekAgo.setDate(today.getDate() - 7);

//     setStartDate(oneWeekAgo);
//     setEndDate(today);

//     fetchData(oneWeekAgo, today);
//     fetchUnknownData(oneWeekAgo, today);
//     fetchExcelData();
//   }, []);

//   const fetchData = async (start, end) => {
//     try {
//       const response = await axios.get('http://localhost:5000/data-analysis', {
//         params: {
//           startDate: format(start, 'yyyy-MM-dd'),
//           endDate: format(end, 'yyyy-MM-dd'),
//         },
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const fetchUnknownData = async (start, end) => {
//     try {
//       const response = await axios.get('http://localhost:5000/unknown-data-analysis', {
//         params: {
//           startDate: format(start, 'yyyy-MM-dd'),
//           endDate: format(end, 'yyyy-MM-dd'),
//         },
//       });
//       setUnknownData(response.data);
//     } catch (error) {
//       console.error('Error fetching unknown data:', error);
//     }
//   };

//   const fetchExcelData = async () => {
//     try {
//       const response = await axios.get('backend\LiveStorage.xlsx', {
//         responseType: 'arraybuffer',
//       });

//       const workbook = new ExcelJS.Workbook();
//       await workbook.xlsx.load(response.data);

//       const worksheet = workbook.getWorksheet(1);
//       const images = worksheet.media;

//       const formattedData = [];

//       images.forEach((image, index) => {
//         const imgBuffer = new Uint8Array(image.buffer);
//         const imgBlob = new Blob([imgBuffer], { type: image.contentType });
//         const imgUrl = URL.createObjectURL(imgBlob);

//         formattedData.push({
//           name: worksheet.getCell(`A${index + 1}`).value, // Assuming names are in column A
//           image: imgUrl
//         });
//       });

//       setExcelData(formattedData);
//     } catch (error) {
//       console.error('Error fetching Excel file:', error);
//     }
//   };

//   const handleDateChange = (item) => {
//     setStartDate(item.selection.startDate);
//     setEndDate(item.selection.endDate);
//     fetchData(item.selection.startDate, item.selection.endDate);
//     fetchUnknownData(item.selection.startDate, item.selection.endDate);
//   };

//   const handleViewPeople = async (date) => {
//     try {
//       const response = await axios.get('http://localhost:5000/names-by-date', {
//         params: {
//           date: date,
//         },
//       });
//       const uniqueNames = Array.from(new Set(response.data));
//       setNames(uniqueNames);
//       setSelectedDate(date);
//     } catch (error) {
//       console.error('Error fetching names:', error);
//     }
//   };

//   const totalKnownData = Object.values(data).reduce((acc, count) => acc + count, 0);
//   const totalUnknownData = Object.values(unknownData).reduce((acc, count) => acc + count, 0);

//   const combinedData = {
//     labels: ['Known Data', 'Unknown Data'],
//     datasets: [
//       {
//         data: [totalKnownData || 1, totalUnknownData || 1],
//         backgroundColor: [
//           totalKnownData > 0 ? '#FF6384' : '#BEBEBE',
//           totalUnknownData > 0 ? '#36A2EB' : '#BEBEBE',
//         ],
//       },
//     ],
//   };

//   const tooltipCallbacks = {
//     label: (context) => {
//       const { label, raw } = context;
//       const isKnown = label === 'Known Data';
//       const dataDetail = isKnown ? data : unknownData;
//       const total = raw;
//       const details = Object.entries(dataDetail)
//         .map(([date, count]) => `${date}: ${count}`)
//         .join(', ');

//       return `${label}: ${total} visits (${details})`;
//     },
//   };

//   const dateRangeDisplay = `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Data from {dateRangeDisplay}</h1>
//       <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
//         <div className="lg:w-1/3 mb-6 lg:mb-0">
//           <DateRangePicker
//             ranges={[{ startDate, endDate, key: 'selection' }]}
//             onChange={handleDateChange}
//           />
//         </div>
//         <div className="lg:w-2/3 flex flex-col items-center">
//           <h2 className="text-xl font-semibold mb-2 text-center">
//             Data Distribution from {dateRangeDisplay}
//           </h2>
//           <div style={{ width: '250px', height: '250px' }} className="mx-auto">
//             <Pie
//               data={combinedData}
//               options={{
//                 plugins: {
//                   tooltip: {
//                     callbacks: tooltipCallbacks,
//                   },
//                 },
//                 responsive: true,
//                 maintainAspectRatio: false,
//               }}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mt-6 flex flex-col lg:flex-row lg:space-x-8">
//         <div className="lg:w-1/2">
//           {Object.keys(data).length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Known Data Summary</h2>
//               <ul className="list-disc pl-5">
//                 {Object.entries(data).map(([date, count]) => (
//                   <li key={date} className="mb-2">
//                     <span className="font-semibold">{date}</span>: {count} visits
//                     <button
//                       onClick={() => handleViewPeople(date)}
//                       className="ml-4 text-blue-500 hover:underline"
//                     >
//                       View People
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         <div className="lg:w-1/2">
//           {Object.keys(unknownData).length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Unknown Data Summary</h2>
//               <ul className="list-disc pl-5">
//                 {Object.entries(unknownData).map(([date, count]) => (
//                   <li key={date} className="mb-2">
//                     <span className="font-semibold">{date}</span>: {count} visits
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//       {names.length > 0 && selectedDate && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">
//             People who visited on {selectedDate}
//           </h2>
//           <ul className="list-disc pl-5">
//             {names.map((name, index) => (
//               <li key={index} className="mb-2">{name}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {excelData.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">Images from Excel</h2>
//           <ul className="list-disc pl-5">
//             {excelData.map((item, index) => (
//               <li key={index} className="mb-4 flex items-center">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-20 h-20 object-cover rounded-full mr-4"
//                   onError={(e) => {
//                     e.target.onerror = null; // prevents looping
//                     e.target.src = '/path/to/default/image.jpg'; // fallback image
//                   }}
//                 />
//                 <span>{item.name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataAnalysis;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DateRangePicker } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import { format } from 'date-fns';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// import ExcelJS from 'exceljs';

// ChartJS.register(Title, Tooltip, Legend, ArcElement);

// const DataAnalysis = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [data, setData] = useState({});
//   const [unknownData, setUnknownData] = useState({});
//   const [names, setNames] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [excelData, setExcelData] = useState([]);

//   useEffect(() => {
//     const today = new Date();
//     const oneWeekAgo = new Date(today);
//     oneWeekAgo.setDate(today.getDate() - 7);

//     setStartDate(oneWeekAgo);
//     setEndDate(today);

//     fetchData(oneWeekAgo, today);
//     fetchUnknownData(oneWeekAgo, today);
//     fetchExcelData();
//   }, []);

//   const fetchData = async (start, end) => {
//     try {
//       const response = await axios.get('http://localhost:5000/data-analysis', {
//         params: {
//           startDate: format(start, 'yyyy-MM-dd'),
//           endDate: format(end, 'yyyy-MM-dd'),
//         },
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const fetchUnknownData = async (start, end) => {
//     try {
//       const response = await axios.get('http://localhost:5000/unknown-data-analysis', {
//         params: {
//           startDate: format(start, 'yyyy-MM-dd'),
//           endDate: format(end, 'yyyy-MM-dd'),
//         },
//       });
//       setUnknownData(response.data);
//     } catch (error) {
//       console.error('Error fetching unknown data:', error);
//     }
//   };

//   const fetchExcelData = async () => {
//     try {
//       const response = await axios.get('backend/LiveStorage.xlsx', {
//         responseType: 'arraybuffer',
//       });

//       const workbook = new ExcelJS.Workbook();
//       await workbook.xlsx.load(response.data);

//       const worksheet = workbook.getWorksheet(1);
//       const images = worksheet.media;

//       const formattedData = [];

//       images.forEach((image, index) => {
//         const imgBuffer = new Uint8Array(image.buffer);
//         const imgBlob = new Blob([imgBuffer], { type: image.contentType });
//         const imgUrl = URL.createObjectURL(imgBlob);

//         formattedData.push({
//           name: worksheet.getCell(`A${index + 1}`).value, // Assuming names are in column A
//           image: imgUrl
//         });
//       });

//       setExcelData(formattedData);
//     } catch (error) {
//       console.error('Error fetching Excel file:', error);
//     }
//   };

//   const handleDateChange = (item) => {
//     setStartDate(item.selection.startDate);
//     setEndDate(item.selection.endDate);
//     fetchData(item.selection.startDate, item.selection.endDate);
//     fetchUnknownData(item.selection.startDate, item.selection.endDate);
//   };

//   const handleViewPeople = async (date) => {
//     try {
//       const response = await axios.get('http://localhost:5000/names-by-date', {
//         params: {
//           date: date,
//         },
//       });
//       const uniqueNames = Array.from(new Set(response.data));
//       setNames(uniqueNames);
//       setSelectedDate(date);
//     } catch (error) {
//       console.error('Error fetching names:', error);
//     }
//   };

//   const totalKnownData = Object.values(data).reduce((acc, count) => acc + count, 0);
//   const totalUnknownData = Object.values(unknownData).reduce((acc, count) => acc + count, 0);

//   const combinedData = {
//     labels: ['Known Data', 'Unknown Data'],
//     datasets: [
//       {
//         data: [totalKnownData || 1, totalUnknownData || 1],
//         backgroundColor: [
//           totalKnownData > 0 ? '#FF6384' : '#BEBEBE',
//           totalUnknownData > 0 ? '#36A2EB' : '#BEBEBE',
//         ],
//       },
//     ],
//   };

//   const tooltipCallbacks = {
//     label: (context) => {
//       const { label, raw } = context;
//       const isKnown = label === 'Known Data';
//       const dataDetail = isKnown ? data : unknownData;
//       const total = raw;
//       const details = Object.entries(dataDetail)
//         .map(([date, count]) => `${date}: ${count}`)
//         .join(', ');

//       return `${label}: ${total} visits (${details})`;
//     },
//   };

//   const dateRangeDisplay = `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Data from {dateRangeDisplay}</h1>
//       <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
//         <div className="lg:w-1/3 mb-6 lg:mb-0">
//           <DateRangePicker
//             ranges={[{ startDate, endDate, key: 'selection' }]}
//             onChange={handleDateChange}
//             className="w-full"
//           />
//         </div>
//         <div className="lg:w-2/3 flex flex-col items-center">
//           <h2 className="text-xl font-semibold mb-2 text-center">
//             Data Distribution from {dateRangeDisplay}
//           </h2>
//           <div style={{ width: '100%', maxWidth: '300px', height: '300px' }} className="mx-auto">
//             <Pie
//               data={combinedData}
//               options={{
//                 plugins: {
//                   tooltip: {
//                     callbacks: tooltipCallbacks,
//                   },
//                 },
//                 responsive: true,
//                 maintainAspectRatio: false,
//               }}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mt-6 flex flex-col lg:flex-row lg:space-x-8">
//         <div className="lg:w-1/2">
//           {Object.keys(data).length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Known Data Summary</h2>
//               <ul className="list-disc pl-5">
//                 {Object.entries(data).map(([date, count]) => (
//                   <li key={date} className="mb-2">
//                     <span className="font-semibold">{date}</span>: {count} visits
//                     <button
//                       onClick={() => handleViewPeople(date)}
//                       className="ml-4 text-blue-500 hover:underline"
//                     >
//                       View People
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         <div className="lg:w-1/2">
//           {Object.keys(unknownData).length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Unknown Data Summary</h2>
//               <ul className="list-disc pl-5">
//                 {Object.entries(unknownData).map(([date, count]) => (
//                   <li key={date} className="mb-2">
//                     <span className="font-semibold">{date}</span>: {count} visits
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//       {names.length > 0 && selectedDate && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">
//             People who visited on {selectedDate}
//           </h2>
//           <ul className="list-disc pl-5">
//             {names.map((name, index) => (
//               <li key={index} className="mb-2">{name}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {excelData.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">Images from Excel</h2>
//           <ul className="list-disc pl-5">
//             {excelData.map((item, index) => (
//               <li key={index} className="mb-4 flex items-center">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-20 h-20 object-cover rounded-full mr-4"
//                   onError={(e) => {
//                     e.target.onerror = null; // prevents looping
//                     e.target.src = '/path/to/default/image.jpg'; // fallback image
//                   }}
//                 />
//                 <span>{item.name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataAnalysis;








import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ExcelJS from 'exceljs';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const DataAnalysis = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState({});
  const [unknownData, setUnknownData] = useState({});
  const [names, setNames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    setStartDate(oneWeekAgo);
    setEndDate(today);

    fetchData(oneWeekAgo, today);
    fetchUnknownData(oneWeekAgo, today);
    fetchExcelData();
  }, []);

  const fetchData = async (start, end) => {
    try {
      const response = await axios.get('http://localhost:5000/data-analysis', {
        params: {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd'),
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchUnknownData = async (start, end) => {
    try {
      const response = await axios.get('http://localhost:5000/unknown-data-analysis', {
        params: {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd'),
        },
      });
      setUnknownData(response.data);
    } catch (error) {
      console.error('Error fetching unknown data:', error);
    }
  };

  const fetchExcelData = async () => {
    try {
      const response = await axios.get('backend/LiveStorage.xlsx', {
        responseType: 'arraybuffer',
      });

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(response.data);

      const worksheet = workbook.getWorksheet(1);
      const images = worksheet.media;

      const formattedData = [];

      images.forEach((image, index) => {
        const imgBuffer = new Uint8Array(image.buffer);
        const imgBlob = new Blob([imgBuffer], { type: image.contentType });
        const imgUrl = URL.createObjectURL(imgBlob);

        formattedData.push({
          name: worksheet.getCell(`A${index + 1}`).value, // Assuming names are in column A
          image: imgUrl,
        });
      });

      setExcelData(formattedData);
    } catch (error) {
      console.error('Error fetching Excel file:', error);
    }
  };

  const handleDateChange = (item) => {
    setStartDate(item.selection.startDate);
    setEndDate(item.selection.endDate);
    fetchData(item.selection.startDate, item.selection.endDate);
    fetchUnknownData(item.selection.startDate, item.selection.endDate);
  };

  const handleViewPeople = async (date) => {
    try {
      const response = await axios.get('http://localhost:5000/names-by-date', {
        params: {
          date: date,
        },
      });
      const uniqueNames = Array.from(new Set(response.data));
      setNames(uniqueNames);
      setSelectedDate(date);
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };

  const totalKnownData = Object.values(data).reduce((acc, count) => acc + count, 0);
  const totalUnknownData = Object.values(unknownData).reduce((acc, count) => acc + count, 0);

  const combinedData = {
    labels: ['Known Data', 'Unknown Data'],
    datasets: [
      {
        data: [totalKnownData || 1, totalUnknownData || 1],
        backgroundColor: [
          totalKnownData > 0 ? '#FF6384' : '#BEBEBE',
          totalUnknownData > 0 ? '#36A2EB' : '#BEBEBE',
        ],
      },
    ],
  };

  const tooltipCallbacks = {
    label: (context) => {
      const { label, raw } = context;
      const isKnown = label === 'Known Data';
      const dataDetail = isKnown ? data : unknownData;
      const total = raw;
      const details = Object.entries(dataDetail)
        .map(([date, count]) => `${date}: ${count}`)
        .join(', ');

      return `${label}: ${total} visits (${details})`;
    },
  };

  const dateRangeDisplay = `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Data from {dateRangeDisplay}</h1>

      {/* Flex container for Pie Chart and Date Range Picker */}
      <div className="flex md:flex-row-reverse ">
        {/* Pie Chart Section */}
        <div className="w-full sm:w-1/2 mb-6 lg:mb-0 overflow-hidden">
          <h2 className="text-xl font-semibold mb-2 text-center">Data Distribution</h2>
          <div style={{ width: '100%', height: '300px' }} className="mx-auto">
            <Pie
              data={combinedData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: tooltipCallbacks,
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Date Range Picker Section */}
        <div className="w-full sm:w-1/2 mb-6 lg:mb-0 overflow-hidden">
          <h2 className="text-xl font-semibold mb-2 text-center">Select Date Range</h2>
          <div className="mx-auto">
            <DateRangePicker
              ranges={[{ startDate, endDate, key: 'selection' }]}
              onChange={handleDateChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Known and Unknown Data Summaries */}
      <div className="lg:flex lg:space-x-8 mt-6">
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-2">Known Data Summary</h2>
          <ul className="list-disc pl-5">
            {Object.entries(data).map(([date, count]) => (
              <li key={date} className="mb-2">
                <span className="font-semibold">{date}</span>: {count} visits
                <button
                  onClick={() => handleViewPeople(date)}
                  className="ml-4 text-blue-500 hover:underline"
                >
                  View People
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-2">Unknown Data Summary</h2>
          <ul className="list-disc pl-5">
            {Object.entries(unknownData).map(([date, count]) => (
              <li key={date} className="mb-2">
                <span className="font-semibold">{date}</span>: {count} visits
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* List of Names for Selected Date */}
      {names.length > 0 && selectedDate && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            People who visited on {selectedDate}
          </h2>
          <ul className="list-disc pl-5">
            {names.map((name, index) => (
              <li key={index} className="mb-2">{name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Excel Data Section */}
      {excelData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Images from Excel</h2>
          <ul className="list-disc pl-5">
            {excelData.map((item, index) => (
              <li key={index} className="mb-4 flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-full mr-4"
                  onError={(e) => {
                    e.target.src = 'fallback-image-url.jpg'; // fallback image
                  }}
                />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;
