import { useState, useRef, useCallback, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useSocket from "./useSocket";
import useAuth from "./useAuth";

const NOTIFICATIONS_LIMIT = 10;

const useNotifications = () => {
  const axiosPrivate = useAxiosPrivate();
  const notificationsSocket = useSocket("/notifications");
  const { auth } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [before, setBefore] = useState(null);

  const loadingMoreRef = useRef(false);

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

        setNotifications((prev) => {
          if (reset) {
            const merged = mergeNotifications(newNotifications, prev);
            if (merged.length === prev.length) {
              setHasMore(false);
            } else {
              setHasMore(!!pagination.hasMore && newNotifications.length > 0);
            }
            return merged;
          }
          const existingIds = new Set(prev.map((n) => n.id));
          const uniqueNew = newNotifications.filter((n) => !existingIds.has(n.id));
          if (uniqueNew.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(!!pagination.hasMore && newNotifications.length > 0);
          }
          return [...prev, ...uniqueNew];
        });

        setBefore(pagination.timestamp || null);

        if (reset) {
          setUnreadCount(
            mergeNotifications(newNotifications, notifications).filter((n) => !n.read).length
          );
        } else {
          setUnreadCount((prevCount) =>
            prevCount + newNotifications.filter((n) => !n.read).length
          );
        }
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
      setUnreadCount((prev) => prev + 1);
    };
    notificationsSocket.on("notification", onNotification);
    return () => {
      notificationsSocket.off("notification", onNotification);
    };
  }, [notificationsSocket]);

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  }, [notifications, axiosPrivate]);

  return {
    notifications,
    unreadCount,
    hasMore,
    loading,
    fetchNotifications,
    markAllAsRead,
    before,
  };
};

export default useNotifications;