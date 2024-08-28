import { useSelector } from 'react-redux';
import Navbar from '../components/navbar/Navbar';
import SubscriptionComponent from '../components/subscription/subscription/Subscription';
import { useSocketNotification } from '../hooks/useSocketNotification';

function SubscriptionPage() {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <SubscriptionComponent />
    </div>
  );
}

export default SubscriptionPage;
