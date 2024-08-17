import { useDispatch, useSelector } from 'react-redux';
import ClanComponent from '../components/clan/clanComponent/ClanComponent';
import Navbar from '../components/navbar/Navbar';
import { useSocketNotification } from '../hooks/useSocketNotification';
import { AppDispatch } from '../redux/Store';

const ClanPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} />
       <ClanComponent socket={socket} />
    </div>
  );
};

export default ClanPage;
