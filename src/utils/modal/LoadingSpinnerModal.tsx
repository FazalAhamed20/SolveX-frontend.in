import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className='flex justify-center items-center min-h-screen'>
    <div
      className='w-16 h-16 border-4 border-t-4 border-green-600 rounded-full animate-spin'
      style={{ borderTopColor: 'transparent' }}
    ></div>
  </div>
);

export default LoadingSpinner;
