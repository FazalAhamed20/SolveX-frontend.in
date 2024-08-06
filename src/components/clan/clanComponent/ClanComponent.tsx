import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaTrophy,
  FaPlus,
  FaTimes,
  FaSearch,
  FaFilter,
  FaTable,
  FaTh,
} from 'react-icons/fa';
import CreateClanModal from '../../../utils/modal/CreateClanModal';
import { createClan, fetchAllClan } from '../../../redux/actions/ClanAction';
import { AppDispatch } from '../../../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClanGridView from './ClanGridView';
import ClanTableView from './ClanTableView';

interface ClanMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface Clan {
  _id: any;
  id: number;
  name: string;
  description: string;
  members: ClanMember[];
  trophies: number;
  userId: string;
  isBlocked: boolean;
  leaderId: string;
}

const ClanComponent: React.FC = () => {
  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);
  const [showClanModal, setShowClanModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const [clans, setClans] = useState<Clan[]>([]);
  const [filteredClans, setFilteredClans] = useState<Clan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyClans, setShowMyClans] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllClans = async () => {
      const response = await dispatch(fetchAllClan());
      console.log('Fetched clans:', response);
      setClans(response.payload as unknown as Clan[]);
      setFilteredClans(response.payload as unknown as Clan[]);
    };
    fetchAllClans();
  }, [dispatch]);

  useEffect(() => {
    const filtered = clans.filter(
      clan =>
        clan.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!showMyClans || clan.members.some(member => member.id === user._id)),
    );
    setFilteredClans(filtered);
  }, [searchTerm, showMyClans, clans, user._id]);

  const handleClanClick = (clan: Clan) => {
    setSelectedClan(clan);
    setShowClanModal(true);
  };

  const handleCreateClan = async (name: string, description: string) => {
    const newClan: Clan = {
      id: clans.length + 1,
      name,
      description,
      members: [],
      trophies: 0,
      userId: user._id,
      _id: undefined,
      isBlocked: false,
      leaderId: user._id,
    };
    console.log('Creating new clan:', newClan);

    const response = await dispatch(createClan(newClan));
    console.log('Clan created:', response);
    if (response.payload) {
      setClans(prevClans => [
        ...prevClans,
        response.payload as unknown as Clan,
      ]);
    }
    console.log('clans', clans);
    setShowCreateModal(false);
  };

  const isUserMember = (clan: Clan): boolean => {
    return clan.members.some(member => member.id === user._id);
  };
  const handleJoinClan = async () => {
    console.log(`User ${user.name} is joining clan: ${selectedClan?.name}`);

    setShowClanModal(false);
  };

  const handleEnterClan = () => {
    console.log('selected clan', selectedClan);
    if (selectedClan) {
      navigate(`/clans/${selectedClan.name}/clan/${selectedClan._id}`);
    }
    setShowClanModal(false);
  };

  return (
    <div className='container mx-auto p-4 sm:p-8 bg-gray-100 min-h-screen'>
      <div className='mb-8'>
        <h1 className='text-3xl sm:text-4xl font-bold text-center text-green-600 mb-4'>
          Coding Clans
        </h1>
        <p className='text-center text-gray-600'>
          Join forces with fellow coders and conquer challenges together!
        </p>
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0'>
        <div className='relative w-full sm:w-1/3'>
          <input
            type='text'
            placeholder='Search clans...'
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FaSearch className='absolute left-3 top-3 text-gray-400' />
        </div>
        <div className='flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4'>
          <button
            onClick={() => setShowMyClans(!showMyClans)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-300 ${
              showMyClans
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 border border-green-600'
            }`}
          >
            <FaFilter className='mr-2' />
            {showMyClans ? 'All Clans' : 'My Clans'}
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className='flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300'
          >
            {viewMode === 'grid' ? (
              <FaTable className='mr-2' />
            ) : (
              <FaTh className='mr-2' />
            )}
            {viewMode === 'grid' ? 'Table' : 'Grid'}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className='flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300'
          >
            <FaPlus className='mr-2' /> Create
          </button>
        </div>
      </div>

      {filteredClans.length === 0 ? (
        <div className='text-center py-12'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'
          >
            <path
              vectorEffect='non-scaling-stroke'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No clans found
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Get started by creating a new clan.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <ClanGridView
          clans={filteredClans}
          onClanClick={handleClanClick}
          isUserMember={isUserMember}
        />
      ) : (
        <ClanTableView
          clans={filteredClans}
          onClanClick={handleClanClick}
          isUserMember={isUserMember}
        />
      )}

      <AnimatePresence>
        {showClanModal && selectedClan && (
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
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
                <h2 className='text-2xl font-bold text-green-600'>
                  {selectedClan.name}
                </h2>
                <button
                  onClick={() => setShowClanModal(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <FaTimes />
                </button>
              </div>
              <p className='text-gray-600 mb-4'>{selectedClan.description}</p>
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2 text-gray-800'>
                  Members
                </h3>
                <ul className='space-y-2'>
                  {selectedClan.members.map(member => (
                    <li key={member.id} className='flex items-center'>
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className='w-10 h-10 rounded-full mr-3'
                      />
                      <div>
                        <p className='font-medium text-gray-800'>
                          {member.name}
                        </p>
                        <p className='text-sm text-gray-600'>{member.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <FaTrophy className='text-yellow-500 mr-2' />
                  <span className='text-gray-600'>
                    {selectedClan.trophies} trophies
                  </span>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isUserMember(selectedClan)
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-600 border border-green-600'
                  }`}
                  onClick={
                    isUserMember(selectedClan)
                      ? handleEnterClan
                      : handleJoinClan
                  }
                >
                  {isUserMember(selectedClan) ? 'Enter Clan' : 'Join Clan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateClanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateClan={handleCreateClan}
      />
    </div>
  );
};

export default ClanComponent;
