import { useSelector } from "react-redux";
import GroupChat from "../components/chat/GroupChat"
import Navbar from "../components/navbar/Navbar"
import { useSocketNotification } from "../hooks/useSocketNotification";


function GroupChatPage() {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
        <GroupChat/>
      
    </div>
  )
}

export default GroupChatPage
