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

  const renderEmojiButton = (emoji: string) => (
    <button
      key={emoji}
      onClick={() => handleReaction(emoji)}
      className={`mx-1 text-lg hover:bg-gray-100 rounded-full p-1 transition-colors duration-200 ${
        currentUserReaction === emoji ? 'bg-green-100' : ''
      }`}
    >
      {emoji}
    </button>
  );

  return (
    <div
      className={`${className} absolute bottom-0 ${
        isOwnMessage ? 'right-0' : 'left-0'
      } transform translate-y-full mt-1 flex flex-wrap items-center bg-white rounded-full shadow-md p-1 z-10`}
    >
      <div className="flex flex-wrap items-center">
        {showAllEmojis 
          ? DEFAULT_EMOJIS.map(renderEmojiButton)
          : DEFAULT_EMOJIS.slice(0, 3).map(renderEmojiButton)
        }
        {!showAllEmojis && (
          <button
            onClick={() => setShowAllEmojis(true)}
            className="mx-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-1 transition-colors duration-200"
          >
            +{DEFAULT_EMOJIS.length - 3}
          </button>
        )}
        {currentUserReaction && !DEFAULT_EMOJIS.includes(currentUserReaction) && renderEmojiButton(currentUserReaction)}
      </div>
      <div className='relative' ref={emojiPickerRef}>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className='mx-1 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200'
        >
          <FaSmile className='text-gray-600' />
        </button>
        {showEmojiPicker && (
          <div className='absolute bottom-full right-0 mb-2 max-w-[90vw] sm:max-w-[300px]'>
            <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height="350px" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Reactions);