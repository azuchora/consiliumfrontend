/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import useRefreshToken from './useRefreshToken';
import { createRawSocket } from '../socket';

const useSocketPrivate = (namespace) => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if(!auth?.accessToken){
      return;
    }

    const sock = createRawSocket(namespace);
    sock.auth = { token: auth?.accessToken };

    sock.on('connect_error', async (err) => {
      console.warn('Socket connect error: ', err?.message);
      if(err.message === 'Forbidden'){
        try {
          const newToken = await refresh();
          sock.auth = { token: newToken };
          sock.disconnect();
          sock.connect();
        } catch (e) {
          console.error('Token refresh failed in socket', e);
        }
      }
    });

    sock.connect();
    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, [namespace, auth?.accessToken]);

  return socket;
};

export default useSocketPrivate;
