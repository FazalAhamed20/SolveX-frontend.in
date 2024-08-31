import React, { forwardRef, useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import { Socket } from 'socket.io-client';
import { useInView } from 'react-intersection-observer';

interface Message {
  _id: string;
  text: string;
  image?: string;
  sender: {
    avatar: any;
    _id: string;
    name: string;
  };
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

interface MessageListProps {
  messages: Message[];
  currentUser: any;
  isLoading: boolean;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: any;
  socket: Socket | null;
  onLoadMore?: () => void;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUser, isLoading, onDeleteMessage, onReplyMessage, socket, onLoadMore }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [topRef, inView] = useInView({
      threshold: 0,
    });

    useEffect(() => {
      if (inView && onLoadMore) {
        onLoadMore();
      }
    }, [inView, onLoadMore]);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [messages]);

    return (
      <div 
        ref={containerRef}
        className='flex-1 overflow-y-auto px-2 sm:px-4 py-4 bg-[#f0f4f0] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
      >
        <div ref={topRef} />
        {messages.map((message, index) => (
          <MessageItem
            key={message._id}
            ref={index === messages.length - 1 ? ref : null}
            message={message}
            currentUser={currentUser}
            isLoading={isLoading}
            onDeleteMessage={onDeleteMessage}
            onReplyMessage={onReplyMessage}
            socket={socket}
          />
        ))}
      </div>
    );
  }
);

export default React.memo(MessageList);