import React, { useState, useEffect, useRef } from 'react';
import {
  FaPaperPlane,
  FaUsers,
  FaCircle,
  FaBars,
  FaCheck,
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { fetchMember } from '../../redux/actions/ClanAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/Store';
import io, { Socket } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface GroupMember {
  id?: any;
  name: string;
  role?: string;
  online?: boolean;
  avatar?: string;
}

const GroupChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const { clanName, clanId } = useParams<{ clanName: string; clanId: string }>();
  const [typingUser, setTypingUser] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user,'.....')

  useEffect(() => {
    socketRef.current = io('http://localhost:3006', {
      query: { userId: user._id } 
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      socketRef.current?.emit('joinRoom', clanId);
    });

    socketRef.current.on('message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    socketRef.current.on('typing', (data: { user: string }) => {
      setTypingUser(data.user);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      const timeout = setTimeout(() => setTypingUser(''), 1000); 
      setTypingTimeout(timeout);
    });

    socketRef.current.on('userOnline', ({ userId }: { userId: string }) => {
      setGroupMembers(prevMembers => 
        prevMembers.map(member =>
          member.id === userId ? { ...member, online: true } : member
        )
      );
    });
    console.log("groupmembers",groupMembers)

    socketRef.current.on('userOffline', ({ userId }: { userId: string }) => {
      setGroupMembers(prevMembers => 
        prevMembers.map(member =>
          member.id === userId ? { ...member, online: false } : member
        )
      );
    });

    return () => {
      socketRef.current?.disconnect();
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [clanId, typingTimeout, user.username]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchAllMember = async () => {
      if (clanId && clanName) {
        const response = await dispatch(
          fetchMember({
            clanId,
            name: clanName,
          }),
        );
        setGroupMembers(response?.payload as unknown as GroupMember[]);
      }
    };
    fetchAllMember();
  }, [clanId, clanName, dispatch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: user.username,
        timestamp: new Date(),
        status: 'sent',
      };
      socketRef.current?.emit('sendMessage', {
        roomId: clanId,
        message: newMessage,
      });
      setInputMessage('');
    }
  };

  const handleTyping = () => {
    socketRef.current?.emit('typing', { roomId: clanId, user: user.username });
  };

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setInputMessage(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };


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
            <FaCheck className='text-green-500' />
            <FaCheck className='text-green-500 -ml-1' />
          </div>
        );
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender === user.username;

    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[75%] md:max-w-[70%] px-3 md:px-4 py-2 rounded-lg shadow-md ${
            isOwnMessage
              ? 'bg-green-100 text-green-800 rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}
        >
          <span className='block text-xs font-bold mb-1'>{message.sender}</span>
          <p className='text-sm md:text-base mb-2'>{message.text}</p>
          <div className='flex justify-between items-center mt-1'>
            <span className='block text-xs text-gray-500'>{formattedTime}</span>
            {isOwnMessage && (
              <span className='text-xs'>
                {renderMessageStatus(message.status)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-white p-2 sm:p-4 md:p-6 lg:p-8'>
      <div className='max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-green-200'>
        <div className='flex flex-col md:flex-row h-[calc(100vh-2rem)] sm:h-[600px]'>
          <div
            className={`${
              showMembers ? 'block' : 'hidden'
            } md:block w-full md:w-1/4 lg:w-1/5 bg-green-50 border-b md:border-r border-green-200`}
          >
            <div className='p-3 md:p-4 bg-green-100 text-green-800'>
              <h2 className='text-lg md:text-xl font-semibold'>
                Group Members
              </h2>
            </div>
            <div className='overflow-y-auto h-[calc(100vh-10rem)] md:h-[calc(600px-60px)]'>
              {groupMembers
                .filter(member => member.name !== user.username)
                .map(member => (
                  <div
                    key={member.id}
                    className='flex items-center p-2 md:p-3 hover:bg-green-100 transition duration-150'
                  >
                    <div className='w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-green-500 flex items-center justify-center text-white font-bold'>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className='ml-2 md:ml-3 flex-1'>
                      <p className='font-medium text-sm md:text-base'>
                        {member.name}
                      </p>
                      <p className='text-xs md:text-sm text-green-600 flex items-center'>
                        <FaCircle
                          className={`mr-1 text-xs ${
                            member.online ? 'text-green-500' : 'text-gray-400'
                          }`}
                        />
                        {member.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className='flex-1 flex flex-col'>
            <div className='bg-green-100 text-green-800 px-3 md:px-4 py-2 flex items-center justify-between border-b border-green-200'>
              <div className='text-xl font-semibold'>
                {clanName || 'Group Chat'}
              </div>
              <button
                onClick={() => setShowMembers(!showMembers)}
                className='text-green-600 hover:text-green-800'
              >
                <FaBars />
              </button>
            </div>

            <div
              ref={chatContainerRef}
              className='flex-1 overflow-y-auto px-2 md:px-4 py-3'
            >
              {messages.map(renderMessage)}
              {typingUser && <p className='italic text-gray-500'>{typingUser} is typing...</p>}
            </div>

            <div className='bg-white border-t border-green-200 p-2 md:p-3'>
            <form
                className='flex items-center space-x-2'
                onSubmit={handleSendMessage}
              >
                <button
                  type='button'
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  className='text-xl'
                >
                  😊
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
                  className='flex-1 border border-green-300 rounded-lg px-3 py-2'
                  placeholder='Type your message...'
                />
                <button
                  type='submit'
                  className='bg-green-500 text-white px-4 py-2 rounded-lg'
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
