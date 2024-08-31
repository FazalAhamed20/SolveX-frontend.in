import React, { useState, useEffect } from 'react';

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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(showMembers);
  }, [showMembers]);

  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState);
  };

  return (
    <div 
      className={`
        fixed top-0 right-0 z-40
        w-full md:w-1/4 lg:w-1/5 
        bg-[#f8faf8] border-l border-gray-200
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'h-screen' : 'h-12'}
      `}
    >
      <div 
        className='sticky top-0 p-3 bg-[#e8f5e9] text-[#2e7d32] z-10 flex justify-between items-center cursor-pointer'
        onClick={toggleExpand}
      >
        <h2 className='text-lg font-semibold'>Group Members</h2>
        <div className="flex space-x-1">
          <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>
      </div>
      {isExpanded && (
        <div className="overflow-y-auto h-[calc(100vh-3rem)]">
          {groupMembers
            .filter(member => member.name !== currentUser.username)
            .map(member => {
              const isOnline = onlineUsers.includes(member.id);
              const isTyping = typingUser === member.name;
              return (
                <div
                  key={member.id}
                  className='flex items-center p-2 md:p-3 hover:bg-[#f1f8f1] transition duration-150'
                >
                  <div className='w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-[#c8e6c9] flex items-center justify-center text-[#2e7d32] font-bold text-sm md:text-base'>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='ml-2 md:ml-3 flex-1 min-w-0'>
                    <p className='font-medium text-[#2e7d32] text-sm md:text-base truncate'>{member.name}</p>
                    <p className='text-xs md:text-sm text-[#4caf50] flex items-center'>
                      <div
                        className={`mr-1 rounded-full w-3 h-3 ${
                          isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`} 
                      />
                      <span className="truncate">
                        {isTyping ? 'Typing...' : (isOnline ? 'Online' : 'Offline')}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MembersList;