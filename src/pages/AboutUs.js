import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Code, Shield, Users, Target, Briefcase } from 'react-feather';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
    whileHover={{ y: -5 }}
  >
    <div className="text-teal-500 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-gray-300 pb-2 inline-block">
    {children}
  </h2>
);

const AboutUs = () => {
  const features = [
    { icon: <Target size={32} />, title: "Our Vision", description: "Empowering developers and businesses with advanced compilation tools that accelerate development and drive innovation." },
    { icon: <Users size={32} />, title: "Our Expertise", description: "Years of experience in compiler design, cloud computing, and API development, bringing knowledge to every aspect of NeXterChat API." },
    { icon: <Briefcase size={32} />, title: "Our Commitment", description: "Dedicated to revolutionizing how developers work with code, delivering cutting-edge API solutions that enhance workflows." },
    { icon: <Zap size={32} />, title: "Advanced Technology", description: "Continuously advancing compiler technology to stay at the forefront of software development." },
    { icon: <Code size={32} />, title: "Fast Execution", description: "Delivering lightning-fast code execution to boost productivity and efficiency." },
    { icon: <Shield size={32} />, title: "Data Protection", description: "Prioritizing the protection of code and data to ensure security and privacy." },
  ];

  return (
    <div className="bg-gradient-to-br from-teal-100 to-blue-200 min-h-screen py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            About NeXterChat API
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Transforming the landscape of software development through innovative compilation tools and cutting-edge API solutions.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-16"
        >
          <SectionTitle>Our Mission</SectionTitle>
          <p className="text-lg text-gray-700 mb-6">
            At NeXterChat API, we're on a mission to revolutionize software development by providing advanced compilation tools and API solutions that empower developers and businesses to create innovative, efficient, and secure applications.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <SectionTitle>Our Values and Strengths</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
