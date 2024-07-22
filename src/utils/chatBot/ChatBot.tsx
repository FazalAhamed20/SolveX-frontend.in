import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { FaComments } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { ProblemAxios } from '../../config/AxiosInstance';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ChatMessage = memo(({ msg }: { msg: Message }) => (
  <div
    className={`px-4 py-2 rounded-lg max-w-3/4 self-${msg.role === 'user' ? 'end' : 'start'} transition-all`}
    style={{
      backgroundColor: msg.role === 'user' ? '#007bff' : '#e1e1e1',
      color: msg.role === 'user' ? 'white' : 'black',
    }}
  >
    {msg.content}
  </div>
));

const ChatBot: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (input.trim() !== '') {
      const userMessage: Message = { role: 'user', content: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const response = await ProblemAxios.post('/chat', { prompt: input });
        const botMessage: Message = { role: 'bot', content: response.data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error generating response:', error);
      }

      setInput('');
    }
  }, [input]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="relative">
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-110"
      >
        <FaComments size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-4 w-96 max-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform transform scale-100">
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button onClick={toggleChat}>
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-64">
            <div className="flex flex-col space-y-2">
              {messages.map((msg, index) => (
                <ChatMessage key={index} msg={msg} />
              ))}
              <div ref={chatContainerRef} />
            </div>
          </div>
          <div className="flex items-center p-2 border-t border-gray-300">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 mr-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ChatBot);