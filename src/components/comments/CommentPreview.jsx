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
  IconButton,
  Tooltip,
  useMediaQuery,
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
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { auth } = useAuth();
  const currentUserId = auth?.id;

  const initialTotalVotes = comment.comment_votes?.reduce((sum, v) => sum + v.value, 0) || 0;
  const initialUserVote = comment.comment_votes?.find(v => v.userId === currentUserId)?.value || 0;
  const [vote, setVote] = useState(initialUserVote);
  const [voteCount, setVoteCount] = useState(initialTotalVotes);
  const [loadingVote, setLoadingVote] = useState(false);

  const [isHelpful, setIsHelpful] = useState(comment.isHelpful || false);
  const [loadingHelpful, setLoadingHelpful] = useState(false);

  const isParentComment = comment.commentId === null;

  const fetchReplies = useCallback(async () => {
    setIsLoadingReplies(true);
    setRepliesErr(null);
    try {
      const response = await axiosPrivate.get(
        `/comments/${comment.id}/replies`
      );
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
  }, [axiosPrivate, comment.id]);

  const handleToggleReplies = () => {
    if (!isRepliesVisible) {
      fetchReplies();
      setIsRepliesVisible(true);
    } else {
      setIsRepliesVisible(false);
      setReplies([]);
    }
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

  const handleVote = async (value) => {
    if (loadingVote) return;
    setLoadingVote(true);

    let newVote;
    let newVoteCount;

    if (vote === value) {
      newVote = 0;
      newVoteCount = voteCount - vote;
    } else {
      newVote = value;
      newVoteCount = voteCount - vote + value;
    }

    try {
      await axiosPrivate.put(`/comments/${comment.id}/vote`, { value: newVote });
      setVote(newVote);
      setVoteCount(newVoteCount);
    } catch (err) {
      console.log("Error voting on comment:", err);
    } finally {
      setLoadingVote(false);
    }
  };

  const handleHelpful = async () => {
    if (loadingHelpful) return;
    setLoadingHelpful(true);
    try {
      await axiosPrivate.put(`/comments/${comment.id}/helpful`, { isHelpful: !isHelpful });
      setIsHelpful((prev) => !prev);
    } catch (err) {
    } finally {
      setLoadingHelpful(false);
    }
  };

  const isPostOwner = currentUserId && comment.posts?.userId === currentUserId;

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
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        mb={1}
        sx={{
          flexWrap: isMobile ? "wrap" : "nowrap",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
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
              flexShrink: 0,
            }}
          >
            {!authorAvatar && comment.users.username?.[0]?.toUpperCase()}
          </Avatar>
        </Link>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle1"
            component={Link}
            to={`/users/${comment.users.username}`}
            sx={{
              textDecoration: "none",
              color: theme.palette.text.primary,
              fontWeight: 600,
              "&:hover": { color: theme.palette.primary.main },
              wordBreak: 'break-word',
            }}
          >
            {`${comment.users.name} ${comment.users.surname}`}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {formatDate(comment.createdAt)}
          </Typography>
        </Box>
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
            minWidth: isMobile ? 40 : "unset",
            mt: isMobile ? 1 : 0,
          }}
        >
          <Tooltip title="Oznaczony jako pomocny">
            <span style={{ display: "flex", alignItems: "center" }}>
              {isHelpful && (
                <FontAwesomeIcon icon={faStarSolid} style={{ color: theme.palette.warning.main, fontSize: 22 }} />
              )}
              {isPostOwner && (
                <IconButton
                  size="small"
                  onClick={handleHelpful}
                  disabled={loadingHelpful}
                  sx={{
                    color: isHelpful ? theme.palette.warning.main : theme.palette.action.active,
                    ml: 1,
                  }}
                >
                  <FontAwesomeIcon icon={faStarSolid} />
                </IconButton>
              )}
            </span>
          </Tooltip>
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

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Tooltip title="Głosuj w górę">
          <IconButton
            size="small"
            sx={{
              color: vote === 1 ? theme.palette.success.dark : theme.palette.success.main,
              bgcolor: vote === 1 ? theme.palette.success.light : 'transparent',
              borderRadius: 1,
              transition: 'background 0.15s, color 0.15s',
            }}
            onClick={() => handleVote(1)}
            disabled={loadingVote}
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
          {voteCount}
        </Typography>
        <Tooltip title="Głosuj w dół">
          <IconButton
            size="small"
            sx={{
              color: vote === -1 ? theme.palette.error.dark : theme.palette.error.main,
              bgcolor: vote === -1 ? theme.palette.error.light : 'transparent',
              borderRadius: 1,
              transition: 'background 0.15s, color 0.15s',
            }}
            onClick={() => handleVote(-1)}
            disabled={loadingVote}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </IconButton>
        </Tooltip>
      </Stack>

      {isParentComment && (
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          mt={1}
          sx={{
            width: "100%",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: isMobile ? "flex-start" : "flex-start",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleToggleReplies}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              fontWeight: 600,
              width: isMobile ? "100%" : "auto",
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
              width: isMobile ? "100%" : "auto",
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
                width: isMobile ? "100%" : "auto",
                mt: isMobile ? 1 : 0,
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