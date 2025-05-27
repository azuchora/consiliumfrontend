import { useState, useMemo, useCallback, useEffect } from 'react';
import usePostsFetcher from '../../hooks/usePostsFetcher';
import PostPreview from './PostPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loader from '../messages/Loader';
import PostFilterForm from '../forms/PostsFilterForm';
import PostCreateForm from '../forms/PostCreateForm';
import {
  Box,
  List,
  ListItem,
  Typography,
  Paper,
  useMediaQuery,
  Button,
  Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfiniteScroll from "react-infinite-scroll-component";

const PostsFeed = () => {
  const [filters, setFilters] = useState({
    search: '',
    postStatusId: '',
    age: '',
    gender: '',
  });

  const [showCreate, setShowCreate] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { posts, hasMore, isLoading, fetchPosts, resetPosts, setPosts } = usePostsFetcher(filters);

  useEffect(() => {
    resetPosts();
    fetchPosts(null, true);
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      resetPosts();
      fetchPosts(null, true);
    },
    [resetPosts, fetchPosts]
  );

  const handleNewPost = (post) => {
    setPosts(prev => [post, ...prev]);
    setShowCreate(false);
  };

  const renderedPosts = useMemo(() => {
    return posts.map((post) => (
      <ListItem
        key={post.id || `${post.title}-${post.createdAt}-${Math.random()}`}
        disablePadding
        sx={{ mb: 2 }}
      >
        <PostPreview post={post} />
      </ListItem>
    ));
  }, [posts]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        background: theme.palette.mode === 'dark'
          ? 'rgba(30,30,30,0.85)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: isMobile ? 2 : 4,
        px: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
          p: isMobile ? 1 : 2,
          background: '#fff',
          borderRadius: 3,
        }}
      >
        <PostFilterForm
          handleInputChange={handleInputChange}
          handleSearchSubmit={handleSearchSubmit}
          filters={filters}
        />
        <Box sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => setShowCreate((prev) => !prev)}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            {showCreate ? 'Anuluj' : 'Dodaj nowy post'}
          </Button>
        </Box>
        <Collapse in={showCreate}>
          <PostCreateForm onPostCreated={handleNewPost} />
        </Collapse>
      </Paper>

      <Box
        sx={{
          width: '100%',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: '100%',
            p: isMobile ? 1 : 2,
            borderRadius: 3,
            background: '#fff',
            minHeight: 200,
          }}
        >
          <InfiniteScroll
            dataLength={posts.length}
            next={() =>
              fetchPosts(posts.length > 0 ? posts[posts.length - 1].createdAt : null, false)
            }
            hasMore={hasMore}
            loader={
              <Loader />
            }
            endMessage={
              posts.length > 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '1.1rem',
                    mt: 4,
                    mb: 2,
                    fontStyle: 'italic',
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    color="#4CAF50"
                    style={{ marginRight: '0.5rem' }}
                  />
                  To już wszystkie posty.
                </Box>
              )
            }
            scrollThreshold={0.90}
          >
            <List sx={{ width: '100%' }}>
              {posts.length === 0 && !isLoading ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  Brak postów
                </Typography>
              ) : (
                renderedPosts
              )}
            </List>
          </InfiniteScroll>
        </Paper>
      </Box>
    </Box>
  );
};

export default PostsFeed;