import { useSelector } from 'react-redux';
import Navbar from '../components/navbar/Navbar';
import CodePlatform from '../components/practice/practice/Practice';
import { useSocketNotification } from '../hooks/useSocketNotification';

const PracticePage = () => {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <CodePlatform />
    </div>
  );
};

export default PracticePage;
