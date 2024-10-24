import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TurnSection = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const variants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { 
      rotateY: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      className={`w-full ${className}`}
    >
      <div className="w-[96%] mx-auto" style={{width:'92%', marginLeft:'4%'}}>
        {children}
      </div>
    </motion.section>
  );
};

export default TurnSection;
