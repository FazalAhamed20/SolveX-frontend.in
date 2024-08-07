import React from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
      overlayClassName='fixed inset-0 bg-black bg-opacity-50'
      ariaHideApp={false}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-lg shadow-lg p-6'
      >
        <h2 className='text-2xl font-bold mb-4'>Confirm Action</h2>
        <p className='mb-6'>{message}</p>
        <div className='flex justify-end space-x-4'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg'
            onClick={onRequestClose}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-4 py-2 bg-red-600 text-white rounded-lg'
            onClick={onConfirm}
          >
            Confirm
          </motion.button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ConfirmModal;
