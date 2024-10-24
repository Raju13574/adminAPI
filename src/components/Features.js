import React from 'react';
import { motion } from 'framer-motion';

const FeatureItem = ({ icon, title, description }) => (
  <motion.div 
    className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <div className="bg-[#FFF0E5] text-[#A52259] text-3xl p-3 rounded-full mr-4 flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-[#A52259] text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

const Features = () => {
  const features = [
    { icon: '</>', title: 'Clean Code', description: 'Optimized, readable code output' },
    { icon: '💻', title: 'Multi-Language', description: 'Support for various programming languages' },
    { icon: '🕒', title: '24/7 Availability', description: 'Round-the-clock service for your needs' },
    { icon: '💖', title: 'Cost-Effective', description: 'High-quality compilation at competitive prices' },
    { icon: '⚡', title: 'Fast Compilation', description: 'Quick response times with optimized algorithms' },
    { icon: '☁️', title: 'Cloud-Based', description: 'Compile directly in the cloud, no local setup' },
  ];

  return (
    <section className="bg-gradient-to-r from-[#FFF0E5] to-[#E6F7FF] py-16 w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-4"
      >
        <h2 className="text-4xl font-bold text-[#A52259] mb-4">
          Powerful Features
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Explore the powerful features that make our Compiler API the choice of industry leaders
        </p>
      </motion.div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
