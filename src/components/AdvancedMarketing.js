import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaRocket, FaShieldAlt, FaUsers, FaChartLine } from 'react-icons/fa';

const FeatureItem = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`w-1/3 ${index % 2 === 0 ? 'pr-8' : 'pl-8'} flex justify-center`}>
        {feature.icon}
      </div>
      <div className="w-2/3">
        <h3 className="text-2xl font-semibold mb-2 text-[#181F32]">{feature.title}</h3>
        <p className="text-gray-600 text-lg">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const AdvancedMarketing = () => {
  const features = [
    {
      title: "Accelerate Development",
      description: "Boost productivity with our lightning-fast compiler, cutting build times by up to 50%.",
      icon: <FaRocket className="text-4xl text-[#A52259]" />,
    },
    {
      title: "Enhance Code Quality",
      description: "Leverage advanced static analysis to identify and fix issues before they reach production.",
      icon: <FaShieldAlt className="text-4xl text-[#A52259]" />,
    },
    {
      title: "Streamline Collaboration",
      description: "Enable seamless teamwork with real-time code sharing and integrated version control.",
      icon: <FaUsers className="text-4xl text-[#A52259]" />,
    },
    {
      title: "Optimize Resource Usage",
      description: "Reduce infrastructure costs with our efficient compiler that minimizes CPU and memory usage.",
      icon: <FaChartLine className="text-4xl text-[#A52259]" />,
    },
  ];

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: false, amount: 0.5 });

  return (
    <div className="py-16 bg-gradient-to-br from-[#A5F3FC] to-[#FFE4E6]">
      <div className="container mx-auto px-4">
        <motion.h2 
          ref={headerRef}
          initial={{ opacity: 0, y: -50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold mb-12 text-center text-[#181F32]"
        >
          Empower Your Business with Advanced Compilation
        </motion.h2>
        
        <div className="space-y-16">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} index={index} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-[#181F32] font-semibold">
            Experience the power of NeXterChat Compiler API and take your development to the next level.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedMarketing;
