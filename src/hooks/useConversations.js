import { useState, useCallback, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useSocket from "./useSocket";
import useSocketEvent from "./useSocketEvent";

const useConversations = (auth) => {
  const axiosPrivate = useAxiosPrivate();
  const chatSocket = useSocket("/chat");

  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [selectedConv, setSelectedConv] = useState(null);

  const fetchConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const res = await axiosPrivate.get("/conversations");
      setConversations(res.data.conversations || []);
    } catch (e) {
      
    } finally {
      setLoadingConvs(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    if (!chatSocket || !auth?.id) return;
    chatSocket.emit("joinUserRoom", auth.id);
    return () => {
      chatSocket.emit("leaveUserRoom", auth.id);
    };
  }, [chatSocket, auth?.id]);
  
  useSocketEvent(
    "chatMessage",
    (msg) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? { ...c, lastMessageAt: msg.createdAt }
            : c
        )
      );
    },
    chatSocket
  );

  const selectConversation = useCallback((conv) => {
    setSelectedConv(conv);
  }, []);

  return {
    conversations,
    setConversations,
    loadingConvs,
    fetchConversations,
    selectedConv,
    setSelectedConv,
    selectConversation,
  };
};

export default useConversations;