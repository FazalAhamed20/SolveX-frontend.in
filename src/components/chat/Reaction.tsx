import React, { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import { X } from "lucide-react";

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
  const [showAllEmojis, setShowAllEmojis] = useState(false);
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
      } transform translate-y-full mt-1 flex flex-wrap items-center bg-white rounded-full shadow-md p-1 z-10 max-w-[calc(100vw-2rem)] sm:max-w-none`}
    >
      {(showAllEmojis ? DEFAULT_EMOJIS : DEFAULT_EMOJIS.slice(0, 3)).map(emoji => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className={`m-1 text-lg sm:text-xl hover:bg-gray-100 rounded-full p-1 transition-colors duration-200 ${
            currentUserReaction === emoji ? 'bg-green-100' : ''
          }`}
        >
          {emoji}
        </button>
      ))}
      {!showAllEmojis && (
        <button
          onClick={() => setShowAllEmojis(true)}
          className="m-1 text-sm sm:text-base bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 transition-colors duration-200"
        >
          +{DEFAULT_EMOJIS.length - 3}
        </button>
      )}
      {currentUserReaction && !DEFAULT_EMOJIS.includes(currentUserReaction) && (
        <button
          onClick={() => handleReaction(currentUserReaction)}
          className="m-1 text-lg sm:text-xl bg-green-100 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
        >
          {currentUserReaction}
        </button>
      )}
      <div className='relative' ref={emojiPickerRef}>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className='m-1 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200'
        >
          {showEmojiPicker ? <X size={20} /> : <FaSmile className='text-gray-600' size={20} />}
        </button>
        {showEmojiPicker && (
          <div className='absolute bottom-full right-0 mb-2 w-[280px] sm:w-auto'>
            <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height="350px" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Reactions);