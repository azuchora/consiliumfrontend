import { useParams } from "react-router-dom";
import { useEffect } from "react";
import usePost from "../hooks/usePost";
import useComments from "../hooks/useComments";
import Loader from "../components/messages/Loader";
import ErrorMessage from "../components/messages/ErrorMessage";
import PostPreview from "../components/posts/PostPreview";
import CommentPreview from "../components/comments/CommentPreview";
import AddCommentForm from "../components/forms/AddCommentForm";
import useSocket from "../hooks/useSocket";
import './PostPage.css';

const PostPage = () => {
  const { id } = useParams();
  const socket = useSocket("/comments");

  const { post, isLoading, error: postError } = usePost(id);
  const { comments, addComment, hasMore, isFetching, error: commentsError } = useComments(id, socket);

  useEffect(() => {
    if (!socket) return;

    if(!socket.connected){
      socket.connect();
    }

    socket.emit("joinPostRoom", id);
    console.log("Joining room:", id);

    return () => {
      socket.emit("leavePostRoom", id);
      console.log("Leaving room:", id);
    };
  }, [socket, id]);

  if (isLoading) return <Loader />;
  if (postError) return <ErrorMessage message={postError} />;

  return (
    <section className='post-page-container'>
      <PostPreview post={post} isPage={true} />

      <section className="comments-section">
        <AddCommentForm postId={id} onCommentAdded={addComment} />

        {comments.length === 0 && !isFetching && <p>Brak komentarzy</p>}

        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <CommentPreview comment={comment} socket={socket} />
            </li>
          ))}
        </ul>

        {isFetching && post?.id && <Loader />}
        {!hasMore && <p>To już wszystkie komentarze.</p>}
        {commentsError && <ErrorMessage message={commentsError} />}
      </section>
    </section>
  );
};

export default PostPage;
