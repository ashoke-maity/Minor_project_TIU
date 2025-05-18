import React from 'react';
import { MoonLoader } from 'react-spinners';

const LoadingOverlay = ({ loading, message = 'Loading...' }) => {
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-sm mx-4">
        <MoonLoader 
          color="#256FF1" 
          loading={loading} 
          size={50} 
          speedMultiplier={0.8}
        />
        <p className="mt-4 text-gray-700 font-medium text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay; 