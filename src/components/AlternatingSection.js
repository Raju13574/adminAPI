import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


const AlternatingSection = ({ title, content, isReversed }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const images = [
    "https://via.placeholder.com/500x300?text=Secure+Compilation",
    "https://via.placeholder.com/500x300?text=Scalable+Solutions",
    
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-[#A5F3FC] to-[#FFE4E6] py-16 text-[#181F32]">
      <div className="container mx-auto w-[92%] ml-[4%]">
        <motion.div
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={containerVariants}
          className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
        >
          <motion.div variants={imageVariants} className="md:w-1/2 relative mb-8 md:mb-0 md:mr-8">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={images[activeSlide]} 
                alt={["Secure Compilation", "Scalable Solutions", "Advanced Security"][activeSlide]} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${index === activeSlide ? 'bg-[#A52259]' : 'bg-gray-400'}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </motion.div>
          <motion.div variants={textVariants} className="md:w-1/2 md:pl-8">
            <h2 className="text-4xl font-bold mb-4">{title}</h2>
            <p className="mb-6 text-gray-700">{content}</p>
            <Link to="/ecosystem" className="text-[#A52259] hover:text-[#D3BC48] transition duration-300 inline-flex items-center">
              Explore Our Ecosystem 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlternatingSection;
