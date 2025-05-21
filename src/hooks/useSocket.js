import { useContext } from 'react';
import { SocketContext } from '../context/SocketProvider';

const useSocket = (namespace) => {
  const { sockets } = useContext(SocketContext);
  return sockets[namespace] || null;
};

export default useSocket;
