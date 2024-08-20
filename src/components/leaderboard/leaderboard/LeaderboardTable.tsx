import React, { useEffect, useState } from 'react';
import {
  FaTrophy,
  FaMedal,
  FaAward,
  FaStar,
  FaCode,
  FaCoins,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { fetchAllSubmission } from '../../../redux/actions/SubmissionAction';

interface User {
  id: number;
  rank: number;
  username: string;
  totalProblems: number;
  totalPoints: number;
  languages: string[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <FaTrophy className='text-yellow-500' />;
    case 2:
      return <FaMedal className='text-gray-400' />;
    case 3:
      return <FaAward className='text-orange-500' />;
    default:
      return <FaStar className='text-blue-500' />;
  }
};

const LeaderBoardTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading,setIsLoading]=useState(false)
  const itemsPerPage = 5;
  const dispatch: AppDispatch = useDispatch();

  const fetchAllSubmissions = async () => {
    setIsLoading(true)
    try {
      const response = await dispatch(fetchAllSubmission() as any);
      const fetchedData = response.payload;
      console.log(response)

      const sortedUsers = fetchedData
        .sort((a: any, b: any) => b.totalPoints - a.totalPoints)
        .map((user: any, index: number) => ({
          ...user,
          rank: index + 1,
        }));

      setUsers(sortedUsers);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }finally{
      setIsLoading(false)
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

  return (
    
    <div className='container mx-auto p-6'>
      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white'>
              <tr>
                <th className='py-3 px-4 text-left'>Rank</th>
                <th className='py-3 px-4 text-left'>Name</th>
                <th className='py-3 px-4 text-left'>Solved Problems</th>
                <th className='py-3 px-4 text-left'>Points</th>
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
              currentUsers.map(user => (
                <tr
                  key={user.id}
                  className='border-b border-gray-200 hover:bg-gray-100 transition duration-200'
                >
                  <td className='py-3 px-4'>
                    <div className='flex items-center'>
                      <span className='mr-2'>{getRankIcon(user.rank)}</span>
                      <span className='font-semibold'>{user.rank}</span>
                    </div>
                  </td>
                  <td className='py-3 px-4 font-medium'>{user.username}</td>
                  <td className='py-3 px-4'>
                    <span className='bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm flex items-center w-min'>
                      <FaCode className='mr-1' />
                      {user.totalProblems}
                    </span>
                  </td>
                  <td className='py-3 px-4'>
                    <span className='bg-purple-100 text-purple-800 py-1 px-2 rounded-full text-sm flex items-center w-min'>
                      <FaCoins className='mr-1' />
                      {user.totalPoints}
                    </span>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        <div className='bg-gray-100 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-medium'>{indexOfFirstItem + 1}</span> to{' '}
                <span className='font-medium'>{indexOfLastItem}</span> of{' '}
                <span className='font-medium'>{users.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'
              >
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number
                        ? 'z-10 bg-indigo-50 border-gray-500 text-gray-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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
