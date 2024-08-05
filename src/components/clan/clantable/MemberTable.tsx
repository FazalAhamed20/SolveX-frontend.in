import React, { useState, useMemo, useEffect } from 'react';
import {
  FaSearch,
  FaTrash,
  FaCrown,
  FaUser,
  FaShieldAlt,
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaCode,
  FaUserPlus,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMember,
  fetchMember,
  removeMember,
} from '../../../redux/actions/ClanAction';
import AddMemberModal from '../../../utils/modal/AddMemberModal';
import ConfirmModal from '../../../utils/modal/confirmModel';

interface Member {
  _id: string | number;
  id: number;
  rank: number;
  name: string;
  role: 'leader' | 'Co-Leader' | 'member';
  solvedProblems: number;
  clanName: string;
  level: number;
}

const MemberTable: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const itemsPerPage = 5;
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage]);

  const pageCount = Math.ceil(filteredMembers.length / itemsPerPage);

  const { clanName } = useParams<{ clanName: string }>();
  const { clanId } = useParams<{ clanId: string }>();
  console.log('clanId', clanId);

  useEffect(() => {
    const fetchAllMember = async () => {
      if (clanId && clanName) {
        const response = await dispatch(
          fetchMember({
            clanId: clanId,
            name: clanName,
          }),
        );
        console.log('members', response);
        if (response.payload && Array.isArray(response.payload)) {
          // Sort members by the number of solved problems in descending order
          const sortedMembers = (response.payload as Member[]).sort(
            (a, b) => b.solvedProblems - a.solvedProblems
          );
  
          // Assign ranks based on the sorted order
          const membersWithRank = sortedMembers.map((member, index) => ({
            ...member,
            rank: index + 1, // rank starts from 1
          }));
  
          setMembers(membersWithRank);
        } else {
          console.error('Failed to fetch members:', response);
        }
      }
    };
    fetchAllMember();
  }, [dispatch, clanId, clanName]);
  

  useEffect(() => {
    console.log('user', user._id);
    if (user && user._id) {
      console.log('members', members);
      const leader = members.some(
        member => member.role === 'leader' && member.id === user._id,
      );
      console.log('leader', leader);
      setIsLeader(leader);
    }
  }, [members, user]);

  const handleRemove = async (_id: any, name: string) => {
    console.log('id', _id, name, clanId);

    const response = await dispatch(
      removeMember({ clanId, _id, memberName: name }),
    );
    console.log('clan response', response);
    if (response.payload && Array.isArray(response.payload)) {
      setMembers(response.payload as Member[]);
    } else {
      console.error('Failed to fetch members:', response);
    }
  };

  const getRoleIcon = (role: Member['role']) => {
    switch (role) {
      case 'leader':
        return <FaCrown className='text-yellow-500' />;
      case 'Co-Leader':
        return <FaShieldAlt className='text-blue-500' />;
      default:
        return <FaUser className='text-gray-500' />;
    }
  };
  const getActionIcon = (member: Member) => {
    if (member.role === 'leader') {
      return (
        <span className="px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full">
          Leader
        </span>
      );
    } else if (isLeader) {
      return (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='text-green-600 hover:text-green-700 transition-colors duration-150'
          onClick={() => confirmRemove(member)}
        >
          <FaTrash />
        </motion.button>
      );
    }
    return null;
  };
  

  const onAddMember = async (username: string, _id: number) => {
    const response = await dispatch(
      addMember({
        clanId: clanId,
        name: clanName,
        members: [
          {
            id: _id,
            name: username,
            role: 'member',
          },
        ],
      }),
    );
    console.log('response error', response);
    if (response.payload && Array.isArray(response.payload)) {
      setMembers(response.payload as Member[]);
    } else {
      console.error('Failed to fetch members:', response);
    }
  };

  const confirmRemove = (member: Member) => {
    setMemberToRemove(member);
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (memberToRemove) {
      await handleRemove(memberToRemove.id, memberToRemove.name);
      setShowConfirmModal(false);
      setMemberToRemove(null);
    }
  };

  return (
    <div className='container mx-auto p-6 bg-white rounded-lg shadow-2xl mt-20'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-extrabold text-green-700'>
          <FaCode className='inline-block mr-3 mb-1' />
          {clanName || 'Clan'}
        </h1>
        {isLeader && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors duration-150 flex items-center'
            onClick={() => setShowAddMemberModal(true)}
          >
            <FaUserPlus className='mr-2' />
            Add Members
          </motion.button>
        )}
      </div>

      <div className='mb-6 flex items-center bg-green-50 rounded-lg border border-green-200'>
        <FaSearch className='text-green-500 ml-4' />
        <input
          type='text'
          placeholder='Search members or clans...'
          className='bg-transparent border-none rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-green-700 placeholder-green-400'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className='overflow-x-auto bg-white shadow-lg rounded-lg border border-green-200'>
        <table className='min-w-full divide-y divide-green-200'>
          <thead>
            <tr>
              {['Rank', 'Name', 'Role', 'Solved Problems', 'Level'].map(
                header => (
                  <th
                    key={header}
                    className='px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider'
                  >
                    {header}
                  </th>
                ),
              )}
              {isLeader && (
                <th className='px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-green-100'>
            {paginatedMembers.map(member => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className='hover:bg-green-50 transition-colors duration-150 ease-in-out'
              >
              <td className='px-6 py-4 whitespace-nowrap'>
  <div className='flex items-center'>
    <FaTrophy
      className={`mr-2 ${
        member.rank <= 3 ? 'text-green-600' : 'text-green-400'
      }`}
    />
    <span
      className={`font-semibold ${
        member.rank <= 3 ? 'text-green-600' : 'text-green-500'
      }`}
    >
      {member.rank}
    </span>
  </div>
</td>

                <td className='px-6 py-4 whitespace-nowrap font-medium text-green-700'>
                  {member.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    {getRoleIcon(member.role)}
                    <span className='ml-2 text-sm text-green-600'>
                      {member.role}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <FaCode className='mr-2 text-green-500' />
                    <span className='font-semibold text-green-700'>
                      {member.solvedProblems}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <FaStar className='text-green-500 mr-1' />
                    <span className='font-semibold text-green-700'>
                      {member.level}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
  {getActionIcon(member)}
</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 flex justify-between items-center'>
        <div className='text-sm text-green-600'>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of{' '}
          {filteredMembers.length} entries
        </div>
        <div className='flex space-x-2'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-3 py-1 rounded-lg shadow ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-3 py-1 rounded-lg shadow ${
              currentPage === pageCount
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            onClick={() =>
              setCurrentPage(prev => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
          >
            <FaChevronRight />
          </motion.button>
        </div>
      </div>

      {showAddMemberModal && (
        <AddMemberModal
          isOpen={showAddMemberModal}
          onClose={() => setShowAddMemberModal(false)}
          onAddMember={onAddMember}
        />
      )}
      <ConfirmModal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRemove}
        message='Are you sure you want to remove this member?'
      />
    </div>
  );
};

export default MemberTable;
