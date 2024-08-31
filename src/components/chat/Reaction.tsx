import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { FaSmile } from "react-icons/fa";

interface Reaction {
  memberId: string;
  emoji: string;
  messageId: string;
}

interface ReactionProps {
  reactions: Reaction[];
  onReact: (emoji: string | null) => void;
  currentUserId: string;
  isOwnMessage: boolean;
  messageId: string;
  className: string;
}

const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '😮', '👏'];

const Reactions: React.FC<ReactionProps> = ({
  reactions,
  onReact,
  currentUserId,
  isOwnMessage,
  className,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    handleReaction(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const getCurrentUserReaction = () => {
    return reactions.find(r => r.memberId === currentUserId)?.emoji || null;
  };

  const handleReaction = (emoji: string) => {
    const currentReaction = getCurrentUserReaction();
    if (currentReaction === emoji) {
      onReact(null); 
    } else {
      onReact(emoji); 
    }
  };

  const currentUserReaction = getCurrentUserReaction();

  return (
    <div
      className={`${className} absolute bottom-0 ${
        isOwnMessage ? 'right-0' : 'left-0'
      } transform translate-y-full mt-1 flex items-center bg-white rounded-full shadow-md p-2 z-10 space-x-1 sm:space-x-2`}
    >
      {DEFAULT_EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className={`flex items-center justify-center w-8 h-8 text-lg hover:bg-gray-100 rounded-full transition-colors duration-200 ${
            currentUserReaction === emoji ? 'bg-green-100' : ''
          }`}
        >
          {emoji}
        </button>
      ))}
      {currentUserReaction && !DEFAULT_EMOJIS.includes(currentUserReaction) && (
        <button
          onClick={() => handleReaction(currentUserReaction)}
          className="flex items-center justify-center w-8 h-8 text-lg bg-green-100 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          {currentUserReaction}
        </button>
      )}
      <div className='relative' ref={emojiPickerRef}>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className='flex items-center justify-center w-8 h-8 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200'
        >
          <FaSmile className='text-gray-600' />
        </button>
        {showEmojiPicker && (
          <div className='absolute bottom-full right-0 mb-2'>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Reactions);