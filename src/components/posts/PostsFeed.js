import { useState, useCallback, useMemo } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import './PostsFeed.css';
import PostPreview from './PostPreview';
import Loading from '../messages/Loader';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [visiblePostIds, setVisiblePostIds] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const revealPostsSequentially = (newPosts) => {
    if (!Array.isArray(newPosts) || newPosts.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if(index >= newPosts.length){
        clearInterval(interval);
        return;
      }

      const post = newPosts[index];
      if(post?.id){
        setVisiblePostIds(prev => [...prev, post.id]);
      }

      index++;
    }, 100); 
  };

  const fetchPosts = useCallback(
    async (timestamp) => {
      if (!hasMore) return;

      try {
        const params = timestamp ? { timestamp } : {};
        const response = await axiosPrivate.get('/posts', { params });
        
        const newPosts = response.data.posts || [];
        const pagination = response.data.pagination || {};

        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));

          if(uniqueNewPosts.length > 0){
            revealPostsSequentially(uniqueNewPosts);
          }

          return [...prev, ...uniqueNewPosts];
        });

        if (pagination.hasMore === false || newPosts.length === 0){
          setHasMore(false);
        }
      } catch (err){
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED'){
          console.log('Request canceled:', err.message);
        }
      }
    }, [axiosPrivate, hasMore]
  );

  const { isFetching } = useInfiniteScroll({
    fetchData: fetchPosts,
    useTimestamp: true,
    getLastTimestamp: () => {
      return posts.length > 0 ? posts[posts.length - 1].created_at : null;
    },
  });

  const renderedPosts = useMemo(() => {
    return posts.map((post) => (
      <li key={post.id}>
        <PostPreview
          post={post}
          visible={!post.isNew || visiblePostIds.includes(post.id)}
        />
      </li>
    ));
  }, [posts, visiblePostIds]);

  return (
    <article className="posts-feed-container">
      <section className="posts-feed-list">
        {posts.length > 0 ? (
          <ul>
            {renderedPosts}
          </ul>
        ) : (
          !isFetching && <p>Brak postów</p>
        )}
        {isFetching && <Loading />}
        {!hasMore && (
          <div className="end-of-posts">
            <FontAwesomeIcon icon={faCircleCheck} color="#4CAF50" style={{ marginRight: '0.5rem' }} />
            To już wszystkie posty.
          </div>
        )}
      </section>
    </article>
  );
};

export default PostsFeed;