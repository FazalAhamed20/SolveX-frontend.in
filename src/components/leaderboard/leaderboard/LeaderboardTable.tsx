import React, { useEffect, useState } from 'react';
import { FaCode, FaCoins, FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { fetchAllSubmission } from '../../../redux/actions/SubmissionAction';
import { motion } from 'framer-motion';

interface User {
  id: number;
  rank: number;
  username: string;
  count: number;
  points: number;
  languages: string[];
}

const LeaderBoardTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const dispatch: AppDispatch = useDispatch();

  const fetchAllSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(fetchAllSubmission() as any);
      const fetchedData = response.payload;
      console.log(response);

      const sortedUsers = fetchedData
        .sort((a: any, b: any) => b.points - a.points)
        .map((user: any, index: number) => ({
          ...user,
          rank: index + 1,
        }));

      setUsers(sortedUsers);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubmissions();
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-green-600 text-2xl" />;
      case 2:
        return <FaMedal className="text-green-500 text-2xl" />;
      case 3:
        return <FaMedal className="text-green-400 text-2xl" />;
      default:
        return <FaAward className="text-green-300 text-xl" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-green-50">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Table for larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Solved Problems</th>
                <th className="py-3 px-4 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-green-100 hover:bg-green-50 transition duration-200"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getRankIcon(user.rank)}</span>
                        <span className="font-semibold">{user.rank}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{user.username}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm flex items-center w-min">
                        <FaCode className="mr-1" />
                        {user.count}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm flex items-center w-min">
                        <FaCoins className="mr-1" />
                        {user.points}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced card layout for smaller screens */}
        <div className="md:hidden space-y-4 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            </div>
          ) : (
            currentUsers.map((user, index) => (
              <motion.div
                key={user.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200"
              >
                <div className="bg-green-500 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-lg">{user.rank}</span>
                    {getRankIcon(user.rank)}
                  </div>
                  <span className="text-white font-semibold text-lg">{user.username}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">Solved Problems</span>
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm flex items-center">
                      <FaCode className="mr-2" />
                      {user.count}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">Points</span>
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm flex items-center">
                      <FaCoins className="mr-2" />
                      {user.points}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="bg-green-50 px-4 py-3 flex items-center justify-between border-t border-green-200 sm:px-6">
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-green-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, users.length)}</span> of{' '}
                <span className="font-medium">{users.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number
                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                        : 'bg-white border-green-300 text-green-500 hover:bg-green-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardTable;