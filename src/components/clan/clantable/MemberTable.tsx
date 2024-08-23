import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FaSearch,
  FaTrash,
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaCode,
  FaUserPlus,
  FaComments,
  FaSignOutAlt,
  FaTasks,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMember,
  completeQuiz,
  fetchMember,
  leaveClan,
  removeMember,
} from '../../../redux/actions/ClanAction';
import AddMemberModal from '../../../utils/modal/AddMemberModal';
import ConfirmModal from '../../../utils/modal/confirmModel';
import QuizModal from '../../../utils/modal/quizzModel';
import { getRandomTopic } from '../../../utils/random/topic';
import { getRoleIcon } from '../../../utils';

interface Member {
  isToday: boolean;
  _id: string | number;
  id: number;
  rank: number;
  name: string;
  role: 'leader' | 'Co-Leader' | 'member';
  score: any;
  clanName: string;
  level: number;
}

const MemberTable: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLeaveClanModal, setShowLeaveClanModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const itemsPerPage = 5;
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserMember = members.find(member => member.id === user._id);
    setIsQuizCompleted(currentUserMember?.isToday || false);
  }, [members, user._id]);
  console.log('hello', isQuizCompleted);

  const { clanName } = useParams<{ clanName: string }>();
  const { clanId } = useParams<{ clanId: string }>();

  const memoizedClanId = useMemo(() => clanId, [clanId]);
  const memoizedClanName = useMemo(() => clanName, [clanName]);

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

  const fetchAllMember = useCallback(async () => {
    if (memoizedClanId && memoizedClanName) {
      setIsLoading(true);
      const response = await dispatch(
        fetchMember({
          clanId: memoizedClanId,
          name: memoizedClanName,
        }),
      );
      if (response.payload && Array.isArray(response.payload)) {
        const sortedMembers = (response.payload as Member[]).sort(
          (a, b) => b.score - a.score,
        );

        const membersWithRank = sortedMembers.map((member, index) => ({
          ...member,
          rank: index + 1,
        }));

        setMembers(membersWithRank);
        setIsLoading(false);
      } else {
        console.error('Failed to fetch members:', response);
      }
    }
  }, [dispatch, memoizedClanId, memoizedClanName]);

  useEffect(() => {
    fetchAllMember();
  }, [fetchAllMember]);

  useEffect(() => {
    if (user && user._id) {
      const leader = members.some(
        member => member.role === 'leader' && member.id === user._id,
      );
      setIsLeader(leader);
    }
  }, [members, user]);

  const handleRemove = async (_id: any, name: string) => {
    const response = await dispatch(
      removeMember({ clanId: memoizedClanId, _id, memberName: name }),
    );
    if (response.payload && Array.isArray(response.payload)) {
      setMembers(response.payload as Member[]);
    } else {
      console.error('Failed to fetch members:', response);
    }
  };

  const getActionIcon = (member: Member) => {
    if (member.role === 'leader') {
      return (
        <span className='px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full'>
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
        clanId: memoizedClanId,
        name: memoizedClanName,
        members: [
          {
            id: _id,
            name: username,
            role: 'member',
          },
        ],
      }),
    );
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

  const handleChatClick = () => {
    navigate(`/groupchat/${memoizedClanName}/${memoizedClanId}`);
  };

  const handleLeaveClan = () => {
    setShowLeaveClanModal(true);
  };

  const confirmLeaveClan = async () => {
    if (memoizedClanId && user._id) {
      try {
        const response = await dispatch(
          leaveClan({
            clanId: memoizedClanId,
            _id: user._id,
            memberName: user.username,
          }),
        );
        if (response.payload) {
          setShowLeaveClanModal(false);
          navigate('/clan');
        } else {
          console.error('Failed to leave clan:', response);
        }
      } catch (error) {
        console.error('Error leaving clan:', error);
      }
    }
  };

  const handleDailyTaskClick = () => {
    if (!isQuizCompleted) {
      setCurrentTopic(getRandomTopic());
      setIsQuizModalOpen(true);
    }
  };

  const handleQuizComplete = async (score: number) => {
    console.log('score', score);
    try {
      const updatedMembers = members.map(member => {
        if (member.id === user._id) {
          return {
            ...member,
            score: member.score + score,
            isToday: true,
          };
        }
        return member;
      });

      setMembers(updatedMembers);

      const response = await dispatch(
        completeQuiz({
          clanId: memoizedClanId,
          userId: user._id,
          score,
        }),
      );

      console.log('Quiz completion response:', response);
      if (response?.payload?.success) {
        setIsQuizCompleted(true);
        setIsQuizModalOpen(false);
      } else {
        console.error('Failed to complete quiz:', response);
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  return (
    <div className='container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-2xl mt-10 sm:mt-20'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8'>
        <h1 className='text-3xl sm:text-4xl font-extrabold text-green-700 mb-4 sm:mb-0'>
          <FaCode className='inline-block mr-3 mb-1' />
          {clanName || 'Clan'}
        </h1>

        <div className='flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4'>
          <div className='timer-container mb-2 sm:mb-0'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 py-2 text-white rounded-full shadow-lg transition-colors duration-150 flex items-center text-sm sm:text-base ${
                isQuizCompleted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              onClick={handleDailyTaskClick}
              disabled={isQuizCompleted}
            >
              <FaTasks className='mr-2' />
              {isQuizCompleted ? 'Task Completed' : 'Daily Task'}
            </motion.button>
            <QuizModal
              isOpen={isQuizModalOpen}
              onClose={() => setIsQuizModalOpen(false)}
              onComplete={handleQuizComplete}
              topic={currentTopic}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-150 flex items-center text-sm sm:text-base mb-2 sm:mb-0'
            onClick={handleChatClick}
          >
            <FaComments className='mr-2' />
            Group Chat
          </motion.button>
          {isLeader ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-3 sm:px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors duration-150 flex items-center text-sm sm:text-base'
              onClick={() => setShowAddMemberModal(true)}
            >
              <FaUserPlus className='mr-2' />
              Add Members
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-3 sm:px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors duration-150 flex items-center text-sm sm:text-base'
              onClick={handleLeaveClan}
            >
              <FaSignOutAlt className='mr-2' />
              Leave Clan
            </motion.button>
          )}
        </div>
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

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500'></div>
        </div>
      ) : (
        <div className='overflow-x-auto bg-white shadow-lg rounded-lg border border-green-200'>
          <table className='min-w-full divide-y divide-green-200'>
            <thead>
              <tr>
                {['Rank', 'Name', 'Role', 'Score', 'Level'].map(header => (
                  <th
                    key={header}
                    className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider'
                  >
                    {header}
                  </th>
                ))}
                {isLeader && (
                  <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider'>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-green-100'>
              {paginatedMembers.map(member => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className='hover:bg-green-50 transition-colors duration-150 ease-in-out'
                >
                  <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
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

                  <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                    {member.name}
                  </td>
                  <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      {getRoleIcon(member.role)}
                      <span className='ml-2 text-sm text-green-600'>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <FaCode className='mr-2 text-green-500' />
                      <span className='font-semibold text-green-700'>
                        {member.score}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <FaStar className='text-green-500 mr-1' />
                      <span className='font-semibold text-green-700'>
                        {member.level}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                    {getActionIcon(member)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='mt-6 flex flex-col sm:flex-row justify-between items-center'>
        <div className='text-sm text-green-600 mb-4 sm:mb-0'>
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
      <ConfirmModal
        isOpen={showLeaveClanModal}
        onRequestClose={() => setShowLeaveClanModal(false)}
        onConfirm={confirmLeaveClan}
        message='Are you sure you want to leave this clan? This action cannot be undone.'
      />
    </div>
  );
};

export default MemberTable;
