import { useSelector } from 'react-redux';
import Navbar from '../components/navbar/Navbar';
import PracticalCodingList from '../components/practice/practicals/PracticalCodingList';
import { useSocketNotification } from '../hooks/useSocketNotification';

const ContextPage = () => {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <PracticalCodingList />
    </div>
  );
};

export default ContextPage;
