import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import usePost from "../hooks/usePost";
import useComments from "../hooks/useComments";
import Loader from "../components/messages/Loader";
import ErrorMessage from "../components/messages/ErrorMessage";
import PostPreview from "../components/posts/PostPreview";
import CommentPreview from "../components/comments/CommentPreview";
import AddCommentForm from "../components/forms/AddCommentForm";
import useSocket from "../hooks/useSocket";
import InfiniteScroll from "react-infinite-scroll-component";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket("/comments");

  const { post, isLoading, error: postError } = usePost(id);
  const {
    comments,
    addComment,
    hasMore,
    isFetching,
    error: commentsError,
    fetchComments,
  } = useComments(id, socket);

  useEffect(() => {
    if (!socket) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinPostRoom", id);
    return () => {
      socket.emit("leavePostRoom", id);
    };
  }, [socket, id]);

  useEffect(() => {
    fetchComments(null);
    // eslint-disable-next-line
  }, [id]);

  const loadMoreComments = () => {
    if (comments.length > 0) {
      fetchComments(comments[comments.length - 1].createdAt);
    } else {
      fetchComments(null);
    }
  };

  if (isLoading) return <Loader />;
  if (postError) return <ErrorMessage message={postError} />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 1 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "primary.main",
            mb: 1,
          }}
          aria-label="Powrót"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
        <PostPreview post={post} isPage={true} />
      </Paper>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <AddCommentForm postId={id} onCommentAdded={addComment} />
        </Box>
        <InfiniteScroll
          dataLength={comments.length}
          next={loadMoreComments}
          hasMore={hasMore}
          loader={isFetching && post?.id && <Loader />}
          endMessage={
            comments.length > 0 && (
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                To już wszystkie komentarze.
              </Typography>
            )
          }
          scrollThreshold={0.95}
          style={{ overflow: "visible" }}
        >
          <List disablePadding>
            {comments.length === 0 && !isFetching ? (
              <Typography variant="body1" align="center">
                Brak komentarzy
              </Typography>
            ) : (
              comments.map((comment) => (
                <ListItem key={comment.id} disableGutters sx={{ display: "block", px: 0 }}>
                  <CommentPreview comment={comment} socket={socket} />
                </ListItem>
              ))
            )}
          </List>
        </InfiniteScroll>
        {commentsError && <ErrorMessage message={commentsError} />}
      </Paper>
    </Container>
  );
};

export default PostPage;