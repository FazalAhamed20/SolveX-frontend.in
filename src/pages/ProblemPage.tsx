import ProblemList from '../components/problem/problems/Problem';
import Navbar from '../components/navbar/Navbar';
import { useSelector } from 'react-redux';
import { useSocketNotification } from '../hooks/useSocketNotification';

const ProblemPage = () => {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <ProblemList />
    </div>
  );
};

export default ProblemPage;
