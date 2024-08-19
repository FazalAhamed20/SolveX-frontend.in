import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSmile, FaImage, FaTimes, FaMicrophone, FaStop } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
  handleTyping: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmojiClick: (emoji: { emoji: string }) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVoiceMessage: (audioBlob: Blob) => void;
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
  handleVoiceMessage
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
    handleSendMessage(e);
    setPreviewImage(null);
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
            <div className="flex-1 border-2 border-[#a5d6a7] rounded-full px-4 py-2 overflow-hidden">
           
          </div>
          ) : (
            <input
    type='text'
    value={inputMessage}
    onChange={e => {
      setInputMessage(e.target.value);
      handleTyping();
    }}
    className='flex-1 border-2 border-[#a5d6a7] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-all duration-300'
    placeholder='Type a message'
  />
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