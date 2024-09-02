import {  useSelector } from 'react-redux';
import ClanComponent from '../components/clan/clanComponent/ClanComponent';
import Navbar from '../components/navbar/Navbar';
import { useSocketNotification } from '../hooks/useSocketNotification';




const ClanPage = () => {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification,isAccepted,isReject } = useSocketNotification(user._id);
  
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
       <ClanComponent socket={socket} isAccepted={isAccepted} isReject={isReject} />
      
    </div>
  );
};

export default ClanPage;
