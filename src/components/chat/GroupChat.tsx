import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSmile, FaPaperclip, FaUsers, FaCircle, FaBars, FaCheck, FaImage, FaMicrophone, FaPlay, FaStop } from 'react-icons/fa';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useParams } from 'react-router-dom';
import { fetchMember } from '../../redux/actions/ClanAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/Store';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  image?: string;
  audio?: string;
}

interface GroupMember {
  id: number;
  name: string;
  role:string
  online: boolean;
  avatar?: string;
}

const GroupChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { clanName } = useParams<{ clanName: string }>();
  const { clanId } = useParams<{ clanId: string }>();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);





  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(()=>{
    const fetchAllMember = async () => {
        if (clanId && clanName) {
          const response = await dispatch(
            fetchMember({
              clanId: clanId,
              name: clanName,
            }),
          );
          setGroupMembers(response?.payload as unknown as GroupMember[]); 
        }
        
    

  }
  fetchAllMember()
}, [clanId, clanName, dispatch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      sendTextMessage(inputMessage);
    } else if (audioURL) {
      sendVoiceMessage(audioURL);
    }
  };

  const sendTextMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: text,
      sender: user.username,
      timestamp: new Date(),
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    simulateMessageStatus(newMessage.id);
  };

  const sendVoiceMessage = (audioUrl: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: '',
      sender: user.username,
      timestamp: new Date(),
      status: 'sent',
      audio: audioUrl
    };
    setMessages([...messages, newMessage]);
    setAudioURL(null);
    simulateMessageStatus(newMessage.id);
  };

  const simulateMessageStatus = (id: number) => {
    setTimeout(() => updateMessageStatus(id, 'delivered'), 1000);
    setTimeout(() => updateMessageStatus(id, 'read'), 2000);
  };

  const updateMessageStatus = (id: number, status: 'sent' | 'delivered' | 'read') => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, status } : msg
      )
    );
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputMessage(prevInput => prevInput + emoji.native);
    setShowEmojis(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage: Message = {
          id: Date.now(),
          text: '',
          sender: user.username,
          timestamp: new Date(),
          status: 'sent',
          image: event.target?.result as string
        };
        setMessages([...messages, newMessage]);
        simulateMessageStatus(newMessage.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const renderMessageStatus = (status: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <FaCheck className="text-gray-400" />;
      case 'delivered':
        return <div className="flex"><FaCheck className="text-gray-400" /><FaCheck className="text-gray-400 -ml-1" /></div>;
      case 'read':
        return <div className="flex"><FaCheck className="text-green-500" /><FaCheck className="text-green-500 -ml-1" /></div>;
    }
  };


  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-green-200">
        <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] sm:h-[600px]">
          <div
            className={`${showMembers ? 'block' : 'hidden'} md:block w-full md:w-1/4 lg:w-1/5 bg-green-50 border-b md:border-r border-green-200`}
          >
            <div className="p-3 md:p-4 bg-green-100 text-green-800">
              <h2 className="text-lg md:text-xl font-semibold">Group Members</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-10rem)] md:h-[calc(600px-60px)]">
              {groupMembers.map((member) => (
                <div key={member.id} className="flex items-center p-2 md:p-3 hover:bg-green-100 transition duration-150">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-green-500 flex items-center justify-center text-white font-bold">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="ml-2 md:ml-3 flex-1">
                    <p className="font-medium text-sm md:text-base">{member.name}</p>
                    <p className="text-xs md:text-sm text-green-600 flex items-center">
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

          <div className="flex-1 flex flex-col">
            <div className="bg-green-100 text-green-800 px-3 md:px-4 py-2 md:py-3 flex justify-between items-center border-b border-green-200">
              <div className="flex items-center">
                <FaBars className="text-xl mr-2 md:mr-3 cursor-pointer md:hidden" onClick={() => setShowMembers(!showMembers)} />
                <h2 className="text-lg md:text-xl font-semibold">{clanName}</h2>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-lg cursor-pointer" onClick={() => setShowMembers(!showMembers)} />
                <span className="ml-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {groupMembers.filter(m => m.online).length}
                </span>
              </div>
            </div>
            
            <div 
  ref={chatContainerRef} 
  className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-blue-50 to-white"
>
  {messages.length === 0 ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500 text-lg">Start a conversation!</p>
    </div>
  ) : (
    messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.sender === user.username ? 'justify-end' : 'justify-start'}`}
      >
        {message.sender !== user.username && (
          <img 
            src={groupMembers.find(m => m.name === message.sender)?.avatar || '/default-avatar.png'} 
            alt={message.sender} 
            className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2 object-cover"
          />
        )}
        <div
          className={`max-w-[75%] md:max-w-[70%] px-3 md:px-4 py-2 rounded-lg shadow-md ${
            message.sender === user.username
              ? 'bg-green-100 text-green-800 rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}
        >
          <span className="block text-xs font-bold mb-1">{message.sender}</span>
          {message.text && <p className="text-sm md:text-base mb-2">{message.text}</p>}
         
          <div className="flex justify-between items-center mt-1">
            <span className="block text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.sender === user.username && (
              <span className="text-xs">{renderMessageStatus(message.status)}</span>
            )}
          </div>
        </div>
        {message.sender === user.username && (
  user.avatar ? (
    <img 
      src={user.avatar}
      alt={user.username} 
      className="w-6 h-6 md:w-8 md:h-8 rounded-full ml-2 object-cover"
    />
  ) : (
    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full ml-2 bg-green-300 flex items-center justify-center text-xs md:text-sm font-bold text-green-800">
      {user.username.charAt(0).toUpperCase()}
    </div>
  )
)}
      </div>
    ))
  )}
</div>
            
            <form onSubmit={handleSendMessage} className="bg-green-50 px-2 md:px-4 py-2 md:py-3 flex items-center border-t border-green-200">
              <button type="button" className="text-green-600 hover:text-green-700 mr-2 transition duration-150" onClick={() => setShowEmojis(!showEmojis)}>
                <FaSmile className="text-lg md:text-xl" />
              </button>
              <button type="button" className="text-green-600 hover:text-green-700 mr-2 transition duration-150" onClick={() => fileInputRef.current?.click()}>
                <FaImage className="text-lg md:text-xl" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white border border-green-300 rounded-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {!isRecording && !audioURL && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="ml-2 bg-green-500 text-white rounded-full p-1 md:p-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
                >
                  <FaMicrophone className="text-base md:text-lg" />
                </button>
              )}
              {isRecording && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="ml-2 bg-red-500 text-white rounded-full p-1 md:p-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
                >
                  <FaStop className="text-base md:text-lg" />
                </button>
              )}
              {audioURL && (
                <button
                  type="submit"
                  className="ml-2 bg-green-500 text-white rounded-full p-1 md:p-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
                >
                  <FaPaperPlane className="text-base md:text-lg" />
                </button>
              )}
              {!audioURL && (
                <button
                  type="submit"
                  className="ml-2 bg-green-500 text-white rounded-full p-1 md:p-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
                >
                  <FaPaperPlane className="text-base md:text-lg" />
                </button>
              )}
            </form>
            {showEmojis && (
              <div className="absolute bottom-16 right-4 z-10">
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;