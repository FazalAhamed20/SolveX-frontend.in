




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
      className="bg-gray-100 p-2 rounded-md mb-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
      onClick={() => onReplyClick(replyTo._id)}
    >
    <div className='bg-gray-100 p-2 rounded-md mb-2 text-sm'>
      <p className='font-semibold'>{replyTo.sender.name}</p>
      {replyTo.text ? (
        <p className='text-gray-600 truncate'>{replyTo.text}</p>
      ) : replyTo.image ? (
        <div>
         
          <img src={replyTo.image} alt="Replied image" className="w-20 h-25 object-cover" />
        </div>
      ) : replyTo.voice ? (
        <div>
          <p className='text-gray-600'>Voice message</p>
          <button className="text-blue-500">Play</button>
        </div>
      ) : null}
    </div>
    </div>
  );
}
  export default ReplyPreview