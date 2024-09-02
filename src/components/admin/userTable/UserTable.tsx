import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { blockUser } from '../../../redux/actions/AdminActions';
import LogoutModal from '../../../utils/modal/LogoutModal';

interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}

interface Props {
  users: User[];
}

const UserTable: React.FC<Props> = ({ users }) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [userIdToBlock, setUserIdToBlock] = useState<string | null>(null);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleButtonClick = (user: User) => {
    setUserIdToBlock(user._id);
    setUserToBlock(user);
    setShowModal(true);
  };

  const toggleBlockUser = async (userId: string | null) => {
    setIsLoading(true);
    if (userId) {
      const userToBlock = filteredUsers.find(user => user._id === userId);

      if (userToBlock) {
        try {
          const newBlockedStatus = !userToBlock.isBlocked;
          const response = await dispatch(
            blockUser({ ...userToBlock, isBlocked: newBlockedStatus }),
          );

          if (blockUser.fulfilled.match(response)) {
            const updatedUser = response.payload.data as unknown as User;

            setFilteredUsers(prevUsers =>
              prevUsers.map(user =>
                user._id === updatedUser._id
                  ? { ...user, isBlocked: updatedUser.isBlocked }
                  : user,
              ),
            );

            
          } else {
            console.error('Failed to block/unblock user:', response.payload);
          }
        } catch (error) {
          console.error('Failed to block/unblock user:', error);
        } finally {
          setShowModal(false);
          setUserIdToBlock(null);
          setUserToBlock(null);
          setIsLoading(false);
        }
      } else {
        console.error('User not found');
      }
    }
  };

  const handleSearch = (query: string) => {
    const filtered = users.filter(
      user =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()),
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

  const handleLogout = () => {
    toggleBlockUser(userIdToBlock);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-xl font-bold mb-4'>Users</h2>
      <div className='mb-4 flex items-center'>
        <input
          type='text'
          placeholder='Search by name or email'
          className='px-3 py-2 border rounded-md'
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border-collapse border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedUsers.map(user => (
              <tr key={user._id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>{user.username}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>{user.email}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => handleButtonClick(user)}
                    className={`px-2 py-1 text-xs rounded ${
                      user.isBlocked
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
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
      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
        data={userToBlock?.isBlocked ? 'Unblock' : 'Block'}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserTable;
