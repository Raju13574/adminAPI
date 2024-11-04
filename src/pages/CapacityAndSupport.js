import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaServer, FaClock, FaHeadset } from 'react-icons/fa';

const CapacityAndSupport = () => {
  const metrics = [
    { icon: <FaUsers />, title: "Active Users", value: "100,000+", description: "Concurrent users supported" },
    { icon: <FaServer />, title: "API Requests", value: "1M+", description: "Requests handled per day" },
    { icon: <FaClock />, title: "Uptime", value: "99.99%", description: "Service reliability" },
    { icon: <FaHeadset />, title: "Support Response", value: "< 2 hours", description: "Average response time" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <motion.h1 
        className="text-4xl font-bold text-center text-indigo-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Our Capacity and Support
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div 
            key={metric.title}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-4xl text-indigo-600 mb-4">
              {metric.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{metric.title}</h2>
            <p className="text-3xl font-bold text-indigo-600 mb-2">{metric.value}</p>
            <p className="text-gray-600">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-12 bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Our Commitment to You</h2>
        <p className="text-gray-700 mb-4">
          At NeXterChat API, we're dedicated to providing a robust, scalable, and reliable compiler service. 
          Our infrastructure is designed to handle high volumes of concurrent users and API requests, 
          ensuring that your development process remains smooth and uninterrupted.
        </p>
        <p className="text-gray-700 mb-4">
          We understand the critical nature of compiler services in the development workflow. That's why we maintain 
          a high uptime, ensuring that our services are available when you need them most.
        </p>
        <p className="text-gray-700">
          Our support team is always ready to assist you. With an average response time of less than 2 hours, 
          we're committed to resolving your issues and answering your questions promptly.
        </p>
      </motion.div>
    </div>
  );
};

export default CapacityAndSupport;
