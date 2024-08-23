import React from 'react';
import { FaCircle } from 'react-icons/fa';

interface GroupMember {
  id?: any;
  name: string;
  role?: string;
  online?: boolean;
  avatar?: string;
}

interface MembersListProps {
  showMembers: boolean;
  groupMembers: GroupMember[];
  currentUser: any;
  onlineUsers: string[];
  typingUser: string;
}

const MembersList: React.FC<MembersListProps> = ({ showMembers, groupMembers, currentUser, onlineUsers, typingUser }) => {
  console.log("group members", groupMembers);
  console.log("online members", onlineUsers);
  console.log("typing user", typingUser);

  return (
    <div className={`${showMembers ? 'block' : 'hidden'} md:block w-full md:w-1/4 lg:w-1/5 bg-[#f8faf8] border-b md:border-r border-gray-200`}>
      <div className='p-4 bg-[#e8f5e9] text-[#2e7d32]'>
        <h2 className='text-xl font-semibold'>Group Members</h2>
      </div>
      <div className='overflow-y-auto h-[calc(100vh-10rem)] md:h-[calc(600px-60px)]'>
        {groupMembers
          .filter(member => member.name !== currentUser.username)
          .map(member => {
            const isOnline = onlineUsers.includes(member.id);
            const isTyping = typingUser === member.name;
            return (
              <div
                key={member.id}
                className='flex items-center p-3 hover:bg-[#f1f8f1] transition duration-150'
              >
                <div className='w-10 h-10 rounded-full overflow-hidden bg-[#c8e6c9] flex items-center justify-center text-[#2e7d32] font-bold'>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className='ml-3 flex-1'>
                  <p className='font-medium text-[#2e7d32]'>{member.name}</p>
                  <p className='text-sm text-[#4caf50] flex items-center'>
                    <FaCircle
                      className={`mr-1 text-xs ${
                        isOnline ? 'text-green-500' : 'text-gray-400'
                      }`}
                    />
                    {isTyping ? 'Typing...' : (isOnline ? 'Online' : 'Offline')}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MembersList;