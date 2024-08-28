import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaTrophy } from 'react-icons/fa';

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

interface ClanGridViewProps {
  clans: Clan[];
  onClanClick: (clan: Clan) => void;
  isUserMember: (clan: Clan) => boolean;
  pendingRequests: string[];
  userId: string;
  loading:boolean
  isAccepted:boolean
  isReject:boolean
 
}

const ClanGridView: React.FC<ClanGridViewProps> = ({
  clans,
  onClanClick,
  isUserMember,
  pendingRequests,
  loading,
  isAccepted,
  isReject
 
}) => {
  console.log(loading)
  return (
    loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    ) : (
      <motion.div
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {clans?.map(clan => (
        <motion.div
          key={clan.id}
          className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300'
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onClanClick(clan)}
        >
          <div className='p-6'>
            <h2 className='text-2xl font-semibold mb-2 text-green-600'>
              {clan.name}
            </h2>
            <p className='text-gray-600 mb-4 h-12 overflow-hidden'>
              {clan.description}
            </p>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <FaUsers className='text-green-500 mr-2' />
                <span className='text-gray-600'>{clan.members.length}</span>
              </div>
              <div className='flex items-center'>
                <FaTrophy className='text-yellow-500 mr-2' />
                <span className='text-gray-600'>{clan.trophies}</span>
              </div>
            </div>
          </div>
          <div className='bg-green-50 px-6 py-3'>
            {clan.isBlocked ? (
              <button
                className='w-full py-2 rounded-lg bg-red-500 text-white cursor-not-allowed'
                disabled
              >
                Suspended
              </button>
            ) : (
              <button
              className={`w-full py-2 rounded-lg transition-colors duration-300 ${
                isUserMember(clan)
                  ? 'bg-green-600 text-white'
                  : pendingRequests.includes(clan._id) && !isReject
                    ? isAccepted
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-500 text-white'
                    : 'bg-white text-green-600 border border-green-600'
              }`}
            >
              {isUserMember(clan)
                ? 'Enter'
                : pendingRequests.includes(clan._id)
                  ? isAccepted
                    ? 'Enter'
                    : isReject
                      ? 'Join'
                      : 'Pending'
                  : 'Join'}
            </button>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
);
};

export default ClanGridView;
