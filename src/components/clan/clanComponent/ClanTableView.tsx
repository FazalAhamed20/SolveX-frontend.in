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

interface ClanTableViewProps {
  clans: Clan[];
  onClanClick: (clan: Clan) => void;
  isUserMember: (clan: Clan) => boolean;
  pendingRequests: string[];
  userId: string;
  loading: boolean;
  isAccepted: boolean;
  isReject: boolean;
}

const ClanTableView: React.FC<ClanTableViewProps> = ({
  clans,
  onClanClick,
  isUserMember,
  pendingRequests,
  loading,
  isAccepted,
  isReject
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className='overflow-x-auto'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='bg-green-600 text-white'>
            <th className='py-3 px-4 text-left'>Name</th>
            <th className='py-3 px-4 text-left hidden md:table-cell'>Description</th>
            <th className='py-3 px-4 text-center'>Members</th>
            <th className='py-3 px-4 text-center'>Trophies</th>
            <th className='py-3 px-4 text-center'>Action</th>
          </tr>
        </thead>
        <motion.tbody>
          {clans.map((clan, index) => (
            <motion.tr 
              key={clan.id} 
              className='border-b hover:bg-green-50 cursor-pointer'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onClanClick(clan)}
            >
              <td className='py-3 px-4 font-semibold text-green-600'>{clan.name}</td>
              <td className='py-3 px-4 hidden md:table-cell'>{clan.description}</td>
              <td className='py-3 px-4 text-center'>
                <div className='flex items-center justify-center'>
                  <FaUsers className='text-green-500 mr-2' />
                  <span>{clan.members.length}</span>
                </div>
              </td>
              <td className='py-3 px-4 text-center'>
                <div className='flex items-center justify-center'>
                  <FaTrophy className='text-yellow-500 mr-2' />
                  <span>{clan.trophies}</span>
                </div>
              </td>
              <td className='py-3 px-4 text-center'>
                {clan.isBlocked ? (
                  <button
                    className='px-4 py-2 rounded-lg bg-red-500 text-white cursor-not-allowed'
                    disabled
                  >
                    Suspended
                  </button>
                ) : (
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
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
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </motion.div>
  );
};

export default ClanTableView;