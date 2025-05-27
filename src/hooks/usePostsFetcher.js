import { useState, useCallback } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

const usePostsFetcher = (filters = {}) => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchPosts = useCallback(async (timestamp = null, reset = false) => {
      try {
        setIsLoading(true);
        
        const params = {
          ...(timestamp && { timestamp }),
          ...filters,
        };

        const response = await axiosPrivate.get('/posts', { params });

        const newPosts = response.data.posts || [];
        const pagination = response.data.pagination || {};

        setPosts((prevPosts) => {
          if (reset) {
            return newPosts;
          }
          const existingIds = new Set(prevPosts.map((p) => p.id));
          const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));
          return [...prevPosts, ...uniqueNewPosts];
        });

        setHasMore(pagination.hasMore && newPosts.length > 0);
      } catch (err) {
        console.error('Fetch posts error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [axiosPrivate, filters]
  );

  const resetPosts = useCallback(() => {
    setPosts([]);
    setHasMore(true);
  }, []);

  return { posts, hasMore, isLoading, fetchPosts, resetPosts, setPosts };
};

export default usePostsFetcher;