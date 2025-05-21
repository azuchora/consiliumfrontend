import { useEffect } from "react";

const useSocketEvent = (eventName, callback, socket) => {
  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [eventName, callback, socket]);
};

export default useSocketEvent;
