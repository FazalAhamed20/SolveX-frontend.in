import  { forwardRef } from 'react';
import MessageItem from './MessageItem';

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
  typingUser: string;
  isLoading:boolean;
  onDeleteMessage: (messageId: string) => void;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUser, typingUser ,isLoading,onDeleteMessage }: MessageListProps, ref) => {
    return (
      <div  className='flex-1 overflow-y-auto px-4 py-4 bg-[#f0f4f0]'>
        {messages.map(message => (
          <MessageItem ref={ref} key={message._id} message={message} currentUser={currentUser} isLoading={isLoading} onDeleteMessage={onDeleteMessage}  />
        ))}
        {typingUser && (
          <p className='italic text-[#4caf50] mt-2'>{typingUser} is typing...</p>
        )}
      </div>
    );
  }
);

export default MessageList;
