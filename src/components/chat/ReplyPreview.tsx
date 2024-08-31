import React from 'react';
import { FaImage, FaMicrophone } from 'react-icons/fa';

interface ReplyTo {
  _id: string;
  text?: string;
  image?: string;
  voice?: string;
  sender: {
    name: string;
  };
}

interface ReplyPreviewProps {
  replyTo: ReplyTo;
  onReplyClick: (messageId: string) => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ replyTo, onReplyClick }) => {
  return (
    <div 
      className="bg-gray-100 p-2 rounded-md mb-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200 max-w-full"
      onClick={() => onReplyClick(replyTo._id)}
    >
      <div className='flex items-start space-x-2 text-sm'>
        <div className='flex-shrink-0 w-1 bg-blue-500 self-stretch'></div>
        <div className='flex-grow overflow-hidden'>
          <p className='font-semibold text-blue-600 mb-1'>{replyTo.sender.name}</p>
          {replyTo.text ? (
            <p className='text-gray-600 truncate'>{replyTo.text}</p>
          ) : replyTo.image ? (
            <div className='flex items-center space-x-2'>
              <FaImage className='text-gray-500' />
              <span className='text-gray-600'>Image</span>
            </div>
          ) : replyTo.voice ? (
            <div className='flex items-center space-x-2'>
              <FaMicrophone className='text-gray-500' />
              <span className='text-gray-600'>Voice message</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ReplyPreview;