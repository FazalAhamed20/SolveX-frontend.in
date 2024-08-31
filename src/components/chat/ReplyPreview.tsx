import { MessageSquare } from "lucide-react";





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
        onClick={() => onReplyClick(replyTo._id)}
        className="flex items-start space-x-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200"
      >
        <MessageSquare size={20} className="flex-shrink-0 mt-1" />
        <div className="flex-grow overflow-hidden">
          <p className="font-semibold text-sm truncate">{replyTo.sender.name}</p>
          {replyTo.text ? (
            <p className="text-sm truncate">{replyTo.text}</p>
          ) : replyTo.image ? (
            <p className="text-sm italic">Image</p>
          ) : replyTo.voice ? (
            <div className="flex items-center space-x-1">
              <span className="text-sm italic">Voice message</span>
              <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                Play
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
}
  export default ReplyPreview