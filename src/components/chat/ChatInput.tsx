import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { FaPaperPlane, FaSmile, FaImage, FaTimes, FaMicrophone, FaStop } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

interface Message {
  _id: string;
  image: string;
  voice: string;
  text: string;
  sender: {
    avatar: any;
    _id: string;
    name: string;
  };
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: {
    _id: string;
    text: string;
    sender: {
      name: string;
    };
  };
}

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (text: string, replyTo: Message | null) => void;
  handleTyping: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmojiClick: (emoji: { emoji: string }) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVoiceMessage: (audioBlob: Blob) => void;
  replyTo: Message | null;
  clearReply: () => void;
}



const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleTyping,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  handleImageUpload,
  handleVoiceMessage,
  replyTo,
  clearReply,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
    handleImageUpload(e);
  };

  const removeImage = () => {
    setPreviewImage(null);
    setInputMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("sub submitted",inputMessage);
   
    handleSendMessage(inputMessage, replyTo);
    console.log("after submitted");
    setPreviewImage(null);
    setInputMessage('');
    clearReply();
  
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
  
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
     
      const draw = () => {
        if (!isRecording) return;
  
      };
  
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
  
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        const syntheticEvent = {
          preventDefault: () => {},
        } as FormEvent<HTMLFormElement>;
        handleSubmit(syntheticEvent);
        console.log("submitted");
        
      };
  
      mediaRecorder.start();
      setIsRecording(true);
      draw();
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

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className='bg-white border-t border-[#c8e6c9] p-4 shadow-lg'>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        {previewImage && (
          <div className="mb-4 relative">
            <div className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full h-48">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-300"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-75 p-2 rounded">
              <p className="text-sm font-semibold truncate">Image Preview</p>
            </div>
          </div>
        )}
        <div className='flex items-center space-x-3'>
          <button
            type='button'
            onClick={() => setShowEmojiPicker(prev => !prev)}
            className='text-[#4caf50] hover:text-[#2e7d32] transition-colors duration-300'
          >
            <FaSmile size={24} />
          </button>
          {showEmojiPicker && (
            <div className='absolute bottom-20 left-4 z-10'>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <label htmlFor="imageUpload" className='cursor-pointer text-[#4caf50] hover:text-[#2e7d32] transition-colors duration-300'>
            <FaImage size={24} />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleLocalImageUpload}
            className="hidden"
          />
          <button
            type='button'
            onClick={isRecording ? stopRecording : startRecording}
            className={`text-white p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#4caf50] hover:bg-[#43a047]'
            }`}
          >
           {isRecording ? <FaStop size={18} /> : <FaMicrophone size={18} />}
          </button>
          {isRecording ? (
            <div className="flex-1 flex items-center">
             
              <div className="flex-shrink-0 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                Recording
              </div>
            </div>
          ) : (
            <div className="flex-1">
  {replyTo && (
    <div className="bg-gray-100 p-2 rounded-md mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">Replying to {replyTo.sender.name}</span>
        <button 
          onClick={clearReply} 
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          ×
        </button>
      </div>
      <div className="flex items-center">
        {replyTo.image && (
          <img 
            src={replyTo.image} 
            alt="Reply preview" 
            className="w-10 h-10 object-cover rounded mr-2"
          />
        )}
        {replyTo.voice && (
          <div className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        )}
        <p className="text-gray-600 truncate flex-1">
          {replyTo.text ? replyTo.text : replyTo.image ? 'Image' : replyTo.voice ? 'Voice message' : 'Message'}
        </p>
      </div>
    </div>
  )}
              <input
                type="text"
                value={inputMessage}
                onChange={e => {
                  setInputMessage(e.target.value);
                  handleTyping();
                }}
                className="w-full border-2 border-[#a5d6a7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-all duration-300"
                placeholder="Type a message"
              />
            </div>
          )}
          <button
            type='submit'
            className='bg-[#4caf50] text-white p-3 rounded-full hover:bg-[#43a047] transition-all duration-300 shadow-md hover:shadow-lg'
          >
            <FaPaperPlane size={18} />
          </button>
          </div>
      </form>
    </div>
  );
};

export default ChatInput;