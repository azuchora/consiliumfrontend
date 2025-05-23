import { useMemo } from 'react';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import usePostsFetcher from '../../hooks/usePostsFetcher';
import PostPreview from './PostPreview';
import Loading from '../messages/Loader';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PostsFeed.css';

const PostsFeed = () => {
  const { posts, hasMore, fetchPosts } = usePostsFetcher();

  const { isFetching } = useInfiniteScroll({
    fetchData: fetchPosts,
    useTimestamp: true,
    getLastTimestamp: () => {
      return posts.length > 0 ? posts[posts.length - 1].createdAt : null;
    },
  });

  const renderedPosts = useMemo(() => {
    return posts.map((post) => (
      <li key={post.id}>
        <PostPreview post={post} />
      </li>
    ));
  }, [posts]);

  return (
    <article className="posts-feed-container">
      <section className="posts-feed-list">
        {posts.length > 0 ? (
          <ul>{renderedPosts}</ul>
        ) : (
          !isFetching && <p>Brak postów</p>
        )}
        {isFetching && <Loading />}
        {!hasMore && (
          <div className="posts-feed-end">
            <FontAwesomeIcon icon={faCircleCheck} color="#4CAF50" style={{ marginRight: '0.5rem' }} />
            To już wszystkie posty.
          </div>
        )}
      </section>
    </article>
  );
};

export default PostsFeed;
