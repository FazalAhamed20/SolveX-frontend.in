import React from 'react';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
  handleTyping: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmojiClick: (emoji: { emoji: string }) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleTyping,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick
}) => {
  return (
    <div className='bg-white border-t border-[#c8e6c9] p-3'>
      <form
        className='flex items-center space-x-2'
        onSubmit={handleSendMessage}
      >
        <button
          type='button'
          onClick={() => setShowEmojiPicker(prev => !prev)}
          className='text-[#4caf50] hover:text-[#2e7d32]'
        >
          <FaSmile size={24} />
        </button>
        {showEmojiPicker && (
          <div className='absolute bottom-16 left-4'>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type='text'
          value={inputMessage}
          onChange={e => {
            setInputMessage(e.target.value);
            handleTyping();
          }}
          className='flex-1 border border-[#a5d6a7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4caf50]'
          placeholder='Type a message'
        />
        <button
          type='submit'
          className='bg-[#4caf50] text-white p-2 rounded-full hover:bg-[#43a047] transition duration-150'
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;