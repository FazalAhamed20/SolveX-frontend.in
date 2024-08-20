import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/Store';
import { Logout } from '../../redux/actions/AuthActions';
import { googleLogout } from '@react-oauth/google';
import LogoutModal from '../../utils/modal/LogoutModal';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { acceptRequest, fetchAllClan } from '../../redux/actions/ClanAction';

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
  request: any[]; // You might want to define a more specific type for requests
  trophies: string;
  userId: string;
  // ... other properties
}

interface Notification {
  id: string;
  type: 'clanRequest' | 'general';
  content: string;
  userData?: {
    userId: string;
    username: string;
  };
  clanId?: string;
}
interface NavbarProps {
  notifications: Notification[];
  clearNotification: (index: number) => void;
}
const Navbar: React.FC<NavbarProps> = ({
  notifications,
  clearNotification,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isUserClanLeader, setIsUserClanLeader] = useState(false);
  const [leaderClanIds, setLeaderClanIds] = useState<string[]>([]);
  const [isAccept, setIsAccept] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  console.log('notification', notifications);

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
        if (userLeaderClans.length > 0) {
          setIsUserClanLeader(true);
          setLeaderClanIds(userLeaderClans.map(clan => clan._id));
          const newNotifications = userLeaderClans.flatMap(clan => {
            if (Array.isArray(clan.request) && clan.request.length > 0) {
              return clan.request.map(req => ({
                id: `${clan._id}-${req.userId}`,
                type: 'clanRequest' as const,
                content: `${req.username} wants to join your clan "${clan.name}"`,
                userData: {
                  userId: req.userId,
                  username: req.username,
                },
                clanId: clan._id,
              }));
            }
            return [];
          });

          console.log('notifi', newNotifications);
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
      }
    };
    fetchPending();
  }, [dispatch]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const clearNotifications = () => {
    setNotification([]);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await dispatch(Logout());
      await googleLogout();
      setIsDropdownOpen(false);
      setShowModal(false);
      navigate('/login', { replace: false });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (ClanId: any, userId: any) => {
    setIsAccept(true);
    console.log(ClanId, userId);
    const response = await dispatch(
      acceptRequest({
        clanId: ClanId,
        userId: userId,
      }),
    );
    if (response && response.payload && response.payload.success) {
      setNotification(prev =>
        prev.filter(
          n => !(n.clanId === ClanId && n.userData?.userId === userId),
        ),
      );

      const index = notifications.findIndex(
        n => n.clanId === ClanId && n.userData?.userId === userId,
      );
      if (index !== -1) {
        clearNotification(index);
      }

      setIsAccept(false);
    }
  };
  const handleRejectRequest = async (ClanId: any, userId: any) => {
    console.log(ClanId, userId);
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
            <span
              className='ml-2 text-2xl font-bold text-gray-800'
              onClick={handleLogout}
            >
              SolveX
            </span>
          </div>

          <div className='hidden sm:flex sm:items-center sm:ml-6'>
            {user ? (
              <div className='flex space-x-4 items-center'>
                <Link
                  to='/home'
                  className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Home
                </Link>
                <Link
                  to='/problem'
                  className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Problem
                </Link>
                <Link
                  to='/context'
                  className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Practice
                </Link>
                <Link
                  to='/leaderboard'
                  className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Leaderboard
                </Link>
                <Link
                  to='/clan'
                  className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Clan
                </Link>
                <Link
                  to='/subscription'
                  className='text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Subscription
                </Link>
                <div className='relative'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='text-gray-700 hover:bg-gray-200 p-2 rounded-full focus:outline-none'
                    onClick={toggleNotifications}
                  >
                    <FaBell size={20} />
                    {notification?.length ? (
                      <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                        {notification.length}
                      </span>
                    ) : (
                      <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                        0
                      </span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50'
                      >
                        <div className='px-4 py-2 border-b border-gray-200 flex justify-between items-center'>
                          <h3 className='text-lg font-semibold'>
                            Notifications
                          </h3>
                          <button
                            onClick={clearNotifications}
                            className='text-sm text-blue-500 hover:text-blue-700'
                          >
                            Clear all
                          </button>
                        </div>
                        {notification.map((notif, index) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                          >
                            {notif.type === 'clanRequest' ? (
                              <div>
                                <p>{notif.content}</p>
                                <div className='mt-2 flex justify-end space-x-2'>
                                  <button
                                    onClick={() =>
                                      handleAcceptRequest(
                                        notif.clanId!,
                                        notif.userData!.userId,
                                      )
                                    }
                                    className='bg-green-500 text-white px-2 py-1 rounded text-sm'
                                  >
                                    {isAccept ? 'Accepting....' : 'Accept'}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRejectRequest(
                                        notif.clanId!,
                                        notif.userData!.userId,
                                      )
                                    }
                                    className='bg-red-500 text-white px-2 py-1 rounded text-sm'
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p>{notif.content}</p>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className='relative z-30'>
                  <button
                    onClick={toggleDropdown}
                    className='bg-green-500 text-white h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium focus:outline-none'
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt='Profile'
                        className='w-full h-full rounded-full object-cover'
                      />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2'>
                      <Link
                        to='/profile'
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                      <a
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer '
                        onClick={() => setShowModal(true)}
                      >
                        Logout
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to='/signup'
                className='bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium'
              >
                Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
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

      {/* Responsive Menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          {user ? (
            <>
              <Link
                to='/home'
                className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'
                onClick={() => navigate('/home')}
              >
                Home
              </Link>
              <Link
                to='/problem'
                className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'
              >
                Problem
              </Link>
              <Link
                to='/context'
                className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'
              >
                Practice
              </Link>
              <Link
                to='/leaderboard'
                className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'
              >
                Leaderboard
              </Link>
              <Link
                to='/clan'
                className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'
              >
                Clan
              </Link>
              <Link
                to='/subscription'
                className='text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium'
              >
                Subscription
              </Link>
              <div className='relative'>
                <button
                  onClick={toggleDropdown}
                  className='bg-green-500 text-white h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium mx-auto focus:outline-none'
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt='Profile'
                      className='w-full h-full rounded-full object-cover'
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </button>
                {isDropdownOpen && (
                  <div className='mt-2 w-48 bg-white rounded-md shadow-lg py-2 mx-auto'>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      onClick={() => {
                        setIsDropdownOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <a
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      onClick={() => setShowModal(true)}
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <a
              className='bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium'
              onClick={() => navigate('/signup')}
            >
              Register Now
            </a>
          )}
        </div>
      </div>
      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
        data={'Logout'}
        isLoading={false}
      />
      {loading && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <ClipLoader color='#ffffff' loading={loading} size={50} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
