import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AdvancedMarketing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const features = [
    {
      title: "Accelerate Development",
      description: "Boost productivity with our lightning-fast compiler, cutting build times by up to 50%.",
      icon: "⚡",
    },
    {
      title: "Enhance Code Quality",
      description: "Leverage advanced static analysis to identify and fix issues before they reach production.",
      icon: "🛡️",
    },
    {
      title: "Streamline Collaboration",
      description: "Enable seamless teamwork with real-time code sharing and integrated version control.",
      icon: "🤝",
    },
    {
      title: "Optimize Resource Usage",
      description: "Reduce infrastructure costs with our efficient compiler that minimizes CPU and memory usage.",
      icon: "💰",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      {/* Background pattern overlay */}
      <div 
        className="absolute inset-0 bg-repeat opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-5xl font-bold mb-4 text-blue-400">
              Empower Your Business with Advanced Compilation
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
              NeXterChat Compiler API delivers enterprise-grade performance and features to drive your business forward.
            </motion.p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants} className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg transition-all duration-300 ${
                    index === activeFeature ? 'bg-blue-600 shadow-lg scale-105' : 'bg-gray-800 bg-opacity-50'
                  }`}
                >
                  <h3 className="text-2xl font-semibold mb-2 flex items-center">
                    <span className="mr-2 text-3xl">{feature.icon}</span>
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="rounded-lg shadow-2xl"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="NeXterChat Compiler API Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link
              to="/pricing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105"
            >
              Explore Enterprise Solutions
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMarketing;
