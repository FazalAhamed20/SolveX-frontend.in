import React, { useState } from 'react';

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

  const toggleBlockUser = (userId: string) => {
    const updatedUsers = filteredUsers.map(user =>
      user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
    );
    console.log(updatedUsers);
    
    setFilteredUsers(updatedUsers);
  };

  const handleSearch = (query: string) => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          className="px-3 py-2 border rounded-md"
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleBlockUser(user._id)}
                    className={`px-2 py-1 text-xs rounded ${
                      user.isBlocked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
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
    </div>
  );
};

export default UserTable;
