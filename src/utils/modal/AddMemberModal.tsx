import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch } from '../../redux/Store';
import { useDispatch } from 'react-redux';
import { fetchAllUsers } from '../../redux/actions/ClanAction';
import { FaSearch, FaUserPlus, FaTimes, FaCheck, FaUser } from 'react-icons/fa';

interface User {
  _id: any;
  username: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (username: string, userId: number) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAddMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const dispatch: AppDispatch = useDispatch();

  const fetchUserSuggestions = async (query: string) => {
    const response = await dispatch(fetchAllUsers());
    if (response.payload && Array.isArray(response.payload)) {
      const suggestions = response.payload
        .filter((user: User) => user.username.toLowerCase().includes(query.toLowerCase()));
      setUserSuggestions(suggestions);
    } else {
      console.error('Failed to fetch user suggestions:', response);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchUserSuggestions(searchTerm);
    } else {
      setUserSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-700 flex items-center">
                <FaUserPlus className="mr-2" /> Add Member
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <ul className="mb-4 max-h-60 overflow-y-auto bg-gray-50 rounded">
              {userSuggestions.map((user) => (
                <motion.li
                  key={user._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`cursor-pointer p-3 hover:bg-green-100 flex items-center justify-between ${
                    selectedUser?._id === user._id ? 'bg-green-200' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-green-600" />
                    <span>{user.username}</span>
                  </div>
                  {selectedUser?._id === user._id && (
                    <FaCheck className="text-green-600" />
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center"
                onClick={onClose}
              >
                <FaTimes className="mr-2" /> Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (selectedUser) {
                    onAddMember(selectedUser.username, selectedUser._id);
                    onClose();
                  }
                }}
                disabled={!selectedUser}
              >
                <FaUserPlus className="mr-2" /> Add
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMemberModal;