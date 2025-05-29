import { useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useSocket from "./useSocket";
import useSocketEvent from "./useSocketEvent";

const useCommentReplies = (commentId, isParentComment) => {
  const axiosPrivate = useAxiosPrivate();
  const socket = useSocket("/comments");
  const [replies, setReplies] = useState([]);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);
  const [repliesErr, setRepliesErr] = useState(null);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const fetchReplies = useCallback(async () => {
    setIsLoadingReplies(true);
    setRepliesErr(null);
    try {
      const response = await axiosPrivate.get(`/comments/${commentId}/replies`);
      const newReplies = response.data.replies || [];
      const pagination = response.data.pagination || {};
      setReplies(newReplies);
      setHasMoreReplies(!!pagination.hasMore);
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      setRepliesErr("Błąd ładowania odpowiedzi");
    } finally {
      setIsLoadingReplies(false);
    }
  }, [axiosPrivate, commentId]);

  const handleToggleReplies = () => {
    if (!isRepliesVisible) {
      fetchReplies();
      setIsRepliesVisible(true);
    } else {
      setIsRepliesVisible(false);
      setReplies([]);
    }
  };

  const handleReplyAdded = (newReply) => {
    setReplies((prev) => {
      if (prev.some((r) => r.id === newReply.id)) return prev;
      return [newReply, ...prev];
    });
    setHasMoreReplies(true);
  };

  const handleReplyDeleted = (id) => {
    setReplies((prev) => prev.filter(r => r.id !== id));
  };

  useSocketEvent(
    "newComment",
    (newComment) => {
      if (isParentComment && newComment.commentId === commentId) {
        handleReplyAdded(newComment);
      }
    },
    socket
  );

  return {
    replies,
    hasMoreReplies,
    isRepliesVisible,
    repliesErr,
    isLoadingReplies,
    fetchReplies,
    handleToggleReplies,
    setIsRepliesVisible,
    setReplies,
    handleReplyAdded,
    handleReplyDeleted,
  };
};

export default useCommentReplies;
