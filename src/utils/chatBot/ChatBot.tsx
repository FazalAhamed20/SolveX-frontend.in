import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { FaComments, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { ProblemAxios } from '../../config/AxiosInstance';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ChatMessage = memo(({ msg }: { msg: Message }) => (
  <div
    className={`flex items-start space-x-2 mb-4 ${
      msg.role === 'user' ? 'justify-end' : 'justify-start'
    }`}
  >
    {msg.role === 'bot' && (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <FaRobot className="text-white" />
      </div>
    )}
    <div
      className={`px-4 py-2 rounded-lg max-w-[70%] ${
        msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      {msg.content}
    </div>
    {msg.role === 'user' && (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <FaUser className="text-white" />
      </div>
    )}
  </div>
));

const ChatBot: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (input.trim() !== '') {
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');
      setIsTyping(true);

      try {
        const response = await ProblemAxios.post('/chat', { prompt: input });
        const botMessage: Message = {
          role: 'bot',
          content: response.data.response,
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error generating response:', error);
      } finally {
        setIsTyping(false);
      }
    }
  }, [input]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="relative">
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <FaComments size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-w-full bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform scale-100">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <h2 className="text-xl font-bold">AI Assistant</h2>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition duration-150 focus:outline-none"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div
            ref={chatContainerRef}
            className="p-4 overflow-y-auto h-96 bg-gray-50"
          >
            {messages.map((msg, index) => (
              <ChatMessage key={index} msg={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
          <div className="flex items-center p-4 bg-white border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 mr-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ChatBot);