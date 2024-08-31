import { Menu } from "lucide-react";

interface ChatHeaderProps {
  clanName?: string;
  showMembers: boolean;
  setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ clanName, showMembers, setShowMembers }) => {
  return (
    <div className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-3 flex items-center justify-between border-b border-[#c8e6c9] z-10 sticky top-0">
      <div className="text-lg sm:text-xl font-semibold truncate flex-1 mr-2">{clanName || 'Group Chat'}</div>
      <button
        onClick={() => setShowMembers(!showMembers)}
        className="text-[#4caf50] hover:text-[#2e7d32] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4caf50] rounded-full p-1"
        aria-label="Toggle member list"
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

export default ChatHeader;