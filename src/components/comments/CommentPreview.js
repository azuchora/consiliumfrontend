import { useState, useCallback } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../messages/Loader";
import FilePreview from "../posts/FilePreview";
import PreviewModal from "../posts/PreviewModal";
import { BACKEND_URL } from "../../api/axios";
import useFileTypeCheck from "../../hooks/useFileTypeCheck";
import useSocketEvent from "../../hooks/useSocketEvent";
import AddCommentForm from "../forms/AddCommentForm";
import useFormatDate from "../../hooks/useFormatDate";

const CommentPreview = ({ comment, socket }) => {
  const axiosPrivate = useAxiosPrivate();
  const { isImage } = useFileTypeCheck();
  const [replies, setReplies] = useState([]);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);
  const [repliesErr, setRepliesErr] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const formatDate = useFormatDate();
  const theme = useTheme();

  const isParentComment = comment.commentId === null;

  const fetchReplies = useCallback(async () => {
    if (!hasMoreReplies || isLoadingReplies) return;
    setIsLoadingReplies(true);
    setRepliesErr(null);
    try {
      const lastTimestamp =
        replies.length > 0 ? replies[replies.length - 1].createdAt : null;
      const params = lastTimestamp ? { timestamp: lastTimestamp } : {};
      const response = await axiosPrivate.get(
        `/comments/${comment.id}/replies`,
        { params }
      );
      const newReplies = response.data.replies || [];
      const pagination = response.data.pagination || {};
      setReplies((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const uniqueNewReplies = newReplies.filter(
          (r) => !existingIds.has(r.id)
        );
        return [...prev, ...uniqueNewReplies];
      });
      if (!pagination.hasMore || newReplies.length === 0) {
        setHasMoreReplies(false);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      setRepliesErr("Błąd ładowania odpowiedzi");
    } finally {
      setIsLoadingReplies(false);
    }
  }, [axiosPrivate, comment.id, replies, hasMoreReplies, isLoadingReplies]);

  const toggleReplies = () => {
    if (!isRepliesVisible && replies.length === 0) {
      setReplies([]);
      setHasMoreReplies(true);
      fetchReplies();
    }
    setIsRepliesVisible((v) => !v);
  };

  useSocketEvent(
    "newComment",
    (newComment) => {
      if (
        isParentComment &&
        newComment.commentId === comment.id
      ) {
        setReplies((prev) => {
          if (prev.some((r) => r.id === newComment.id)) {
            return prev;
          }
          return [newComment, ...prev];
        });
      }
    },
    socket
  );

  const imageFiles = comment.files?.filter((file) => isImage(file.filename)) || [];
  const otherFiles = comment.files?.filter((file) => !isImage(file.filename)) || [];
  const closePreview = () => setPreviewFile(null);

  const handleReplyAdded = (newReply) => {
    setReplies((prev) => {
      if (prev.some((r) => r.id === newReply.id)) return prev;
      return [newReply, ...prev];
    });
    setIsReplying(false);
    setHasMoreReplies(true);
  };

  const authorAvatar = comment?.users?.files?.[0]?.filename;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        bgcolor: theme.palette.background.default,
        borderRadius: 3,
        width: "100%",
        border: `1.5px solid ${theme.palette.primary.main}`,
        boxShadow: '0 2px 12px 0 rgba(42,63,84,0.07)',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" mb={1}>
        <Link to={`/users/${comment.users.username}`}>
          <Avatar
            src={
              authorAvatar
                ? `${BACKEND_URL}/static/${authorAvatar}`
                : undefined
            }
            alt={comment.users.username}
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 700,
              border: `2px solid ${theme.palette.secondary.main}`,
            }}
          >
            {!authorAvatar && comment.users.username?.[0]?.toUpperCase()}
          </Avatar>
        </Link>
        <Box>
          <Typography
            variant="subtitle1"
            component={Link}
            to={`/users/${comment.users.username}`}
            sx={{
              textDecoration: "none",
              color: theme.palette.text.primary,
              fontWeight: 600,
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            {`${comment.users.name} ${comment.users.surname}`}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {formatDate(comment.createdAt)}
          </Typography>
        </Box>
      </Stack>
      <Typography variant="body1" sx={{ mb: 1, wordBreak: "break-word", color: theme.palette.text.primary }}>
        {comment.content}
      </Typography>
      {imageFiles.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          {imageFiles.map((file) => (
            <Box
              key={file.id || file.filename}
              component="img"
              src={`${BACKEND_URL}/static/${file.filename}`}
              alt={file.filename}
              sx={{
                width: 100,
                height: "auto",
                cursor: "pointer",
                borderRadius: 1,
                boxShadow: 1,
                border: `2px solid ${theme.palette.primary.light}`,
                background: theme.palette.background.default,
              }}
              onClick={() =>
                setPreviewFile({
                  type: "image",
                  url: `${BACKEND_URL}/static/${file.filename}`,
                })
              }
            />
          ))}
        </Box>
      )}
      {otherFiles.length > 0 && (
        <Box sx={{ mb: 1 }}>
          {otherFiles.map((file) => (
            <FilePreview
              key={file.id || file.filename}
              file={file}
              onPreview={setPreviewFile}
            />
          ))}
        </Box>
      )}
      {isParentComment && (
        <Stack direction="row" spacing={2} mt={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={toggleReplies}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              fontWeight: 600,
              "&:hover": {
                bgcolor: theme.palette.secondary.main,
                color: "#fff",
                borderColor: theme.palette.secondary.main,
              },
            }}
          >
            {isRepliesVisible ? "Ukryj odpowiedzi" : "Pokaż odpowiedzi"}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsReplying((v) => !v)}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                bgcolor: theme.palette.secondary.main,
                color: "#fff",
              },
            }}
          >
            {isReplying ? "Anuluj" : "Odpowiedz"}
          </Button>
        </Stack>
      )}
      {isReplying && isParentComment && (
        <Box mt={2}>
          <AddCommentForm
            postId={comment.postId}
            parentCommentId={comment.id}
            onCommentAdded={handleReplyAdded}
          />
        </Box>
      )}
      {isParentComment && isRepliesVisible && (
        <Box mt={2} pl={2} borderLeft={`2px dashed ${theme.palette.primary.light}`}>
          {replies.length === 0 && !isLoadingReplies && (
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Brak odpowiedzi
            </Typography>
          )}
          <List disablePadding>
            {replies.map((reply) => (
              <ListItem key={reply.id} disableGutters sx={{ display: "block", px: 0 }}>
                <CommentPreview comment={reply} socket={socket} />
              </ListItem>
            ))}
          </List>
          {repliesErr && (
            <Typography variant="body2" color="error">
              {repliesErr}
            </Typography>
          )}
          {isLoadingReplies && <Loader />}
          {!isLoadingReplies && hasMoreReplies && (
            <Button
              variant="outlined"
              size="small"
              onClick={fetchReplies}
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: theme.palette.secondary.main,
                  color: "#fff",
                  borderColor: theme.palette.secondary.main,
                },
              }}
            >
              Załaduj więcej odpowiedzi
            </Button>
          )}
          {!hasMoreReplies && replies.length > 0 && (
            <Typography variant="caption" color={theme.palette.text.secondary}>
              To już wszystkie odpowiedzi.
            </Typography>
          )}
        </Box>
      )}
      <PreviewModal previewFile={previewFile} onClose={closePreview} />
    </Paper>
  );
};

export default CommentPreview;