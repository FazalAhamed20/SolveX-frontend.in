import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

const DraggableOnlineUsers: React.FC<{ onlineUsers: string[] }> = ({ onlineUsers }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="fixed bg-white shadow-md rounded-lg p-3 cursor-move z-50"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
    >
      <h3 className="font-semibold mb-2">Online Users</h3>
      <ul>
        {onlineUsers.map((user, index) => (
          <li key={index} className="text-sm">{user}</li>
        ))}
      </ul>
    </div>
  );
};

const MembersList: React.FC<MembersListProps> = ({ showMembers, groupMembers, currentUser, onlineUsers, typingUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(showMembers);
  }, [showMembers]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  return (
    <>
      <DraggableOnlineUsers onlineUsers={onlineUsers} />

      <div 
        className={`
          ${(showMembers || isMobileMenuOpen) ? 'fixed inset-0 z-40 bg-white' : ''} 
          md:relative md:block 
          w-full md:w-1/4 lg:w-1/5 
          bg-[#f8faf8] border-b md:border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${(showMembers || isMobileMenuOpen) ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className='sticky top-0 p-3 md:p-4 bg-[#e8f5e9] text-[#2e7d32] z-10 flex justify-between items-center'>
          <h2 className='text-lg md:text-xl font-semibold'>Group Members</h2>
          <button 
            className="md:hidden text-[#2e7d32] hover:text-[#1b5e20] transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            <X size={24} />
          </button>
        </div>
        <div className={`overflow-y-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] ${(showMembers || isMobileMenuOpen) ? 'block' : 'hidden md:block'}`}>
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
      </div>
    </>
  );
};

export default MembersList;