import React, { forwardRef, useState } from 'react';
import { FaCheck, FaPlay, FaPause } from 'react-icons/fa';

interface Message {
  _id: string;
  text: string;
  sender: {
    avatar: any;
    _id: string;
    name: string;
  };
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  image?: string;
  voice?: string; // New field for voice messages
}

interface MessageItemProps {
  message: Message;
  currentUser: any;
}

const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(({ message, currentUser }, ref) => {
  console.log("messages",message)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(message.voice ? new Audio(message.voice) : null);

  const isOwnMessage = message.sender._id === currentUser._id;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const renderMessageStatus = (status: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <FaCheck className='text-gray-400' />;
      case 'delivered':
        return (
          <div className='flex'>
            <FaCheck className='text-gray-400' />
            <FaCheck className='text-gray-400 -ml-1' />
          </div>
        );
      case 'read':
        return (
          <div className='flex'>
            <FaCheck className='text-green-600' />
            <FaCheck className='text-green-600 -ml-1' />
          </div>
        );
    }
  };

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  React.useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => setIsPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [audio]);

  return (
    <div
      ref={ref}
      className={`flex ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      } mb-3 items-end`}
    >
      {!isOwnMessage && (
        <div className="w-10 h-10 rounded-full bg-green-100 flex-shrink-0 mr-2 overflow-hidden shadow-md transform transition-transform duration-200 hover:scale-110">
          {message.sender.avatar ? (
            <img src={message.sender.avatar} alt={message.sender.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-green-600">
              {message.sender.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      <div
        className={`relative max-w-[90%] px-4 py-2.5 rounded-2xl shadow-md transform transition-all duration-200 ease-in-out hover:shadow-lg ${
          isOwnMessage
            ? 'bg-green-100 text-green-900'
            : 'bg-white text-green-900'
        } hover:-translate-y-0.5`}
      >
        {!isOwnMessage && (
          <span className='block text-xs font-bold mb-1 text-green-700'>
            {message.sender.name}
          </span>
        )}
        {message.image && (
          <img 
            src={message.image} 
            alt="Shared image" 
            className="max-w-60 h-45 rounded-lg mb-2"
          />
        )}
        {message.voice && (
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={toggleAudio}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
            >
              {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
            </button>
            <div className="flex-1 h-1 bg-green-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(audio?.currentTime || 0) / (audio?.duration || 1) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {message.text && <p className='text-sm leading-relaxed'>{message.text}</p>}
        <div className='flex justify-end items-center mt-1 space-x-1.5'>
          <span className='block text-[11px] text-green-600'>
            {formattedTime}
          </span>
          {isOwnMessage && (
            <span className='text-[11px] text-green-600'>
              {renderMessageStatus(message.status)}
            </span>
          )}
        </div>
        <div
          className={`absolute w-3 h-3 ${
            isOwnMessage
              ? 'right-0 -mr-1.5 bg-green-100'
              : 'left-0 -ml-1.5 bg-white'
          } bottom-[8px] transform ${
            isOwnMessage ? 'rotate-45' : '-rotate-45'
          }`}
        ></div>
      </div>
    </div>
  );
});

export default MessageItem;