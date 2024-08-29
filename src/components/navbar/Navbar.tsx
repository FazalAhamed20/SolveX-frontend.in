import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/Store';
import { fetchAllClan } from '../../redux/actions/ClanAction';
import { Socket } from 'socket.io-client';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

interface ClanMember {
  id: string;
  name: string;
  role: 'leader' | 'member';
}

interface Clan {
  _id: string;
  name: string;
  description: string;
  members: ClanMember[];
  request: any[];
  trophies: string;
  userId: string;
}

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
  seen:boolean
}

interface NavbarProps {
  notifications:any;
  clearNotification: (index: number) => void;
  socket: Socket | null;

}

const Navbar: React.FC<NavbarProps> = ({
  notifications,
  clearNotification,
  socket,

}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState<Notification[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setNotification(notifications);
  }, [notifications]);

  useEffect(() => {
    const fetchPending = async () => {
      const response = await dispatch(fetchAllClan());
      console.log('response', response);
  
      if (response.payload && Array.isArray(response.payload)) {
        const clans: Clan[] = response.payload;
        const userLeaderClans = clans.filter(clan =>
          clan.members.some(
            member => member.id === user._id && member.role === 'leader',
          ),
        );
        console.log('leader', userLeaderClans);
  
        let newNotifications: Notification[] = [];
  
        if (userLeaderClans.length > 0) {
          
          userLeaderClans.map(clan => clan._id);
          newNotifications = userLeaderClans.flatMap(clan => {
            if (Array.isArray(clan.request) && clan.request.length > 0) {
              return clan.request
                .filter(req => req.status === 'Pending')
                .map(req => ({
                  id: `${clan._id}-${req.userId}`,
                  type: 'clanRequest' as const,
                  content: `${req.username} wants to join your clan "${clan.name}"`,
                  userData: {
                    userId: req.userId,
                    username: req.username,
                  },
                  clanId: clan._id,
                  clanName:clan.name,
                   seen: false,
                }));
            }
            return [];
          });
        }
  
        
        const userPendingClans = clans.filter(clan =>
          clan.request.some(req => req.userId === user._id)
        );
  
        const pendingNotifications = userPendingClans.map(clan => ({
          id: `${clan._id}-${user._id}-pending`,
          type: 'requestPending' as const,
          content: `Your request to join "${clan.name}" is pending`,
          clanData: {
            clanId: clan._id,
            clanName: clan.name,
          },
          
          seen: false,
        }));
   
  
        newNotifications = [...newNotifications, ...pendingNotifications];
  
        console.log('notifications', newNotifications);
        setNotification(prev => {
          const prevNotifications = Array.isArray(prev) ? prev : [];
          const uniqueNewNotifications = newNotifications.filter(
            newNotif =>
              !prevNotifications.some(
                existingNotif => existingNotif.id === newNotif.id,
              ),
          );
          return [...prevNotifications, ...uniqueNewNotifications];
        });
      }
    };
    fetchPending();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='bg-white shadow-md z-10'>
      <div className='max-w-full mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <img
              className='h-6 w-auto'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/c869578c6dcaa35301d4bd19676c539d8b9e6b6d26a4b22898f4201318589d79?'
              alt='Logo'
            />
            <span className='ml-2 text-2xl font-bold text-gray-800'>
              SolveX
            </span>
          </div>

          <DesktopMenu 
            notifications={notification}
            clearNotification={clearNotification}
            socket={socket}
          
          />

          <div className='flex sm:hidden'>
            <button
              type='button'
              className='text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 px-3 py-2 rounded-md'
              aria-label='Toggle menu'
              onClick={toggleMenu}
            >
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isMenuOpen={isMenuOpen} 
        notifications={notification}
        clearNotification={clearNotification}
        socket={socket}
      />
    </nav>
  );
};

export default Navbar;