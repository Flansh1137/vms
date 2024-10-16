import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const DataAnalysis = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState({});
  const [unknownData, setUnknownData] = useState({});
  const [images, setImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isKnownPeople, setIsKnownPeople] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    setStartDate(oneWeekAgo);
    setEndDate(today);

    fetchData(oneWeekAgo, today);
    fetchUnknownData(oneWeekAgo, today);
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

  const handleDateChange = (item) => {
    setStartDate(item.selection.startDate);
    setEndDate(item.selection.endDate);
    fetchData(item.selection.startDate, item.selection.endDate);
    fetchUnknownData(item.selection.startDate, item.selection.endDate);
  };

  const handleViewPeople = async (date, isKnown) => {
    try {
      const url = isKnown
        ? 'http://localhost:5000/known-images-by-date'
        : 'http://localhost:5000/unknown-images-by-date';

      const response = await axios.get(url, {
        params: {
          date: date,
        },
      });

      if (response.data.length === 0) {
        setImages([]); // Clear images if no images found
        setErrorMessage(`No images found for ${format(new Date(date), 'MMM d, yyyy')}.`); // Set error message with date
      } else {
        setImages(response.data);
        setErrorMessage(''); // Clear error message
      }

      setSelectedDate(date);
      setIsKnownPeople(isKnown);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]); // Clear images on error
      setErrorMessage(`No images found for ${format(new Date(date), 'MMM d, yyyy')}.`); // Set error message with date
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

      <div className="flex md:flex-row-reverse">
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

      <div className="lg:flex lg:space-x-8 mt-6">
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-2">Known Data Summary</h2>
          <ul className="list-disc pl-5">
            {Object.entries(data).map(([date, count]) => (
              <li key={date} className="mb-2">
                <span className="font-semibold">{date}</span>: {count} visits
                <button
                  onClick={() => handleViewPeople(date, true)}
                  className="ml-4 text-blue-500 hover:underline"
                >
                  View Known People
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
                <button
                  onClick={() => handleViewPeople(date, false)}
                  className="ml-4 text-blue-500 hover:underline"
                >
                  View Unknown People
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {errorMessage && ( // Display error message if exists
        <div className="mt-6 text-red-500 text-center">{errorMessage}</div>
      )}

      {images.length > 0 && selectedDate && !errorMessage && ( // Only show images if there are images and no error
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            {isKnownPeople
              ? `Known People Images from ${selectedDate}`
              : `Unknown People Images from ${selectedDate}`}
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-0">
            {images.map((img, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={`data:image/jpeg;base64,${img.image}`}
                  alt={`Person ${index}`}
                  className="w-48 h-56 object-cover mb-2"
                />
                <span className="text-center">{img.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;
