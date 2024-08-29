import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  initializeSocket: (userId: string) => void;
  disconnectSocket: () => void;
  

}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const initializeSocket = (userId: string) => {
    if (!socketRef.current) {
      const newSocket = io('www.thecoffeeland.shop', {
        autoConnect: false,
        transports: ['websocket'],
        query: { userId },
      });
      socketRef.current = newSocket;
      setSocket(newSocket);
      newSocket.connect();
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, initializeSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
