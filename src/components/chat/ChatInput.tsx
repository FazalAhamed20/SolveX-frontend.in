import React, { useState, useRef, useEffect } from 'react';
import {  SmileIcon, ImageIcon, XIcon, MicIcon, StopCircleIcon } from 'lucide-react';
import { FaPaperPlane } from 'react-icons/fa';
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
  const [voiceReady, setVoiceReady] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
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
    handleSendMessage(inputMessage, replyTo);
    setPreviewImage(null);
    setInputMessage('');
    setVoiceReady(false);
    clearReply();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

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
      setVoiceReady(true);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setVoiceReady(false);
    };
  }, []);

  return (
    <div className='bg-white border-t border-[#c8e6c9] p-2 sm:p-4 shadow-lg'>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        {previewImage && (
          <div className="mb-2 sm:mb-4 relative">
            <div className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full h-32 sm:h-48">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-500 text-white rounded-full p-1 sm:p-2 hover:bg-red-600 transition-colors duration-300"
                >
                  <XIcon size={16} />
                </button>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-75 p-1 sm:p-2 rounded">
              <p className="text-xs sm:text-sm font-semibold truncate">Image Preview</p>
            </div>
          </div>
        )}
        <div className='flex flex-wrap items-center space-x-1 sm:space-x-3'>
          <button
            type='button'
            onClick={() => setShowEmojiPicker(prev => !prev)}
            className='text-[#4caf50] hover:text-[#2e7d32] transition-colors duration-300 p-1 sm:p-2'
          >
            <SmileIcon size={20} />
          </button>
          {showEmojiPicker && (
            <div className='absolute bottom-20 left-4 z-10'>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <label htmlFor="imageUpload" className='cursor-pointer text-[#4caf50] hover:text-[#2e7d32] transition-colors duration-300 p-1 sm:p-2'>
            <ImageIcon size={20} />
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
            className={`text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#4caf50] hover:bg-[#43a047]'
            }`}
          >
           {isRecording ? <StopCircleIcon size={18} /> : <MicIcon size={18} />}
          </button>
          <div className="flex-1 min-w-0">
            {replyTo && (
              <div className="bg-gray-100 p-1 sm:p-2 rounded-md mb-1 sm:mb-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold truncate">Replying to {replyTo.sender.name}</span>
                  <button 
                    onClick={clearReply} 
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-200 ml-1"
                  >
                    <XIcon size={16} />
                  </button>
                </div>
                <div className="flex items-center">
                  {replyTo.image && (
                    <img 
                      src={replyTo.image} 
                      alt="Reply preview" 
                      className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded mr-1 sm:mr-2"
                    />
                  )}
                  {replyTo.voice && (
                    <div className="mr-1 sm:mr-2">
                      <MicIcon size={16} className="text-blue-500" />
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
              className="w-full border-2 border-[#a5d6a7] rounded-full px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-all duration-300"
              placeholder="Type a message"
            />
          </div>
          <button
            type='submit'
            className='bg-[#4caf50] text-white p-2 sm:p-3 rounded-full hover:bg-[#43a047] transition-all duration-300 shadow-md hover:shadow-lg flex-shrink-0'
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
        {(isRecording || voiceReady) && (
          <div className="mt-2 flex items-center justify-center">
            <div className={`text-xs sm:text-sm px-2 py-1 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'}`}>
              {isRecording ? 'Recording' : 'Voice Ready'}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;