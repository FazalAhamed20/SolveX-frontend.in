import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';
import { Socket } from 'socket.io-client';

interface Notification {
  id: string;
  type: 'clanRequest' | 'general' | 'requestPending' | "acceptRequest" | "removedClan";
  content: string;
  userData?: {
    userId: string;
    username: string;
  };
  clanId?: string;
  clanName?: string;
  isRead:boolean
}

interface DesktopMenuProps {
  notifications: Notification[];
  clearNotification: (index: number) => void;
  socket: Socket | null;
  markAsRead:(id:string)=>void
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({
  notifications,
  clearNotification,
  socket,
  markAsRead
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className='hidden sm:flex sm:items-center sm:ml-6'>
      {user ? (
        <div className='flex space-x-4 items-center'>
          <Link to='/home' className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'>
            Home
          </Link>
          <Link to='/problem' className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'>
            Problem
          </Link>
          <Link to='/context' className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'>
            Practice
          </Link>
          <Link to='/leaderboard' className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'>
            Leaderboard
          </Link>
          <Link to='/clan' className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'>
            Clan
          </Link>
          <Link to='/subscription' className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'>
            Subscription
          </Link>
          <NotificationDropdown 
            notifications={notifications}
            clearNotification={clearNotification}
            socket={socket}
            markAsRead={markAsRead}
          />
          <UserDropdown user={user} />
        </div>
      ) : (
        <Link to='/signup' className='bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium'>
          Register
        </Link>
      )}
    </div>
  );
};

export default DesktopMenu;