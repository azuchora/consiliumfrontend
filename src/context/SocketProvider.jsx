import { createContext, useState, useEffect, useMemo } from 'react';
import useSocketPrivate from '../hooks/useSocketPrivate';

export const SocketContext = createContext({
  sockets: {},
  connections: {},
});

export const SocketProvider = ({ children }) => {
  const commentsSocket = useSocketPrivate('/comments');
  const notificationsSocket = useSocketPrivate('/notifications');

  const sockets = useMemo(() => ({
    '/comments': commentsSocket,
    '/notifications': notificationsSocket,
  }), [commentsSocket, notificationsSocket]);

  const [connections, setConnections] = useState({});

  useEffect(() => {
    const tempConnections = {};

    const handlers = [];

    Object.entries(sockets).forEach(([ns, socket]) => {
      if (!socket) return;

      const onConnect = () => {
        tempConnections[ns] = true;
        setConnections(prev => {
          if (prev[ns] === true) return prev;
          return { ...prev, [ns]: true };
        });
      };

      const onDisconnect = () => {
        tempConnections[ns] = false;
        setConnections(prev => {
          if (prev[ns] === false) return prev;
          return { ...prev, [ns]: false };
        });
      };

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);

      handlers.push({ socket, onConnect, onDisconnect });
    });

    return () => {
      handlers.forEach(({ socket, onConnect, onDisconnect }) => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      });
    };
  }, [sockets]);

  return (
    <SocketContext.Provider value={{ sockets, connections }}>
      {children}
    </SocketContext.Provider>
  );
};
