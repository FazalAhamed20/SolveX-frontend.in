import { useSelector } from 'react-redux';
import Footer from '../components/footer/Footer';
import LandingHome from '../components/home/userHome/LandingHome';
import Navbar from '../components/navbar/Navbar';
import { useSocketNotification } from '../hooks/useSocketNotification';

function LandingHomePage() {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <LandingHome />
      <Footer />
    </div>
  );
}

export default LandingHomePage;
