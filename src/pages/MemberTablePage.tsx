import { useSelector } from 'react-redux';
import MemberTable from '../components/clan/clantable/MemberTable';
import Navbar from '../components/navbar/Navbar';
import { useSocketNotification } from '../hooks/useSocketNotification';

const MemberTablePage = () => {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <MemberTable />
    </div>
  );
};

export default MemberTablePage;
