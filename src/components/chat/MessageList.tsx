import  { forwardRef } from 'react';
import MessageItem from './MessageItem';
import React from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  _id: string;
  text: string;
  image?:string;
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
  isLoading:boolean;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage:any
  socket:Socket | null
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUser ,isLoading,onDeleteMessage,onReplyMessage ,socket}: MessageListProps, ref) => {

  

    return (
      <div className="w-full max-w-3xl mx-auto">
        {messages.map(message => (
          <div key={message._id} className="mb-4 p-3 bg-white rounded-lg shadow">
          <MessageItem ref={ref} key={message._id} message={message} currentUser={currentUser} isLoading={isLoading} onDeleteMessage={onDeleteMessage} onReplyMessage={onReplyMessage} socket={socket}  />
          </div>
        ))}
        
      </div>
    );
  }
);

export default React.memo(MessageList);
