import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../pages/Home';
import Dashboard from './Usercontroll';
// ... import other components

const AppContent = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">No Internet Connection</h1>
        <p className="mb-4">Please check your network connection and try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDashboard ? 'bg-gray-100' : 'bg-[#2c183f] text-white'} overflow-x-hidden`}>
      {!isDashboard && <Navbar />}
      {!isDashboard && <div className="h-px bg-pink-500 w-full"></div>}
      <div className={isDashboard ? '' : 'smooth-scroll'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other routes */}
        </Routes>
      </div>
    </div>
  );
};

export default AppContent;