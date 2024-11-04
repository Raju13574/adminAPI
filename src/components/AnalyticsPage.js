import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState({});
  const [isRotating, setIsRotating] = useState(true);

  const chartTypes = ['Line', 'Bar', 'Doughnut', 'Radar', 'PolarArea'];
  const titles = [
    "Code Insights Hub",
    "Compiler Performance Explorer",
    "Language Efficiency Tracker",
    "Programming Language Pulse",
    "Compiler Metrics Command Center"
  ];
  const chartDescriptions = [
    "Line chart showing performance trends over time for different languages.",
    "Bar chart comparing compilation times across languages.",
    "Doughnut chart illustrating the distribution of API usage by language.",
    "Radar chart displaying multiple performance metrics for each language.",
    "Polar area chart representing error rates for different languages."
  ];
  const contentDetails = [
    "Analyze trends in compilation speed, error rates, and memory usage across different programming languages over time.",
    "Compare the efficiency of various compilers by examining their performance metrics side by side.",
    "Understand the popularity and usage patterns of different programming languages in your development ecosystem.",
    "Get a comprehensive view of how each language performs across multiple dimensions such as speed, memory efficiency, and error handling.",
    "Visualize and compare error rates among different programming languages to identify areas for optimization."
  ];

  useEffect(() => {
    const generateData = () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    
    const updateData = () => {
      const newData = {
        labels: ['Python', 'JavaScript', 'Java', 'C++', 'Ruby'],
        datasets: [{
          label: 'Performance Metrics',
          data: generateData(),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      };
      setChartData(newData);
    };

    updateData();
    let interval;
    if (isRotating) {
      interval = setInterval(() => {
        updateData();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % chartTypes.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isRotating]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      title: { 
        display: true, 
        text: `Compiler ${chartTypes[currentIndex]} Analysis`,
        font: { size: 18, weight: 'bold' },
        color: '#333'
      },
    },
    scales: chartTypes[currentIndex] !== 'Doughnut' && chartTypes[currentIndex] !== 'PolarArea' ? {
      y: { beginAtZero: true, ticks: { font: { size: 12 } } },
      x: { ticks: { font: { size: 12 } } }
    } : undefined,
    animation: { duration: 500, easing: 'easeInOutQuart' }
  };

  const renderChart = () => {
    if (!chartData.datasets) return null;
    switch(chartTypes[currentIndex]) {
      case 'Line': return <Line data={chartData} options={chartOptions} />;
      case 'Bar': return <Bar data={chartData} options={chartOptions} />;
      case 'Doughnut': return <Doughnut data={chartData} options={chartOptions} />;
      case 'Radar': return <Radar data={chartData} options={chartOptions} />;
      case 'PolarArea': return <PolarArea data={chartData} options={chartOptions} />;
      default: return null;
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + chartTypes.length) % chartTypes.length);
    setIsRotating(false);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % chartTypes.length);
    setIsRotating(false);
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-pink-100 p-4">
      <AnimatePresence mode="wait">
        <motion.h1 
          key={currentIndex}
          className="text-3xl md:text-4xl font-bold text-center text-indigo-800 mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
        >
          {titles[currentIndex]}
        </motion.h1>
      </AnimatePresence>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <motion.div 
          className="bg-gradient-to-r from-cyan-50 to-pink-50 rounded-xl shadow-lg p-4 lg:w-2/3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="h-[60vh] w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderChart()}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center mt-2 space-x-4">
            <button onClick={handlePrevious} className="p-2 bg-indigo-600 text-white rounded-full"><FaArrowLeft /></button>
            <button onClick={toggleRotation} className="p-2 bg-indigo-600 text-white rounded-full">
              {isRotating ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleNext} className="p-2 bg-indigo-600 text-white rounded-full"><FaArrowRight /></button>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-cyan-50 to-pink-50 rounded-xl shadow-lg p-4 lg:w-1/3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-indigo-700">Compiler API Insights</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-2 text-gray-700 text-sm md:text-base">{chartDescriptions[currentIndex]}</p>
              <p className="text-gray-700 text-sm md:text-base mb-2">{contentDetails[currentIndex]}</p>
            </motion.div>
          </AnimatePresence>
          <ul className="list-disc list-inside text-gray-700 text-sm md:text-base">
            <li>Compilation Time</li>
            <li>Error Rate</li>
            <li>Memory Usage</li>
            <li>API Calls</li>
            <li>Optimization Level</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
