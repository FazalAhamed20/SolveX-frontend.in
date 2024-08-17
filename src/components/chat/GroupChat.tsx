import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { AppDispatch, RootState } from '../../redux/Store';
import { fetchMember } from '../../redux/actions/ClanAction';
import { ChatAxios } from '../../config/AxiosInstance';
import MembersList from './MembersList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

interface Message {
  _id: string;
  image: string;
  audioUrl:string;
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
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [image, setImage] = useState('');
  const [voice,setVoice]=useState('')

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const { clanName, clanId } = useParams<{
    clanName: string;
    clanId: string;
  }>();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  // const { socket, initializeSocket, disconnectSocket } = useSocket();
  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    console.log('____________________ rendereed due to msg');
  }, [messages]);
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

  useEffect(() => {
    const fetchAllMember = async () => {
      if (clanId && clanName) {
        const response = await dispatch(
          fetchMember({ clanId, name: clanName }),
        );
        const members = response?.payload as unknown as GroupMember[];
        setGroupMembers(members.map(member => ({ ...member, online: false })));
      }
    };
    fetchAllMember();
  }, [clanId, clanName, dispatch]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3006', {
      query: { userId: user._id },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      socketRef.current?.emit('joinRoom', { roomId: clanId, userId: user._id });
    });

    socketRef.current.on('initialOnlineStatus', (onlineUsers: string[]) => {
      setGroupMembers(prevMembers =>
        prevMembers.map(member => ({
          ...member,
          online: onlineUsers.includes(member.id),
        })),
      );
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
          member.id === userId ? { ...member, online: true } : member,
        ),
      );
    });

    socketRef.current.on('userOffline', ({ userId }: { userId: string }) => {
      setGroupMembers(prevMembers =>
        prevMembers.map(member =>
          member.id === userId ? { ...member, online: false } : member,
        ),
      );
    });

    return () => {
      socketRef.current?.emit('leaveRoom', {
        roomId: clanId,
        userId: user._id,
      });
      socketRef.current?.disconnect();
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [clanId, user._id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' || image || voice) {
      try {
        const response = await ChatAxios.post('/chat/messages', {
          image: image,
          voice:voice,
          text: inputMessage,
          sender: { _id: user._id, name: user.username },
          clanId: clanId,
        });

        const newMessage = response.data;
        
        socketRef.current?.emit('sendMessage', {
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

  const handleTyping = () => {
    socketRef.current?.emit('typing', { roomId: clanId, user: user.username });
  };

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setInputMessage(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      }
    }
  };
  console.log('omage', image);
  const handleVoiceMessage = async(audioBlob: Blob) => {
     
     const audioFile = new File([audioBlob], 'voice_message.webm', { type: 'audio/webm' });

    
     const formData = new FormData();
     formData.append('file', audioFile);
     formData.append('upload_preset', 'upload');

    
     const response = await axios.post(
       `https://api.cloudinary.com/v1_1/dlitqiyia/video/upload`,
       formData
     );

     const audioUrl = response.data.secure_url;
     setVoice(audioUrl)
  };

  return (
    <div className='min-h-screen bg-[#f0f4f0] p-2 sm:p-4 md:p-6 lg:p-8'>
      <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='flex flex-col md:flex-row h-[calc(100vh-2rem)] sm:h-[600px]'>
          <MembersList
            showMembers={showMembers}
            groupMembers={groupMembers}
            currentUser={user}
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
            />
            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              handleTyping={handleTyping}
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

export default GroupChat;
