import { useSelector } from 'react-redux';
import LeaderBoardTable from '../components/leaderboard/leaderboard/LeaderboardTable';
import Navbar from '../components/navbar/Navbar';
import { useSocketNotification } from '../hooks/useSocketNotification';

function LeaderBoardPage() {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <LeaderBoardTable />
    </div>
  );
}

export default LeaderBoardPage;
