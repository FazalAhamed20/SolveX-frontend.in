import Navbar from '../components/navbar/Navbar';
import Home from '../components/home/home/Home';
import Footer from '../components/footer/Footer';
import { useSelector } from 'react-redux';
import { useSocketNotification } from '../hooks/useSocketNotification';

const LandingPage = () => {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user?._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <Home />
      <Footer />
    </div>
  );
};

export default LandingPage;
