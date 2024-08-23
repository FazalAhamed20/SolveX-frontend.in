import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
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
  }

interface MobileMenuProps {
  isMenuOpen: boolean;
  notifications: Notification[];
  clearNotification: (index: number) => void;
  socket: Socket | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
      <div className='px-2 pt-2 pb-3 space-y-1'>
        {user ? (
          <>
            <Link to='/home' className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'>
              Home
            </Link>
            <Link to='/problem' className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'>
              Problem
            </Link>
            <Link to='/context' className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'>
              Practice
            </Link>
            <Link to='/leaderboard' className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'>
              Leaderboard
            </Link>
            <Link to='/clan' className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'>
              Clan
            </Link>
            <Link to='/subscription' className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'>
              Subscription
            </Link>
            <UserDropdown user={user} />
          </>
        ) : (
          <Link to='/signup' className='bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium'>
            Register Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;