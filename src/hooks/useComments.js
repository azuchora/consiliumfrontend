/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useSocket from "./useSocket";
import useSocketEvent from "./useSocketEvent";

const useComments = (postId) => {
  const axiosPrivate = useAxiosPrivate();
  const socket = useSocket("/comments");

  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchComments = useCallback(async (timestamp) => {
    if (!hasMore || isFetching) return;

    setIsFetching(true);
    try {
      const params = timestamp ? { timestamp } : {};
      const response = await axiosPrivate.get(`/posts/${postId}/comments`, { params });
      const newComments = response.data.comments || [];
      const pagination = response.data.pagination || {};

      setComments(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const uniqueNew = newComments.filter(c => !existingIds.has(c.id));
        if (uniqueNew.length === 0) return prev;
        return [...prev, ...uniqueNew];
      });

      if (pagination.hasMore === false || newComments.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError('Błąd ładowania komentarzy');
      }
    } finally {
      setIsFetching(false);
    }
  }, [postId, axiosPrivate, hasMore, isFetching]);

  const addComment = useCallback((newComment) => {
    if (newComment.commentId != null) return;

    setComments(prev => {
      if (prev.some(c => c.id === newComment.id)) return prev;
      return [newComment, ...prev];
    });
  }, []);

  useSocketEvent("newComment", (newComment) => {
    if (newComment.postId === parseInt(postId) && !newComment.commentId) {
      addComment(newComment);
    }
  }, socket);

  return {
    comments,
    addComment,
    fetchComments,
    hasMore,
    isFetching,
    error,
    setComments,
  };
};

export default useComments;
