import React from 'react';
import { motion } from 'framer-motion';

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <motion.div
        className='bg-white p-6 rounded-lg shadow-lg'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex items-center'>
          <svg
            className='animate-spin h-6 w-6 text-green-500 mr-3'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          <p className='text-lg font-semibold text-gray-700'>
            Processing your payment...<br />
            <span className='text-sm text-gray-500'>
              Please do not refresh or navigate away.
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingModal;
