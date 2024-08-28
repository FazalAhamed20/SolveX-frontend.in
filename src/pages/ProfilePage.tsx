import { useSelector } from 'react-redux';
import Navbar from '../components/navbar/Navbar';
import UserProfile from '../components/profile/UserProfile';
import { useSocketNotification } from '../hooks/useSocketNotification';

const ProfilePage = () => {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
