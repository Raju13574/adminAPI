import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AnalyticsPage from '../components/AnalyticsPage'; // Import the AnalyticsPage component
import AdvancedMarketing from '../components/AdvancedMarketing';
import OurSolutions from '../components/OurSolutions'; // Import the new component // Import the new component
import Pricing from './Pricing'; // Import the Pricing component
import AboutUs from './AboutUs';
import FAQs from './FAQs';
import homepagePng from '../assets/homepage.png'; // Import the GIF
import TurnSection from '../components/TurnSection';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStartForFree = () => {
    navigate('/signup');
  };

  return (
    <div id="home" className="bg-gradient-to-r from-[#A5F3FC] to-[#FFE4E6] min-h-screen">
      <div className="container mx-auto px-4 pt-2 pb-8 text-[#181F32]" style={{width:'92%', marginLeft:'4%'}}>
        <div className="flex flex-col md:flex-row items-center">
          <div className={`md:w-1/2 mb-4 md:mb-0 text-content ${isLoaded ? 'animate-content' : ''}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-[#181F32] animate-item">Find out how our services can elevate your business potential</h1>
            <p className="mb-4 text-base md:text-lg text-[#4B5563] animate-item">
              Unlock new opportunities and achieve greater success with our expert services.
            </p>
            <button 
              onClick={handleStartForFree}
              className="bg-[#A52259] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#D3BC48] hover:text-[#181F32] transition duration-300 inline-flex items-center group animate-item"
            >
              <span className="mr-2">Start for Free</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
          <div className={`md:w-1/2 image-content ${isLoaded ? 'animate-image' : ''}`} style={{border:'none'}}>
            <img 
              src={homepagePng} 
              alt="Our Team" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      <TurnSection>
        <Features />
      </TurnSection>
      
      <TurnSection>
        <HowItWorks />
      </TurnSection>
      
      <TurnSection>
        <AdvancedMarketing />
      </TurnSection>
      
      <TurnSection>
        <AnalyticsPage />
      </TurnSection>

      <OurSolutions />

      <div id="pricing">
        <Pricing />
      </div>

      <div id="about">
        <AboutUs />
      </div>

      <div id="faqs">
        <FAQs />
      </div>
    </div>
  );
};

export default Home;
