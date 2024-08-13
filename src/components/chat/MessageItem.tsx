import React, { forwardRef } from 'react';
import { FaCheck } from 'react-icons/fa';

interface Message {
  _id: string;
  text: string;
  sender: {
    avatar: any;
    _id: string;
    name: string;
  };
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

interface MessageItemProps {
  message: Message;
  currentUser: any;
}

const MessageItem = ({ message, currentUser }:MessageItemProps,ref:any) => {
  const isOwnMessage = message.sender._id === currentUser._id;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

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
            <FaCheck className='text-green-600' />
            <FaCheck className='text-green-600 -ml-1' />
          </div>
        );
    }
  };

  return (
    <div
    ref={ref}
      className={`flex ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      } mb-3 items-end`}
    >
      {!isOwnMessage && (
        <div className="w-10 h-10 rounded-full bg-green-100 flex-shrink-0 mr-2 overflow-hidden shadow-md transform transition-transform duration-200 hover:scale-110">
          {message.sender.avatar ? (
            <img src={message.sender.avatar} alt={message.sender.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-green-600">
              {message.sender.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      <div
        className={`relative max-w-[90%] px-4 py-2.5 rounded-2xl shadow-md transform transition-all duration-200 ease-in-out hover:shadow-lg ${
          isOwnMessage
            ? 'bg-green-100 text-green-900'
            : 'bg-white text-green-900'
        } hover:-translate-y-0.5`}
      >
        {!isOwnMessage && (
          <span className='block text-xs font-bold mb-1 text-green-700'>
            {message.sender.name}
          </span>
        )}
        <p className='text-sm leading-relaxed'>{message.text}</p>
        <div className='flex justify-end items-center mt-1 space-x-1.5'>
          <span className='block text-[11px] text-green-600'>
            {formattedTime}
          </span>
          {isOwnMessage && (
            <span className='text-[11px] text-green-600'>
              {renderMessageStatus(message.status)}
            </span>
          )}
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
      </div>
    </div>
  );
};

export default forwardRef(MessageItem);