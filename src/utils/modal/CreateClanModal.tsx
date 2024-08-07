// CreateClanModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface CreateClanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClan: (name: string, description: string) => void;
}

const CreateClanModal: React.FC<CreateClanModalProps> = ({
  isOpen,
  onClose,
  onCreateClan,
}) => {
  const [newClanName, setNewClanName] = useState('');
  const [newClanDescription, setNewClanDescription] = useState('');

  const handleCreateClan = () => {
    if (newClanName && newClanDescription) {
      onCreateClan(newClanName, newClanDescription);
      setNewClanName('');
      setNewClanDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className='bg-white rounded-lg p-6 w-full max-w-md'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-green-600'>Create New Clan</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <FaTimes />
          </button>
        </div>
        <input
          type='text'
          placeholder='Clan Name'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          value={newClanName}
          onChange={e => setNewClanName(e.target.value)}
        />
        <textarea
          placeholder='Clan Description'
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          rows={3}
          value={newClanDescription}
          onChange={e => setNewClanDescription(e.target.value)}
        ></textarea>
        <button
          onClick={handleCreateClan}
          className='w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300'
        >
          Create Clan
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CreateClanModal;
