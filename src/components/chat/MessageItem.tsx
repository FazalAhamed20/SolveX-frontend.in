import React, { forwardRef, useState, useEffect } from 'react';
import {
  FaCheck,
  FaPlay,
  FaPause,
  FaTrash,
  FaChevronDown,
} from 'react-icons/fa';
import ConfirmModal from '../../utils/modal/confirmModel';

import { ChatAxios } from '../../config/AxiosInstance';
import Reactions from './Reaction';

interface Reaction {
  memberId: string;
  emoji: string;
  messageId: string;
}

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
  voice?: string;
  reactions?: Reaction[];
}

interface MessageItemProps {
  message: Message;
  currentUser: any;
  isLoading: boolean;
  onDeleteMessage: (messageId: string) => void;
}

const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(
  ({ message, currentUser, isLoading, onDeleteMessage }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(message.voice ? new Audio(message.voice) : null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reactions, setReactions] = useState<Reaction[]>(message.reactions || []);
    const [showReactions, setShowReactions] = useState(false);

    console.log('react message', message.reactions);

    const isOwnMessage = message.sender._id === currentUser._id;

    const handleDeleteClick = () => {
      setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
      onDeleteMessage(message._id);
      setIsModalOpen(false);
    };

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

    const handleReact = async (emoji: string | null) => {
      let updatedReactions = [...reactions];
    
      const existingReactionIndex = updatedReactions.findIndex(
        r => r.memberId === currentUser._id && r.messageId === message._id
      );
    
      if (existingReactionIndex !== -1) {
        if (emoji === null) {
          // Remove the reaction
          updatedReactions.splice(existingReactionIndex, 1);
        } else {
          // Update the existing reaction
          updatedReactions[existingReactionIndex].emoji = emoji;
        }
      } else if (emoji !== null) {
        // Add a new reaction
        updatedReactions.push({
          memberId: currentUser._id,
          emoji: emoji,
          messageId: message._id
        });
      }
    
      setReactions(updatedReactions);
    
      try {
        const response = await ChatAxios.post('/messages/react', {
          messageId: message._id,
          emoji: emoji,
          userId: currentUser._id,
        });
        console.log('response', response);
      } catch (error) {
        console.error('Failed to save reaction:', error);
      }
    };

    useEffect(() => {
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
        } mb-3 items-end relative`}
      >
        {isOwnMessage && showDropdown && (
          <div className='absolute right-0 top-0 transform -translate-y-full mb-1 w-28 bg-white rounded-md shadow-lg z-10'>
            <button
              onClick={handleDeleteClick}
              className='flex items-center px-4 py-2 w-full text-sm text-red-600 hover:bg-red-100 rounded-md'
            >
              <FaTrash size={12} className='mr-2' />
              Delete
            </button>
          </div>
        )}

        {!isOwnMessage && (
          <div className='w-8 h-8 rounded-full bg-green-100 flex-shrink-0 mr-2 overflow-hidden shadow-md self-end'>
            {message.sender.avatar ? (
              <img
                src={message.sender.avatar}
                alt={message.sender.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-lg font-semibold text-green-600'>
                {message.sender.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        <div
          className={`relative max-w-[90%] md:max-w-[75%] lg:max-w-[60%] px-4 py-2 rounded-lg shadow-md ${
            isOwnMessage
              ? 'bg-green-100 text-green-900'
              : 'bg-white text-gray-900'
          }`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {!isOwnMessage && (
            <span className='block text-xs font-bold mb-1 text-green-700'>
              {message.sender.name}
            </span>
          )}

          {message.image && (
            <>
              {isLoading ? (
                'loading'
              ) : (
                <img
                  src={message.image}
                  alt='Shared image'
                  className='max-w-60 h-45 rounded-lg mb-2'
                />
              )}
            </>
          )}

          {message.voice && (
            <div className='flex items-center space-x-2 mb-2'>
              <button
                onClick={toggleAudio}
                className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200'
              >
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
              </button>
              <div className='flex-1 h-1 bg-green-200 rounded-full'>
                <div
                  className='h-full bg-green-500 rounded-full'
                  style={{
                    width: `${
                      ((audio?.currentTime || 0) / (audio?.duration || 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className='pr-6'>
            <p className='text-sm leading-relaxed break-words whitespace-pre-wrap'>
              {message.text}
            </p>

            {reactions.length > 0 && (
  <div
    className={`absolute -bottom-4 ${
      isOwnMessage ? 'right-0' : 'left-0'
    } flex space-x-1`}
  >
    {Object.entries(
      reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([emoji, count]) => (
      <div
        key={emoji}
        className='bg-white shadow-md px-2 py-1 rounded-full text-xs'
      >
        {emoji} {count}
      </div>
    ))}
  </div>
)}

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

          {isOwnMessage && (
            <div className='absolute top-2 right-2 z-10'>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className='p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200'
              >
                <FaChevronDown size={14} />
              </button>
            </div>
          )}

          {showReactions && (
          <Reactions
          reactions={reactions}
          onReact={handleReact}
          currentUserId={currentUser._id}
          isOwnMessage={isOwnMessage}
          messageId={message._id}
        />
          )}
        </div>
        <ConfirmModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message='Are you sure you want to delete this message?'
        />
      </div>
    );
  },
);

export default React.memo(MessageItem);
