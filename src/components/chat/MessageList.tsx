import  { forwardRef } from 'react';
import MessageItem from './MessageItem';
import React from 'react';

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
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUser ,isLoading,onDeleteMessage,onReplyMessage }: MessageListProps, ref) => {

  

    return (
      <div  className='flex-1 overflow-y-auto px-4 py-4 bg-[#f0f4f0]'>
        {messages.map(message => (
          <MessageItem ref={ref} key={message._id} message={message} currentUser={currentUser} isLoading={isLoading} onDeleteMessage={onDeleteMessage} onReplyMessage={onReplyMessage}  />
        ))}
        
      </div>
    );
  }
);

export default React.memo(MessageList);
