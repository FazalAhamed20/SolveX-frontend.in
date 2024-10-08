import React, { useState, useEffect, useRef } from 'react';

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
  onToggleMobileMenu: () => void;  
}

const MembersList: React.FC<MembersListProps> = ({ 
  showMembers, 
  groupMembers, 
  currentUser, 
  onlineUsers, 
  typingUser,
  onToggleMobileMenu  // New prop
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY - scrollY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isMobile) return;
    const newScrollY = e.touches[0].clientY - startY;
    setScrollY(Math.max(0, Math.min(newScrollY, window.innerHeight - (headerRef.current?.offsetHeight || 0))));
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isMobile) {
      setScrollY(0);
      setIsDragging(false);
    }
  }, [isMobile]);

  return (
    <>
      <div 
        className={`
          ${showMembers ? 'fixed inset-0 z-40 bg-white' : ''} 
          md:relative md:block 
          w-full md:w-1/4 lg:w-1/5 
          bg-[#f8faf8] border-b md:border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${showMembers ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div 
          ref={headerRef}
          className={`
            p-3 md:p-4 bg-[#e8f5e9] text-[#2e7d32] z-10 flex justify-between items-center
            ${isMobile ? 'fixed w-full cursor-move' : 'sticky top-0'}
          `}
          style={isMobile ? { transform: `translateY(${scrollY}px)` } : {}}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h2 className='text-lg md:text-xl font-semibold'>Group Members</h2>
          <button 
            className="md:hidden text-[#2e7d32] hover:text-[#1b5e20] transition-colors duration-200"
            onClick={onToggleMobileMenu}  // Use the new prop here
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div 
          className={`
            overflow-y-auto
            ${isMobile ? `h-[calc(100vh-${headerRef.current?.offsetHeight || 0}px)] mt-[${headerRef.current?.offsetHeight || 0}px]` : 'h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]'}
            ${showMembers ? 'block' : 'hidden md:block'}
          `}
        >
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