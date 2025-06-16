import { useContext } from "react";
import NotificationsContext from "../context/NotificationsProvider";

const useNotifications = () => {
  return useContext(NotificationsContext);
};

export default useNotifications;