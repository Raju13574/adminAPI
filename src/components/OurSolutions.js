import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaCode, FaRocket, FaShieldAlt, FaUsers, FaCloud, FaCogs } from 'react-icons/fa';

const RotatingRing = ({ solutions, activeSolution, setActiveSolution }) => {
  return (
    <motion.div 
      className="w-72 h-72 rounded-full border-4 border-[#A52259] relative"
      animate={{ rotate: -activeSolution * 60 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
    >
      {solutions.map((solution, index) => {
        const angle = (index / solutions.length) * 360;
        const x = Math.cos((angle * Math.PI) / 180) * 130;
        const y = Math.sin((angle * Math.PI) / 180) * 130;
        return (
          <motion.div
            key={index}
            className={`absolute w-14 h-14 rounded-full flex items-center justify-center cursor-pointer
                        ${activeSolution === index ? 'bg-[#A52259] text-white' : 'bg-white text-[#A52259]'}`}
            style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)` }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setActiveSolution(index)}
            animate={{ rotate: activeSolution * 60 }}
          >
            <solution.icon className="w-6 h-6" />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const ExpandingCircle = ({ solution, isActive }) => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: isActive ? 1 : 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
    >
      <motion.div 
        className="w-48 h-48 bg-white rounded-full shadow-lg flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: isActive ? 1 : 0, rotateY: isActive ? 0 : -90 }}
        transition={{ duration: 0.5, delay: isActive ? 0.2 : 0 }}
      >
        <h3 className="text-lg font-bold text-[#181F32] mb-2 text-center">{solution.title}</h3>
        <p className="text-xs text-gray-600 text-center">{solution.description}</p>
      </motion.div>
    </motion.div>
  );
};

const OurSolutions = () => {
  const [activeSolution, setActiveSolution] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const solutions = [
    {
      title: "Code Compilation",
      description: "Compile and run code in multiple languages securely and efficiently.",
      icon: FaCode
    },
    {
      title: "Performance Boost",
      description: "Optimize code execution with advanced compilation techniques.",
      icon: FaRocket
    },
    {
      title: "Security Protocols",
      description: "Protect your code with robust sandboxing and security measures.",
      icon: FaShieldAlt
    },
    {
      title: "Team Collaboration",
      description: "Enhance productivity with real-time code sharing and collaboration tools.",
      icon: FaUsers
    },
    {
      title: "Cloud Integration",
      description: "Seamlessly deploy and scale your compiled code in the cloud.",
      icon: FaCloud
    },
    {
      title: "API Customization",
      description: "Tailor our compiler API to fit your specific development needs.",
      icon: FaCogs
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSolution((prev) => (prev + 1) % solutions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [solutions.length]);

  return (
    <div className="bg-gradient-to-r from-[#A5F3FC] to-[#FFE4E6] py-12 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <div className="mb-4">
          <motion.h1 
            className="text-4xl font-bold text-center mb-4 text-gray-800"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our Solutions
          </motion.h1>
        </div>
        <div className="mb-8">
          <motion.p 
            className="text-xl text-center text-gray-600 max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Elevate your development with our Compiler API, offering seamless multi-language code compilation. 
            Enjoy optimal performance, robust security, and real-time collaboration tools. 
          </motion.p>
        </div>
        <motion.div 
          className="relative w-72 h-72 mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isInView ? 1 : 0.8, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <RotatingRing 
            solutions={solutions} 
            activeSolution={activeSolution} 
            setActiveSolution={setActiveSolution} 
          />
          <AnimatePresence>
            {solutions.map((solution, index) => (
              <ExpandingCircle 
                key={index} 
                solution={solution} 
                isActive={index === activeSolution} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default OurSolutions;
