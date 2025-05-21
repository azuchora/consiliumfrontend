import { io } from "socket.io-client";
import { BACKEND_URL } from "../api/axios";


export const createRawSocket = (namespace) => {
  return io(BACKEND_URL + namespace, {
    autoConnect: false, 
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });
}
