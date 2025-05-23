import { useState, useCallback } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

const usePostsFetcher = () => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const fetchPosts = useCallback(
    async (timestamp) => {
      if (!hasMore) return;

      try {
        const params = timestamp ? { timestamp } : {};
        const response = await axiosPrivate.get('/posts', { params });
        const newPosts = response.data.posts || [];
        const pagination = response.data.pagination || {};

        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((p) => p.id));
          const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));

          return [...prevPosts, ...uniqueNewPosts];
        });

        if (pagination.hasMore === false || newPosts.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Fetch posts error:', err);
        }
      }
    },
    [axiosPrivate, hasMore]
  );

  return { posts, hasMore, fetchPosts };
};

export default usePostsFetcher;
