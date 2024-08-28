import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// types/notification.ts

export interface Notification {
  id: string;
  type: 'clanRequest' | 'general' | 'requestPending' | 'acceptRequest' | 'removedClan' | 'requestAccepted' | 'requestRejected';
  content: string;
  userData?: {
    userId: string;
    username: string;
  };
  clanId?: string;
  clanName?: string;
}

export const useSocketNotification = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAccepted,setIsAccepted]=useState(false)
  const [isReject,setIsReject]=useState(false)

  useEffect(() => {
    const newSocket = io('http://localhost:3004');
    newSocket.on('connect', () => {
      console.log('Connected to socket server with ID:', newSocket.id);
      newSocket.emit('joinRoom', userId);
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on('joinRequestNotification', (data: Notification) => {
        console.log('Received join request notification:', data);
        setNotifications(prev => [...prev, data]);
      });

      socket.on('requestPendingNotification', (data: Notification) => {
        console.log('Received request pending notification:', data);
        setNotifications(prev => [...prev, data]);
        setIsReject(false)
      });

      socket.on('requestAcceptedNotification', (data: Notification) => {
        console.log('Received request accepted notification:', data);

        setNotifications(prev => [...prev, data]);
        setIsAccepted(true)
      
      });

      socket.on('requestRejectedNotification', (data: Notification) => {
        console.log('Received request rejected notification:', data);
        setNotifications(prev => [...prev, data]);
        setIsReject(true)
      });
   
    }

    return () => {
      if (socket) {
        socket.off('joinRequestNotification');
        socket.off('requestPendingNotification');
        socket.off('requestAcceptedNotification');
        socket.off('requestRejectedNotification');
      }
    };
  }, [socket]);

  const clearNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return { socket, notifications, clearNotification,isAccepted,isReject };
};
