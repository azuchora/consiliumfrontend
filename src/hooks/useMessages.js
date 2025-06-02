import { useState, useRef, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useSocket from "./useSocket";
import useSocketEvent from "./useSocketEvent";

const MESSAGES_LIMIT = 15;

const useMessages = (selectedConv) => {
  const axiosPrivate = useAxiosPrivate();
  const chatSocket = useSocket("/chat");

  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const chatScrollableRef = useRef(null);

  const fetchMessages = useCallback(
    async ({ before = null, reset = false } = {}) => {
      if (!selectedConv) return;
      if (reset) setMessages([]);
      setLoadingMsgs(true);

      let prevScrollHeight = null;
      if (!reset && chatScrollableRef.current) {
        prevScrollHeight = chatScrollableRef.current.scrollHeight;
      }

      try {
        const params = {};
        if (before) params.before = before;
        const res = await axiosPrivate.get(
          `/conversations/${selectedConv.id}/messages`,
          { params }
        );
        const msgs = res.data.messages || [];
        if (reset) {
          setMessages(msgs.slice().reverse());
        } else {
          setMessages((prev) => [...msgs.slice().reverse(), ...prev]);
        }
        setHasMore(msgs.length === MESSAGES_LIMIT);
      } catch (e) {
        
      } finally {
        setLoadingMsgs(false);
        if (!reset && chatScrollableRef.current && prevScrollHeight !== null) {
          const scrollable = chatScrollableRef.current;
          const newScrollHeight = scrollable.scrollHeight;
          scrollable.scrollTop += newScrollHeight - prevScrollHeight;
        }
      }
    },
    [axiosPrivate, selectedConv]
  );

  useSocketEvent(
    "chatMessage",
    (msg) => {
      if (selectedConv && msg.conversationId === selectedConv.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    },
    chatSocket
  );

  useSocketEvent(
    "chatDelete",
    (data) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.id));
    },
    chatSocket
  );

  const fetchMoreMessages = useCallback(async () => {
    if (!selectedConv || !hasMore || messages.length === 0) return;
    const oldest = messages[0];
    if (!oldest) return;
    await fetchMessages({ before: oldest.createdAt, reset: false });
  }, [selectedConv, hasMore, messages, fetchMessages]);

  const handleSend = useCallback(async () => {
    if (!msgInput.trim() || !selectedConv) return;
    setSending(true);
    try {
      await axiosPrivate.post(
        `/conversations/${selectedConv.id}/messages`,
        { content: msgInput.trim() }
      );
      setMsgInput("");
    } finally {
      setSending(false);
    }
  }, [msgInput, selectedConv, axiosPrivate]);

  return {
    messages,
    setMessages,
    hasMore,
    setHasMore,
    loadingMsgs,
    fetchMessages,
    fetchMoreMessages,
    msgInput,
    setMsgInput,
    sending,
    handleSend,
    chatScrollableRef,
    messagesEndRef,
  };
};

export default useMessages;