import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  FaPlay,
  FaPause,
  FaTrash,
  FaChevronDown,
  FaReply,
} from 'react-icons/fa';
import ConfirmModal from '../../utils/modal/confirmModel';
import { ChatAxios } from '../../config/AxiosInstance';
import Reactions from './Reaction';
import ReplyPreview from './ReplyPreview';
import { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

interface Reaction {
  memberId: string;
  emoji: string;
  messageId: string;
  createdAt:any
}


interface ReplyTo {
  _id: string;
  text?: string;
  image?: string;
  voice?: string;
  sender: {
    name: string;
  };
}

interface Message {
  _id: string;
  text?: string;
  image?: string;
  voice?: string;
  sender: {
    avatar: string;
    _id: string;
    name: string;
  };
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: Reaction[];
  replyTo?: ReplyTo;
}

interface MessageItemProps {
  message: Message;
  currentUser: any;
  isLoading: boolean;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: (message: Message) => void;
  socket:Socket | null
 
}



const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(
  (
    { message, currentUser, isLoading, onDeleteMessage, onReplyMessage,socket },
    ref,
  ) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reactions, setReactions] = useState<Reaction[]>(
      message.reactions || [],
    );
    const [showReactions, setShowReactions] = useState(false);
    const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.user.user);
    useEffect(() => {
   
   if(socket){
    socket.on('reaction_updated', ({ messageId, emoji, memberId, createdAt }) => {
      setReactions((prevReactions) => {
        const updatedReactions = [...prevReactions];
        const existingReactionIndex = updatedReactions.findIndex(
          (r) => r.memberId === memberId && r.messageId === messageId
        );

        if (existingReactionIndex !== -1) {
    
          if (emoji === null) {
            updatedReactions.splice(existingReactionIndex, 1);
          } else {
            updatedReactions[existingReactionIndex] = {
              ...updatedReactions[existingReactionIndex],
              emoji,
              createdAt,
            };
          }
        } else if (emoji !== null) {
        
          updatedReactions.push({
            memberId,
            emoji,
            messageId,
            createdAt,
          });
        }

        return updatedReactions;
      });
    });

   
    return () => {
      socket.off('reaction_updated');
    };
   }
  }, []);

    useEffect(() => {
      if (scrollToMessageId) {
        const element = document.getElementById(`message-${scrollToMessageId}`);
        if (element) {
          document.querySelectorAll('.bg-green-200').forEach(el => el.classList.remove('bg-green-200'));
          
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-green-200');
          setTimeout(() => element.classList.remove('bg-green-200'), 2000);
        }
      }
    }, [scrollToMessageId]);
   

    const isOwnMessage = useMemo(
      () => message.sender._id === currentUser._id,
      [message.sender._id, currentUser._id],
    );

    const audio = useMemo(
      () => (message.voice ? new Audio(message.voice) : null),
      [message.voice],
    );

    const formattedTime = useMemo(() => {
      return new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }, [message.createdAt]);

    const handleDeleteClick = useCallback(() => {
      setIsModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      console.log('delete',message)
      onDeleteMessage(message._id);
      setIsModalOpen(false);
    }, [message._id, onDeleteMessage]);

    const toggleAudio = useCallback(() => {
      if (audio) {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
        setIsPlaying(!isPlaying);
      }
    }, [audio, isPlaying]);

    const handleReply = useCallback(() => {
      onReplyMessage(message);
      setShowDropdown(false);
    }, [message, onReplyMessage]);

    const handleReact = useCallback(
      async (emoji: string | null) => {
        if (socket) {
       
          socket.emit('react_to_message', {
            messageId: message._id,
            emoji: emoji,
            userId: user._id,
          });
          
  
          console.log("reaction ", socket);
        }
  
        let updatedReactions = [...reactions];
        const existingReactionIndex = updatedReactions.findIndex(
          r => r.memberId === currentUser._id
        );
    
        if (existingReactionIndex !== -1) {
          if (emoji === null) {
            updatedReactions.splice(existingReactionIndex, 1);
          } else {
           
            updatedReactions[existingReactionIndex] = {
              ...updatedReactions[existingReactionIndex],
              emoji: emoji,
              createdAt: new Date().toISOString()
            };
          }
        } else if (emoji !== null) {
          
          updatedReactions.push({
            memberId: currentUser._id,
            emoji: emoji,
            messageId: message._id,
            createdAt: new Date().toISOString(),
          });
        }
        console.log('updated reaction',updatedReactions)
    
        setReactions(updatedReactions);
      
    
       
      
    
        try {
          await ChatAxios.post('/messages/react', {
            messageId: message._id,
            emoji: emoji,
            userId: currentUser._id,
          });
        } catch (error) {
          console.error('Failed to save reaction:', error);
        }
      },
      [reactions, currentUser._id, message._id]
    );

    useEffect(() => {
      if (audio) {
        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);
        return () => {
          audio.removeEventListener('ended', handleEnded);
        };
      }
    }, [audio]);

    const renderMessageStatus = useMemo(() => {
      if (isOwnMessage) {
        switch (message.status) {
          case 'sent':
            return (
              <div className='absolute bottom-[6px] right-[6px]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='17'
                  height='17'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='#808080'
                    fillRule='evenodd'
                    d='M19.7071 6.29289C20.0976 6.68342 20.0976 7.31658 19.7071 7.70711L9.70711 17.7071C9.51957 17.8946 9.26522 18 9 18C8.73478 18 8.48043 17.8946 8.29289 17.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L9 15.5858L18.2929 6.29289C18.6834 5.90237 19.3166 5.90237 19.7071 6.29289Z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            );
          case 'delivered':
            return (
              <div className='absolute bottom-[6px] right-[6px]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='17'
                  height='17'
                  fill='none'
                  viewBox='0 0 24 24'
                  id='double-check'
                >
                  <path
                    fill='url(#paint0_linear_1233_4362)'
                    fillRule='evenodd'
                    d='M22.7071 7.70709C23.0976 7.31656 23.0976 6.68339 22.7071 6.29288C22.3166 5.90236 21.6834 5.90238 21.2929 6.29291L12.0003 15.5859L11.207 14.7928C10.8164 14.4023 10.1833 14.4024 9.79279 14.793C9.40232 15.1836 9.40242 15.8167 9.793 16.2072L11.2934 17.7072C11.684 18.0976 12.3171 18.0976 12.7076 17.7071L22.7071 7.70709ZM16.7071 7.70711C17.0976 7.31658 17.0976 6.68342 16.7071 6.29289C16.3166 5.90237 15.6834 5.90237 15.2929 6.29289L6 15.5858L2.70711 12.2929C2.31658 11.9024 1.68342 11.9024 1.29289 12.2929C0.902369 12.6834 0.902369 13.3166 1.29289 13.7071L5.29289 17.7071C5.48043 17.8946 5.73478 18 6 18C6.26522 18 6.51957 17.8946 6.70711 17.7071L16.7071 7.70711Z'
                    clipRule='evenodd'
                  ></path>
                  <defs>
                    <linearGradient
                      id='paint0_linear_1233_4362'
                      x1='12'
                      x2='12'
                      y1='6'
                      y2='18'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#57EAEA'></stop>
                      <stop offset='1' stopColor='#2BC9FF'></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            );
          case 'read':
            return (
              <div className='absolute bottom-[6px] right-[6px]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='17'
                  height='17'
                  fill='none'
                  viewBox='0 0 24 24'
                  id='double-check'
                >
                  <path
                    fill='url(#paint0_linear_1233_4362)'
                    fillRule='evenodd'
                    d='M22.7071 7.70709C23.0976 7.31656 23.0976 6.68339 22.7071 6.29288C22.3166 5.90236 21.6834 5.90238 21.2929 6.29291L12.0003 15.5859L11.207 14.7928C10.8164 14.4023 10.1833 14.4024 9.79279 14.793C9.40232 15.1836 9.40242 15.8167 9.793 16.2072L11.2934 17.7072C11.684 18.0976 12.3171 18.0976 12.7076 17.7071L22.7071 7.70709ZM16.7071 7.70711C17.0976 7.31658 17.0976 6.68342 16.7071 6.29289C16.3166 5.90237 15.6834 5.90237 15.2929 6.29289L6 15.5858L2.70711 12.2929C2.31658 11.9024 1.68342 11.9024 1.29289 12.2929C0.902369 12.6834 0.902369 13.3166 1.29289 13.7071L5.29289 17.7071C5.48043 17.8946 5.73478 18 6 18C6.26522 18 6.51957 17.8946 6.70711 17.7071L16.7071 7.70711Z'
                    clipRule='evenodd'
                  ></path>
                  <defs>
                    <linearGradient
                      id='paint0_linear_1233_4362'
                      x1='12'
                      x2='12'
                      y1='6'
                      y2='18'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#57EAEA'></stop>
                      <stop offset='1' stopColor='#2BC9FF'></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            );
          default:
            return null;
        }
      }
      return null;
    }, [message.status, isOwnMessage]);

    const reactionSummary = useMemo(() => {
      const uniqueReactions = reactions.reduce((acc, reaction) => {
        acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
      
      const sortedReactions = Object.entries(uniqueReactions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2);
    
      return Object.fromEntries(sortedReactions);
    }, [reactions]);
    

  

    const onReplyClick = (messageId: any) => {
      setScrollToMessageId(null);
      setTimeout(() => setScrollToMessageId(messageId), 0);
    }

    return (
      <div
        ref={ref}
        id={`message-${message._id}`}
        className={`flex ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        } mb-3 items-end relative ${reactions.length > 0 ? 'mb-8' : 'mb-3'}`}
      >
        {isOwnMessage && showDropdown && (
          <div className='absolute right-0 top-0 transform -translate-y-full mb-1 w-28 bg-white rounded-md shadow-lg z-10'>
            <button
              onClick={handleDeleteClick}
              className='flex items-center px-4 py-2 w-full text-sm text-red-600 hover:bg-red-100 rounded-md z-10'
            >
              <FaTrash size={12} className='mr-2' />
              Delete
            </button>
            <button
              onClick={handleReply}
              className='flex items-center px-4 py-2 w-full text-sm text-blue-600 hover:bg-blue-100 rounded-md'
            >
              <FaReply size={12} className='mr-2' />
              Reply
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
            <div className='flex justify-between items-center mb-1'>
              <span className='text-xs font-bold text-green-700 mr-6'>
                {message.sender.name}
              </span>
              <button
                onClick={handleReply}
                className='p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200'
              >
                <FaReply size={14} />
              </button>
            </div>
          )}

{message.replyTo && (
          <ReplyPreview 
            replyTo={message.replyTo} 
            onReplyClick={() => onReplyClick(message.replyTo!._id)} 
          />
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

          <div className='pr-8'>
            <p className='text-sm leading-relaxed break-words whitespace-pre-wrap'>
              {message.text}
            </p>

            {reactions.length > 0 && (
  <div
    className={`absolute -bottom-6 ${
      isOwnMessage ? 'right-0' : 'left-0'
    } flex space-x-1`}
  >
    {Object.entries(reactionSummary).map(([emoji, count]) => (
      <div
        key={emoji}
        className='bg-white shadow-md px-2 py-1 rounded-full text-xs'
      >
        {emoji} {count}
      </div>
    ))}
    {Object.keys(reactionSummary).length < reactions.length && (
      <div className='bg-white shadow-md px-2 py-1 rounded-full text-xs'>
        +{reactions.length - Object.keys(reactionSummary).length}
      </div>
    )}
  </div>
)}

            <div className='flex justify-end items-center mt-1 space-x-1.5'>
              <span className='block text-[11px] text-green-600'>
                {formattedTime}
              </span>
              {renderMessageStatus}
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
           className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} ${
             reactions.length > 0 ? '-bottom-12' : '-bottom-6'
           }`}
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
