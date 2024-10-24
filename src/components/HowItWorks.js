import React from 'react';
import { FaCode, FaCloudUploadAlt, FaCogs, FaCheckCircle } from 'react-icons/fa';

const Step = ({ icon, title, description, index }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A52259] to-[#D3BC48] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
    <div className="text-5xl mb-6 text-[#A52259] group-hover:animate-bounce">{icon}</div>
    <h3 className="text-2xl font-semibold mb-3 text-[#181F32]">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <div className="absolute bottom-0 right-0 w-12 h-12 bg-[#A52259] text-white rounded-tl-full flex items-center justify-center text-xl font-bold">
      {index + 1}
    </div>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaCode />,
      title: "Write Your Code",
      description: "Create your code in any supported programming language."
    },
    {
      icon: <FaCloudUploadAlt />,
      title: "Send API Request",
      description: "Use our API to send your code for compilation and execution."
    },
    {
      icon: <FaCogs />,
      title: "Compile and Run",
      description: "We securely compile and execute your code in our sandboxed environment."
    },
    {
      icon: <FaCheckCircle />,
      title: "Receive Results",
      description: "Get the output or any error messages back through the API response."
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-r from-[#FFE4E6] to-[#A5F3FC]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-[#181F32]">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Step key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
