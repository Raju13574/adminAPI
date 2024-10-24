import React, { useEffect, useRef, useState } from 'react';

const FlipSection = ({ children }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const currentRef = sectionRef.current; // Store the current value
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFlipped(true);
        }
      },
      { threshold: 0.5 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`flip-section ${isFlipped ? 'flipped' : ''}`}
    >
      {children}
    </div>
  );
};

export default FlipSection;