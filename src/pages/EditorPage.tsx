import CodeEditor from '../components/problem/editor/CodeEditor';
import Navbar from '../components/navbar/Navbar';
import { useSelector } from 'react-redux';
import { useSocketNotification } from '../hooks/useSocketNotification';

function EditorPage() {
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <CodeEditor />
    </div>
  );
}

export default EditorPage;
