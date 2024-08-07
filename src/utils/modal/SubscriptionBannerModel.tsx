import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-800'>
                Upgrade to Premium
              </h2>
              <button
                onClick={handleClose}
                className='text-gray-500 hover:text-gray-700'
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className='text-center mb-6'>
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  repeatType: 'reverse',
                }}
                className='inline-block'
              >
                <FaCrown size={64} className='text-yellow-400 mb-2' />
              </motion.div>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                Unlock Premium Features
              </h3>
              <p className='text-gray-600'>
                Create clans and solve premium problems!
              </p>
            </div>
            <div className='space-y-4 mb-6'>
              <div className='flex items-center'>
                <FaCheckCircle className='text-green-500 mr-2' />
                <span className='text-gray-700'>Create and manage clans</span>
              </div>
              <div className='flex items-center'>
                <FaCheckCircle className='text-green-500 mr-2' />
                <span className='text-gray-700'>
                  Access premium problem sets
                </span>
              </div>
              <div className='flex items-center'>
                <FaCheckCircle className='text-green-500 mr-2' />
                <span className='text-gray-700'>
                  Exclusive community features
                </span>
              </div>
            </div>
            <div className='flex justify-center space-x-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-blue-600 transition duration-300'
                onClick={() => navigate('/subscription')}
              >
                Upgrade Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className='bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-300 transition duration-300'
              >
                Maybe Later
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
