import React from 'react';
import LoadingDots from './LoadingDots';

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-purple-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <LoadingDots />
        <p className="mt-4 text-center text-purple-900 font-semibold">Authenticating...</p>
      </div>
    </div>
  );
};

export default FullPageLoader;