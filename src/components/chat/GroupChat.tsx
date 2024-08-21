import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/Store';
import { fetchMember } from '../../redux/actions/ClanAction';
import { ChatAxios } from '../../config/AxiosInstance';
import MembersList from './MembersList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import debounce from 'lodash/debounce';

interface Message {
  _id: string;
  image: string;
  audioUrl: string;
  text: string;
  sender: {
    avatar: any;
    _id: string;
    name: string;
  };
  createdAt: string;
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
  const [typingUser, setTypingUser] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [image, setImage] = useState('');
  const [voice, setVoice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { clanName, clanId } = useParams<{ clanName: string; clanId: string }>();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const { socket, initializeSocket, disconnectSocket } = useSocket();

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);
  useLayoutEffect(() => {
    const fetchAllMember = async () => {
      if (clanId && clanName) {
        const response = await dispatch(fetchMember({ clanId, name: clanName }));
        const members = response?.payload as unknown as GroupMember[];
        setGroupMembers(members.map(member => ({ ...member, online: false })));
      }
    };
    
    fetchAllMember();
  }, [clanId, clanName, dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await ChatAxios.get(`/messages/clan/${clanId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [clanId]);


  const handleNewMessage = useCallback((message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
  }, []);
 

  const handleTyping = useCallback((data: { user: string }) => {
    setTypingUser(data.user);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => setTypingUser(''), 1000);
    setTypingTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user._id) {
      initializeSocket(user._id);
    }
  }, [user._id, initializeSocket]);

  useEffect(() => {
    if (user._id) {
      initializeSocket(user._id);
    if (socket) {
      socket.emit('joinRoom', { roomId: clanId, userId: user._id });
      socket.on('message', handleNewMessage);
      socket.on('deleteMessage', handleDeleteMessage);
      socket.on('typing', handleTyping);
      socket.on('userJoined', handleUserJoined);
      socket.on('userLeft', handleUserLeft);
      socket.on('onlineUsers', handleOnlineUsers);
      socket.on('messageStatusUpdate', handleMessageStatusUpdate);

  

      return () => {
        socket.emit('leaveRoom', { roomId: clanId, userId: user._id });
      
        socket.off('message');
        socket.off('deleteMessage');
        socket.off('typing');
        socket.off('userJoined');
        socket.off('userLeft');
        socket.off('onlineUsers');
        socket.off('messageStatusUpdate');
      
      };
    }
  }
}, [user._id,socket, clanId, user._id,  handleNewMessage, handleDeleteMessage, handleTyping]);

useEffect(() => {
  const markMessagesAsRead = () => {
    const unreadMessages = messages.filter(msg => 
      msg.sender._id !== user._id && msg.status !== 'read'
    );
    unreadMessages.forEach(msg => {
      socket?.emit('messageRead', { roomId: clanId, messageId: msg._id, userId: user._id });
    });
  };

  markMessagesAsRead();
}, [messages, user._id, clanId, socket]);

const handleUserJoined = useCallback((userId: string) => {
  setOnlineUsers(prevUsers => [...new Set([...prevUsers, userId])]);
  setGroupMembers(prevMembers =>
    prevMembers.map(member => 
      member.id === userId ? { ...member, online: true } : member
    )
  );
}, []);

const handleMessageStatusUpdate = useCallback((updatedMessage: Message) => {
  setMessages(prevMessages =>
    prevMessages.map(msg =>
      msg._id === updatedMessage._id ? { ...msg, status: updatedMessage.status } : msg
    )
  );
}, []);

const handleUserLeft = useCallback((userId: string) => {
  setOnlineUsers(prevUsers => prevUsers.filter(id => id !== userId));
  setGroupMembers(prevMembers =>
    prevMembers.map(member => 
      member.id === userId ? { ...member, online: false } : member
    )
  );
}, []);
const handleOnlineUsers = useCallback((users: string[]) => {
  setOnlineUsers(users);
  setGroupMembers(prevMembers =>
    prevMembers.map(member => ({
      ...member,
      online: users.includes(member.id)
    }))
  );
}, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' || image || voice) {
      try {
        const response = await ChatAxios.post('/chat/messages', {
          image: image,
          voice: voice,
          text: inputMessage,
          sender: { _id: user._id, name: user.username },
          clanId: clanId,
        });

        const newMessage = response.data;
        
        socket?.emit('sendMessage', {
          roomId: clanId,
          message: newMessage,
        });

        setInputMessage('');
        setImage('');
        setVoice('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const debouncedTyping = useCallback(
    debounce(() => {
      socket?.emit('typing', { roomId: clanId, user: user.username });
    }, 300),
    [socket, clanId, user.username]
  );

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setInputMessage(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'upload');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dlitqiyia/image/upload`,
          formData,
        );

        const imageUrl = response.data.secure_url;
        setImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    const audioFile = new File([audioBlob], 'voice_message.webm', { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('upload_preset', 'upload');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dlitqiyia/video/upload`,
        formData
      );

      const audioUrl = response.data.secure_url;
      setVoice(audioUrl);
    } catch (error) {
      console.error('Error uploading voice message:', error);
    }
  };

  const handleDeleteMessageRequest = async (messageId: string) => {
    try {
      await ChatAxios.delete(`/messages/${messageId}`);
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      socket?.emit('deleteMessage', { roomId: clanId, messageId: messageId });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className='min-h-screen bg-[#f0f4f0] p-2 sm:p-4 md:p-6 lg:p-8'>
      <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='flex flex-col md:flex-row h-[calc(100vh-2rem)] sm:h-[600px]'>
          <MembersList
            showMembers={showMembers}
            groupMembers={groupMembers}
            currentUser={user}
            onlineUsers={onlineUsers}
          />
          <div className='flex-1 flex flex-col'>
            <ChatHeader
              clanName={clanName}
              showMembers={showMembers}
              setShowMembers={setShowMembers}
            />
            <MessageList
              messages={messages}
              currentUser={user}
              typingUser={typingUser}
              ref={chatContainerRef}
              isLoading={isLoading}
              onDeleteMessage={handleDeleteMessageRequest}
            />
            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              handleTyping={debouncedTyping}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              handleEmojiClick={handleEmojiClick}
              handleImageUpload={handleImageUpload}
              handleVoiceMessage={handleVoiceMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat