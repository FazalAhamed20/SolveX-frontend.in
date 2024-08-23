import React from 'react';
import { FaBars } from 'react-icons/fa';

interface ChatHeaderProps {
  clanName?: string;
  showMembers: boolean;
  setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ clanName, showMembers, setShowMembers }) => {
  return (
    <div className='bg-[#e8f5e9] text-[#2e7d32] px-4 py-3 flex items-center justify-between border-b border-[#c8e6c9] z-0'>
      <div className='text-xl font-semibold'>{clanName || 'Group Chat'}</div>
      <button
        onClick={() => setShowMembers(!showMembers)}
        className='text-[#4caf50] hover:text-[#2e7d32] md:hidden'
      >
        <FaBars />
      </button>
    </div>
  );
};

export default ChatHeader;