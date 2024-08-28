import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import { acceptRequest, rejectRequest } from '../../redux/actions/ClanAction';

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

interface NotificationDropdownProps {
  notifications: Notification[];
  clearNotification: (index: number) => void;
  socket: Socket | null;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  clearNotification,
  socket
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const clearNotifications = () => {
    notifications.forEach((_, index) => {
      clearNotification(index);
    });
  };

  const handleAcceptRequest = async (ClanId: string, userId: string, clanName: string) => {
    if (socket) {
      socket.emit('acceptRequest', {
        clanId: ClanId,
        userId: userId,
        clanName: clanName
      });
    }
    setIsAccept(true);
    const response = await dispatch(
      acceptRequest({
        clanId: ClanId,
        userId: userId,
      })
    );
    if (response && response.payload && response.payload.success) {
      const index = notifications.findIndex(
        n => n.clanId === ClanId && n.userData?.userId === userId
      );
      if (index !== -1) {
        clearNotification(index);
      }
      setIsAccept(false);
    }
  };

  const handleRejectRequest = async (ClanId: string, userId: string, clanName: string) => {
    if (socket) {
      socket.emit('rejectRequest', {
        clanId: ClanId,
        userId: userId,
        clanName: clanName
      });
    }
    const response = await dispatch(
      rejectRequest({
        clanId: ClanId,
        userId: userId,
      })
    );
    if (response && response.payload && response.payload.success) {
      const index = notifications.findIndex(
        n => n.clanId === ClanId && n.userData?.userId === userId
      );
      if (index !== -1) {
        clearNotification(index);
      }
    }
  };

  return (
    <div className='relative'>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='text-gray-700 hover:bg-gray-200 p-2 rounded-full focus:outline-none'
        onClick={toggleNotifications}
      >
        <FaBell size={20} />
        <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
          {notifications?.length}
        </span>
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
              <h3 className='text-lg font-semibold'>Notifications</h3>
              <button
                onClick={clearNotifications}
                className='text-sm text-blue-500 hover:text-blue-700'
              >
                Clear all
              </button>
            </div>
            {notifications.map((notif, index) => (
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
                            notif.clanName!
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
                            notif.clanName!
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
  );
};

export default NotificationDropdown;