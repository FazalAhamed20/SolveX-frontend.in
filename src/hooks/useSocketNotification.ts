// hooks/useSocketNotification.ts
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// interface Notification {
//     message: string;
//     clanId: string;
//     userId: string;
//   }

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
  

export const useSocketNotification = (userId:string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
  }, []);
  useEffect(() => {
    console.log("socket...",socket)
    if (socket) {
      socket.on('joinRequestNotification', (data: Notification) => {
        console.log("data....................",data)
        setNotifications(prev => [...prev, data]);
      });
    }
    console.log("notif",notifications);
    

    return () => {
      if (socket) {
        socket.off('joinRequestNotification');
      }
    };
  }, [socket]);

  const clearNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return { socket, notifications, clearNotification };
};