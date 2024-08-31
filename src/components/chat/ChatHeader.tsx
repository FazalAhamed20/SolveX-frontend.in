import { Menu, Users } from 'lucide-react';
import React from 'react';


interface ChatHeaderProps {
  clanName?: string;
  showMembers: boolean;
  setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ clanName, showMembers, setShowMembers }) => {
  return (
    <div className='bg-[#e8f5e9] text-[#2e7d32] px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-[#c8e6c9] z-10'>
      <div className='flex items-center space-x-2'>
        <div className='text-lg sm:text-xl font-semibold truncate max-w-[200px] sm:max-w-none'>
          {clanName || 'Group Chat'}
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <button
          onClick={() => setShowMembers(!showMembers)}
          className='text-[#4caf50] hover:text-[#2e7d32] p-2 rounded-full hover:bg-[#c8e6c9] transition-colors duration-200'
          aria-label={showMembers ? 'Hide Members' : 'Show Members'}
        >
          <Users size={20} />
        </button>
        <button
          className='text-[#4caf50] hover:text-[#2e7d32] p-2 rounded-full hover:bg-[#c8e6c9] transition-colors duration-200 sm:hidden'
          aria-label='Menu'
        >
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;