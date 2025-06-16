import { createContext, useState, useRef, useCallback, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useSocket from "../hooks/useSocket";
import useAuth from "../hooks/useAuth";

const NOTIFICATIONS_LIMIT = 15;

const NotificationsContext = createContext({});

export const NotificationsProvider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const notificationsSocket = useSocket("/notifications");
  const { auth } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [before, setBefore] = useState(null);

  const loadingMoreRef = useRef(false);

  const filterChat = (arr) => arr.filter((n) => n.type === "new_message");
  const filterNonChat = (arr) => arr.filter((n) => n.type !== "new_message");

  const nonChatNotifications = filterNonChat(notifications);
  const nonChatUnreadCount = nonChatNotifications.filter((n) => !n.read).length;
  const chatUnreadCount = filterChat(notifications).filter((n) => !n.read).length;

  const getChatNotificationsForConversation = (conversationId) =>
    filterChat(notifications).filter(
      (n) => n.metadata.conversationId === conversationId && !n.read
    );

  const markChatNotificationsAsRead = useCallback(
    async (conversationId) => {
      setNotifications((prev) => {
        const chatNotifs = prev.filter(
          (n) => n.type === "new_message" && n.metadata.conversationId === conversationId && !n.read
        );
        if (chatNotifs.length === 0) return prev;
        chatNotifs.forEach((n) => {
          axiosPrivate.patch(`/notifications/${n.id}/read`).catch(() => {});
        });
        return prev.map((n) =>
          n.type === "new_message" && n.metadata.conversationId === conversationId
            ? { ...n, read: true }
            : n
        );
      });
    },
    [axiosPrivate]
  );

  const mergeNotifications = (incoming, existing) => {
    const map = new Map();
    [...incoming, ...existing].forEach((n) => {
      map.set(n.id, n);
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const fetchNotifications = useCallback(
    async (beforeParam = null, reset = false) => {
      if (loadingMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoading(true);

      try {
        const params = {
          limit: NOTIFICATIONS_LIMIT,
        };
        if (beforeParam) params.before = beforeParam;
        const res = await axiosPrivate.get("/notifications", { params });
        const newNotifications = res.data.notifications || [];
        const pagination = res.data.pagination || {};

        let merged;
        if (reset) {
          merged = mergeNotifications(newNotifications, notifications);
        } else {
          const existingIds = new Set(notifications.map((n) => n.id));
          const uniqueNew = newNotifications.filter((n) => !existingIds.has(n.id));
          merged = mergeNotifications([...notifications, ...uniqueNew], []);
        }
        setNotifications(merged);

        setHasMore(!!pagination.hasMore && newNotifications.length > 0);
        setBefore(pagination.timestamp || null);

        setUnreadCount(
          merged.filter((n) => n.type !== "new_message" && !n.read).length
        );
      } catch (e) {
        console.error("Error fetching notifications:", e);
      } finally {
        setLoading(false);
        loadingMoreRef.current = false;
      }
    },
    [axiosPrivate, notifications]
  );

  useEffect(() => {
    if (!notificationsSocket || !auth?.id) return;
    notificationsSocket.emit("joinUserRoom", auth.id);
    return () => {
      notificationsSocket.emit("leaveUserRoom", auth.id);
    };
  }, [notificationsSocket, auth?.id]);

  useEffect(() => {
    if (!notificationsSocket) return;
    const onNotification = (notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
      if (notification.type !== "new_message") {
        setUnreadCount((prev) => prev + 1);
      }
    };
    notificationsSocket.on("notification", onNotification);
    return () => {
      notificationsSocket.off("notification", onNotification);
    };
  }, [notificationsSocket]);

  const markAllAsRead = useCallback(async () => {
    const unreadIds = filterNonChat(notifications).filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) {
      setUnreadCount(0);
      setNotifications(prev =>
        prev.map(n => n.type !== "new_message" ? { ...n, read: true } : n)
      );
      return;
    }
    try {
      await Promise.all(
        unreadIds.map(id => axiosPrivate.patch(`/notifications/${id}/read`))
      );
      setNotifications(prev =>
        prev.map(n => unreadIds.includes(n.id) ? { ...n, read: true } : n)
      );
      setUnreadCount(0);
    } catch (e) {
      setNotifications(prev =>
        prev.map(n => unreadIds.includes(n.id) ? { ...n, read: true } : n)
      );
      setUnreadCount(0);
    }
  }, [notifications, axiosPrivate]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount: nonChatUnreadCount,
        hasMore,
        loading,
        fetchNotifications,
        markAllAsRead,
        before,
        chatUnreadCount,
        markChatNotificationsAsRead,
        getChatNotificationsForConversation,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;