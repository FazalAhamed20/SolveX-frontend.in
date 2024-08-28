import React, { useEffect, useState } from 'react';
import {  FaCode, FaCoins } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { fetchAllSubmission } from '../../../redux/actions/SubmissionAction';
import {getRankIcon} from '../../../utils'

interface User {
  id: number;
  rank: number;
  username: string;
  count: number;
  points: number;
  languages: string[];
}

;

const LeaderBoardTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const itemsPerPage = 5;
  const dispatch: AppDispatch = useDispatch();

  const fetchAllSubmissions = async () => {
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
        console.log('sorted',sortedUsers);

      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };
  console.log('user',users)

  useEffect(() => {
    fetchAllSubmissions();
  }, [dispatch]);

  const handleSearch = (query: string) => {
    const filtered = users.filter(
      user => user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-xl font-bold mb-4'>Leaderboard</h2>
      <div className='mb-4 flex items-center'>
        <input
          type='text'
          placeholder='Search by username'
          className='px-3 py-2 border rounded-md'
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border-collapse border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Rank
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Solved Problems
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Points
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedUsers.map(user => (
              <tr key={user.id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <span className='mr-2'>{getRankIcon(user.rank)}</span>
                    <span className='font-semibold'>{user.rank}</span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>{user.username}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='bg-green-100 text-green-800 py-1 px-2 rounded-full text-sm flex items-center w-min'>
                    <FaCode className='mr-1' />
                    {user.count}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='bg-purple-100 text-purple-800 py-1 px-2 rounded-full text-sm flex items-center w-min'>
                    <FaCoins className='mr-1' />
                    {user.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between mt-4'>
        <button
          onClick={handlePreviousPage}
          className='px-3 py-1 border rounded-md bg-gray-200'
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className='px-3 py-1 border rounded-md bg-gray-200'
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeaderBoardTable;